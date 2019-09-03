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
const ShipmentModel = require('../../models/shipment')

describe('# Shipment Model', () => {

  before(done => {
    done()
  })

  const Shipment = ShipmentModel(sequelize, dataTypes)
  const shipment = new Shipment()

  // 檢查model是否存在
  checkModelName(Shipment)('Shipment')

  // 檢查欄位是否被定義
  context('properties', () => {
    ;[
      'OrderId',
      'ShipmentStatusId',
      'ShipmentTypeId',
      'ShipmentConvenienceStoreId'
    ].forEach(checkPropertyExists(shipment))
  })

  // 檢查關聯是否正確
  context('associations', () => {
    const Order = 'Order'
    const Shipment_status = 'Shipment_status'
    const Shipment_type = 'Shipment_type'
    before(() => {
      Shipment.associate({ Order })
      Shipment.associate({ Shipment_status })
      Shipment.associate({ Shipment_type })
    })

    it('should belongs to Order', (done) => {
      expect(Shipment.belongsTo).to.have.been.calledWith(Order)
      done()
    })

    it('should belongs to Shipment_status', (done) => {
      expect(Shipment.belongsTo).to.have.been.calledWith(Shipment_status)
      done()
    })

    it('should belongs to Shipment_type', (done) => {
      expect(Shipment.belongsTo).to.have.been.calledWith(Shipment_type)
      done()
    })
  })

  // CRUD
  describe('CRUD', () => {

    let data = null

    it('create', (done) => {
      db.Shipment.create({}).then(shipment => {
        data = shipment
        done()
      })
    })

    it('read', (done) => {
      db.Shipment.findByPk(data.id).then(shipment => {
        expect(data.id).to.be.equal(shipment.id)
        done()
      })
    })

    it('update', (done) => {
      db.Shipment.update({}, { where: { id: data.id } }).then(() => {
        db.Shipment.findByPk(data.id).then(shipment => {
          expect(data.updatedAt).to.be.not.equal(shipment.updatedAt)
          done()
        })
      })
    })

    it('delete', (done) => {
      db.Shipment.destroy({ where: { id: data.id } }).then(() => {
        db.Shipment.findByPk(data.id).then(shipment => {
          expect(shipment).to.be.equal(null)
          done()
        })
      })
    })
  })
})
