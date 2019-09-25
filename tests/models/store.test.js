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
const StoreModel = require('../../models/store')

describe('# Store Model', () => {

  before(done => {
    done()
  })

  const Store = StoreModel(sequelize, dataTypes)
  const store = new Store()

  // 檢查model是否存在
  checkModelName(Store)('Store')

  // 檢查欄位是否被定義
  context('properties', () => {
    ;[
      'StoreCategoryId',
      'name',
      'description'
    ].forEach(checkPropertyExists(store))
  })

  // 檢查關聯是否正確
  context('associations', () => {
    const Coupon = 'Coupon'
    before(() => {
      Store.associate({ Coupon })
    })

    it('should hasMany to Coupon', (done) => {
      expect(Store.hasMany).to.have.been.calledWith(Coupon)
      done()
    })
  })

  // CRUD
  describe('CRUD', () => {

    let data = null

    it('create', (done) => {
      db.Store.create({}).then(store => {
        data = store
        done()
      })
    })

    it('read', (done) => {
      db.Store.findByPk(data.id).then(store => {
        expect(data.id).to.be.equal(store.id)
        done()
      })
    })

    it('update', (done) => {
      db.Store.update({}, { where: { id: data.id } }).then(() => {
        db.Store.findByPk(data.id).then(store => {
          expect(data.updatedAt).to.be.not.equal(store.updatedAt)
          done()
        })
      })
    })

    it('delete', (done) => {
      db.Store.destroy({ where: { id: data.id } }).then(() => {
        db.Store.findByPk(data.id).then(store => {
          expect(store).to.be.equal(null)
          done()
        })
      })
    })
  })
})
