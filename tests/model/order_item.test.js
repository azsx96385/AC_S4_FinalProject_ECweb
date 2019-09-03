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
const Order_itemModel = require('../../models/order_item')

describe('#Order_item_Model', () => {
  before(done => {
    done()
  })

  const Order_item = Order_itemModel(sequelize, dataTypes)
  const order_item = new Order_item()
  //檢查model name
  checkModelName(Order_item)('Order_item')

  //檢查properties
  context('properties', () => {
    ;[
      'ProductId',
      'OrderId',
      'quantity',
      'price'
    ].forEach(checkPropertyExists(order_item))
  })
  //檢查associations
  context('associations', () => {

    const Product = 'Product'

    before(() => {
      Order_item.associate({ Product })

    })

    it('should belongsTo Product', (done) => {
      expect(Order_item.belongsTo).to.have.been.calledWith(Product)
      done()
    })
  })

  context('action', () => {
    let data = null

    it('create', (done) => {
      db.Order_item.create({}).then((order_item) => {
        data = order_item
        done()
      })
    })
    it('read', (done) => {
      db.Order_item.findByPk(data.id).then((order_item) => {
        expect(data.id).to.be.equal(order_item.id)
        done()
      })
    })
    it('update', (done) => {
      db.Order_item.update({}, { where: { id: data.id } }).then(() => {
        db.Order_item.findByPk(data.id).then((order_item) => {
          expect(data.updatedAt).to.be.not.equal(order_item.updatedAt)
          done()
        })
      })
    })
    it('delete', (done) => {
      db.Order_item.destroy({ where: { id: data.id } }).then(() => {
        db.Order_item.findByPk(data.id).then((order_item) => {
          expect(order_item).to.be.equal(null)
          done()
        })
      })
    })
  })
})
