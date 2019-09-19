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


  describe('#post coupon', function () {
    this.timeout(5000)
    before(async function () {

      let rootUser = await db.User.create({ name: 'root' })
      //模擬登入
      this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
        callback(null, { ...rootUser }, null);
        return (req, res, next) => { };
      })
    })
    it('生成coupon', (done) => {
      request(app)
        .post('/admin/coupon/make')
        .send({ storeId: 1, couponTypeId: 1, CouponDescription: 'CouponDescription', CouponDiscount: 100 })
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          db.Coupon.findByPk(1).then(coupon => {

            expect(coupon).to.not.be.null
            return done()
          })

        });
    })

    after(async function () {
      await db.Coupon.destroy({ where: {}, truncate: true })
      this.authenticate.restore()
    })

  })
  describe('couponcheck', function () {
    this.timeout(5000);

    beforeEach(async function () {

      let rootUser = await db.User.create({ name: 'root' })
      //模擬登入
      this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
        callback(null, { ...rootUser }, null);
        return (req, res, next) => { };
      })

      await db.Product.create({ price: 100 })
      await db.Cart_item.create({ ProductId: 1, CartId: 1, quantity: 1 })
      await db.Coupon.create({ couponCode: 'abcd1236', discount: 50 })
      await db.Coupon.create({ couponCode: 'abcd1234', discount: 500, available: true })

      await db.Coupon.create({ couponCode: 'abcd1235', available: false })


    })

    afterEach(async function () {
      await db.Coupon.destroy({ where: {}, truncate: true })
      await db.Product.destroy({ where: {}, truncate: true })
      await db.Cart_item.destroy({ where: {}, truncate: true })
      await db.Cart.destroy({ where: {}, truncate: true })

      this.authenticate.restore()
    })


    it('coupon序號不存在，redirect back', (done) => {
      var agent = request.agent(app)
      agent
        .post('/cart')
        .send('productId=1&quantity=1')
        .set('Accept', 'application/json')
        .expect(302)
        .end(function (err, res) {
          agent
            .post('/checkCoupon')
            .set('Accept', 'application/json')
            .expect(302)
            .end(function (err, res) {
              if (err) return done(err);

              expect(res.header.location).to.equal('/')
              done();

            });
        })
    })

    it('coupon狀態不能使用,redirect back ', (done) => {
      var agent = request.agent(app)
      agent
        .post('/cart')
        .send('productId=1&quantity=1')
        .set('Accept', 'application/json')
        .expect(302)
        .end(function (err, res) {
          agent
            .post('/checkCoupon')
            .send({ code: 'abcd1235' })
            .set('Accept', 'application/json')
            .expect(302)
            .end(function (err, res) {
              expect(res.header.location).to.equal('/')
              done();

            });
        })
    })

    it('折抵金額大於totalprice ', (done) => {
      var agent = request.agent(app)
      agent
        .post('/cart')
        .send('productId=1&quantity=1')
        .set('Accept', 'application/json')
        .expect(302)
        .end(function (err, res) {
          agent
            .post('/checkCoupon')
            .send({ couponCode: 'abcd1234' })
            .set('Accept', 'application/json')
            .expect(302)
            .end(function (err, res) {
              expect(res.header.location).to.equal('/')
              return done()
            });
        })
    })

    it('成功折抵', (done) => {
      var agent = request.agent(app)
      agent
        .post('/cart')
        .send('productId=1&quantity=1')
        .set('Accept', 'application/json')
        .expect(302)
        .end(function (err, res) {
          agent
            .post('/checkCoupon')
            .send({ couponCode: 'abcd1236' })
            .set('Accept', 'application/json')
            .expect(302)
            .end(function (err, res) {
              expect(res.header.location).to.equal('/cart?couponId=%201')
              return done()
            });
        })
    })




  })

  describe('getCouponManagePage', function () {
    this.timeout(5000);
    before(async function () {

      let rootUser = await db.User.create({ name: 'root' })
      //模擬登入
      this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
        callback(null, { ...rootUser }, null);
        return (req, res, next) => { };
      })


      await db.Coupon.create({ couponCode: 'abcd1236', discount: 50 })
      await db.Coupon.create({ couponCode: 'abcd1234', discount: 500, available: true, expireDate: 2019 - 08 - 08 })

      await db.Coupon.create({ couponCode: 'abcd1235', available: false })


    })

    after(async function () {
      await db.Coupon.destroy({ where: {}, truncate: true })

      this.authenticate.restore()
    })


    it('will show all the coupon', (done) => {
      request(app)
        .get('/admin/coupon/managePage')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          res.text.should.include('abcd1236')
          res.text.should.include('abcd1234')
          res.text.should.include('abcd1235')
          done();
        });
    })
    it('過期的coupon會被改成無效', (done) => {
      db.Coupon.findByPk(2).then(coupon => {
        expect(coupon.available).to.equal(false)
        return done()
      })
    })


  })

  describe('getCouponManagePage', () => {
    before(async function () {

      let rootUser = await db.User.create({ name: 'root' })
      //模擬登入
      this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
        callback(null, { ...rootUser }, null);
        return (req, res, next) => { };
      })
      await db.Coupon.create({ couponCode: 'abcd1236', discount: 50, description: 'coupondescription' })
    })

    after(async function () {
      await db.Coupon.destroy({ where: {}, truncate: true })

      this.authenticate.restore()
    })

    it('will render couponEditPage', (done) => {
      request(app)
        .get('/admin/coupon/managePage/1/edit')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err);
          res.text.should.include('coupondescription')
          res.text.should.include(50)
          done();
        });
    })
  })
  describe('#getCouponOrderEdit', () => {

    before(async function () {
      const rootUser = await db.User.create({ name: 'root', address: '開山里' })
      await db.Cart.create({})
      await db.Product.create({ name: "productName", price: 100 })
      await db.Cart_item.create({ CartId: 1, ProductId: 1 })
      await db.Coupon.create({ discount: 50 })

      //模擬登入
      this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
        callback(null, { ...rootUser }, null);
        return (req, res, next) => { req.user = rootUser };
      })
    })

    it('render orderEdit', (done) => {
      var agent = request.agent(app)
      agent
        .post('/cart')
        .send('productId=1&quantity=1')
        .set('Accept', 'application/json')
        .expect(302)
        .end(function (err, res) {
          agent
            .get('/admin/couponOrder/1')
            .set('Accept', 'application/json')
            .expect(200)
            .end(function (err, res) {
              res.text.should.include('root')
              res.text.should.include("productName")
              res.text.should.include(100)
              res.text.should.include(50)


              done();
            });
        })
    })



    after(async function () {
      // 在所有測試結束後會執行的程式碼區塊
      this.authenticate.restore()
      await db.Cart_item.destroy({ where: {}, truncate: { cascade: true } })
      await db.Cart.destroy({ where: {}, truncate: true })
      await db.Product.destroy({ where: {}, truncate: true })
      await db.User.destroy({ where: {}, truncate: true })

    });

  })

  describe('postCouponEdit', async () => {
    before(async function () {

      let rootUser = await db.User.create({ name: 'root' })
      //模擬登入
      this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
        callback(null, { ...rootUser }, null);
        return (req, res, next) => { };
      })
      await db.Coupon.create({ couponCode: 'abcd1236', discount: 50, description: 'coupondescription' })
    })

    after(async function () {
      await db.Coupon.destroy({ where: {}, truncate: true })

      this.authenticate.restore()
    })
    it('redirect to coupon managePage', (done) => {
      request(app)
        .post('/admin/coupon/edit')
        .send({ couponId: 1, StoreId: 1, couponTypeId: 1, CouponDiscount: 100, CouponDescription: 'newDescription', available: true })
        .set('Accept', 'application/json')
        .expect(302)
        .end(function (err, res) {

          if (err) return done(err)
          done();
        });
    })
    it('coupon資料會被修改', (done) => {
      db.Coupon.findByPk(1).then(coupon => {
        expect(coupon.discount).to.equal(100)
        expect(coupon.description).to.equal('newDescription')
        done()
      })

    })
  })


})