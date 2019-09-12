process.env.NODE_ENV = 'test'

const assert = require('assert')
const moment = require('moment')
const chai = require('chai')
const request = require('supertest')
const should = chai.should()
const { expect } = require('chai')
const sinon = require('sinon')

const passport = require('../../config/passport')
const app = require('../../app')
const db = require('../../models')

describe('# Order Controller', () => {

  describe('GET /order/:id/payment', () => {

    before(async () => {
      // 在所有測試開始前會執行的程式碼區塊
      await db.User.destroy({ where: {}, truncate: { cascade: true } })
      await db.Order.destroy({ where: {}, truncate: { cascade: true } })

      const rootUser = await db.User.create({ id: 1, name: 'root' })
      await db.Order.create({ id: 1, UserId: 1, amount: 1000 })

      this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
        callback(null, { ...rootUser }, null);
        return (req, res, next) => { }
      })
    })

    after(async () => {
      // 在所有測試結束後會執行的程式碼區塊
      await db.User.destroy({ where: {}, truncate: { cascade: true } })
      await db.Order.destroy({ where: {}, truncate: { cascade: true } })
      this.authenticate.restore()
    })

    it('(O) 登入狀態，取得付款頁面', (done) => {
      request(app)
        .get('/order/1/payment')
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          res.text.should.include(1000)
          return done()
        })
    })
  })

  describe('GET /order/:id/branchselection', () => {

    before(async () => {
      // 在所有測試開始前會執行的程式碼區塊
      await db.User.destroy({ where: {}, truncate: { cascade: true } })
      await db.Order.destroy({ where: {}, truncate: { cascade: true } })

      const rootUser = await db.User.create({ id: 1, name: 'root' })
      await db.Order.create({ id: 1, UserId: 1, amount: 1000 })

      this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
        callback(null, { ...rootUser }, null);
        return (req, res, next) => { }
      })
    })

    after(async () => {
      // 在所有測試結束後會執行的程式碼區塊
      await db.User.destroy({ where: {}, truncate: { cascade: true } })
      await db.Order.destroy({ where: {}, truncate: { cascade: true } })
      this.authenticate.restore()
    })

    it('(O) 登入狀態，取得付款頁面', (done) => {
      request(app)
        .get('/order/1/branchselection')
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          res.text.should.include(1000)
          return done()
        })
    })
  })
})