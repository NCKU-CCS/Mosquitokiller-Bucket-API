process.env.NODE_ENV = 'test'
const Agent = require('../../testAgent')

const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const server = require('../../../app')

chai.use(chaiHttp)
const agent = chai.request.agent(server)

//
// Test Data
//
const name = 'lamps'
const itemId = 'lamp_id'
const route = '/apis'

const createDataWrong = {
  lamp_id: Math.random().toString(),
  lamp_location: [120.203778825737, ''],
  place_id: 1
}

const loginAuth = Agent.loginAuth
const checkGetSuccess = Agent.checkGetSuccess
const checkGetError = Agent.checkGetError
const checkPostError = Agent.checkPostError

describe(`Lamps Supports -- `, () => {
  before(done => {
    loginAuth(agent, () => {
      done()
    })
  })
  // =========================
  // Get Item By ID
  // =========================
  const ID = '9b3814'
  describe(`/Get ${name} By Hash ID Should success-- `, () => {
    it(`should return single ${name} With Correct Hash ID & key parameter`, done => {
      checkGetSuccess({agent, done}, `${route}/${name}/${ID}?key=hash`, itemId)
    })
  })

  describe(`/Get ${name} By Wrong Hash ID Should Not success-- `, () => {
    it(`should return single ${name} With too short ID`, done => {
      checkGetError({agent, done}, `${route}/${name}/9?key=hash`, 404)
    })
  })
  // =========================
  // Post Item
  // =========================
  describe(`/POST ${name} -- `, () => {
    it(`post location array with empty string should NOT be create`, done => {
      checkPostError({agent, done}, `${route}/${name}`, createDataWrong)
    })
  })
})
