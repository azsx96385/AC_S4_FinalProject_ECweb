process.env.NODE_ENV = 'test'

var chai = require('chai')
var sinon = require('sinon')
chai.use(require('sinon-chai'))

const { expect } = require('chai')
const {
  sequelize,
  dataTypes,
  checkModelName,
  checkUniqueIndex,
  checkPropertyExists
} = require('sequelize-test-helpers')

const db = require('../../models')
const OrderModel = require('../../models/order')

describe('# Order Model', () => {
  before(done => {
    done()
  })

  const Order = OrderModel(sequelize, dataTypes)
  const order = new Order()
  //檢查model name
  checkModelName(Order)('Order')

  //檢查properties
  context('properties', () => {
    ;[
      'UserId',
      'StoreId',
      'OrderStatusId',
      'name',
      'amount',
      'phone',
      'address',
      'memo'
    ].forEach(checkPropertyExists(order))
  })
  //檢查associations
  context('associations', () => {
    const Product = 'Product'
    const User = 'User'
    const Shipment_type = 'Shipment_type'
    const Shipment_status = 'Shipment_status'
    const Payment_status = 'Payment_status'
    const Payment_type = 'Payment_type'
    const Payment = 'Payment'
    const Shipment = 'Shipment'
    const Shipment_convenienceStore = 'Shipment_convenienceStore'


    before(() => {
      Order.associate({ Product })
      Order.associate({ User })
      Order.associate({ Shipment_type })
      Order.associate({ Shipment_status })
      Order.associate({ Payment_status })
      Order.associate({ Payment_type })
      Order.associate({ Payment })
      Order.associate({ Shipment })
      Order.associate({ Shipment_convenienceStore })
    })

    it('should belongsToMany Product', (done) => {
      expect(Order.belongsToMany).to.have.been.calledWith(Product)
      done()
    })
    it('should belong to user', (done) => {
      expect(Order.belongsTo).to.have.been.calledWith(User)
      done()
    })

    it('should belongsToMany Shipment_type', (done) => {
      expect(Order.belongsToMany).to.have.been.calledWith(Shipment_type)
      done()
    })

    it('should belongsToMany Shipment_status', (done) => {
      expect(Order.belongsToMany).to.have.been.calledWith(Shipment_status)
      done()
    })

    it('should belongsToMany Payment_status', (done) => {
      expect(Order.belongsToMany).to.have.been.calledWith(Payment_status)
      done()
    })

    it('should belongsToMany Payment_type', (done) => {
      expect(Order.belongsToMany).to.have.been.calledWith(Payment_type)
      done()
    })

    it('should have many Payment', (done) => {
      expect(Order.hasMany).to.have.been.calledWith(Payment)
      done()
    })

    it('should have many Shipment', (done) => {
      expect(Order.hasMany).to.have.been.calledWith(Shipment)
      done()
    })


    it('should belongsToMany Shipment_convenienceStore', (done) => {
      expect(Order.belongsToMany).to.have.been.calledWith(Shipment_convenienceStore)
      done()
    })
  })

  context('action', () => {
    let data = null

    it('create', (done) => {
      db.Order.create({}).then((order) => {
        data = order
        done()
      })
    })
    it('read', (done) => {
      db.Order.findByPk(data.id).then((order) => {
        expect(data.id).to.be.equal(order.id)
        done()
      })
    })
    it('update', (done) => {
      db.Order.update({}, { where: { id: data.id } }).then(() => {
        db.Order.findByPk(data.id).then((order) => {
          expect(data.updatedAt).to.be.not.equal(order.updatedAt)
          done()
        })
      })
    })
    it('delete', (done) => {
      db.Order.destroy({ where: { id: data.id } }).then(() => {
        db.Order.findByPk(data.id).then((order) => {
          expect(order).to.be.equal(null)
          done()
        })
      })
    })
  })
})
