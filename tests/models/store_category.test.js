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
const StoreCategoryModel = require('../../models/store_category')

describe('# Store_category Model', () => {

  before(done => {
    done()
  })

  const Store_category = StoreCategoryModel(sequelize, dataTypes)
  const store_category = new Store_category()

  // 檢查model是否存在
  checkModelName(Store_category)('Store_category')

  // 檢查欄位是否被定義
  context('properties', () => {
    ;[
    ].forEach(checkPropertyExists(store_category))
  })

  // 檢查關聯是否正確
  context('associations', () => {

    before(done => {
      done()
    })

    it('no associations', (done) => {
      done()
    })
  })

  // CRUD
  describe('CRUD', () => {

    let data = null

    it('create', (done) => {
      db.Store_category.create({}).then(store_category => {
        data = store_category
        done()
      })
    })

    it('read', (done) => {
      db.Store_category.findByPk(data.id).then(store_category => {
        expect(data.id).to.be.equal(store_category.id)
        done()
      })
    })

    it('update', (done) => {
      db.Store_category.update({}, { where: { id: data.id } }).then(() => {
        db.Store_category.findByPk(data.id).then(store_category => {
          expect(data.updatedAt).to.be.not.equal(store_category.updatedAt)
          done()
        })
      })
    })

    it('delete', (done) => {
      db.Store_category.destroy({ where: { id: data.id } }).then(() => {
        db.Store_category.findByPk(data.id).then(store_category => {
          expect(store_category).to.be.equal(null)
          done()
        })
      })
    })
  })
})
