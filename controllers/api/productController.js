const productService = require('../../services/productService')

const productController = {
  getIndex: (req, res) => {
    productService.getIndex(req, res, (data) => {
      res.json(data);
    });
  },

  getCategoryProducts: (req, res) => {
    productService.getCategoryProducts(req, res, (data) => {
      res.json(data);
    });
  },

  getProduct: (req, res) => {
    productService.getProduct(req, res, (data) => {
      res.json(data)
    })
  },

  searchProduct: (req, res) => {
    productService.searchProduct(req, res, (data) => {
      res.json(data)
    })
  },

  postProductRate: (req, res) => {
    productService.postProductRate(req, res, (data) => {
      res.json(data)
    })
  },

  deleteProductRate: (req, res) => {
    productService.deleteProductRate(req, res, (data) => {
      res.json(data)
    })
  },

  postDeliveryNotice: (req, res) => {
    productService.postDeliveryNotice(req, res, (data) => {
      res.json(data)
    })
  }
};

module.exports = productController;