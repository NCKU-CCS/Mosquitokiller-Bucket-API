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

describe(`Comments Supports -- `, () => {
  // =========================
  // Get Item By ID
  // =========================
  const ID = 'TEST01'
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
})