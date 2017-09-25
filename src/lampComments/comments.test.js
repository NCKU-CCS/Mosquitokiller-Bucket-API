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

describe('Comments -- ', () => {
  // beforeEach((done) => {
  //   loginAuth(agent, () => {
  //     done()
  //   })
  // })

  let ID = 0
  // =========================
  // Create New Comment
  // =========================
  describe('/POST Comments -- ', () => {
    it('new comment data should be create', (done) => {
      const comment = {
        lamp_id: 'TEST01',
        comment_content: '我不會用'
      }
      agent
        .post('/apis/comments')
        .send(comment)
        .end((err, res) => {
          if (err) return done(err)
          res.should.have.status(200)
          res.should.be.json
          res.body.should.have.property('comment')
          ID = res.body.comment.comment_id
          done()
        })
    })

    it('new comment without lamp_id should NOT be create', (done) => {
      const comment = {
        lamp_id: 'TEST01'
      }
      agent
        .post('/apis/comments')
        .send(comment)
        .end((err, res) => {
          res.should.have.status(400)
          res.should.be.json
          res.body.should.have.property('errors')
          done()
        })
    })
  })

  // =========================
  // Get All Comments
  // =========================
  describe('/Get All Comments -- ', () => {
    it('should return all comment', (done) => {
      agent
        .get('/apis/comments')
        .end((err, res) => {
          if (err) return done(err)
          res.should.have.status(200)
          res.should.be.json
          res.body.should.have.property('comments')
          done()
        })
    })
  })

  // =========================
  // Get Comment By ID
  // =========================
  describe('/Get Comment By ID -- ', () => {
    it('should return single comment With Correct ID', (done) => {
      agent
        .get(`/apis/comments/${ID}`)
        .end((err, res) => {
          if (err) return done(err)
          res.should.have.status(200)
          res.should.be.json
          res.body.should.have.property('comment')
          done()
        })
    })
    it('should Not return single comment With Wrong ID', (done) => {
      const ID = 0
      agent
        .get(`/apis/comments/${ID}`)
        .end((err, res) => {
          res.should.have.status(404)
          res.should.be.json
          done()
      })
    })
    it('should Not return single comment With NaN ID', (done) => {
      const ID = 'e'
      agent
        .get(`/apis/comments/${ID}`)
        .end((err, res) => {
          res.should.have.status(404)
          res.should.be.json
          done()
      })
    })
  })

  // =========================
  // Update A Comment
  // =========================
  describe('/Put Comment -- ', () => {
    it('comment data should be update', (done) => {
      const comment = {
        lamp_id: 'TEST01',
        comment_content: '我真的不會用'
      }
      agent
        .put(`/apis/comments/${ID}`)
        .send(comment)
        .end((err, res) => {
          if (err) return done(err)
          res.should.have.status(200)
          res.should.be.json
          res.body.should.have.property('comment_id')
          done()
        })
    })
  })

  // =========================
  // Remove A Comment
  // =========================
  describe('/Delete Comment -- ', () => {
    it('comment data should be delete', (done) => {
      agent
        .delete(`/apis/comments/${ID}`)
        .end((err, res) => {
          if (err) return done(err)
          res.should.have.status(200)
          res.should.be.json
          done()
        })
    })
  })
})