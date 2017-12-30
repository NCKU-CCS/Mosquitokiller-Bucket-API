module.exports = {
  loginAuth: (agent, next) => {
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
  },
  checkGetSuccess: (tester, checkRoute, checkID, isArray = false) => {
    tester.agent.get(checkRoute).end((err, res) => {
      if (err) return tester.done(err)
      res.should.have.status(200)
      res.should.be.json
      if (isArray) {
        res.body.should.be.an('array')
        res.body[0].should.have.property(checkID)
      } else {
        res.body.should.have.property(checkID)
      }
      tester.done()
    })
  },
  checkGetError: (tester, checkRoute, status) => {
    tester.agent.get(checkRoute).end((err, res) => {
      if (err) {
        res.should.have.status(status)
        res.should.be.json
        res.body.should.have.property('error')
        tester.done()
      }
    })
  },
  checkPostError: (tester, checkRoute, body) => {
    tester.agent
    .post(checkRoute)
    .send(body)
    .end((err, res) => {
      if (err) {
        res.should.have.status(400)
        res.should.be.json
        res.body.should.have.property('error')
        tester.done()
      }
    })
  }
}