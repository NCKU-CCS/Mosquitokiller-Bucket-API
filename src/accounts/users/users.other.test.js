process.env.NODE_ENV = 'test'

let chai = require('chai')
let chaiHttp = require('chai-http')
let should = chai.should()
let server = require(`${global.ROOT_PATH}/app`)

chai.use(chaiHttp)
const agent = chai.request.agent(server)

const name = 'users'
const route = '/accounts'

const createDataWrongEmail = {
  user_id: 'tester',
  email: 'oceanus1103@',
  password: 'test*11034'
}

const createDataExistEmail = {
  user_id: 'tester',
  email: 'oceanus1103@gmail.com',
  password: 'test*11034'
}

const createDataExistID = {
  user_id: 'admin',
  email: 'oceanus@gmail.com',
  password: 'test*11034'
}

describe(`${name} -- `, () => {
  // =========================
  // Create New Item
  // =========================
  describe(`/POST ${name} -- `, () => {
    it(`new ${name} with bad email should NOT be create`, (done) => {
      agent
        .post(`${route}/${name}`)
        .send(createDataWrongEmail)
        .end((err, res) => {
          if (err) {
            res.should.have.status(400)
            res.should.be.json
            res.body.should.have.property('errors')
            done()
          }
        })
    })
    it(`new ${name} with exist user_id should NOT be create`, (done) => {
      agent
        .post(`${route}/${name}`)
        .send(createDataExistEmail)
        .end((err, res) => {
          if (err) {
            res.should.have.status(400)
            res.should.be.json
            res.body.should.have.property('errors')
            done()
          }
        })
    })
    it(`new ${name} with exist email should NOT be create`, (done) => {
      agent
        .post(`${route}/${name}`)
        .send(createDataExistID)
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
