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
const PaymentModel = require('../../models/payment')

describe('# Shipment Model', () => {

  before(done => {
    done()
  })

  const Payment = PaymentModel(sequelize, dataTypes)
  const payment = new Payment()

  // 檢查model是否存在
  checkModelName(Payment)('Payment')

  // 檢查欄位是否被定義
  context('properties', () => {
    ;[
      'OrderId',
      'PaymentStatusId',
      'PaymentTypeId',
      'amount'
    ].forEach(checkPropertyExists(payment))
  })

  // 檢查關聯是否正確
  context('associations', () => {
    const Order = 'Order'
    const Payment_status = 'Payment_status'
    const Payment_type = 'Payment_type'
    before(() => {
      Payment.associate({ Order })
      Payment.associate({ Payment_status })
      Payment.associate({ Payment_type })
    })

    it('should belongs to Order', (done) => {
      expect(Payment.belongsTo).to.have.been.calledWith(Order)
      done()
    })

    it('should belongs to Payment_status', (done) => {
      expect(Payment.belongsTo).to.have.been.calledWith(Payment_status)
      done()
    })

    it('should belongs to Payment_type', (done) => {
      expect(Payment.belongsTo).to.have.been.calledWith(Payment_type)
      done()
    })
  })

  // CRUD
  describe('CRUD', () => {

    let data = null

    it('create', (done) => {
      db.Payment.create({}).then(payment => {
        data = payment
        done()
      })
    })

    it('read', (done) => {
      db.Payment.findByPk(data.id).then(payment => {
        expect(data.id).to.be.equal(payment.id)
        done()
      })
    })

    it('update', (done) => {
      db.Payment.update({}, { where: { id: data.id } }).then(() => {
        db.Payment.findByPk(data.id).then(payment => {
          expect(data.updatedAt).to.be.not.equal(payment.updatedAt)
          done()
        })
      })
    })

    it('delete', (done) => {
      db.Payment.destroy({ where: { id: data.id } }).then(() => {
        db.Payment.findByPk(data.id).then(payment => {
          expect(payment).to.be.equal(null)
          done()
        })
      })
    })
  })
})
