const assert = require('assert')
const moment = require('moment')
const chai = require('chai')
const request = require('supertest')
const should = chai.should()
const { expect } = require('chai')
const sinon = require('sinon')

const app = require('../../app')
const db = require('../../models')

describe('# Product Controller', () => {

  describe('GET /index', () => {

    before(async () => {
      // 在所有測試開始前會執行的程式碼區塊
      await db.Product_category.destroy({ where: {}, truncate: { cascade: true } })
      await db.Product_category.create({ StoreId: 1, name: '麵包' })
    })

    after(async () => {
      // 在所有測試結束後會執行的程式碼區塊
      await db.Product_category.destroy({ where: {}, truncate: { cascade: true } })
    });

    it('(O) 首頁顯示所有分類', (done) => {
      request(app)
        .get('/index')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          res.text.should.include('麵包')
          return done()
        })
    })
  })





})