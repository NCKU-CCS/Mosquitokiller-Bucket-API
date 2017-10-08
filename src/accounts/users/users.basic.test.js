const TEST = require('../../baseTest')

const createDataCorrect = {
  user_id: 'TEST',
  email: 'test@ccns.ncku.edu.com',
  password: 'test11034',
  first_name: 'Po Chun',
  last_name: 'Lu',
  phone: '0910-xxxxxx'
}

const createDataWrong = {
  user_id: 'admin',
  email: 'oceanus1103@gmail.com'
}

const updateData = {
  first_name: 'Po Chun',
  last_name: 'Lin'
}

const Data = {createDataCorrect, createDataWrong, updateData}

// get second parent dirname as api path
const functionType = __dirname.split('/').slice(-2, -1)[0]

const Item = {name: 'users', id: 'user_id', route: `/${functionType}`}

TEST(Item, Data)
