const assert = require('assert')
const chai = require('chai')
const request = require('supertest')
const should = chai.should()
const { expect } = require('chai')
const sinon = require('sinon')


const passport = require('../../config/passport')

const app = require('../../app')
const db = require('../../models')

describe('#coupon request', () => {


  describe('#post coupon', () => {

    it('redirect coupon show', (done) => {
      request(app)
        .post('coupon/make')
        .send({ storeId: 1, couponTypeId: 1, CouponDescription: 'CouponDescription', CouponDiscount: 100 })
        .set('Accept', 'application/json')
        .expect(302)
        .end(function (err, res) {

          if (err) return done(err);
          done();

        });
    })

  })
  /* describe('couponcheck', () => {
 
     it('coupon序號不存在 ', (done) => {
       request(app)
         .get('/checkCoupon')
         .set('Accept', 'application/json')
         .expect(302)
         .end(function (err, res) {
 
 
           return done()
         });
     })
 
   })*/

})