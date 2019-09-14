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
const ShipmentStatusModel = require('../../models/shipment_status')

describe('# Shipment_status Model', () => {

  before(done => {
    done()
  })

  const Shipment_status = ShipmentStatusModel(sequelize, dataTypes)
  const shipment_status = new Shipment_status()

  // 檢查model是否存在
  checkModelName(Shipment_status)('Shipment_status')

  // 檢查欄位是否被定義
  context('properties', () => {
    ;[
      'shipmentStatus'
    ].forEach(checkPropertyExists(shipment_status))
  })

  // 檢查關聯是否正確
  context('associations', () => {
    const Order = 'Order'
    before(() => {
      Shipment_status.associate({ Order })
    })

    it('should belongs to many Order', (done) => {
      expect(Shipment_status.belongsToMany).to.have.been.calledWith(Order)
      done()
    })
  })

  // CRUD
  describe('CRUD', () => {

    let data = null

    it('create', (done) => {
      db.Shipment_status.create({}).then(shipment_status => {
        data = shipment_status
        done()
      })
    })

    it('read', (done) => {
      db.Shipment_status.findByPk(data.id).then(shipment_status => {
        expect(data.id).to.be.equal(shipment_status.id)
        done()
      })
    })

    it('update', (done) => {
      db.Shipment_status.update({}, { where: { id: data.id } }).then(() => {
        db.Shipment_status.findByPk(data.id).then(shipment_status => {
          expect(data.updatedAt).to.be.not.equal(shipment_status.updatedAt)
          done()
        })
      })
    })

    it('delete', (done) => {
      db.Shipment_status.destroy({ where: { id: data.id } }).then(() => {
        db.Shipment_status.findByPk(data.id).then(shipment_status => {
          expect(shipment_status).to.be.equal(null)
          done()
        })
      })
    })
  })
})
