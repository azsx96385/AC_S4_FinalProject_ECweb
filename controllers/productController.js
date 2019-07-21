const db = require("../models");
const {
  Product_category,
  Product
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
      const product = category.Products.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 34),
      }))
      Product_category.findAll().then(categories => {
        res.render('categoryProducts', { categories, product, category })
      })
    })
  },

}



module.exports = productController