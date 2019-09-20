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
const Delivery_noticeModel = require('../../models/delivery_notice')

describe('#  delivery_notice Model', () => {
  before(done => {
    done()
  })

  const Delivery_notice = Delivery_noticeModel(sequelize, dataTypes)
  const delivery_notice = new Delivery_notice()
  //檢查model name
  checkModelName(Delivery_notice)('Delivery_notice')

  //檢查properties
  context('properties', () => {
    ;[
      'ProductId',
      'email'
    ].forEach(checkPropertyExists(delivery_notice))
  })
  //檢查associations
  context('associations', () => {
    const Product = 'Product'


    before(() => {
      Delivery_notice.associate({ Product })

    })

    it('should belongsTo Delivery_notice', (done) => {
      expect(Delivery_notice.belongsTo).to.have.been.calledWith(Product)
      done()
    })

  })

  context('action', () => {
    let data = null

    it('create', (done) => {
      db.Delivery_notice.create({}).then((delivery_notice) => {
        data = delivery_notice
        done()
      })
    })
    it('read', (done) => {
      db.Delivery_notice.findByPk(data.id).then((delivery_notice) => {
        expect(data.id).to.be.equal(delivery_notice.id)
        done()
      })
    })
    it('update', (done) => {
      db.Delivery_notice.update({}, { where: { id: data.id } }).then(() => {
        db.Delivery_notice.findByPk(data.id).then((delivery_notice) => {
          expect(data.updatedAt).to.be.not.equal(delivery_notice.updatedAt)
          done()
        })
      })
    })
    it('delete', (done) => {
      db.Delivery_notice.destroy({ where: { id: data.id } }).then(() => {
        db.Delivery_notice.findByPk(data.id).then((delivery_notice) => {
          expect(delivery_notice).to.be.equal(null)
          done()
        })
      })
    })
  })
})
