const TEST = require('../baseTest')

const createDataCorrect = {
  timeline_upper_limit: 3,
  distance_lower_limit: 500,
  points_lower_limit: 5,
  counts_lower_limit: 50
}

const createDataWrong = {
  timeline_upper_limit: 3,
  distance_lower_limit: 500,
  points_lower_limit: 5
}

const updateData = {
  timeline_upper_limit: 2,
  distance_lower_limit: 500,
  points_lower_limit: 5,
  counts_lower_limit: 50
}

const Data = {createDataCorrect, createDataWrong, updateData}

const Item = {name: 'rules', id: 'rule_id'}

TEST(Item, Data)
