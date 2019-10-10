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
    Comment.create({
      comment: req.body.comment,
      rating: req.body.rating,
      ProductId: req.body.ProductId,
      UserId: req.user.id
    }).then(() => {
      res.redirect(`/product/${req.body.ProductId}`);
    });
  },

  deleteProductRate: (req, res) => {
    Comment.findByPk(req.params.id).then(comment => {
      comment.destroy().then(comment => {
        res.redirect(`/product/${comment.ProductId}`);
      });
    });
  },

  postDeliveryNotice: (req, res) => {
    productService.postDeliveryNotice(req, res, (data) => {
      res.json(data)
    })
  }
};

module.exports = productController;