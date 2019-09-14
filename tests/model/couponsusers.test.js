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
const CouponsUsersModel = require('../../models/couponsusers')

describe('#CouponsUsers Model', () => {
  before(done => {
    done()
  })

  const CouponsUsers = CouponsUsersModel(sequelize, dataTypes)
  const couponsUsers = new CouponsUsers()
  //檢查model name
  checkModelName(CouponsUsers)('CouponsUsers')

  //檢查properties
  context('properties', () => {
    ;[
      'UserId',
      'CouponId',
      'counts'
    ].forEach(checkPropertyExists(couponsUsers))
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
      db.CouponsUsers.create({}).then((couponsUsers) => {
        data = couponsUsers
        done()
      })
    })
    it('read', (done) => {
      db.CouponsUsers.findByPk(data.id).then((couponsUsers) => {
        expect(data.id).to.be.equal(couponsUsers.id)
        done()
      })
    })
    it('update', (done) => {
      db.CouponsUsers.update({}, { where: { id: data.id } }).then(() => {
        db.CouponsUsers.findByPk(data.id).then((couponsUsers) => {
          expect(data.updatedAt).to.be.not.equal(couponsUsers.updatedAt)
          done()
        })
      })
    })
    it('delete', (done) => {
      db.CouponsUsers.destroy({ where: { id: data.id } }).then(() => {
        db.CouponsUsers.findByPk(data.id).then((couponsUsers) => {
          expect(couponsUsers).to.be.equal(null)
          done()
        })
      })
    })
  })
})
