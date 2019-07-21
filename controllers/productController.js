const Handlebars = require('handlebars')
const getStarts = require('../public/javascript/getStarts')

const db = require("../models")
const {
  Product_category,
  Product,
  Comment
} = db

const productController = {
  getIndex: (req, res) => {
    Product_category.findAll().then(categories => {
      res.render('index', { categories })
    })
  },

  getCategoryProducts: (req, res) => {
    Product_category.findByPk(req.params.category_id, {
      include: [
        Product
      ]
    }).then(category => {
      const products = category.Products.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 34),
      }))
      Product_category.findAll().then(categories => {
        res.render('categoryProducts', { categories, products, category })
      })
    })
  },

  getProduct: (req, res) => {
    Product.findByPk(req.params.id, {
      include: [
        { model: Product_category, include: [Product] },
        Comment
      ]
    }).then(product => {
      console.log(product)
      const category = product.Product_category
      const categoryProducts = category.Products

      const products = categoryProducts.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
      }))

      productsFilter = products.slice(0, 4)

      Product_category.findAll().then(categories => {
        res.render('product', { product, categories, productsFilter })
      })
    })
  }
}

Handlebars.registerHelper('star', startsNum => {
  const yellowNum = Math.floor(startsNum)
  const grayNum = Math.floor(5 - startsNum)
  const decimalNum = (startsNum - yellowNum).toFixed(1)
  return getStarts(yellowNum, decimalNum, grayNum)
})



module.exports = productController