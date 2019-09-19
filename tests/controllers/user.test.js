const assert = require('assert')
const chai = require('chai')
const request = require('supertest')
const should = chai.should()
const { expect } = require('chai')
const sinon = require('sinon')
const passport = require('../../config/passport')
const bcrypt = require("bcryptjs");

const app = require('../../app')
const db = require('../../models')

describe('# User controller', function () {


  describe('#/users/signUp', function () {
    beforeEach(async function () {
      // 在所有測試開始前會執行的程式碼區塊
      await db.User.create({ name: 'name1', email: 'email2' })
    });

    afterEach(async function () {
      // 在所有測試結束後會執行的程式碼區塊
      await db.User.destroy({ where: {}, truncate: { cascade: true } })
    });
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
      request(app)
        .post('/users/signUp')
        .send('email=email&password=password&password_confirm=password')
        .expect(302)
        .end(function (err, res) {
          db.User.findOne({
            where: {
              email: 'email'
            }
          }).then((user) => {
            expect(user).to.be.null
            done()
          })
        });
    })
    it("(X) 信箱重複", (done) => {
      request(app)
        .post('/users/signUp')
        .send('name=name&email=email2&password=password&passwordCheck=password')
        .expect(302)
        .end(function (err, res) {
          db.User.findAll({
            where: {
              email: 'email2'
            }
          }).then((user) => {
            //不會建立第二個email2的user
            expect(user.length).to.be.equal(1)
            done()
          })
        })
    })

    it("(X) 兩次密碼輸入不同", (done) => {
      request(app)
        .post('/users/signUp')
        .send('name=name1&email=email1&password=password1&passwordCheck=password')
        .expect(302)
        .end(function (err, res) {
          //不會建立user
          db.User.findAll({
            where: {
              email: 'email1'
            }
          }).then((user) => {

            expect(user).to.be.empty
            done()
          })
        })
    })
  })
  describe('getUserProfile', function () {
    this.timeout(5000);
    beforeEach(async function () {
      // 在所有測試開始前會執行的程式碼區塊
      const rootUser = await db.User.create({ id: 1, name: 'root' })
      await db.Product.create({ id: 1, name: 'productname' })
      await db.Order.create({ id: 1, UserId: 1, name: 'name', address: '開山里', amount: 150 })
      await db.Order_item.create({ ProductId: 1, OrderId: 1, quantity: 1 })
      await db.Shipment_status.create({ id: 1, shipmentStatus: '未出貨' })
      await db.Shipment_type.create({ id: 1, shipmentType: '宅配' })
      await db.Shipment.create({ OrderId: 1, ShipmentStatusId: 1, ShipmentTypeId: 1 })
      await db.Payment_type.create({ id: 1, paymentType: '貨到付款' })
      await db.Payment_status.create({ id: 1, paymentStatus: '未付款' })

      await db.Payment.create({ OrderId: 1, PaymentStatusId: 1, PaymentTypeId: 1 })



      //模擬登入

      this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
        callback(null, { ...rootUser }, null);
        return (req, res, next) => { };
      });

    });

    afterEach(async function () {
      // 在所有測試結束後會執行的程式碼區塊
      this.authenticate.restore()
      await db.User.destroy({ where: {}, truncate: { cascade: true } })
      await db.Product.destroy({ where: {}, truncate: { cascade: true } })
      await db.Order.destroy({ where: {}, truncate: { cascade: true } })
      await db.Order_item.destroy({ where: {}, truncate: { cascade: true } })
      await db.Shipment_status.destroy({ where: {}, truncate: { cascade: true } })
      await db.Shipment_type.destroy({ where: {}, truncate: { cascade: true } })
      await db.Shipment.destroy({ where: {}, truncate: { cascade: true } })
      await db.Payment_type.destroy({ where: {}, truncate: { cascade: true } })
      await db.Payment_status.destroy({ where: {}, truncate: { cascade: true } })

      await db.Payment.destroy({ where: {}, truncate: { cascade: true } })



    });

    it('it render userProfile', (done) => {
      request(app)
        .get('/user/1/profile')
        .expect(200)
        .end(function (err, res) {
          res.text.should.include('root')
          res.text.should.include('name')
          res.text.should.include('開山里')
          res.text.should.include('productname')
          res.text.should.include('未出貨')
          res.text.should.include('宅配')
          res.text.should.include('貨到付款')
          res.text.should.include('未付款')

          done()
        })
    })
  })

  describe('getUserProfileEdit', function () {
    this.timeout(5000);
    beforeEach(async function () {
      // 在所有測試開始前會執行的程式碼區塊
      const rootUser = await db.User.create({ id: 1, name: 'root', email: 'email11', address: 'address2' })



      //模擬登入

      this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
        callback(null, { ...rootUser }, null);
        return (req, res, next) => { };
      });

    });

    afterEach(async function () {
      // 在所有測試結束後會執行的程式碼區塊
      this.authenticate.restore()
      await db.User.destroy({ where: {}, truncate: { cascade: true } })




    });

    it('it render userProfile', (done) => {
      request(app)
        .get('/user/1/editProfile')
        .expect(200)
        .end(function (err, res) {

          res.text.should.include('root')
          res.text.should.include('email11')
          res.text.should.include('address2')

          done()
        })
    })
  })

  describe('postUserProfile', function () {
    this.timeout(5000);
    beforeEach(async function () {
      // 在所有測試開始前會執行的程式碼區塊
      const rootUser = await db.User.create({ id: 1, name: 'root', email: 'email11', address: 'address2' })



      //模擬登入

      this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
        callback(null, { ...rootUser }, null);
        return (req, res, next) => { };
      });

    });

    afterEach(async function () {
      // 在所有測試結束後會執行的程式碼區塊
      this.authenticate.restore()
      await db.User.destroy({ where: {}, truncate: { cascade: true } })
    });

    it('it render userProfile', (done) => {
      request(app)
        .post('/user/1/edit')
        .send({ name: '遊戲boy', email: 'game@gmail', address: 'gameAddress', password: '123' })
        .expect(302)
        .end(function (err, res) {

          db.User.findByPk(1).then(user => {
            expect(user.name).to.equal('遊戲boy')
            expect(user.email).to.equal('game@gmail')
            expect(user.address).to.equal('gameAddress')
            expect(bcrypt.compareSync('123', user.password)).to.equal(true)
            done()
          })



        })
    })
  })

  describe(' postResetUrl', () => {

    beforeEach(async function () {
      // 在所有測試開始前會執行的程式碼區塊

      //模擬登入
      const rootUser = await db.User.create({ name: 'root', email: 'email' })
      this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
        callback(null, { ...rootUser }, null);
        return (req, res, next) => { };
      });

    });

    afterEach(async function () {
      // 在所有測試結束後會執行的程式碼區塊
      this.authenticate.restore()
      await db.User.destroy({ where: {}, truncate: { cascade: true } })
    });
    it('未填email', (done) => {
      request(app)
        .post('/forget')

        .expect(302)
        .end(function (err, res) {
          db.User.findOne({ where: { name: 'root' } }).then(user => {
            expect(user.resetPasswordToken).to.be.null
            done()
          })

        })

    })
    it('信箱並不存在', (done) => {
      request(app)
        .post('/forget')
        .send({ email: 'email2' })
        .expect(302)
        .end(function (err, res) {
          db.User.findOne({ where: { email: 'email2' } }).then(user => {
            expect(user).to.be.null
            done()
          })

        })

    })

    it('成功更改', (done) => {
      request(app)
        .post('/forget')
        .send({ email: 'email' })
        .expect(302)
        .end(function (err, res) {
          db.User.findOne({ where: { email: 'email' } }).then(user => {
            expect(user.resetPasswordToken).to.not.be.null

            done()
          })

        })
    })
  })


  describe('getResetPage', () => {

    beforeEach(async function () {
      // 在所有測試開始前會執行的程式碼區塊

      //模擬登入
      const rootUser = await db.User.create({ name: 'root', email: 'email' })
      this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
        callback(null, { ...rootUser }, null);
        return (req, res, next) => { };
      });

    });

    afterEach(async function () {
      // 在所有測試結束後會執行的程式碼區塊
      this.authenticate.restore()
      await db.User.destroy({ where: {}, truncate: { cascade: true } })
    });


    it('成功進入', (done) => {
      request(app)
        .post('/forget')
        .send({ email: 'email' })
        .expect(302)
        .end(function (err, res) {
          db.User.findOne({ where: { email: 'email' } }).then(user => {
            request(app)
              .get(`/reset/${user.resetPasswordToken}`)
              .expect(200)
              .end(function (err, res) {
                res.text.should.include(user.resetPasswordToken)
                done()
              })
          })

        })
    })

    it('找不到user', (done) => {
      request(app)
        .get(`/reset/fake`)
        .expect(302)
        .end(function (err, res) {

          done()
        })

    })
  })

  describe('postResetPassword', () => {
    beforeEach(async function () {
      // 在所有測試開始前會執行的程式碼區塊

      //模擬登入
      const rootUser = await db.User.create({ name: 'root', email: 'email', password: '123456' })
      this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
        callback(null, { ...rootUser }, null);
        return (req, res, next) => { };
      });

    });

    afterEach(async function () {
      // 在所有測試結束後會執行的程式碼區塊
      this.authenticate.restore()
      await db.User.destroy({ where: {}, truncate: { cascade: true } })
    });
    it('成功進入', (done) => {
      request(app)
        .post('/forget')
        .send({ email: 'email' })
        .expect(302)
        .end(function (err, res) {
          db.User.findOne({ where: { email: 'email' } }).then(user => {
            request(app)
              .post(`/reset/${user.resetPasswordToken}`)
              .send({ password: '123', password_confirm: '123' })
              .expect(302)
              .end(function (err, res) {
                db.User.findOne({ where: { email: 'email' } }).then(async (user) => {

                  expect(user.password).to.not.equal('123456')
                  done()
                })

              })
          })

        })
    })
  })
})