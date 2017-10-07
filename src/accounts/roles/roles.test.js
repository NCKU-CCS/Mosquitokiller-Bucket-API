const TEST = require('../../baseTest')

const createDataCorrect = {
  role_id: 'ADMIN',
  role_description: '系統管理員',
  role_permissions: JSON.stringify({
    'READ': '*',
    'CREATE': '*',
    'UPDATE': '*',
    'DELETE': '*'
  })
}

const createDataWrong = {
  role_description: '系統管理員'
}

const updateData = {
  role_id: 'ADMIN',
  role_description: '網頁系統管理員'
}

const Data = {createDataCorrect, createDataWrong, updateData}

// get second parent dirname as api path
const functionType = __dirname.split('/').slice(-2, -1)[0]

const Item = {name: 'roles', id: 'role_id', route: `/${functionType}`}

TEST(Item, Data)
