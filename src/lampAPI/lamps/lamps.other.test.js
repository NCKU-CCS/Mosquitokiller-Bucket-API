process.env.NODE_ENV = 'test'

let chai = require('chai')
let chaiHttp = require('chai-http')
let should = chai.should()
let server = require('../../../app')

chai.use(chaiHttp)
const agent = chai.request.agent(server)

const name = 'lamps'
const itemId = 'lamp_id'
const route = '/apis'

const createDataWrong = {
  lamp_id: Math.random().toString(),
  lamp_location: [120.203778825737, ''],
  place_id: 1
}

describe(`Lamps Supports -- `, () => {
  // =========================
  // Get Item By ID
  // =========================
  const ID = '9b3814'
  describe(`/Get ${name} By Hash ID Should success-- `, () => {
    it(`should return single ${name} With Correct ID`, done => {
      agent.get(`${route}/${name}/${ID}?key=hash`).end((err, res) => {
        if (err) return done(err)
        res.should.have.status(200)
        res.should.be.json
        res.body.should.have.property(`${itemId}`)
        done()
      })
    })
  })

  describe(`/Get ${name} By Wrong Hash ID Should Not success-- `, () => {
    it(`should return single ${name} With too short ID`, done => {
      agent.get(`${route}/${name}/9?key=hash`).end((err, res) => {
        if (err) {
          res.should.have.status(404)
          res.should.be.json
          res.body.should.have.property(`error`)
          done()
        }
      })
    })
  })

  describe(`/POST ${name} -- `, () => {
    it(`post location array with empty string should NOT be create`, done => {
      agent
        .post(`${route}/${name}`)
        .send(createDataWrong)
        .end((err, res) => {
          if (err) {
            res.should.have.status(400)
            res.should.be.json
            res.body.should.have.property('errors')
            done()
          }
        })
    })
  })
})
