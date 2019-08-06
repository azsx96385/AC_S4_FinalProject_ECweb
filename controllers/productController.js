const average = require('../public/javascript/average')

const db = require("../models")
const {
  Product_category,
  Product,
  Comment,
  User
} = db

const productController = {
  getIndex: (req, res) => {
    Product_category.findAll().then(categories => {
      res.render('index', { categories })
    })
  },

  getCategoryProducts: (req, res) => {
    let key = req.query.key
    let value = req.query.value
    let sort = ''

    Product_category.findByPk(req.params.category_id, {
      include: [
        Product
      ]
    }).then(category => {
      let products = category.Products.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 34),
      }))

      if (key === 'createdAt' && value === 'desc') {
        products = products.sort((a, b) => b.createdAt - a.createdAt)
        sort = '上架時間: 由新到舊'
      } else if (key === 'createdAt' && value === 'asc') {
        products = products.sort((a, b) => a.createdAt - b.createdAt)
        sort = '上架時間: 由舊到新'
      } else if (key === 'price' && value === 'desc') {
        products = products.sort((a, b) => b.price - a.price)
        sort = '價格: 由高至低'
      } else if (key === 'price' && value === 'asc') {
        products = products.sort((a, b) => a.price - b.price)
        sort = '價格: 由低至高'
      }

      Product_category.findAll().then(categories => {
        res.render('categoryProducts', {
          categories,
          products,
          category,
          sort
        })
      })
    })
  },

  getProduct: (req, res) => {
    Product.findByPk(req.params.id, {
      include: [
        { model: Product_category, include: [Product] },
        { model: Comment, include: [User, Product] }
      ]
    }).then(product => {
      const comment = product.Comments.map(r => ({
        ...r.dataValues,
        createdAt: Number(r.createdAt),
        updatedAt: Number(r.updatedAt)
      }))
      const category = product.Product_category
      const categoryProducts = category.Products

      const products = categoryProducts.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 50),
      }))

      productsFilter = products.slice(0, 4)

      Product_category.findAll().then(categories => {
        const ratingAve = average(comment)

        res.render('product', { product, categories, productsFilter, ratingAve })
      })
    })
  },

  searchProduct: (req, res) => {
    const keyword = req.query.keyword

    Product.findAll().then(products => {
      let search = products.filter(product => {
        return product.name.toLowerCase().includes(keyword.toLowerCase())
      })

      search = search.map(r => ({
        ...r.dataValues,
        description: r.dataValues.description.substring(0, 34),
      }))

      Product_category.findAll().then(categories => {
        res.render('search', { products: search, keyword, categories })
      })
    })
  },

  postProductRate: (req, res) => {
    Comment.create({
      comment: req.body.comment,
      rating: req.body.rating,
      ProductId: req.body.ProductId,
      UserId: req.user.id
    }).then(() => {
      res.redirect(`/product/${req.body.ProductId}`)
    })
  },

  deleteProductRate: (req, res) => {
    Comment.findByPk(req.params.id).then(comment => {
      comment.destroy().then(comment => {
        res.redirect(`/product/${comment.ProductId}`)
      })
    })
  }
}

module.exports = productController