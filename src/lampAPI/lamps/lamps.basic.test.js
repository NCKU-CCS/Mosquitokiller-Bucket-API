const TEST = require('../../baseTest')

const createDataCorrect = {
  lamp_id: Math.random().toString(),
  lamp_location: [120.203778825737, 22.985508992788],
  place_id: 1
}

const createDataWrong = [{
  lamp_location: [],
  place_id: 1
}, {
  lamp_id: null,
  lamp_location: [120.203778825737, 22.985508992788],
  place_id: 1
}]

const updateData = {
  lamp_deployed_date: '2017-09-26',
  lamp_wifi_ssid: '70102',
  lamp_wifi_password: 'new password',
  lamp_contact_person: 'MR. Yang'
}

const Data = {createDataCorrect, createDataWrong, updateData}

const Item = {name: 'lamps', id: 'lamp_id'}

TEST(Item, Data)
