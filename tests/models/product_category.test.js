process.env.NODE_ENV = 'test'

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
const ProductCategoryModel = require('../../models/product_category')

describe('# Shipment Model', () => {

  before(done => {
    done()
  })

  const Product_category = ProductCategoryModel(sequelize, dataTypes)
  const product_category = new Product_category()

  // 檢查model是否存在
  checkModelName(Product_category)('Product_category')

  // 檢查欄位是否被定義
  context('properties', () => {
    ;[
      'StoreId',
      'name',
      'image'
    ].forEach(checkPropertyExists(product_category))
  })

  // 檢查關聯是否正確
  context('associations', () => {
    const Product = 'Product'
    before(() => {
      Product_category.associate({ Product })
    })

    it('should has many Product', (done) => {
      expect(Product_category.hasMany).to.have.been.calledWith(Product)
      done()
    })
  })

  // CRUD
  describe('CRUD', () => {

    let data = null

    it('create', (done) => {
      db.Product_category.create({}).then(product_category => {
        data = product_category
        done()
      })
    })

    it('read', (done) => {
      db.Product_category.findByPk(data.id).then(product_category => {
        expect(data.id).to.be.equal(product_category.id)
        done()
      })
    })

    it('update', (done) => {
      db.Product_category.update({}, { where: { id: data.id } }).then(() => {
        db.Product_category.findByPk(data.id).then(product_category => {
          expect(data.updatedAt).to.be.not.equal(product_category.updatedAt)
          done()
        })
      })
    })

    it('delete', (done) => {
      db.Product_category.destroy({ where: { id: data.id } }).then(() => {
        db.Product_category.findByPk(data.id).then(product_category => {
          expect(product_category).to.be.equal(null)
          done()
        })
      })
    })
  })
})
