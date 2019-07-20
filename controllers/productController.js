const db = require("../models");
const { Product_category } = db

const productController = {
  getIndex: (req, res) => {
    Product_category.findAll().then(categories => {
      res.render('index', { categories })
    })
  }
}


module.exports = productController