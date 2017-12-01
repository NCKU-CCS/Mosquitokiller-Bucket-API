const TEST = require('../../baseTest')

const createDataCorrect = {
  lamp_id: 'TEST01',
  lamp_state: 1
}

const createDataWrong = [{
  lamp_id: 'TEST01'
}, {
  lamp_id: 'TEST01',
  lamp_state: null
}]

const updateData = {
  lamp_id: 'TEST01',
  lamp_state: 2,
  state_description: '不會亮'
}

const Data = {createDataCorrect, createDataWrong, updateData}

const Item = {name: 'states', id: 'state_id'}

TEST(Item, Data)
