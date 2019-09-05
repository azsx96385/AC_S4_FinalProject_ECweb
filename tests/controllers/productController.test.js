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
    })

    it('(O) 首頁顯示所有分類', (done) => {
      request(app)
        .get('/index')
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          res.text.should.include('麵包')
          return done()
        })
    })
  })

  describe('GET /Category/:category_id', () => {

    before(async () => {
      // 在所有測試開始前會執行的程式碼區塊
      await db.Product_category.destroy({ where: {}, truncate: { cascade: true } })
      await db.Product.destroy({ where: {}, truncate: { cascade: true } })

      await db.Product_category.create({ id: 1, StoreId: 1, name: '麵包' })
      await db.Product.create({ StoreId: 1, ProductCategoryId: 1, name: '吐司' })
      await db.Product.create({ StoreId: 1, ProductCategoryId: 1, name: '肉鬆麵包' })
    })

    after(async () => {
      // 在所有測試結束後會執行的程式碼區塊
      await db.Product_category.destroy({ where: {}, truncate: { cascade: true } })
      await db.Product.destroy({ where: {}, truncate: { cascade: true } })
      await db.Product.destroy({ where: {}, truncate: { cascade: true } })
    })

    it('(O) 顯示此分類的所有產品', (done) => {
      request(app)
        .get('/Category/1')
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          res.text.should.include('吐司')
          res.text.should.include('肉鬆麵包')
          return done()
        })
    })

    it('(O) 產品由上架時間-新到舊排序', (done) => {
      request(app)
        .get('/Category/1/?key=createdAt&value=desc')
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          res.text.indexOf('肉鬆麵包').should.above(res.text.indexOf('吐司'))
          return done()
        })
    })
  })

  describe('GET /product/:id', () => {

    before(async () => {
      // 在所有測試開始前會執行的程式碼區塊
      await db.Product_category.destroy({ where: {}, truncate: { cascade: true } })
      await db.Product.destroy({ where: {}, truncate: { cascade: true } })
      await db.Comment.destroy({ where: {}, truncate: { cascade: true } })

      await db.Product_category.create({ id: 1, StoreId: 1, name: '麵包' })
      await db.Product.create({ id: 1, StoreId: 1, ProductCategoryId: 1, name: '吐司' })
      await db.Comment.create({ ProductId: 1, comment: '123' })
    })

    after(async () => {
      // 在所有測試結束後會執行的程式碼區塊
      await db.Product_category.destroy({ where: {}, truncate: { cascade: true } })
      await db.Product.destroy({ where: {}, truncate: { cascade: true } })
      await db.Comment.destroy({ where: {}, truncate: { cascade: true } })
    })

    it('(O) 顯示單項產品頁面', (done) => {
      request(app)
        .get('/product/1')
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          res.text.should.include('吐司')
          res.text.should.include('123')
          return done()
        })
    })
  })

  describe('GET /ESHOP/search', () => {

    before(async () => {
      // 在所有測試開始前會執行的程式碼區塊
      await db.Product.destroy({ where: {}, truncate: { cascade: true } })

      await db.Product.create({ name: 'abc' })
    })

    after(async () => {
      // 在所有測試結束後會執行的程式碼區塊
      await db.Product.destroy({ where: {}, truncate: { cascade: true } })
    })

    it('(O) 搜尋產品', (done) => {
      request(app)
        .get('/ESHOP/search?keyword=abc')
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          res.text.should.include('abc')
          return done()
        })
    })
  })

})