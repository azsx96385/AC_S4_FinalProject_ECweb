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
const PaymentStatusModel = require('../../models/payment_status')

describe('# Payment_status Model', () => {

  before(done => {
    done()
  })

  const Payment_status = PaymentStatusModel(sequelize, dataTypes)
  const payment_status = new Payment_status()

  // 檢查model是否存在
  checkModelName(Payment_status)('Payment_status')

  // 檢查欄位是否被定義
  context('properties', () => {
    ;[
      'paymentStatus'
    ].forEach(checkPropertyExists(payment_status))
  })

  // 檢查關聯是否正確
  context('associations', () => {
    const Payment = 'Payment'
    before(() => {
      Payment_status.associate({ Payment })
    })

    it('should has many Payment', (done) => {
      expect(Payment_status.hasMany).to.have.been.calledWith(Payment)
      done()
    })
  })

  // CRUD
  describe('CRUD', () => {

    let data = null

    it('create', (done) => {
      db.Payment_status.create({}).then(payment_status => {
        data = payment_status
        done()
      })
    })

    it('read', (done) => {
      db.Payment_status.findByPk(data.id).then(payment_status => {
        expect(data.id).to.be.equal(payment_status.id)
        done()
      })
    })

    it('update', (done) => {
      db.Payment_status.update({}, { where: { id: data.id } }).then(() => {
        db.Payment_status.findByPk(data.id).then(payment_status => {
          expect(data.updatedAt).to.be.not.equal(payment_status.updatedAt)
          done()
        })
      })
    })

    it('delete', (done) => {
      db.Payment_status.destroy({ where: { id: data.id } }).then(() => {
        db.Payment_status.findByPk(data.id).then(payment_status => {
          expect(payment_status).to.be.equal(null)
          done()
        })
      })
    })
  })
})
