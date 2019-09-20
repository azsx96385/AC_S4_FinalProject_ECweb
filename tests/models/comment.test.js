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
const CommentModel = require('../../models/comment')

describe('# Comment Model', () => {
  before(done => {
    done()
  })

  const Comment = CommentModel(sequelize, dataTypes)
  const comment = new Comment()
  //檢查model name
  checkModelName(Comment)('Comment')

  //檢查properties
  context('properties', () => {
    ;[
      'UserId',
      'ProductId',
      'comment',
      'rating'
    ].forEach(checkPropertyExists(comment))
  })
  //檢查associations
  context('associations', () => {
    const Product = 'Product'
    const User = 'User'

    before(() => {
      Comment.associate({ Product })
      Comment.associate({ User })
    })

    it('should belongsTo Product', (done) => {
      expect(Comment.belongsTo).to.have.been.calledWith(Product)
      done()
    })
    it('should belongsTo User', (done) => {
      expect(Comment.belongsTo).to.have.been.calledWith(User)
      done()
    })
  })

  context('action', () => {
    let data = null

    it('create', (done) => {
      db.Comment.create({}).then((comment) => {
        data = comment
        done()
      })
    })
    it('read', (done) => {
      db.Comment.findByPk(data.id).then((comment) => {
        expect(data.id).to.be.equal(comment.id)
        done()
      })
    })
    it('update', (done) => {
      db.Comment.update({}, { where: { id: data.id } }).then(() => {
        db.Comment.findByPk(data.id).then((comment) => {
          expect(data.updatedAt).to.be.not.equal(comment.updatedAt)
          done()
        })
      })
    })
    it('delete', (done) => {
      db.Comment.destroy({ where: { id: data.id } }).then(() => {
        db.Comment.findByPk(data.id).then((comment) => {
          expect(comment).to.be.equal(null)
          done()
        })
      })
    })
  })
})
