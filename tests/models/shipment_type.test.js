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
const ShipmentTypeModel = require('../../models/shipment_type')

describe('# Shipment_type Model', () => {

  before(done => {
    done()
  })

  const Shipment_type = ShipmentTypeModel(sequelize, dataTypes)
  const shipment_type = new Shipment_type()

  // 檢查model是否存在
  checkModelName(Shipment_type)('Shipment_type')

  // 檢查欄位是否被定義
  context('properties', () => {
    ;[
      'shipmentType'
    ].forEach(checkPropertyExists(shipment_type))
  })

  // 檢查關聯是否正確
  context('associations', () => {
    const Order = 'Order'
    before(() => {
      Shipment_type.associate({ Order })
    })

    it('should belongs to many Order', (done) => {
      expect(Shipment_type.belongsToMany).to.have.been.calledWith(Order)
      done()
    })
  })

  // CRUD
  describe('CRUD', () => {

    let data = null

    it('create', (done) => {
      db.Shipment_type.create({}).then(shipment_type => {
        data = shipment_type
        done()
      })
    })

    it('read', (done) => {
      db.Shipment_type.findByPk(data.id).then(shipment_type => {
        expect(data.id).to.be.equal(shipment_type.id)
        done()
      })
    })

    it('update', (done) => {
      db.Shipment_type.update({}, { where: { id: data.id } }).then(() => {
        db.Shipment_type.findByPk(data.id).then(shipment_type => {
          expect(data.updatedAt).to.be.not.equal(shipment_type.updatedAt)
          done()
        })
      })
    })

    it('delete', (done) => {
      db.Shipment_type.destroy({ where: { id: data.id } }).then(() => {
        db.Shipment_type.findByPk(data.id).then(shipment_type => {
          expect(shipment_type).to.be.equal(null)
          done()
        })
      })
    })
  })
})
