const assert = require('assert')
const chai = require('chai')
const request = require('supertest')
const should = chai.should()
const { expect } = require('chai')
const sinon = require('sinon')


const passport = require('../../config/passport')

const app = require('../../app')
const db = require('../../models')

describe('#order request', () => {



  describe('#getOrderEdit', () => {

    before(async function () {
      const rootUser = await db.User.create({ name: 'root', address: '開山里' })

      await db.Product.create({ name: "productName", price: 100 })
      await db.Cart_item.create({ CartId: 1, ProductId: 1, quantity: 2 })

      //模擬登入
      this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
        callback(null, { ...rootUser }, null);
        return (req, res, next) => { req.user = rootUser };
      })
    })

    it('getOrderEdit', (done) => {
      var agent = request.agent(app)
      agent
        .post('/cart')
        .send('productId=1&quantity=1')
        .set('Accept', 'application/json')
        .expect(302)
        .end(function (err, res) {
          agent
            .get('/orderEdit')
            .set('Accept', 'application/json')
            .expect(200)
            .end(function (err, res) {

              res.text.should.include('root')
              res.text.should.include('開山里')
              res.text.should.include("productName")
              res.text.should.include(100)
              res.text.should.include(300)

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
  describe('# getOrderSuccess', function () {
    this.timeout(5000);
    describe("#運送方式宅配，出貨狀況預設未出貨", () => {

      before(async function () {
        let rootUser = await db.User.create({ name: 'root' })
        //模擬登入
        this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
          callback(null, { ...rootUser }, null);
          return (req, res, next) => { };
        });

        //建立order

        await db.Order.create({ id: 1, UserId: 1, name: 'userName', OrderStatusId: 1 })
        await db.Product.create({ id: 1, name: "產品1" })
        await db.Order_item.create({ OrderId: 1, ProductId: 1 })
        await db.Shipment_type.create({ id: 1, shipmentType: '宅配' })
        await db.Shipment_status.create({ id: 1, shipmentStatus: '未出貨' })
        await db.Shipment.create({ id: 1, ShipmentTypeId: 1, OrderId: 1, ShipmentStatusId: 1 })
        await db.Order_status.create({ id: 1, orderStatus: '排程中' })

      })

      it('can render orderSucess', (done) => {
        request(app)
          .get('/order/1/success')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {

            res.text.should.include('產品1')
            res.text.should.include('userName')
            res.text.should.include('宅配')
            res.text.should.include('未出貨')
            res.text.should.include('排程中')
            return done()
          });
      })

      after(async function () {


        this.authenticate.restore()
        await db.User.destroy({ where: {}, truncate: true })
        await db.Order.destroy({ where: {}, truncate: true })
        await db.Product.destroy({ where: {}, truncate: true })
        await db.Order_item.destroy({ where: {}, truncate: true })
        await db.Shipment_type.destroy({ where: {}, truncate: true })
        await db.Shipment_status.destroy({ where: {}, truncate: true })
        await db.Shipment.destroy({ where: {}, truncate: true })
        await db.Order_status.destroy({ where: {}, truncate: true })
      });

    })
    describe("#超商取貨，出貨狀況預設未出貨", () => {
      before(async function () {
        this.timeout(5000);

        let rootUser = await db.User.create({ name: 'root' })
        //模擬登入
        this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
          callback(null, { ...rootUser }, null);
          return (req, res, next) => { };
        });



        //建立order
        await db.Order.create({ id: 1, UserId: 1, name: 'userName2' })
        await db.Product.create({ id: 1, name: "產品2" })
        await db.Order_item.create({ OrderId: 1, ProductId: 1 })
        await db.Shipment_type.create({ id: 1, shipmentType: '超商取貨' })
        await db.Shipment_convenienceStore.create({ id: 1, branch: '發大財門市' })

        await db.Shipment_status.create({ id: 1, shipmentStatus: '未出貨' })
        await db.Shipment.create({ id: 1, ShipmentTypeId: 1, OrderId: 1, ShipmentStatusId: 1, ShipmentConvenienceStoreId: 1 })

      })

      it('can render orderSucess', (done) => {
        request(app)
          .get('/order/1/success')
          .set('Accept', 'application/json')
          .expect(200)
          .end(function (err, res) {
            res.text.should.include('產品2')
            res.text.should.include('userName2')
            res.text.should.include('超商取貨')
            res.text.should.include('未出貨')
            res.text.should.include('發大財門市')
            return done()
          });
      })

      after(async function () {


        this.authenticate.restore()
        await db.User.destroy({ where: {}, truncate: true })
        await db.Order.destroy({ where: {}, truncate: true })
        await db.Product.destroy({ where: {}, truncate: true })
        await db.Order_item.destroy({ where: {}, truncate: true })
        await db.Shipment_type.destroy({ where: {}, truncate: true })
        await db.Shipment_status.destroy({ where: {}, truncate: true })
        await db.Shipment.destroy({ where: {}, truncate: true })
        await db.Shipment_convenienceStore.destroy({ where: {}, truncate: true })

      });
    })
  })

  describe('#postOrder', () => {
    describe('no coupon', () => {
      before(async function () {

        //模擬登入
        let rootUser = await db.User.create({ name: 'root' })
        this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
          callback(null, { ...rootUser }, null);
          return (req, res, next) => { };
        });

        await db.Order.destroy({ where: {}, truncate: true })
        await db.Product.create({ id: 1, name: "產品1", price: 100 })
        await db.Cart.create({ id: 1 })
        await db.Cart_item.create({ ProductId: 1, CartId: 1, quantity: 1 })
      })

      after(async function () {
        this.authenticate.restore()
        await db.Order.destroy({ where: {}, truncate: true })
        await db.Order_item.destroy({ where: {}, truncate: true })

        await db.User.destroy({ where: {}, truncate: true })
        await db.Cart.destroy({ where: {}, truncate: true })
        await db.Cart_item.destroy({ where: {}, truncate: true })

        await db.Product.destroy({ where: {}, truncate: true })



      })

      it('will redirect to orderSuccess', (done) => {
        request(app)
          .post('/order')
          .send({ couponId: null, amount: 1000, cartId: 1, name: 'name', address: 'address' })
          .set('Accept', 'application/json')
          .expect(302)
          .end(function (err, res) {
            if (err) return done(err);
            done();
          });
      })
      it('order will build', (done) => {
        db.Order.findByPk(1).then(order => {
          expect(order.name).to.equal('name')
          expect(order.address).to.equal('address')
          done()
        })
      })

    })


    describe('有輸入coupon', () => {
      before(async function () {

        //模擬登入
        let rootUser = await db.User.create({ name: 'root' })
        this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
          callback(null, { ...rootUser }, null);
          return (req, res, next) => { };
        });
        await db.Coupon.destroy({ where: {}, truncate: true })

        await db.Product.create({ id: 1, name: "產品1", price: 100 })
        await db.Cart.create({ id: 1 })
        await db.Cart_item.create({ ProductId: 1, CartId: 1, quantity: 1 })
        await db.Coupon.create({ id: 1, discount: 100 })
      })

      after(async function () {
        this.authenticate.restore()
        await db.Order.destroy({ where: {}, truncate: true })
        await db.Order_item.destroy({ where: {}, truncate: true })
        await db.User.destroy({ where: {}, truncate: true })
        await db.Cart.destroy({ where: {}, truncate: true })
        await db.Cart_item.destroy({ where: {}, truncate: true })
        await db.Product.destroy({ where: {}, truncate: true })
        await db.Coupon.destroy({ where: {}, truncate: true })

      });

      it('will redirect to orderSuccess', (done) => {
        request(app)
          .post('/order')
          .send({ couponId: 1, amount: 1000, cartId: 1, name: 'name', address: 'address' })
          .set('Accept', 'application/json')
          .expect(302)
          .end(function (err, res) {
            if (err) return done(err);

            done();
          });
      })
      it('order的amount會被折抵', (done) => {
        db.Order.findByPk(1).then(order => {

          expect(order.amount).to.equal(900)


          done()
        })
      })
    })

    describe('選擇到店取貨，導向店面選擇', () => {
      before(async function () {

        //模擬登入
        let rootUser = await db.User.create({ name: 'root' })
        this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
          callback(null, { ...rootUser }, null);
          return (req, res, next) => { };
        });


        await db.Product.create({ id: 1, name: "產品1", price: 100 })
        await db.Cart.create({})
        await db.Cart_item.create({ ProductId: 1, CartId: 1, quantity: 1 })
      })

      after(async function () {
        this.authenticate.restore();
        await db.Order.destroy({ where: {}, truncate: true })
        await db.Order_item.destroy({ where: {}, truncate: true })

        await db.User.destroy({ where: {}, truncate: true })
        await db.Cart.destroy({ where: {}, truncate: true })
        await db.Cart_item.destroy({ where: {}, truncate: true })

        await db.Product.destroy({ where: {}, truncate: true })



      })

      it('will redirect to branchSelection', (done) => {
        request(app)
          .post('/order')
          .send({ couponId: null, amount: 1000, cartId: 1, name: 'name', address: 'address', shipmentType: '2' })
          .set('Accept', 'application/json')
          .expect(302)
          .end(function (err, res) {
            if (err) return done(err);

            expect(res.header.location).to.equal('/order/1/branchselection')
            done();
          });
      })


    })


    describe('選擇線上支付，導向支付頁面', () => {
      before(async function () {

        //模擬登入
        let rootUser = await db.User.create({ name: 'root' })
        this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
          callback(null, { ...rootUser }, null);
          return (req, res, next) => { };
        });


        await db.Product.create({ id: 1, name: "產品1", price: 100 })
        await db.Cart.create({})
        await db.Cart_item.create({ ProductId: 1, CartId: 1, quantity: 1 })
      })

      after(async function () {
        this.authenticate.restore();
        await db.Order.destroy({ where: {}, truncate: true })
        await db.Order_item.destroy({ where: {}, truncate: true })

        await db.User.destroy({ where: {}, truncate: true })
        await db.Cart.destroy({ where: {}, truncate: true })
        await db.Cart_item.destroy({ where: {}, truncate: true })

        await db.Product.destroy({ where: {}, truncate: true })



      })

      it('will redirect to branchSelection', (done) => {
        request(app)
          .post('/order')
          .send({ couponId: null, amount: 1000, cartId: 1, name: 'name', address: 'address', paymentType: '1' })
          .set('Accept', 'application/json')
          .expect(302)
          .end(function (err, res) {
            if (err) return done(err);

            expect(res.header.location).to.equal('order/1/payment')
            done();
          });
      })


    })



  })

  describe('cancelOrder', () => {

    describe('Shipment_statuses為備貨中"', () => {
      before(async function () {

        //模擬登入
        let rootUser = await db.User.create({ name: 'root' })
        this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
          callback(null, { ...rootUser }, null);
          return (req, res, next) => { };
        });


        await db.Order.create({ id: 1, OrderStatusId: 1 })
        await db.Shipment.create({ OrderId: 1, ShipmentStatusId: 1, ShipmentTypeId: 1 })
        await db.Shipment_status.create({ shipmentStatus: "備貨中" })
        await db.Shipment_status.create({ shipmentStatus: '出貨中' })

        await db.Shipment_type.create({ shipmentType: '宅配' })
      })

      after(async function () {
        this.authenticate.restore()
        await db.Order.destroy({ where: {}, truncate: true })
        await db.Shipment.destroy({ where: {}, truncate: true })
        await db.Shipment_status.destroy({ where: {}, truncate: true })
        await db.Shipment_type.destroy({ where: {}, truncate: true })
        await db.User.destroy({ where: {}, truncate: true })

      })

      it('redirect back', (done) => {
        request(app)
          .post('/order/1')
          .set('Accept', 'application/json')
          .expect(302)
          .end(function (err, res) {
            if (err) return done(err);

            expect(res.header.location).to.equal('/')
            done();
          });
      })
      it('order的OrderStatus改成已取消', (done) => {
        db.Order.findByPk(1).then(order => {
          expect(order.OrderStatusId).to.equal(4)
          done()
        })
      })
    })

    describe('Shipment_statuses不是未出貨', () => {
      before(async function () {

        //模擬登入
        let rootUser = await db.User.create({ name: 'root' })
        this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
          callback(null, { ...rootUser }, null);
          return (req, res, next) => { };
        });


        await db.Order.create({ OrderStatusId: 1 })
        await db.Shipment.create({ OrderId: 1, ShipmentStatusId: 2, ShipmentTypeId: 1 })
        await db.Shipment_status.create({ shipmentStatus: "備貨中" })
        await db.Shipment_status.create({ shipmentStatus: '出貨中' })

        await db.Shipment_type.create({ shipmentType: '宅配' })
      })

      after(async function () {
        this.authenticate.restore()
        await db.Order.destroy({ where: {}, truncate: true })
        await db.Shipment.destroy({ where: {}, truncate: true })
        await db.Shipment_status.destroy({ where: {}, truncate: true })
        await db.Shipment_type.destroy({ where: {}, truncate: true })
        await db.User.destroy({ where: {}, truncate: true })
      })
      it('redirect back', (done) => {
        request(app)
          .post('/order/1')
          .set('Accept', 'application/json')
          .expect(302)
          .end(function (err, res) {
            if (err) return done(err);

            expect(res.header.location).to.equal('/')
            done();
          });
      })
      it('order的狀態不會改變', (done) => {
        db.Order.findByPk(1).then(order => {
          expect(order.OrderStatusId).to.equal(1)
          done()
        })
      })

    })
  })
})



