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

describe('Rules -- ', () => {
  // beforeEach((done) => {
  //   loginAuth(agent, () => {
  //     done()
  //   })
  // })

  let ID = 0
  // =========================
  // Create New Rule
  // =========================
  describe('/POST Rules -- ', () => {
    it('new rule data should be create', (done) => {
      const rule = {
        timeline_upper_limit: 3,
        distance_lower_limit: 500,
        points_lower_limit: 5,
        counts_lower_limit: 50
      }
      agent
        .post('/apis/rules')
        .send(rule)
        .end((err, res) => {
          if (err) return done(err)
          res.should.have.status(201)
          res.should.be.json
          res.body.should.have.property('rule_id')
          ID = res.body.rule_id
          done()
        })
    })

    it('new rule without counts keys should NOT be create', (done) => {
      const rule = {
        timeline_upper_limit: 3,
        distance_lower_limit: 500,
        points_lower_limit: 5
      }
      agent
        .post('/apis/rules')
        .send(rule)
        .end((err, res) => {
          res.should.have.status(400)
          res.should.be.json
          res.body.should.have.property('errors')
          done()
        })
    })
  })

  // =========================
  // Get All Rules
  // =========================
  describe('/Get All Rules -- ', () => {
    it('should return all rule', (done) => {
      agent
        .get('/apis/rules')
        .end((err, res) => {
          if (err) return done(err)
          res.should.have.status(200)
          res.body.should.be.an('array')
          done()
        })
    })
  })

  // =========================
  // Get Rule By ID
  // =========================
  describe('/Get Rule By ID -- ', () => {
    it('should return single rule With Correct ID', (done) => {
      agent
        .get(`/apis/rules/${ID}`)
        .end((err, res) => {
          if (err) return done(err)
          res.should.have.status(200)
          res.should.be.json
          res.body.should.have.property('rule_id')
          done()
        })
    })
    it('should Not return single rule With Wrong ID', (done) => {
      const ID = 0
      agent
        .get(`/apis/rules/${ID}`)
        .end((err, res) => {
          res.should.have.status(404)
          res.should.be.json
          done()
      })
    })
    it('should Not return single rule With NaN ID', (done) => {
      const ID = 'e'
      agent
        .get(`/apis/rules/${ID}`)
        .end((err, res) => {
          res.should.have.status(404)
          res.should.be.json
          done()
      })
    })
  })

  // =========================
  // Update A Rule
  // =========================
  describe('/Put Rule -- ', () => {
    it('rule data should be update', (done) => {
      const rule = {
        timeline_upper_limit: 2,
        distance_lower_limit: 500,
        points_lower_limit: 5,
        counts_lower_limit: 50
      }
      agent
        .put(`/apis/rules/${ID}`)
        .send(rule)
        .end((err, res) => {
          if (err) return done(err)
          res.should.have.status(204)
          done()
        })
    })
  })

  // =========================
  // Remove A Rule
  // =========================
  describe('/Delete Rule -- ', () => {
    it('rule data should be delete', (done) => {
      agent
        .delete(`/apis/rules/${ID}`)
        .end((err, res) => {
          if (err) return done(err)
          res.should.have.status(204)
          done()
        })
    })
  })
})