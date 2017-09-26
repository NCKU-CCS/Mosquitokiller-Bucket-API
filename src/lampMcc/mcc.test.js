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

describe('Mcc -- ', () => {
  // beforeEach((done) => {
  //   loginAuth(agent, () => {
  //     done()
  //   })
  // })

  let ID = 0
  // =========================
  // Create New Mcc
  // =========================
  describe('/POST Mcc -- ', () => {
    it('new mcc data should be create', (done) => {
      const mcc = {
        mcc_keys: ['TEST01', 'TEST02'],
        mcc_points: ['TEST01', 'TEST02'],
        mcc_center: [120, 22],
        rule_id: 1
      }
      agent
        .post('/apis/mcc')
        .send(mcc)
        .end((err, res) => {
          if (err) return done(err)
          res.should.have.status(201)
          res.should.be.json
          res.headers.should.have.property('location')
          res.body.should.have.property('mcc_id')
          ID = res.body.mcc_id
          done()
        })
    })

    it('new mcc without mcc keys should NOT be create', (done) => {
      const mcc = {
        mcc_points: ['TEST01', 'TEST02'],
        mcc_center: [120, 22],
        rule_id: 1
      }
      agent
        .post('/apis/mcc')
        .send(mcc)
        .end((err, res) => {
          res.should.have.status(400)
          res.should.be.json
          res.body.should.have.property('errors')
          done()
        })
    })
  })

  // =========================
  // Get All Mcc
  // =========================
  describe('/Get All Mcc -- ', () => {
    it('should return all mcc', (done) => {
      agent
        .get('/apis/mcc')
        .end((err, res) => {
          if (err) return done(err)
          res.should.have.status(200)
          res.body.should.be.an('array')
          done()
        })
    })
  })

  // =========================
  // Get Mcc By ID
  // =========================
  describe('/Get Mcc By ID -- ', () => {
    it('should return single mcc With Correct ID', (done) => {
      agent
        .get(`/apis/mcc/${ID}`)
        .end((err, res) => {
          if (err) return done(err)
          res.should.have.status(200)
          res.should.be.json
          res.body.should.have.property('mcc_id')
          done()
        })
    })
    it('should Not return single mcc With Wrong ID', (done) => {
      const ID = 0
      agent
        .get(`/apis/mcc/${ID}`)
        .end((err, res) => {
          res.should.have.status(404)
          res.should.be.json
          done()
      })
    })
    it('should Not return single mcc With NaN ID', (done) => {
      const ID = 'e'
      agent
        .get(`/apis/mcc/${ID}`)
        .end((err, res) => {
          res.should.have.status(404)
          res.should.be.json
          done()
      })
    })
  })

  // =========================
  // Update A Mcc
  // =========================
  describe('/Put Mcc -- ', () => {
    it('mcc data should be update', (done) => {
      const mcc = {
        mcc_points: ['TEST09', 'TEST02'],
        mcc_center: [120, 22],
        rule_id: 1
      }
      agent
        .put(`/apis/mcc/${ID}`)
        .send(mcc)
        .end((err, res) => {
          if (err) return done(err)
          res.should.have.status(204)
          done()
        })
    })
  })

  // =========================
  // Remove A Mcc
  // =========================
  describe('/Delete Mcc -- ', () => {
    it('mcc data should be delete', (done) => {
      agent
        .delete(`/apis/mcc/${ID}`)
        .end((err, res) => {
          if (err) return done(err)
          res.should.have.status(204)
          done()
        })
    })
  })
})