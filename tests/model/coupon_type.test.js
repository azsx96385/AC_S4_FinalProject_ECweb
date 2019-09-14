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
const Coupon_typeModel = require('../../models/coupon_type')

describe('# Coupon_type Model', () => {
  before(done => {
    done()
  })

  const Coupon_type = Coupon_typeModel(sequelize, dataTypes)
  const coupon_type = new Coupon_type()
  //檢查model name
  checkModelName(Coupon_type)('Coupon_type')

  //檢查properties
  context('properties', () => {
    ;[
      'couponType'
    ].forEach(checkPropertyExists(coupon_type))
  })
  //檢查associations
  context('associations', () => {
    const Coupon = 'Coupon'

    before(() => {
      Coupon_type.associate({ Coupon })
    })

    it('should hasMany  Coupon', (done) => {
      expect(Coupon_type.hasMany).to.have.been.calledWith(Coupon)
      done()
    })

  })

  context('action', () => {
    let data = null

    it('create', (done) => {
      db.Coupon_type.create({}).then((coupon_type) => {
        data = coupon_type
        done()
      })
    })
    it('read', (done) => {
      db.Coupon_type.findByPk(data.id).then((coupon_type) => {
        expect(data.id).to.be.equal(coupon_type.id)
        done()
      })
    })
    it('update', (done) => {
      db.Coupon_type.update({}, { where: { id: data.id } }).then(() => {
        db.Coupon_type.findByPk(data.id).then((coupon_type) => {
          expect(data.updatedAt).to.be.not.equal(coupon_type.updatedAt)
          done()
        })
      })
    })
    it('delete', (done) => {
      db.Coupon_type.destroy({ where: { id: data.id } }).then(() => {
        db.Coupon_type.findByPk(data.id).then((coupon_type) => {
          expect(coupon_type).to.be.equal(null)
          done()
        })
      })
    })
  })
})
