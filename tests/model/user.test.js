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
const UserModel = require('../../models/user')

describe('# User Model', () => {
  before(done => {
    done()
  })

  const User = UserModel(sequelize, dataTypes)
  const user = new User()
  //檢查model name
  checkModelName(User)('User')

  //檢查properties
  context('properties', () => {
    ;[
      'StoreId', 'name', 'email', 'address', 'password', 'emailVerf', 'resetPasswordToken', 'resetPasswordExpires', 'image'
    ].forEach(checkPropertyExists(user))
  })
  //檢查associations
  context('associations', () => {
    const Comment = 'Comment'
    const Order = 'Order'
    const Coupon = 'Like'

    before(() => {
      User.associate({ Comment })
      User.associate({ Order })
      User.associate({ Coupon })
    })

    it('should have many Comment', (done) => {
      expect(User.hasMany).to.have.been.calledWith(Comment)
      done()
    })
    it('should have many Order', (done) => {
      expect(User.hasMany).to.have.been.calledWith(Order)
      done()
    })

    it('should have many  Coupon', (done) => {
      expect(User.belongsToMany).to.have.been.calledWith(Coupon)
      done()
    })
  })

  context('action', () => {
    let data = null

    it('create', (done) => {
      db.User.create({}).then((user) => {
        data = user
        done()
      })
    })
    it('read', (done) => {
      db.User.findByPk(data.id).then((user) => {
        expect(data.id).to.be.equal(user.id)
        done()
      })
    })
    it('update', (done) => {
      db.User.update({}, { where: { id: data.id } }).then(() => {
        db.User.findByPk(data.id).then((user) => {
          expect(data.updatedAt).to.be.not.equal(user.updatedAt)
          done()
        })
      })
    })
    it('delete', (done) => {
      db.User.destroy({ where: { id: data.id } }).then(() => {
        db.User.findByPk(data.id).then((user) => {
          expect(user).to.be.equal(null)
          done()
        })
      })
    })
  })
})
