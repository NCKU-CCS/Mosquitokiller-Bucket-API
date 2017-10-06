const TEST = require('../../baseTest')

const createDataCorrect = {
  mcc_keys: ['TEST01', 'TEST02'],
  mcc_points: ['TEST01', 'TEST02'],
  mcc_center: [120, 22],
  rule_id: 1
}

const createDataWrong = {
  mcc_points: ['TEST01', 'TEST02'],
  mcc_center: [120, 22],
  rule_id: 1
}

const updateData = {
  mcc_points: ['TEST09', 'TEST02'],
  mcc_center: [120, 22],
  rule_id: 1
}

const Data = {createDataCorrect, createDataWrong, updateData}

const Item = {name: 'mcc', id: 'mcc_id'}

TEST(Item, Data)
