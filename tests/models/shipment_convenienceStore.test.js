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
const ShipmentConvenienceStoreModel = require('../../models/shipment_convenienceStore')

describe('# Shipment_convenienceStore Model', () => {

  before(done => {
    done()
  })

  const Shipment_convenienceStore = ShipmentConvenienceStoreModel(sequelize, dataTypes)
  const shipment_convenienceStore = new Shipment_convenienceStore()

  // 檢查model是否存在
  checkModelName(Shipment_convenienceStore)('Shipment_convenienceStore')

  // 檢查欄位是否被定義
  context('properties', () => {
    ;[
      'branch',
      'address'
    ].forEach(checkPropertyExists(shipment_convenienceStore))
  })

  // 檢查關聯是否正確
  context('associations', () => {
    const Order = 'Order'
    before(() => {
      Shipment_convenienceStore.associate({ Order })
    })

    it('should belongs to many Order', (done) => {
      expect(Shipment_convenienceStore.belongsToMany).to.have.been.calledWith(Order)
      done()
    })
  })

  // CRUD
  describe('CRUD', () => {

    let data = null

    it('create', (done) => {
      db.Shipment_convenienceStore.create({}).then(shipment_convenienceStore => {
        data = shipment_convenienceStore
        done()
      })
    })

    it('read', (done) => {
      db.Shipment_convenienceStore.findByPk(data.id).then(shipment_convenienceStore => {
        expect(data.id).to.be.equal(shipment_convenienceStore.id)
        done()
      })
    })

    it('update', (done) => {
      db.Shipment_convenienceStore.update({}, { where: { id: data.id } }).then(() => {
        db.Shipment_convenienceStore.findByPk(data.id).then(shipment_convenienceStore => {
          expect(data.updatedAt).to.be.not.equal(shipment_convenienceStore.updatedAt)
          done()
        })
      })
    })

    it('delete', (done) => {
      db.Shipment_convenienceStore.destroy({ where: { id: data.id } }).then(() => {
        db.Shipment_convenienceStore.findByPk(data.id).then(shipment_convenienceStore => {
          expect(shipment_convenienceStore).to.be.equal(null)
          done()
        })
      })
    })
  })
})
