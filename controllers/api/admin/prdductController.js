const productService = require("../../../services/admin/productService")

const productController = {
  getProductManagePage: (req, res) => {
    productService.getProductManagePage(req, res, (data) => {
      res.json(data);
    })
  },

  getProductCreatePage: (req, res) => {
    productService.getProductCreatePage(req, res, (data) => {
      res.json(data);
    })
  },

  postProduct: (req, res) => {
    productService.postProduct(req, res, (data) => {
      res.json(data);
    })
  },

  deleteProduct: (req, res) => {
    productService.deleteProduct(req, res, (data) => {
      res.json(data);
    })
  },

  getProduct: (req, res) => {
    productService.getProduct(req, res, (data) => {
      res.json(data);
    })
  },

  putProduct: (req, res) => {
    productService.putProduct(req, res, (data) => {
      res.json(data);
    })
  },

  putProductLauched: (req, res) => {
    productService.putProductLauched(req, res, (data) => {
      res.json(data);
    })
  },

  getDeliveryNotice: (req, res) => {
    productService.getDeliveryNotice(req, res, (data) => {
      res.json(data);
    })
  },

  deleteDeliveryNotice: (req, res) => {
    productService.deleteDeliveryNotice(req, res, (data) => {
      res.json(data);
    })
  }
}

module.exports = productController