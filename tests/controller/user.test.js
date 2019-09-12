const assert = require('assert')
const chai = require('chai')
const request = require('supertest')
const should = chai.should()
const { expect } = require('chai')

const app = require('../../app')
const db = require('../../models')

describe('# User controller', function () {
  describe('#/users/signUp', function () {
    it("成功註冊", (done) => {
      request(app)
        .post('/users/signUp')
        .send('name=name&email=email&password=password&password_confirm=password')
        .expect(302)
        .end(function (err, res) {
          db.User.findOne({
            where: {
              email: 'email'
            }
          }).then((user) => {
            expect(user.email).to.be.equal('email')
            done()
          })
        });
    });

    it('資料漏填', (done) => {

    })
    it("(X) 信箱重複", (done) => {
      request(app)
        .post('/users/signUp')
        .send('name=name&email=email&password=password&passwordCheck=password')
        .expect(200)
        .end(function (err, res) {

          if (err) return done(err);
          done();
        });
    });

    it("(X) 兩次密碼輸入不同", (done) => {
      request(app)
        .post('/users/signUp')
        .send('name=name1&email=email1&password=password1&passwordCheck=password')
        .expect(302)
        .end(function (err, res) {

          if (err) return done(err);
          done();
        });
    });


  })

})