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
const CartModel = require('../../models/cart')

describe('# Cart Model', () => {
  before(done => {
    done()
  })

  const Cart = CartModel(sequelize, dataTypes)
  const cart = new Cart()
  //檢查model name
  checkModelName(Cart)('Cart')

  //檢查properties
  context('properties', () => {
    ;[

    ].forEach(checkPropertyExists(cart))
  })
  //檢查associations
  context('associations', () => {
    const Product = 'Product'
    const Cart_item = 'Cart_item'

    before(() => {
      Cart.associate({ Product })
      Cart.associate({ Cart_item })
    })

    it('should belongsToMany Product', (done) => {
      expect(Cart.belongsToMany).to.have.been.calledWith(Product)
      done()
    })
    it('should hasMany Cart_item', (done) => {
      expect(Cart.hasMany).to.have.been.calledWith(Cart_item)
      done()
    })
  })

  context('action', () => {
    let data = null

    it('create', (done) => {
      db.Cart.create({}).then((cart) => {
        data = cart
        done()
      })
    })
    it('read', (done) => {
      db.Cart.findByPk(data.id).then((cart) => {
        expect(data.id).to.be.equal(cart.id)
        done()
      })
    })
    it('update', (done) => {
      db.Cart.update({}, { where: { id: data.id } }).then(() => {
        db.Cart.findByPk(data.id).then((cart) => {
          expect(data.updatedAt).to.be.not.equal(cart.updatedAt)
          done()
        })
      })
    })
    it('delete', (done) => {
      db.Cart.destroy({ where: { id: data.id } }).then(() => {
        db.Cart.findByPk(data.id).then((cart) => {
          expect(cart).to.be.equal(null)
          done()
        })
      })
    })
  })
})
