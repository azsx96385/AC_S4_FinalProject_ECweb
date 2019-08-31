const average = require('../public/javascript/average')

const db = require("../models")
const {
  Product_category,
  Product,
  Comment,
  User,
  Order,
  Payment_status
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
      const categoryId = category.id
      let products = category.Products.map(r => ({
        ...r.dataValues,
        name: r.dataValues.name.substring(0, 20)
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
      console.log(products)
      Product_category.findAll().then(categories => {
        res.render('categoryProducts', {
          categories,
          products,
          category,
          sort,
          categoryId
        })
      })
    })
  },

  getProduct: (req, res) => {
    Product.findByPk(req.params.id, {
      include: [
        { model: Product_category, include: [Product] },
        { model: Comment, include: [User, Product] },
        {
          model: Order, as: 'orders',
          include: [
            User,
            { model: Payment_status, as: 'PaymentStatus' }
          ]
        }
      ]
    }).then(product => {
      const comment = product.Comments.map(r => ({
        ...r.dataValues,
        createdAt: Number(r.createdAt),
        updatedAt: Number(r.updatedAt)
      }))

      // 評價分頁
      const pageLimit = 10
      let page = Number(req.query.page) || 1
      let pages = Math.ceil(comment.length / pageLimit)
      let totalPage = Array.from({ length: pages }).map((item, index) => index + 1)
      let prev = page - 1 < 1 ? 1 : page - 1
      let next = page + 1 > pages ? pages : page + 1
      let paginationData = []
      paginationData = comment || paginationData
      let offset = (page - 1) * pageLimit
      let pageData = paginationData.slice(offset, offset + pageLimit)

      // 篩選相似商品
      const category = product.Product_category
      const categoryId = category.id
      const categoryProducts = category.Products
      const products = categoryProducts.filter(d => d.id != req.params.id)
      let productsFilter = products.slice(0, 6)
      productsFilter = productsFilter.map(r => ({
        ...r.dataValues,
        name: r.name.substring(0, 20)
      }))

      Product_category.findAll().then(categories => {
        // 評價平均分數
        const ratingAve = average(comment)

        const orders = product.orders

        res.render('product', {
          product,
          categories,
          productsFilter,
          ratingAve,
          orders,
          totalPage,
          page,
          prev,
          next,
          comment: pageData,
          categoryId
        })
      })
    })
  },

  searchProduct: (req, res) => {
    const keyword = req.query.keyword

    Product.findAll({ include: [Product_category] }).then(products => {
      let search = products.filter(product => {
        return product.name.toLowerCase().includes(keyword.toLowerCase())
      })

      search = search.map(r => ({
        ...r.dataValues,
        name: r.name.substring(0, 30)
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