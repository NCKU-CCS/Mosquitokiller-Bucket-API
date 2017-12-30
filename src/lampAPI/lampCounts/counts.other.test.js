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
const name = 'counts'
const route = '/apis'
const itemId = 'count_id'

const HASH_ID = '9b3814'
const WRONG_HASH_ID = 'eee'

const checkGetSuccess = Agent.checkGetSuccess
const checkGetError = Agent.checkGetError

const checkGetFormatSuccess = (done, checkRoute) => {
  agent.get(checkRoute).end((err, res) => {
    if (err) return done(err)
    res.should.have.status(200)
    res.should.be.json
    done()
  })
}

describe(`counts Supports -- `, () => {
  // =========================
  // Get Item By ID
  // =========================
  describe(`/Get ${name} Should success-- `, () => {
    it(`should return ${name} With lampHashID=hashID`, done => {
      const checkRoute = `${route}/${name}?lampHashID=${HASH_ID}`
      checkGetSuccess({agent, done}, checkRoute, itemId, true)
    })
    it(`should return ${name} With limit=7`, done => {
      const checkRoute = `${route}/${name}?limit=7`
      checkGetSuccess({agent, done}, checkRoute, itemId, true)
    })
    it(`should return ${name} With lampHashID & limit=7`, done => {
      const checkRoute = `${route}/${name}?lampHashID=${HASH_ID}&limit=7`
      checkGetSuccess({agent, done}, checkRoute, itemId, true)
    })
    it(`should return sum of all lamp ${name} With formatBy=hour & no lampID`, done => {
      const checkRoute = `${route}/${name}?formatBy=hour`
      checkGetFormatSuccess(done, checkRoute)
    })
    it(`should return ${name} With formatBy=hour&lampHashID=hashID`, done => {
      const checkRoute = `${route}/${name}?formatBy=hour&lampHashID=${HASH_ID}`
      checkGetFormatSuccess(done, checkRoute)
    })
    it(`should return ${name} With formatBy=hour & lampHashID=hashID & limit`, done => {
      const checkRoute = `${route}/${name}?formatBy=hour&lampHashID=${HASH_ID}&limit=7`
      checkGetFormatSuccess(done, checkRoute)
    })
    it(`should return ${name} With formatBy=date`, done => {
      const checkRoute = `${route}/${name}?formatBy=date`
      checkGetFormatSuccess(done, checkRoute)
    })
    it(`should return one lamp ${name} With formatBy=date & hash lampID`, done => {
      const checkRoute = `${route}/${name}?formatBy=date&lampHashID=${HASH_ID}`
      checkGetFormatSuccess(done, checkRoute)
    })
    it(`should return one lamp ${name} With formatBy=date & hash lampID & limit date`, done => {
      const checkRoute = `${route}/${name}?formatBy=date&lampHashID=${HASH_ID}&limit=7`
      checkGetFormatSuccess(done, checkRoute)
    })
  })

  describe(`/Get ${name} format By Wrong info Should Not success-- `, () => {
    it(`should Not return ${name} With formatBy=hour & Wrong lampID`, done => {
      const checkRoute = `${route}/${name}?formatBy=hour&lampHashID=${WRONG_HASH_ID}`
      checkGetError({agent, done}, checkRoute, 404)
    })
    it(`should Not return ${name} With formatBy=wrong`, done => {
      const checkRoute = `${route}/${name}?formatBy=wrong`
      checkGetError({agent, done}, checkRoute, 400)
    })
  })
})
