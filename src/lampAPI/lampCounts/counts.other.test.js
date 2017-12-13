process.env.NODE_ENV = 'test'

let chai = require('chai')
let chaiHttp = require('chai-http')
let should = chai.should()
let server = require('../../../app')

chai.use(chaiHttp)
const agent = chai.request.agent(server)

const name = 'counts'
const route = '/apis'

const REAL_ID = 'TEST01'
const HASH_ID = '9b3814'
const WRONG_HASH_ID = 'eee'

const checkSuccess = (done, checkRoute, checkID = null) => {
  agent.get(checkRoute).end((err, res) => {
    if (err) return done(err)
    res.should.have.status(200)
    res.should.be.json
    if (checkID) {
      res.body[0].should.have.property('count_id')
    }
    done()
  })
}

const checkError = (done, checkRoute, status) => {
  agent.get(checkRoute).end((err, res) => {
    if (err) {
      res.should.have.status(status)
      res.should.be.json
      res.body.should.have.property('error')
      done()
    }
  })
}

describe(`counts Supports -- `, () => {
  // =========================
  // Get Item By ID
  // =========================
  describe(`/Get ${name} Should success-- `, () => {
    it(`should return ${name} With lampHashID=hashID`, done => {
      const checkRoute = `${route}/${name}?lampHashID=${HASH_ID}`
      checkSuccess(done, checkRoute, (checkID = true))
    })
    it(`should return ${name} With limit=7`, done => {
      const checkRoute = `${route}/${name}?limit=7`
      checkSuccess(done, checkRoute, (checkID = true))
    })
    it(`should return ${name} With lampHashID & limit=7`, done => {
      const checkRoute = `${route}/${name}?lampHashID=${HASH_ID}&limit=7`
      checkSuccess(done, checkRoute, (checkID = true))
    })
    it(`should return sum of all lamp ${name} With formatBy=hour & no lampID`, done => {
      const checkRoute = `${route}/${name}?formatBy=hour`
      checkSuccess(done, checkRoute)
    })
    it(`should return ${name} With formatBy=hour&lampHashID=hashID`, done => {
      const checkRoute = `${route}/${name}?formatBy=hour&lampHashID=${HASH_ID}`
      checkSuccess(done, checkRoute)
    })
    it(`should return ${name} With formatBy=hour & lampHashID=hashID & limit`, done => {
      const checkRoute = `${route}/${name}?formatBy=hour&lampHashID=${HASH_ID}&limit=7`
      checkSuccess(done, checkRoute)
    })
    it(`should return ${name} With formatBy=date`, done => {
      const checkRoute = `${route}/${name}?formatBy=date`
      checkSuccess(done, checkRoute)
    })
    it(`should return one lamp ${name} With formatBy=date & hash lampID`, done => {
      const checkRoute = `${route}/${name}?formatBy=date&lampHashID=${HASH_ID}`
      checkSuccess(done, checkRoute)
    })
    it(`should return one lamp ${name} With formatBy=date & hash lampID & limit date`, done => {
      const checkRoute = `${route}/${name}?formatBy=date&lampHashID=${HASH_ID}&limit=7`
      checkSuccess(done, checkRoute)
    })
  })

  describe(`/Get ${name} format By Wrong info Should Not success-- `, () => {
    it(`should Not return ${name} With formatBy=hour & Wrong lampID`, done => {
      const checkRoute = `${route}/${name}?formatBy=hour&lampHashID=${WRONG_HASH_ID}`
      checkError(done, checkRoute, 404)
    })
    it(`should Not return ${name} With formatBy=wrong`, done => {
      const checkRoute = `${route}/${name}?formatBy=wrong`
      checkError(done, checkRoute, 400)
    })
  })
})
