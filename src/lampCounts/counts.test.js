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

describe('Counts -- ', () => {
  // beforeEach((done) => {
  //   loginAuth(agent, () => {
  //     done()
  //   })
  // })

  let ID = 0
  // =========================
  // Create New Count
  // =========================
  describe('/POST Counts -- ', () => {
    it('new count data should be create', (done) => {
      const count = {
        lamp_id: 'TEST01',
        counts: 1
      }
      agent
        .post('/apis/counts')
        .send(count)
        .end((err, res) => {
          if (err) return done(err)
          res.should.have.status(201)
          res.should.be.json
          res.headers.should.have.property('location')
          res.body.should.have.property('count_id')
          ID = res.body.count_id
          done()
        })
    })

    it('new count without lamp_id should NOT be create', (done) => {
      const count = {
        counts: 1
      }
      agent
        .post('/apis/counts')
        .send(count)
        .end((err, res) => {
          res.should.have.status(400)
          res.should.be.json
          res.body.should.have.property('errors')
          done()
        })
    })
  })

  // =========================
  // Get All Counts
  // =========================
  describe('/Get All Counts -- ', () => {
    it('should return all count', (done) => {
      agent
        .get('/apis/counts')
        .end((err, res) => {
          if (err) return done(err)
          res.should.have.status(200)
          res.body.should.be.an('array')
          done()
        })
    })
  })

  // =========================
  // Get Count By ID
  // =========================
  describe('/Get Count By ID -- ', () => {
    it('should return single count With Correct ID', (done) => {
      agent
        .get(`/apis/counts/${ID}`)
        .end((err, res) => {
          if (err) return done(err)
          res.should.have.status(200)
          res.should.be.json
          res.body.should.have.property('count_id')
          done()
        })
    })
    it('should Not return single count With Wrong ID', (done) => {
      const ID = 0
      agent
        .get(`/apis/counts/${ID}`)
        .end((err, res) => {
          res.should.have.status(404)
          res.should.be.json
          done()
      })
    })
    it('should Not return single count With NaN ID', (done) => {
      const ID = 'e'
      agent
        .get(`/apis/counts/${ID}`)
        .end((err, res) => {
          res.should.have.status(404)
          res.should.be.json
          done()
      })
    })
  })

  // =========================
  // Update A Count
  // =========================
  describe('/Put Count -- ', () => {
    it('count data should be update', (done) => {
      const count = {
        lamp_id: 'TEST01',
        counts: 10
      }
      agent
        .put(`/apis/counts/${ID}`)
        .send(count)
        .end((err, res) => {
          if (err) return done(err)
          res.should.have.status(204)
          done()
        })
    })
  })

  // =========================
  // Remove A Count
  // =========================
  describe('/Delete Count -- ', () => {
    it('count data should be delete', (done) => {
      agent
        .delete(`/apis/counts/${ID}`)
        .end((err, res) => {
          if (err) return done(err)
          res.should.have.status(204)
          done()
        })
    })
  })
})