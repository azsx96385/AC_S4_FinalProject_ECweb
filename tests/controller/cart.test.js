const assert = require('assert')
const chai = require('chai')
const request = require('supertest')
const should = chai.should()
const { expect } = require('chai')

const app = require('../../app')
const db = require('../../models')

describe('#cart request', function () {


  describe('getCart', () => {

    before(async function () {
      await db.Product.create({ CartId: 1, name: "productName", price: 100 })
    })

    after(async function () {
      await db.Cart.destroy({ where: {}, truncate: true })
      await db.Cart_item.destroy({ where: {}, truncate: true })
      await db.Product.destroy({ where: {}, truncate: true })
    })


    it('（Ｏ）取得購物車資料', done => {
      //產生req.session
      var agent = request.agent(app)
      agent
        .post('/cart')
        .send('productId=1&quantity=1')
        .set('Accept', 'application/json')
        .expect(302)
        .end(function (err, res) {
          if (err) return done(err)
          agent
            .get('/cart')
            .set('Accept', 'application/json')
            .expect(200)
            .end(function (err, res) {
              if (err) return done(err)
              res.text.should.include('productName')
              done()
            })
        })
    })

    it('（x）購物車是空的', done => {

      request(app)
        .get('/cart')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function (err, res) {
          if (err) return done(err)
          res.text.should.not.include('productName')
          done()
        })
    })
  })


  describe('postCart', () => {

    before(async () => {
      await db.Product.create({ CartId: 1, name: "productName", price: 100 })
    })

    it('建立cart並建立cartItem', (done) => {
      request(app)
        .post('/cart')
        .send('productId=1&quantity=1')
        .set('Accept', 'application/json')
        .expect(302)
        .end(function (err, res) {
          //cart存在
          db.Cart.findByPk(1, { include: db.Cart_item }).then(cart => {

            expect(cart).to.not.be.null
            expect(cart.Cart_items[0].dataValues.quantity).to.not.be.null
            done();
          })
        })
    })
  })

  describe('已建立cart ,update cartitem的quantiy', () => {
    it('update cartItem的quantity', (done) => {
      request(app)
        .post('/cart')
        .send('CartId=1&productId=1&quantity=1')
        .set('Accept', 'application/json')
        .expect(302)
        .end(function (err, res) {
          db.Cart.findByPk(1, { include: db.Cart_item }).then(cart => {
            expect(cart.Cart_items[0].dataValues.quantity).to.equal(2)
            done();
          })
        })
    })

    after(async function () {
      // 在所有測試結束後會執行的程式碼區塊
      await db.Cart_item.destroy({ where: {}, truncate: { cascade: true } })
      await db.Cart.destroy({ where: {}, truncate: { cascade: true } })
      await db.Product.destroy({ where: {}, truncate: { cascade: true } })
    })

  })

  describe('addCartItem', () => {

    before(async function () {
      await db.Cart_item.create({ id: 1, quantity: 1 })
    })

    it('[O] cartItem quantity will add 1', (done) => {
      request(app)
        .post('/cartItem/1/add')
        .expect(302)
        .end(function (err, res) {
          db.Cart_item.findOne({ where: { id: 1 } }).then(cartItem => {
            expect(cartItem.quantity).to.equal(2)
            done()
          })
        })
    })

    after(async function () {
      await db.Cart_item.destroy({ where: {}, truncate: { cascade: true } })
    })
  })


  describe('subCartItem', () => {

    before(async function () {
      await db.Cart_item.create({ id: 1, quantity: 2 })
      await db.Cart_item.create({ id: 2, quantity: 1 })
    });

    it('cartItem quantity will subtract 1', (done) => {
      request(app)
        .post('/cartItem/1/sub')
        .expect(302)
        .end(function (err, res) {
          db.Cart_item.findOne({ where: { id: 1 } }).then(cartItem => {
            expect(cartItem.quantity).to.equal(1)
            done()
          })
        })
    })

    it('if cartItem quantity is 0, will be delete', (done) => {
      request(app)
        .post('/cartItem/2/sub')
        .expect(302)
        .end(function (err, res) {
          db.Cart_item.findOne({ where: { id: 2 } }).then(cartItem => {
            expect(cartItem).to.be.null
            done()
          })
        })
    })

    after(async function () {
      // 在所有測試結束後會執行的程式碼區塊
      await db.Cart_item.destroy({ where: {}, truncate: { cascade: true } })
      await db.Cart.destroy({ where: {}, truncate: { cascade: true } })
    })
  })


  describe('deleteCartItem', () => {

    before(async function () {
      await db.Cart_item.create({ id: 1, quantity: 1 })
    });

    it('[O] cartItem  willl be null', (done) => {
      request(app)
        .delete('/cartItem/1')
        .expect(302)
        .end(function (err, res) {
          db.Cart_item.findOne({ where: { id: 1 } }).then(cartItem => {
            expect(cartItem).to.be.null
            done()
          })
        });

    })
    after(async function () {
      await db.Cart_item.destroy({ where: {}, truncate: { cascade: true } })
    });
  })

}) 