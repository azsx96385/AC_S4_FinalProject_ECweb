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
const FlowModel = require('../../models/flow')

describe('# Flow Model', () => {
  before(done => {
    done()
  })

  const Flow = FlowModel(sequelize, dataTypes)
  const flow = new Flow()
  //檢查model name
  checkModelName(Flow)('Flow')

  //檢查properties
  context('properties', () => {
    ;[
      'StoreId',
      'device',
      'browser'
    ].forEach(checkPropertyExists(flow))
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
      db.Flow.create({}).then((flow) => {
        data = flow
        done()
      })
    })
    it('read', (done) => {
      db.Flow.findByPk(data.id).then((flow) => {
        expect(data.id).to.be.equal(flow.id)
        done()
      })
    })
    it('update', (done) => {
      db.Flow.update({}, { where: { id: data.id } }).then(() => {
        db.Flow.findByPk(data.id).then((flow) => {
          expect(data.updatedAt).to.be.not.equal(flow.updatedAt)
          done()
        })
      })
    })
    it('delete', (done) => {
      db.Flow.destroy({ where: { id: data.id } }).then(() => {
        db.Flow.findByPk(data.id).then((flow) => {
          expect(flow).to.be.equal(null)
          done()
        })
      })
    })
  })
})
