process.env.NODE_ENV = 'test'

const Agent = require('../../testAgent')

const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const server = require('../../../app')

chai.use(chaiHttp)
const agent = chai.request.agent(server)

const checkPostError = Agent.checkPostError

//
// Test Data
//
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
      checkPostError({agent, done}, `${route}/${name}`, createDataWrongShortHashID)
    })
  })
  describe(`/Post ${name} By Wrong hash ID Should Not success-- `, () => {
    it(`should return single ${name} With Correct ID`, (done) => {
      checkPostError({agent, done}, `${route}/${name}`, createDataWrongHashID, 404)
    })
  })
})