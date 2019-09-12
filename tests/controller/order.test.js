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



      const rootUser = await db.User.create({ name: 'root' })
      await db.Cart.create({})
      await db.Product.create({ CartId: 1, name: "productName", price: 100 })
      await db.Cart_item.create({ CartId: 1, ProductId: 1 })

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

              expect(res.text).to.include('root')
              return done();
            });
        })

    })



    after(async function () {
      // 在所有測試結束後會執行的程式碼區塊
      this.authenticate.restore()
      await db.Cart_item.destroy({ where: {}, truncate: { cascade: true } })
      await db.Cart.destroy({ where: {}, truncate: true })
      await db.Product.destroy({ where: {}, truncate: true })
    });

  })






















  /* describe('# getOrderSuccess', () => {
     describe("#運送方式宅配，出貨狀況預設未出貨", () => {
       before(async () => {
 
         await db.Order.destroy({ where: {}, truncate: true })
         await db.Product.destroy({ where: {}, truncate: true })
         await db.Order_item.destroy({ where: {}, truncate: true })
         await db.Shipment_type.destroy({ where: {}, truncate: true })
         await db.Shipment_status.destroy({ where: {}, truncate: true })
         await db.Shipment.destroy({ where: {}, truncate: true })
         let rootUser = await db.User.create({ name: 'root' })
         //模擬登入
         this.authenticate = sinon.stub(passport, "authenticate").callsFake((strategy, options, callback) => {
           callback(null, { ...rootUser }, null);
           return (req, res, next) => { };
         });
 
 
         //建立order
         await db.Order.create({ UserId: 1, name: 'userName' })
         await db.Product.create({ id: 1, name: "產品1" })
         await db.Order_item.create({ OrderId: 1, ProductId: 1 })
         await db.Shipment_type.create({ shipmentType: '宅配' })
         await db.Shipment_status.create({ shipmentStatus: '未出貨' })
         await db.Shipment.create({ ShipmentTypeId: 1, OrderId: 1, ShipmentStatusId: 1 })
 
 
 
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
 
             return done()
           });
       })
 
       after(async function () {
         // 在所有測試結束後會執行的程式碼區塊
 
         await db.User.destroy({ where: {}, truncate: true })
         await db.Order.destroy({ where: {}, truncate: true })
         await db.Product.destroy({ where: {}, truncate: true })
         await db.Order_item.destroy({ where: {}, truncate: true })
         await db.Shipment_type.destroy({ where: {}, truncate: true })
         await db.Shipment_status.destroy({ where: {}, truncate: true })
         await db.Shipment.destroy({ where: {}, truncate: true })
       });
 
     })
     describe("#超商取貨，出貨狀況預設未出貨", () => {
       before(async () => {
 
         await db.Order.destroy({ where: {}, truncate: true })
         await db.Product.destroy({ where: {}, truncate: true })
         await db.Order_item.destroy({ where: {}, truncate: true })
         await db.Shipment_type.destroy({ where: {}, truncate: true })
         await db.Shipment_status.destroy({ where: {}, truncate: true })
         await db.Shipment.destroy({ where: {}, truncate: true })
         await db.User.destroy({ where: {}, truncate: true })
 
 
         //建立order
         await db.Order.create({ UserId: 1, name: 'userName2' })
         await db.Product.create({ id: 1, name: "產品2" })
         await db.Order_item.create({ OrderId: 1, ProductId: 1 })
         await db.Shipment_type.create({ shipmentType: '超商取貨' })
         await db.Shipment_convenienceStore.create({ branch: '發大財門市' })
 
         await db.Shipment_status.create({ shipmentStatus: '未出貨' })
         await db.Shipment.create({ ShipmentTypeId: 1, OrderId: 1, ShipmentStatusId: 1, ShipmentConvenienceStoreId: 1 })
 
 
 
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
         // 在所有測試結束後會執行的程式碼區塊
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
 */
  /* describe('#postOrder', () => {
     describe('no coupon', () => {
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
           .send({ couponId: null, amount: 1000, CartId: 1, name: 'name', address: 'address' })
           .set('Accept', 'application/json')
           .expect(302)
           .end(function (err, res) {
             if (err) return done(err);
             done();
           });
       })
       it('order will build', (done) => {
         db.Order.findOne({ where: { id: 1 } }).then(order => {
           expect(order.name).to.equal('name')
           expect(order.address).to.equal('address')
           done()
         })
       })
 
     })
 
 
     describe('有輸入coupon coupon', () => {
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
         await db.Coupon.create({ discount: 100 })
       })
 
       after(async function () {
         this.authenticate.restore()
         await db.Order.destroy({ where: {}, truncate: true })
         await db.Order_item.destroy({ where: {}, truncate: true })
         await db.User.destroy({ where: {}, truncate: true })
         await db.Cart.destroy({ where: {}, truncate: true })
         await db.Cart_item.destroy({ where: {}, truncate: true })
         await db.Product.destroy({ where: {}, truncate: true })
 
       });
 
       it('will redirect to orderSuccess', (done) => {
         request(app)
           .post('/order')
           .send({ couponId: 1, amount: 1000, CartId: 1, name: 'name', address: 'address' })
           .set('Accept', 'application/json')
           .expect(302)
           .end(function (err, res) {
             if (err) return done(err);
 
             done();
           });
       })
       it('order的amount會被折抵', (done) => {
         db.Order.findOne({ where: { id: 1 } }).then(order => {
 
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
           .send({ couponId: null, amount: 1000, CartId: 1, name: 'name', address: 'address', shipmentType: '2' })
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
           .send({ couponId: null, amount: 1000, CartId: 1, name: 'name', address: 'address', paymentType: '1' })
           .set('Accept', 'application/json')
           .expect(302)
           .end(function (err, res) {
             if (err) return done(err);
 
             expect(res.header.location).to.equal('order/1/payment')
             done();
           });
       })
 
 
     })
 
 
 
   })*/
})



