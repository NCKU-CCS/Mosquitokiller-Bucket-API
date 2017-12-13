// const fetch = require('node-fetch');
// const Data = require('./lampData.json')

// In Browser

const Data = [
  {
    lamp_id: '1710331-1',
    place_name: 'SAMPLE',
    place_address: 'SAMPLE2',
    place_phone: '0932-826-017',
    place_contact_person: ''
  },
  {
    lamp_id: '1710331-2',
    place_name: 'SAMPLE',
    place_address: 'SAMPLE2',
    place_phone: '06-2200819',
    place_contact_person: ''
  }
]

const URL = 'http://localhost:3001'
// const URL = 'https://mosquitokiller.csie.ncku.edu.tw'
const APIkey = '<KEY>'
const getGeoUrl = address => {
  return `https://maps.googleapis.com/maps/api/geocode/json?key=${APIkey}&address=${address}`
}

const postData = (items, data) => {
  return fetch(`${URL}/apis/${items}`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify(data)
  }).then(data => data.json())
}

const createPlace = placeData => {
  return postData('places', placeData)
}

const createLamp = async lampData => {
  return postData('lamps', lampData)
}

const getLocationByAddress = async address => {
  const data = await fetch(encodeURI(getGeoUrl(address)), {
    headers: {
      Accept: 'application/json'
    }
  }).then(data => data.json())
  if (data.status === 'OK') {
    return data.results[0].geometry.location
  } else {
    console.log(data)
  }
}

// Insert New Lamp & Place

Data.map(async lamp => {
  const placeData = {
    place_name: lamp.place_name,
    place_address: lamp.place_address,
    place_phone: lamp.place_phone,
    place_contact_person: lamp.place_contact_person
  }
  const newPlace = await createPlace(placeData)
  console.log(newPlace)

  const place_id = newPlace.place_id
  const location = await getLocationByAddress(newPlace.place_address)
  const lampData = {
    lamp_id: lamp.lamp_id,
    lamp_location: [location.lng, location.lat],
    place_id: place_id
  }

  const newLamp = await createLamp(lampData)
  console.log(newLamp)
}, this)
