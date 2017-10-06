const TEST = require('../../baseTest')

const createDataCorrect = {
  permission_id: 'USERS-READ',
  permission_description: '讀取部分使用者資訊'
}

const createDataWrong = {
  permission_description: '讀取所有使用者資訊'
}

const updateData = {
  permission_id: 'USERS-READ',
  permission_description: '讀取所有使用者資訊'
}

const Data = {createDataCorrect, createDataWrong, updateData}

// get second parent dirname as api path
const functionType = __dirname.split('/').slice(-2, -1)[0]

const Item = {name: 'permissions', id: 'permission_id', route: `/${functionType}`}

TEST(Item, Data)
