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
const CouponModel = require('../../models/coupon')

describe('# Coupon Model', () => {
  before(done => {
    done()
  })

  const Coupon = CouponModel(sequelize, dataTypes)
  const coupon = new Coupon()
  //檢查model name
  checkModelName(Coupon)('Coupon')

  //檢查properties
  context('properties', () => {
    ;[
      'StoreId',
      'CouponTypeId',
      'couponCode',
      'discount',
      'description',
      'available',
      'expireDate',
    ].forEach(checkPropertyExists(coupon))
  })
  //檢查associations
  context('associations', () => {
    const User = 'User'
    const Coupon_type = 'Coupon_type'
    const Store = 'Store'

    before(() => {
      Coupon.associate({ User })
      Coupon.associate({ Coupon_type })
      Coupon.associate({ Store })
    })

    it('should belongsToMany  User', (done) => {
      expect(Coupon.belongsToMany).to.have.been.calledWith(User)
      done()
    })
    it('should belongsTo  Coupon_type ', (done) => {
      expect(Coupon.belongsTo).to.have.been.calledWith(Coupon_type)
      done()
    })

    it('should belongsTo  Store', (done) => {
      expect(Coupon.belongsTo).to.have.been.calledWith(Store)
      done()
    })
  })

  context('action', () => {
    let data = null

    it('create', (done) => {
      db.Coupon.create({}).then((coupon) => {
        data = coupon
        done()
      })
    })
    it('read', (done) => {
      db.Coupon.findByPk(data.id).then((coupon) => {
        expect(data.id).to.be.equal(coupon.id)
        done()
      })
    })
    it('update', (done) => {
      db.Coupon.update({}, { where: { id: data.id } }).then(() => {
        db.Coupon.findByPk(data.id).then((coupon) => {
          expect(data.updatedAt).to.be.not.equal(coupon.updatedAt)
          done()
        })
      })
    })
    it('delete', (done) => {
      db.Coupon.destroy({ where: { id: data.id } }).then(() => {
        db.Coupon.findByPk(data.id).then((coupon) => {
          expect(coupon).to.be.equal(null)
          done()
        })
      })
    })
  })
})
