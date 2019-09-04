const chai = require('chai')
chai.use(require('sinon-chai'));
const { expect } = require('chai')

const {
  sequelize,
  dataTypes,
  checkModelName,
  checkUniqueIndex,
  checkPropertyExists
} = require('sequelize-test-helpers')

const db = require('../../models')
const ProductModel = require('../../models/product')

describe('# Product Model', () => {

  before(done => {
    done()
  })

  const Product = ProductModel(sequelize, dataTypes)
  const product = new Product()

  // 檢查model是否存在
  checkModelName(Product)('Product')

  // 檢查欄位是否被定義
  context('properties', () => {
    ;[
      'ProductCategoryId',
      'StoreId',
      'name',
      'count',
      'launched',
      'price',
      'description',
      'image',
      'imageI',
      'imageII'
    ].forEach(checkPropertyExists(product))
  })

  // 檢查關聯是否正確
  context('associations', () => {
    const Order = 'Order'
    const Product_category = 'Product_category'
    const Comment = 'Comment'
    const Cart_item = 'Cart_item'
    const Order_item = 'Order_item'
    const Delivery_notice = 'Delivery_notice'
    const Cart = 'Cart'
    before(() => {
      Product.associate({ Order })
      Product.associate({ Product_category })
      Product.associate({ Comment })
      Product.associate({ Cart_item })
      Product.associate({ Order_item })
      Product.associate({ Delivery_notice })
      Product.associate({ Cart })
    })

    it('should belongs to many Order', (done) => {
      expect(Product.belongsToMany).to.have.been.calledWith(Order)
      done()
    })

    it('should belongs to Product_category', (done) => {
      expect(Product.belongsTo).to.have.been.calledWith(Product_category)
      done()
    })

    it('should has many Comment', (done) => {
      expect(Product.hasMany).to.have.been.calledWith(Comment)
      done()
    })

    it('should has many Cart_item', (done) => {
      expect(Product.hasMany).to.have.been.calledWith(Cart_item)
      done()
    })

    it('should has many Order_item', (done) => {
      expect(Product.hasMany).to.have.been.calledWith(Order_item)
      done()
    })

    it('should has many Delivery_notice', (done) => {
      expect(Product.hasMany).to.have.been.calledWith(Delivery_notice)
      done()
    })

    it('should belongs to many Cart', (done) => {
      expect(Product.belongsToMany).to.have.been.calledWith(Cart)
      done()
    })
  })

  // CRUD
  describe('CRUD', () => {

    let data = null

    it('create', (done) => {
      db.Product.create({}).then(product => {
        data = product
        done()
      })
    })

    it('read', (done) => {
      db.Product.findByPk(data.id).then(product => {
        expect(data.id).to.be.equal(product.id)
        done()
      })
    })

    it('update', (done) => {
      db.Product.update({}, { where: { id: data.id } }).then(() => {
        db.Product.findByPk(data.id).then(product => {
          expect(data.updatedAt).to.be.not.equal(product.updatedAt)
          done()
        })
      })
    })

    it('delete', (done) => {
      db.Product.destroy({ where: { id: data.id } }).then(() => {
        db.Product.findByPk(data.id).then(product => {
          expect(product).to.be.equal(null)
          done()
        })
      })
    })
  })
})
