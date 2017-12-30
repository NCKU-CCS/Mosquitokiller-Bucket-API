process.env.NODE_ENV = 'test'

let chai = require('chai')
let chaiHttp = require('chai-http')
let should = chai.should()
let server = require('../app')

chai.use(chaiHttp)
const agent = chai.request.agent(server)

const loginAuth = (agent, next) => {
  return agent
    .post('/login')
    .set('content-type', 'application/x-www-form-urlencoded')
    .send({ email: 'oceanus11034@gmail.com', password: 'test11034' })
    .end((err, res) => {
      if (err) next(err)
      agent.get('/login').then(res => {
        res.should.have.status(200)
        next()
      })
    })
}

const checkGetSuccess = (done, checkRoute, checkID, isArray = false) => {
  agent.get(checkRoute).end((err, res) => {
    if (err) return done(err)
    res.should.have.status(200)
    res.should.be.json
    if (isArray) {
      res.body.should.be.an('array')
      res.body[0].should.have.property(checkID)
    } else {
      res.body.should.have.property(checkID)
    }
    done()
  })
}

const checkGetError = (done, checkRoute, status) => {
  agent.get(checkRoute).end((err, res) => {
    if (err) {
      res.should.have.status(status)
      res.should.be.json
      res.body.should.have.property('error')
      done()
    }
  })
}

const checkPostError = (done, checkRoute, body) => {
  agent
  .post(checkRoute)
  .send(body)
  .end((err, res) => {
    if (err) {
      res.should.have.status(400)
      res.should.be.json
      res.body.should.have.property('errors')
      done()
    }
  })
}

const Test = (Item, Data) => {
  const name = Item.name
  const itemId = Item.id
  const route = Item.route || '/apis'
  const { createDataCorrect, createDataWrong, updateData } = Data

  before(done => {
    loginAuth(agent, () => {
      done()
    })
  })

  describe(`${name} -- `, () => {
    let ID = 0
    // =========================
    // Create New Item
    // =========================
    describe(`/POST ${name} -- `, () => {
      it(`new ${name} data should be create`, done => {
        agent
          .post(`${route}/${name}`)
          .send(createDataCorrect)
          .end((err, res) => {
            if (err) return done(err)
            res.should.have.status(201)
            res.should.be.json
            res.headers.should.have.property('location')
            res.body.should.have.property(`${itemId}`)
            ID = res.body[itemId]
            done()
          })
      })

      it(`new ${name} without ${name} name should NOT be create`, done => {
        checkPostError(done, `${route}/${name}`, createDataWrong[0])
      })

      it(`new ${name} with null required value should NOT be create`, done => {
        checkPostError(done, `${route}/${name}`, createDataWrong[1])
      })
    })

    // =========================
    // Get All Item
    // =========================
    describe(`/Get All ${name} -- `, () => {  
      it(`should return all ${name}`, done => {
        checkGetSuccess(done, `${route}/${name}`, itemId, true)
      })
    })

    // =========================
    // Get Item By ID
    // =========================
    describe(`/Get ${name} By ID -- `, () => {
      it(`should return single ${name} With Correct ID`, done => {
        checkGetSuccess(done, `${route}/${name}/${ID}`, itemId)
      })
      it('should Not return single ${name} With Wrong ID', done => {
        const ID = 0
        checkGetError(done, `${route}/${name}/${ID}`, 404)
      })
      it('should Not return single ${name} With NaN ID', done => {
        const ID = 'e'
        checkGetError(done, `${route}/${name}/${ID}`, 404)
      })
    })

    // =========================
    // Update A Item
    // =========================
    describe(`/Put ${name} -- `, () => {
      it(`${name} data should be update`, done => {
        agent.put(`${route}/${name}/${ID}`).send(updateData).end((err, res) => {
          if (err) return done(err)
          res.should.have.status(200)
          res.body.should.have.property(`${itemId}`)
          done()
        })
      })
      it(`${name} data should not be update with id not found`, done => {
        agent.put(`${route}/${name}/0`).send(updateData).end((err, res) => {
          if (err) {
            res.should.have.status(404)
            res.should.be.json
            res.body.should.have.property('error')
            done()
          }
        })
      })
    })

    // =========================
    // Remove A Item
    // =========================
    describe(`/Delete ${name} -- `, () => {
      it(`${name} data should be delete`, done => {
        agent.delete(`${route}/${name}/${ID}`).end((err, res) => {
          if (err) return done(err)
          res.should.have.status(204)
          done()
        })
      })
    })
  })
}

module.exports = Test
