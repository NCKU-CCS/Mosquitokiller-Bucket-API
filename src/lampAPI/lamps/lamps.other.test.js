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

describe(`Lamps Supports -- `, () => {
  // =========================
  // Get Item By ID
  // =========================
  const ID = '9b381'
  describe(`/Get ${name} By Hash ID Should success-- `, () => {
    it(`should return single ${name} With Correct ID`, (done) => {
      agent
        .get(`${route}/${name}/${ID}?key=hash`)
        .end((err, res) => {
          if (err) return done(err)
          res.should.have.status(200)
          res.should.be.json
          res.body.should.have.property(`${itemId}`)
          done()
        })
    })
  })
})