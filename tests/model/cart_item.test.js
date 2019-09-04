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
const Cart_itemModel = require('../../models/cart_item')

describe('# Car_item Model', () => {
  before(done => {
    done()
  })

  const Cart_item = Cart_itemModel(sequelize, dataTypes)
  const cart_item = new Cart_item()
  //檢查model name
  checkModelName(Cart_item)('Cart_item')

  //檢查properties
  context('properties', () => {
    ;[
      'ProductId',
      'CartId',
      'quantity'
    ].forEach(checkPropertyExists(cart_item))
  })
  //檢查associations
  context('associations', () => {
    const Cart = 'Cart'
    const Product = 'Product'

    before(() => {
      Cart_item.associate({ Cart })
      Cart_item.associate({ Product })
    })

    it('should belongsTo Cart', (done) => {
      expect(Cart_item.belongsTo).to.have.been.calledWith(Cart)
      done()
    })
    it('should belongsTo Product ', (done) => {
      expect(Cart_item.belongsTo).to.have.been.calledWith(Product)
      done()
    })
  })

  context('action', () => {
    let data = null

    it('create', (done) => {
      db.Cart_item.create({}).then((cart_item) => {
        data = cart_item
        done()
      })
    })
    it('read', (done) => {
      db.Cart_item.findByPk(data.id).then((cart_item) => {
        expect(data.id).to.be.equal(cart_item.id)
        done()
      })
    })
    it('update', (done) => {
      db.Cart_item.update({}, { where: { id: data.id } }).then(() => {
        db.Cart_item.findByPk(data.id).then((cart_item) => {
          expect(data.updatedAt).to.be.not.equal(cart_item.updatedAt)
          done()
        })
      })
    })
    it('delete', (done) => {
      db.Cart_item.destroy({ where: { id: data.id } }).then(() => {
        db.Cart_item.findByPk(data.id).then((cart_item) => {
          expect(cart_item).to.be.equal(null)
          done()
        })
      })
    })
  })
})
