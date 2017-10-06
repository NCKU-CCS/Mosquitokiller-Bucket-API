process.env.NODE_ENV = 'test'

let chai = require('chai')
let chaiHttp = require('chai-http')
let should = chai.should()
let server = require('../app')

chai.use(chaiHttp)
const agent = chai.request.agent(server)

// const loginAuth = (agent, next) => {
//   return agent
//     .post('/login')
//     .set('content-type', 'application/x-www-form-urlencoded')
//     .send({'email': 'sirius@ccns.ncku.edu.tw', 'password': 'sample1234'})
//     .end((err, res) => {
//       if (err) next(err)
//       agent.get('/login').then((res) => {
//         res.should.have.status(200)
//         next()
//       })
//     })
// }

const Test = (Item, Data) => {
  const name = Item.name
  const itemId = Item.id
  const route = Item.route || '/apis'
  const {createDataCorrect, createDataWrong, updateData} = Data

  describe(`${name} -- `, () => {
    // beforeEach((done) => {
    //   loginAuth(agent, () => {
    //     done()
    //   })
    // })

    let ID = 0
    // =========================
    // Create New Item
    // =========================
    describe(`/POST ${name} -- `, () => {
      it(`new ${name} data should be create`, (done) => {
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

      it(`new ${name} without ${name} name should NOT be create`, (done) => {
        agent
          .post(`${route}/${name}`)
          .send(createDataWrong)
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

    // =========================
    // Get All Item
    // =========================
    describe(`/Get All ${name} -- `, () => {
      it(`should return all ${name}`, (done) => {
        agent
          .get(`${route}/${name}`)
          .end((err, res) => {
            if (err) return done(err)
            res.should.have.status(200)
            res.should.be.json
            res.body.should.be.an('array')
            done()
          })
      })
    })

    // =========================
    // Get Item By ID
    // =========================
    describe(`/Get ${name} By ID -- `, () => {
      it(`should return single ${name} With Correct ID`, (done) => {
        agent
          .get(`${route}/${name}/${ID}`)
          .end((err, res) => {
            if (err) return done(err)
            res.should.have.status(200)
            res.should.be.json
            res.body.should.have.property(`${itemId}`)
            done()
          })
      })
      it('should Not return single ${name} With Wrong ID', (done) => {
        const ID = 0
        agent
          .get(`${route}/${name}/${ID}`)
          .end((err, res) => {
            if (err) {
              res.should.have.status(404)
              res.should.be.json
              done()
            }
        })
      })
      it('should Not return single ${name} With NaN ID', (done) => {
        const ID = 'e'
        agent
          .get(`${route}/${name}/${ID}`)
          .end((err, res) => {
            if (err) {
              res.should.have.status(404)
              res.should.be.json
              done()
            }
        })
      })
    })

    // =========================
    // Update A Item
    // =========================
    describe(`/Put ${name} -- `, () => {
      it(`${name} data should be update`, (done) => {
        agent
          .put(`${route}/${name}/${ID}`)
          .send(updateData)
          .end((err, res) => {
            if (err) return done(err)
            res.should.have.status(204)
            done()
          })
      })
    })

    // =========================
    // Remove A Item
    // =========================
    describe(`/Delete ${name} -- `, () => {
      it(`${name} data should be delete`, (done) => {
        agent
          .delete(`${route}/${name}/${ID}`)
          .end((err, res) => {
            if (err) return done(err)
            res.should.have.status(204)
            done()
          })
      })
    })
  })
}

module.exports = Test
