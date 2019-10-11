const productService = require('../services/productService')

const productController = {
  getIndex: (req, res) => {
    productService.getIndex(req, res, (data) => {
      res.render("index", data);
    });
  },

  getCategoryProducts: (req, res) => {
    productService.getCategoryProducts(req, res, (data) => {
      res.render("categoryProducts", data);
    });
  },

  getProduct: (req, res) => {
    productService.getProduct(req, res, (data) => {
      res.render("product", data);
    });
  },

  searchProduct: (req, res) => {
    productService.searchProduct(req, res, (data) => {
      res.render("search", data);
    });
  },

  postProductRate: (req, res) => {
    productService.postProductRate(req, res, (data) => {
      if (data['status'] === 'success') {
        req.flash('success_messages', data['message'])
        res.redirect(`/product/${req.body.ProductId}`)
      }
    });
  },

  deleteProductRate: (req, res) => {
    productService.deleteProductRate(req, res, (data) => {
      if (data['status'] === 'success') {
        req.flash('success_messages', data['message'])
        res.redirect(`/product/${data['comment'].ProductId}`)
      }
    });
  },

  postDeliveryNotice: (req, res) => {
    productService.postDeliveryNotice(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      res.redirect(`/product/${req.body.ProductId}`)
    });
  }
};

module.exports = productController;
