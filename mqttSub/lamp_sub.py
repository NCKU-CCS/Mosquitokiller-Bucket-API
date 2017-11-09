import paho.mqtt.client as mqtt
import time
import datetime
import math
import psycopg2
import json
from math import radians, cos, sin, asin, sqrt

from config import CONFIG
BROKER_ADDRESS = CONFIG['BROKER_ADDRESS']
TOPIC = CONFIG['TOPIC']


from config import DBCONFIG
HOST = DBCONFIG['HOST']
DBNAME = DBCONFIG['DBNAME']
USER = DBCONFIG['USER']
PASSWORD = DBCONFIG['PASSWORD']

DistanceDict = dict()
LampDict = dict()
UpdatedAt = str(datetime.date.today())
Location = dict()

# The callback for when the client receives a CONNACK response from the server.
def on_connect(client, userdata, rc):
    client.subscribe(TOPIC)

def on_publish(client, userdata, mid):
    print("mid: " + str(mid))

def distance(lon1, lat1, lon2, lat2):
    """
    Calculate the great circle distance between two points
    on the earth (specified in decimal degrees)
    """
    # convert decimal degrees to radians
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
    # haversine formula
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat / 2)**2 + cos(lat1) * cos(lat2) * sin(dlon / 2)**2
    c = 2 * asin(sqrt(a))
    m = 6367 * c * 1000
    return m


def TimeDifference(TimeA, TimeB):
    tmpA = datetime.datetime.strptime(TimeA, "%Y-%m-%d").date()
    tmpB = datetime.datetime.strptime(TimeB, "%Y-%m-%d").date()
    DateDelta = (tmpA - tmpB).days
    if DateDelta < 0:
        DateDelta = (-1) * DateDelta
    return DateDelta


def CheckPointInMcc(p, Mcc):
    global DistanceDict
    for x in Mcc:
        if (x, p) not in DistanceDict:
            return False
    if len(Mcc) == 2:
        if DistanceDict[(Mcc[0], p)] > DistanceDict[(Mcc[0], Mcc[1])] or DistanceDict[(Mcc[1], p)] > DistanceDict[(Mcc[0], Mcc[1])]:
            return False
        if DistanceDict[(Mcc[0], p)]**2 + DistanceDict[(Mcc[1], p)]**2 > DistanceDict[(Mcc[0], Mcc[1])]**2:
            return False
        return True
    elif len(Mcc) == 3:
        # ABC vs P
        a = DistanceDict[(p, Mcc[0])]  # PA
        b = DistanceDict[(p, Mcc[1])]  # PB
        c = DistanceDict[(p, Mcc[2])]  # PC
        Pmin = a
        Pmax = (b, c)
        brother = Mcc[0]
        Bmax = (DistanceDict[(Mcc[0], Mcc[1])], DistanceDict[(Mcc[0], Mcc[2])])
        Base = DistanceDict[(Mcc[1], Mcc[2])]

        if b < Pmin:
            Pmin = b
            Pmax = (a, c)
            brother = Mcc[1]
            Bmax = (DistanceDict[(Mcc[0], Mcc[1])],
                    DistanceDict[(Mcc[1], Mcc[2])])
            Base = DistanceDict[(Mcc[0], Mcc[2])]
        if c < Pmin:
            Pmin = c
            Pmax = (a, b)
            brother = Mcc[2]
            Bmax = (DistanceDict[(Mcc[0], Mcc[2])],
                    DistanceDict[(Mcc[1], Mcc[2])])
            Base = DistanceDict[(Mcc[0], Mcc[1])]

        if isObtuseAngle(Pmax[0], Pmax[1], Base):# degree more than 90
            return True

        CosP = calCos(Pmax, Base)
        CosB = calCos(Bmax, Base)
        if CosP <= CosB:
            return True
        return False

def isObtuseAngle(lineA, lineB, lineC):
    return (lineA**2 + lineB**2) <= lineC**2

def calCos(Max, Base):
    cos = (Max[0]**2 + Max[1]**2 - Base**2) / (2 * Max[0] * Max[1])
    return cos

# The callback for when a PUBLISH message is received from the server.
def on_message(client, userdata, msg):
    def TempSaveMcc(Key, NewSet):
        '''Remove Subset of MCC '''
        isNotSubset = True
        PopSet = set()
        for PrevSet in MccSet:
            if(NewSet.issubset(set(PrevSet))):
                isNotSubset = False
            if(PrevSet.issubset(NewSet) and len(PrevSet) != len(NewSet)):
                PopSet.add(PrevSet)

        for PrevSet in PopSet:
            MccSet.discard(PrevSet)
            del MccKey[PrevSet]

        if (isNotSubset):
            #print ('save new mcc')
            MccSet.add(frozenset(NewSet))
            MccKey[frozenset(NewSet)] = list(Key)

    def CalMccCenter(mcc):
        '''Calculate the center position of Mcc '''
        if len(mcc) == 2:
            center = list()
            LonCenter = CalPointcenter(LampDict[mcc[0]]["Lon"], LampDict[mcc[1]]["Lon"])
            LatCenter = CalPointcenter(LampDict[mcc[0]]["Lat"], LampDict[mcc[1]]["Lat"])
            center.append(LonCenter)
            center.append(LatCenter)
            return center
        else:
            return CalMccCenterByThreePoints(mcc)

    def CalPointcenter(pointA, pointB):
        return (pointA + pointB) / 2

    def CalMccCenterByThreePoints(mcc):
        '''Calculate Mcc Center By Three Points'''
        center = list()
        ma = CalDistanceSlope(LampDict[mcc[1]], LampDict[mcc[0]])
        mb = CalDistanceSlope(LampDict[mcc[2]], LampDict[mcc[1]])
        centerLon = (ma * mb * (LampDict[mcc[0]]["Lat"] - LampDict[mcc[2]]["Lat"]) + mb * (LampDict[mcc[0]]["Lon"] + LampDict[mcc[1]]["Lon"])
                     - ma * (LampDict[mcc[1]]["Lon"] + LampDict[mcc[2]]["Lon"])) / (2 * (mb - ma))

        centerLat = -(1 / ma) * (centerLon - (LampDict[mcc[0]]["Lon"] + LampDict[mcc[1]]["Lon"]) / 2) \
            + (LampDict[mcc[1]]["Lat"] + LampDict[mcc[0]]["Lat"]) / 2

        center.append(centerLon)
        center.append(centerLat)
        # print str(center[1]) + ',' + str(center[0])
        return center

    def CalDistanceSlope(lampA, lampB):
        slop = (lampA["Lat"] - lampB["Lat"]) / (lampA["Lon"] - lampB["Lon"])
        return slop

    if msg.topic == 'ncku/netdb/test':
        print(str(msg.payload))
    elif msg.topic == TOPIC:
        print('\n------\n')
        print(str(msg.payload))
        #####################################################
        # Initialization
        # Parse MQTT Data
        #####################################################
        D = DISTANCE
        # Initial
        global DistanceDict
        global LampDict
        global UpdatedAt
        global Location

        Neighbor = set()

        # Mcc Elements
        Mcc = dict()
        MccSet = set()
        # Mcc Keys
        MccKey = dict()
        LampData = json.loads(msg.payload)
        lampId = str(LampData['id'])

        if lampId not in Location:
            cursor.execute("SELECT lamp_id, lamp_location FROM lamps;")
            lamps = cursor.fetchall()
            for item in lamps:
                Location[item[0]] = item[1]

        if lampId not in Location:
            print('id not exist')
            return

        Lon = float(Location[lampId][0])
        Lat = float(Location[lampId][1])
        Time = str(datetime.date.today())

        #####################################################
        # Plus Lamp Count
        #####################################################
        NewActiveLamp = False
        if lampId not in LampDict:
            LampDict[lampId] = dict()
            LampDict[lampId]["Lon"] = Lon
            LampDict[lampId]["Lat"] = Lat
            LampDict[lampId]["Count"] = 1
            LampDict[lampId]["Neighbor"] = Neighbor
            LampDict[lampId]["Mcc"] = Mcc
            LampDict[lampId]["Active"] = False
            # e.g. 2017-09-21 get one
            LampDict[lampId][Time] = 1

            print(LampDict[lampId])
        else:
            LampDict[lampId]["Count"] += 1
            if Time not in LampDict[lampId]:
                LampDict[lampId][Time] = 1
            else:
                LampDict[lampId][Time] += 1
            ## Activate lamp
            if LampDict[lampId]["Count"] >= ACTIVE_LIMIT and not LampDict[lampId]["Active"]:
                LampDict[lampId]["Active"] = True
                NewActiveLamp = True
                print('now active')
            print(LampDict[lampId])
        #####################################################
        # Remove Old Counts When New Date
        # Add New Distance When New Lamp
        # Add Neighbors When New lamp
        #####################################################
        PopList = list()

        for oldLampId in LampDict:
            if oldLampId == lampId:
                continue

            if UpdatedAt != str(datetime.date.today()):
                # remove expired counts
                expiredDate = str(datetime.date.today() - datetime.timedelta(TIMELINE))
                if expiredDate in LampDict[lampId]:
                    LampDict[lampId]["Count"] -= LampDict[lampId][expiredDate]
                    del LampDict[lampId][expiredDate]

                if LampDict[oldLampId]["Count"] < ACTIVE_LIMIT and LampDict[oldLampId]["Active"]:
                    LampDict[oldLampId]["Active"] = False
                    PopList.append(oldLampId)
                    continue

            if NewActiveLamp and LampDict[oldLampId]["Active"] \
                and (oldLampId, lampId) not in DistanceDict:

                DistanceTmp = distance(Lon, Lat, LampDict[oldLampId]["Lon"], LampDict[oldLampId]["Lat"])
                if DistanceTmp <= (2 * D):
                    Neighbor.add(oldLampId)
                    DistanceDict[(oldLampId, lampId)] = DistanceTmp  # from small to large
                    DistanceDict[(lampId, oldLampId)] = DistanceTmp  # from large to small

        UpdatedAt = str(datetime.date.today())
        print('Update :' + UpdatedAt)

        #####################################################
        # Remove Expired Event Points
        # Remove UnActive Lamps` Distance
        #####################################################

        Dpop = set()
        for oldLampId in PopList:
            for oldDistance in DistanceDict:
                if oldLampId in oldDistance:
                    Dpop.add(oldDistance)
        for x in Dpop:
            del DistanceDict[x]

        #####################################################
        # Generate Mcc of New Lamp
        #####################################################

        if NewActiveLamp:
            print('cal new mcc-----------------------------')
            print(NewActiveLamp)

            # Get Mcc about lampId (2-point and 3-point)
            Mcc = dict()

            for x in Neighbor:
                print(x)
                Mcc[(x, lampId)] = set([x, lampId])  # 2-point Mcc
                for y in LampDict[x]["Neighbor"]:  # lampId > x > y
                    if y not in Neighbor:
                        continue
                    a = DistanceDict[(x, lampId)]
                    b = DistanceDict[(y, lampId)]
                    c = DistanceDict[(y, x)]
                    Emax = a
                    Emin = (b, c)
                    diameter = (x, lampId)
                    if b > Emax:
                        Emax = b
                        Emin = (a, c)
                        diameter = (y, lampId)
                    if c > Emax:
                        Emax = c
                        Emin = (a, c)
                        diameter = (y, x)

                    if isObtuseAngle(Emin[0], Emin[1], Emax):
                        Mcc[diameter] = set([y, x, lampId])  # 3 point in 2-point Mcc
                    else:
                        S = (a + b + c) / 2
                        R = a * b * c / \
                            (4 * math.sqrt(S * (S - a) * (S - b) * (S - c)))
                        if R > D:
                            continue
                        Mcc[(y, x, lampId)] = set([y, x, lampId])  # 3-point Mcc


            for p in Neighbor:
                for mcc in Mcc:
                    if CheckPointInMcc(p, mcc):
                        Mcc[mcc].add(p)

            #####################################################
            # Temp Save Mcc
            #####################################################
            for mcc in Mcc:
                print('got mcc --------------')
                print(mcc)
                print(Mcc[mcc])
                print('\n')
                TempSaveMcc(mcc, Mcc[mcc])


            #####################################################
            # Add new lamp in neighbors` Mcc
            # Remove Expired Mcc
            #####################################################

            # Get Score of Mcc about lampId's Neighbor
            MccPop = set()
            for x in Neighbor:
                for mcc in LampDict[x]["Mcc"]:
                    for point in mcc:
                        if point in PopList:
                            MccPop.add((x, mcc))
                            break

                    # add lamp if point in neighbor`s mcc
                    if CheckPointInMcc(lampId, mcc):
                        LampDict[x]["Mcc"][mcc].add(lampId)
                    else:
                        continue

                    print('got neighbor mcc --------------')
                    print(mcc)
                    print(LampDict[x]["Mcc"][mcc])
                    print('\n')
                    TempSaveMcc(mcc, LampDict[x]["Mcc"][mcc])

            # Remove Expired Mcc
            for x in MccPop:
                LampDict[x[0]]["Mcc"].pop(x[1], None)

            #####################################################
            # Save Lamps
            # Save Mcc
            #####################################################

            LampDict[lampId]["Neighbor"] = Neighbor
            LampDict[lampId]["Mcc"] = Mcc

            #print (Eid)
            for mcc in MccSet:
                if (len(mcc) > POINT_COUNTS):
                    print ('Save to DB: ')
                    print (MccKey[mcc])
                    print (list(mcc))
                    # calculate the center of mcc
                    center = CalMccCenter(MccKey[mcc])
                    # save mcc to db
                    cursor.execute("INSERT INTO lamp_mccs (mcc_keys, mcc_points, rule_id, mcc_center, created_at) \
        VALUES(%s, %s, %s, %s, %s);", (MccKey[mcc], list(mcc), 1, list(center), datetime.datetime.now()))
                    conn.commit()
            NewActiveLamp = False
        #####################################################
        # Save Event
        #####################################################
        cursor.execute("INSERT INTO lamp_counts (lamp_id, created_at, counts) \
        VALUES(%s, %s, %s);", (LampData['id'], datetime.datetime.now(), int(LampData['cnt'])))
        conn.commit()



conn_string = "host=" + HOST + " dbname=" + DBNAME + \
    " user=" + USER + " password=" + PASSWORD
print ("Connecting to database\n	->%s" % (conn_string))
conn = psycopg2.connect(conn_string)
cursor = conn.cursor()
print ("Connected!\n")


##############################
# Setup Mcc Rules
##############################
cursor.execute("SELECT timeline_upper_limit, distance_lower_limit, points_lower_limit, counts_lower_limit FROM lamp_mcc_rules;")
Rules = cursor.fetchone()
print('Rules:\nTime: {}\nDistance: {}\nPoints: {}\nCounts: {}'.format(Rules[0], Rules[1], Rules[2], Rules[3]))
print(Rules)
print('#########################\n')
TIMELINE = Rules[0]
DISTANCE = Rules[1]
POINT_COUNTS = 2 #Rules[2]
ACTIVE_LIMIT = 3 #Rules[3]


##############################
# Connect to MQTT
##############################
client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message
client.connect(BROKER_ADDRESS, 1883, 60)
client.loop_forever()
