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

describe('Places -- ', () => {
  // beforeEach((done) => {
  //   loginAuth(agent, () => {
  //     done()
  //   })
  // })

  let ID
  // =========================
  // Create New Lamp
  // =========================
  describe('/POST Lamp -- ', () => {
    it('new lamp data should be create', (done) => {
      const lamp = {
        lamp_id: 'TEST04',
        lamp_location: [],
        place_id: 1
      }
      agent
        .post('/apis/lamps')
        .send(lamp)
        .end((err, res) => {
          if (err) return done(err)
          res.should.have.status(200)
          res.should.be.json
          res.body.should.have.property('lamp')
          ID = res.body.lamp.lamp_id
          done()
        })
    })

    it('new lamp without lamp_id should NOT be create', (done) => {
      const lamp = {
        lamp_location: [],
        place_id: 1
      }
      agent
        .post('/apis/lamps')
        .send(lamp)
        .end((err, res) => {
          res.should.have.status(400)
          res.should.be.json
          res.body.should.have.property('errors')
          done()
        })
    })
  })

  // =========================
  // Get All Lamps
  // =========================
  describe('/Get All Lamps -- ', () => {
    it('should return all lamps', (done) => {
      agent
        .get('/apis/lamps')
        .end((err, res) => {
          if (err) return done(err)
          res.should.have.status(200)
          res.should.be.json
          res.body.should.have.property('lamps')
          done()
        })
    })
  })

  // =========================
  // Get Lamp By ID
  // =========================
  describe('/Get Lamp By ID -- ', () => {
    it('should return single lamp With Correct ID', (done) => {
      agent
        .get(`/apis/lamps/${ID}`)
        .end((err, res) => {
          if (err) return done(err)
          res.should.have.status(200)
          res.should.be.json
          res.body.should.have.property('lamp')
          done()
        })
    })
    it('should Not return single lamp With Wrong ID', (done) => {
      const ID = 'wrongId'
      agent
        .get(`/apis/lamps/${ID}`)
        .end((err, res) => {
          res.should.have.status(404)
          res.should.be.json
          done()
      })
    })
  })

  // =========================
  // Update A Lamp
  // =========================
  describe('/Put Lamp -- ', () => {
    it('lamp data should be update', (done) => {
      const lamp = {
        lamp_name: 'NETDB_2',
        lamp_address: '70102',
        lamp_contact_person: 'MR. Yang'
      }
      agent
        .put(`/apis/lamps/${ID}`)
        .send(lamp)
        .end((err, res) => {
          if (err) return done(err)
          res.should.have.status(200)
          res.should.be.json
          res.body.should.have.property('lamp_id')
          done()
        })
    })
  })

  // =========================
  // Remove A Lamp
  // =========================
  describe('/Delete Lamp -- ', () => {
    it('lamp data should be delete', (done) => {
      agent
        .delete(`/apis/lamps/${ID}`)
        .end((err, res) => {
          if (err) return done(err)
          res.should.have.status(200)
          res.should.be.json
          done()
        })
    })
  })
})