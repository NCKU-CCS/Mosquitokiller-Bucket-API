const TEST = require('../../baseTest')

const createDataCorrect = {
  role_id: 'TEST',
  role_description: '除改動留言外之所有權限',
  role_permissions: JSON.stringify({
    'READ': ['Users', 'Roles', 'Places', 'Lamps', 'States', 'Counts', 'Mcc', 'Rules', 'Comments'],
    'CREATE': ['Users', 'Roles', 'Places', 'Lamps', 'States', 'Counts', 'Mcc', 'Rules', 'Comments'],
    'UPDATE': ['Users', 'Roles', 'Places', 'Lamps', 'States', 'Counts', 'Mcc', 'Rules'],
    'DELETE': ['Users', 'Roles', 'Places', 'Lamps', 'States', 'Counts', 'Mcc', 'Rules']
  })
}

const createDataWrong = {
  role_description: '系統管理員'
}

const updateData = {
  role_description: '網頁系統管理員'
}

const Data = {createDataCorrect, createDataWrong, updateData}

// get second parent dirname as api path
const functionType = __dirname.split('/').slice(-2, -1)[0]

const Item = {name: 'roles', id: 'role_id', route: `/${functionType}`}

TEST(Item, Data)
