process.env.NODE_ENV = 'test'

let chai = require('chai')
let chaiHttp = require('chai-http')
let should = chai.should()
let server = require('../../app')

chai.use(chaiHttp)
const agent = chai.request.agent(server)

const loginAuth = (agent, next) => {
  return agent
    .post('/login')
    .set('content-type', 'application/x-www-form-urlencoded')
    .send({'email': 'sirius@ccns.ncku.edu.tw', 'password': 'sample1234'})
    .end((err, res) => {
      if (err) next(err)
      agent.get('/login').then((res) => {
        res.should.have.status(200)
        next()
      })
    })
}

describe('States -- ', () => {
  // beforeEach((done) => {
  //   loginAuth(agent, () => {
  //     done()
  //   })
  // })

  let ID = 0
  // =========================
  // Create New State
  // =========================
  describe('/POST States -- ', () => {
    it('new state data should be create', (done) => {
      const state = {
        lamp_id: 'TEST01',
        lamp_state: 1
      }
      agent
        .post('/apis/states')
        .send(state)
        .end((err, res) => {
          if (err) return done(err)
          res.should.have.status(200)
          res.should.be.json
          res.body.should.have.property('state')
          ID = res.body.state.state_id
          done()
        })
    })

    it('new state without lamp_state should NOT be create', (done) => {
      const state = {
        lamp_id: 'TEST01'
      }
      agent
        .post('/apis/states')
        .send(state)
        .end((err, res) => {
          res.should.have.status(400)
          res.should.be.json
          res.body.should.have.property('errors')
          done()
        })
    })
  })

  // =========================
  // Get All States
  // =========================
  describe('/Get All States -- ', () => {
    it('should return all state', (done) => {
      agent
        .get('/apis/states')
        .end((err, res) => {
          if (err) return done(err)
          res.should.have.status(200)
          res.should.be.json
          res.body.should.have.property('states')
          done()
        })
    })
  })

  // =========================
  // Get State By ID
  // =========================
  describe('/Get State By ID -- ', () => {
    it('should return single state With Correct ID', (done) => {
      agent
        .get(`/apis/states/${ID}`)
        .end((err, res) => {
          if (err) return done(err)
          res.should.have.status(200)
          res.should.be.json
          res.body.should.have.property('state')
          done()
        })
    })
    it('should Not return single state With Wrong ID', (done) => {
      const ID = 0
      agent
        .get(`/apis/states/${ID}`)
        .end((err, res) => {
          res.should.have.status(404)
          res.should.be.json
          done()
      })
    })
    it('should Not return single state With NaN ID', (done) => {
      const ID = 'e'
      agent
        .get(`/apis/states/${ID}`)
        .end((err, res) => {
          res.should.have.status(404)
          res.should.be.json
          done()
      })
    })
  })

  // =========================
  // Update A State
  // =========================
  describe('/Put State -- ', () => {
    it('state data should be update', (done) => {
      const state = {
        lamp_id: 'TEST01',
        lamp_state: 2,
        state_description: '不會亮'
      }
      agent
        .put(`/apis/states/${ID}`)
        .send(state)
        .end((err, res) => {
          if (err) return done(err)
          res.should.have.status(200)
          res.should.be.json
          res.body.should.have.property('state_id')
          done()
        })
    })
  })

  // =========================
  // Remove A State
  // =========================
  describe('/Delete State -- ', () => {
    it('state data should be delete', (done) => {
      agent
        .delete(`/apis/states/${ID}`)
        .end((err, res) => {
          if (err) return done(err)
          res.should.have.status(200)
          res.should.be.json
          done()
        })
    })
  })
})