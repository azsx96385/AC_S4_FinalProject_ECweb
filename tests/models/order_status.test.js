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
const Order_statusModel = require('../../models/order_status')

describe('# Order_status Model', () => {
  before(done => {
    done()
  })

  const Order_status = Order_statusModel(sequelize, dataTypes)
  const order_status = new Order_status()
  //檢查model name
  checkModelName(Order_status)('Order_status')

  //檢查properties
  context('properties', () => {
    ;[
      'orderStatus'
    ].forEach(checkPropertyExists(order_status))
  })
  //檢查associations
  context('associations', () => {

    before(done => {
      done()
    })

    it('has no associations', (done) => {

      done()
    })

  })

  context('action', () => {
    let data = null

    it('create', (done) => {
      db.Order_status.create({}).then((order_status) => {
        data = order_status
        done()
      })
    })
    it('read', (done) => {
      db.Order_status.findByPk(data.id).then((order_status) => {
        expect(data.id).to.be.equal(order_status.id)
        done()
      })
    })
    it('update', (done) => {
      db.Order_status.update({}, { where: { id: data.id } }).then(() => {
        db.Order_status.findByPk(data.id).then((order_status) => {
          expect(data.updatedAt).to.be.not.equal(order_status.updatedAt)
          done()
        })
      })
    })
    it('delete', (done) => {
      db.Order_status.destroy({ where: { id: data.id } }).then(() => {
        db.Order_status.findByPk(data.id).then((order_status) => {
          expect(order_status).to.be.equal(null)
          done()
        })
      })
    })
  })
})
