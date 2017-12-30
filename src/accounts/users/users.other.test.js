process.env.NODE_ENV = 'test'

const Agent = require('../../testAgent')
const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const server = require(`${global.ROOT_PATH}/app`)

chai.use(chaiHttp)
const agent = chai.request.agent(server)

const loginAuth = Agent.loginAuth
const checkPostError = Agent.checkPostError

//
// Test Data
//
const name = 'users'
const route = '/accounts'

const createDataWrongEmail = {
  user_id: 'tester',
  email: 'oceanus1103@',
  password: 'test*11034'
}

const createDataExistEmail = {
  user_id: 'tester',
  email: 'oceanus11034@gmail.com',
  password: 'test*11034'
}

const createDataExistID = {
  user_id: 'admin',
  email: 'oceanus@gmail.com',
  password: 'test*11034'
}

const createDataWrongPwShort = {
  user_id: 'tester',
  email: 'oceanus@gmail.com',
  password: 'test'
}

const createDataWrongPwOnlyEng = {
  user_id: 'tester',
  email: 'oceanus@gmail.com',
  password: 'tesetsetstetset'
}

const createDataWrongPwOnlyNum = {
  user_id: 'tester',
  email: 'oceanus@gmail.com',
  password: '123213133233'
}

describe(`${name} -- `, () => {
  // =========================
  // Login Before all test
  // =========================
  before((done) => {
    loginAuth(agent, () => {
      done()
    })
  })
  // =========================
  // Create New Item
  // =========================
  describe(`/POST ${name} -- `, () => {
    it(`new ${name} with bad email should NOT be create`, (done) => {
      checkPostError({agent, done}, `${route}/${name}`, createDataWrongEmail)
    })
    it(`new ${name} with exist email should NOT be create`, (done) => {
      checkPostError({agent, done}, `${route}/${name}`, createDataExistEmail)
    })
    it(`new ${name} with exist id should NOT be create`, (done) => {
      checkPostError({agent, done}, `${route}/${name}`, createDataExistID)
    })
    it(`new ${name} with <8 length pw should NOT be create`, (done) => {
      checkPostError({agent, done}, `${route}/${name}`, createDataWrongPwShort)
    })
    it(`new ${name} with full eng pw should NOT be create`, (done) => {
      checkPostError({agent, done}, `${route}/${name}`, createDataWrongPwOnlyEng)
    })
    it(`new ${name} with full num should NOT be create`, (done) => {
      checkPostError({agent, done}, `${route}/${name}`, createDataWrongPwOnlyNum)
    })
  })
})
