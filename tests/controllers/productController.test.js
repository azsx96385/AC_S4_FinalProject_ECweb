process.env.NODE_ENV = 'test'

const chai = require('chai')
const request = require('supertest')
const should = chai.should()
const { expect } = require('chai')
const sinon = require('sinon')

const passport = require('../../config/passport')
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

      await db.Product.create({ name: 'ABC' })
    })

    after(async () => {
      // 在所有測試結束後會執行的程式碼區塊
      await db.Product.destroy({ where: {}, truncate: { cascade: true } })
    })

    it('(O) 搜尋產品', (done) => {
      request(app)
        .get('/ESHOP/search?keyword=a')
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          res.text.should.include('ABC')
          return done()
        })
    })
  })

  describe('POST /product/:id/rate', () => {

    before(async () => {
      // 在所有測試開始前會執行的程式碼區塊
      await db.User.destroy({ where: {}, truncate: { cascade: true } })
      await db.Product_category.destroy({ where: {}, truncate: { cascade: true } })
      await db.Product.destroy({ where: {}, truncate: { cascade: true } })

      const rootUser = await db.User.create({ name: 'root', email: 'root@gmail.com', password: 'password' })
      await db.Product_category.create({ id: 1, name: '麵包' })
      await db.Product.create({ id: 1, ProductCategoryId: 1, name: '吐司' })

      this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
        callback(null, { ...rootUser }, null);
        return (req, res, next) => { req.user = rootUser }
      })
    })

    after(async () => {
      // 在所有測試結束後會執行的程式碼區塊
      await db.User.destroy({ where: {}, truncate: { cascade: true } })
      await db.Product_category.destroy({ where: {}, truncate: { cascade: true } })
      await db.Product.destroy({ where: {}, truncate: { cascade: true } })
      await db.Comment.destroy({ where: {}, truncate: { cascade: true } })
      this.authenticate.restore()
    })

    it('(O) 登入狀態，新增評論後返回單項產品頁面', (done) => {
      request(app)
        .post('/product/1/rate')
        .send('comment=good&rating=3&ProductId=1')
        .set('Accept', 'application/json')
        .expect(302)
        .end((err, res) => {
          if (err) return done(err)
          return done()
        })
    })

    it('(O) 登入狀態，確認是否有新增評價', (done) => {
      request(app)
        .get('/product/1')
        .set('Accept', 'application/json')
        .expect(200)
        .end((err, res) => {
          if (err) return done(err)
          res.text.should.include('good')
          return done()
        })
    })
  })

  describe('DELETE /product/:id/rate/:id', () => {

    before(async () => {
      // 在所有測試開始前會執行的程式碼區塊
      await db.User.destroy({ where: {}, truncate: { cascade: true } })
      await db.Product_category.destroy({ where: {}, truncate: { cascade: true } })
      await db.Product.destroy({ where: {}, truncate: { cascade: true } })
      await db.Comment.destroy({ where: {}, truncate: { cascade: true } })

      const rootUser = await db.User.create({ name: 'root', email: 'root@gmail.com', password: 'password' })
      await db.Product_category.create({ id: 1, name: '麵包' })
      await db.Product.create({ id: 1, ProductCategoryId: 1, name: '吐司' })
      await db.Comment.create({ id: 1, comment: '123' })

      this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
        callback(null, { ...rootUser }, null);
        return (req, res, next) => { req.user = rootUser }
      })
    })

    after(async () => {
      // 在所有測試結束後會執行的程式碼區塊
      await db.User.destroy({ where: {}, truncate: { cascade: true } })
      await db.Product_category.destroy({ where: {}, truncate: { cascade: true } })
      await db.Product.destroy({ where: {}, truncate: { cascade: true } })
      this.authenticate.restore()
    })

    it('(O) 登入狀態，刪除評價', (done) => {
      request(app)
        .delete('/product/1/rate/1')
        .set('Accept', 'application/json')
        .expect(302)
        .end((err, res) => {
          if (err) return done(err)
          db.Comment.findOne({ where: { id: 1 } }).then(comment => {
            expect(comment).to.be.null
            done()
          })
        })
    })
  })

  describe('POST /product/:id/deliveryNotice', () => {

    before(async () => {
      // 在所有測試開始前會執行的程式碼區塊
      await db.Product_category.destroy({ where: {}, truncate: { cascade: true } })
      await db.Product.destroy({ where: {}, truncate: { cascade: true } })
      await db.Delivery_notice.destroy({ where: {}, truncate: { cascade: true } })

      await db.Product_category.create({ id: 1, name: '麵包' })
      await db.Product.create({ id: 1, ProductCategoryId: 1, name: '吐司' })
    })

    after(async () => {
      // 在所有測試結束後會執行的程式碼區塊
      await db.Product_category.destroy({ where: {}, truncate: { cascade: true } })
      await db.Product.destroy({ where: {}, truncate: { cascade: true } })
      await db.Delivery_notice.destroy({ where: {}, truncate: { cascade: true } })
    })

    it("(X) 兩次信箱輸入不同", (done) => {
      request(app)
        .post('/product/1/deliveryNotice')
        .send('email=root@gmail.com&email_confirm=email&ProductId=1')
        .expect(302)
        .end((err, res) => {
          if (err) return done(err)
          db.Delivery_notice.findOne({ where: { ProductId: 1 } }).then(delivery_notice => {
            expect(delivery_notice).to.be.null
            return done()
          })
        });
    });

    it('(O) 申請貨到通知後返回單項產品頁面', (done) => {
      request(app)
        .post('/product/1/deliveryNotice')
        .send('email=root@gmail.com&email_confirm=root@gmail.com&ProductId=1')
        .set('Accept', 'application/json')
        .expect(302)
        .end((err, res) => {
          if (err) return done(err)
          return done()
        })
    })

    it('(O) 確認申請貨到通知是否有成功', (done) => {
      db.Delivery_notice.findOne({ where: { ProductId: 1 } }).then(delivery_notice => {
        expect(delivery_notice.email).to.be.equal('root@gmail.com')
        return done()
      })
    })
  })
})