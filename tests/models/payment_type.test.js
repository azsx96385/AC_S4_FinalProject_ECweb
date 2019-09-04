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
const PaymentTypeModel = require('../../models/payment_type')

describe('# Payment_type Model', () => {

  before(done => {
    done()
  })

  const Payment_type = PaymentTypeModel(sequelize, dataTypes)
  const payment_type = new Payment_type()

  // 檢查model是否存在
  checkModelName(Payment_type)('Payment_type')

  // 檢查欄位是否被定義
  context('properties', () => {
    ;[
      'paymentType'
    ].forEach(checkPropertyExists(payment_type))
  })

  // 檢查關聯是否正確
  context('associations', () => {
    const Payment = 'Payment'
    before(() => {
      Payment_type.associate({ Payment })
    })

    it('should has many Payment', (done) => {
      expect(Payment_type.hasMany).to.have.been.calledWith(Payment)
      done()
    })
  })

  // CRUD
  describe('CRUD', () => {

    let data = null

    it('create', (done) => {
      db.Payment_type.create({}).then(payment_type => {
        data = payment_type
        done()
      })
    })

    it('read', (done) => {
      db.Payment_type.findByPk(data.id).then(payment_type => {
        expect(data.id).to.be.equal(payment_type.id)
        done()
      })
    })

    it('update', (done) => {
      db.Payment_type.update({}, { where: { id: data.id } }).then(() => {
        db.Payment_type.findByPk(data.id).then(payment_type => {
          expect(data.updatedAt).to.be.not.equal(payment_type.updatedAt)
          done()
        })
      })
    })

    it('delete', (done) => {
      db.Payment_type.destroy({ where: { id: data.id } }).then(() => {
        db.Payment_type.findByPk(data.id).then(payment_type => {
          expect(payment_type).to.be.equal(null)
          done()
        })
      })
    })
  })
})
