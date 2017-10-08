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

const loginAuth = (agent, next) => {
  return agent
    .post('/login')
    .set('content-type', 'application/x-www-form-urlencoded')
    .send({'email': 'oceanus11034@gmail.com', 'password': 'test11034'})
    .end((err, res) => {
      if (err) next(err)
      agent.get('/login').then((res) => {
        res.should.have.status(200)
        next()
      })
    })
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
    it(`new ${name} with exist email should NOT be create`, (done) => {
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
    it(`new ${name} with exist id should NOT be create`, (done) => {
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
    it(`new ${name} with <8 length pw should NOT be create`, (done) => {
      agent
        .post(`${route}/${name}`)
        .send(createDataWrongPwShort)
        .end((err, res) => {
          if (err) {
            res.should.have.status(400)
            res.should.be.json
            res.body.should.have.property('errors')
            done()
          }
        })
    })
    it(`new ${name} with full eng pw should NOT be create`, (done) => {
      agent
        .post(`${route}/${name}`)
        .send(createDataWrongPwOnlyEng)
        .end((err, res) => {
          if (err) {
            res.should.have.status(400)
            res.should.be.json
            res.body.should.have.property('errors')
            done()
          }
        })
    })
    it(`new ${name} with full num should NOT be create`, (done) => {
      agent
        .post(`${route}/${name}`)
        .send(createDataWrongPwOnlyNum)
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
