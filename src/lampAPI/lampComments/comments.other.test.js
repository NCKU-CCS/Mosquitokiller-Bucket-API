process.env.NODE_ENV = 'test'

let chai = require('chai')
let chaiHttp = require('chai-http')
let should = chai.should()
let server = require('../../../app')

chai.use(chaiHttp)
const agent = chai.request.agent(server)

const name = 'comments'
const itemId = 'comment_id'
const route = '/apis'

const createDataRealId = {
  lamp_id: 'TEST01',
  comment_content: '我不會用'
}

const createDataWrongShortHashID = {
  lamp_id: '9b381',
  comment_content: '我不會用'
}

const createDataWrongHashID = {
  lamp_id: '9b381435',
  comment_content: '我不會用'
}

describe(`Comments Supports -- `, () => {
  // =========================
  // Post New Comment
  // =========================
  describe(`/Post ${name} By Real ID Should success-- `, () => {
    it(`should return single ${name} With Correct ID`, (done) => {
      agent
        .post(`${route}/${name}?key=id`)
        .send(createDataRealId)
        .end((err, res) => {
          if (err) return done(err)
          res.should.have.status(201)
          res.should.be.json
          res.body.should.have.property(`${itemId}`)
          done()
        })
    })
  })
  describe(`/Post ${name} By Too short hash ID Should Not success-- `, () => {
    it(`should return single ${name} With Correct ID`, (done) => {
      agent
        .post(`${route}/${name}`)
        .send(createDataWrongShortHashID)
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
  describe(`/Post ${name} By Wrong hash ID Should Not success-- `, () => {
    it(`should return single ${name} With Correct ID`, (done) => {
      agent
        .post(`${route}/${name}`)
        .send(createDataWrongHashID)
        .end((err, res) => {
          if (err) {
            res.should.have.status(404)
            res.should.be.json
            res.body.should.have.property('error')
            done()
          }
        })
    })
  })
})