const TEST = require('../../baseTest')

const createDataCorrect = {
  lamp_id: 'TEST01',
  counts: 1
}

const createDataWrong = [{
  counts: 1
}, {
  lamp_id: 'TEST01',
  counts: null
}]

const updateData = {
  lamp_id: 'TEST01',
  counts: 10
}

const Data = {createDataCorrect, createDataWrong, updateData}

const Item = {name: 'counts', id: 'count_id'}

TEST(Item, Data)
