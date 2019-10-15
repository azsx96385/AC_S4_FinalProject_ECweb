const average = require("../public/javascript/average");

const db = require("../models");
const {
  Product_category,
  Product,
  Comment,
  User,
  Order,
  Payment_status,
  Delivery_notice
} = db;

const productService = {
  getIndex: (req, res, callback) => {
    Product_category.findAll().then(categories => {
      callback({ categories });
    });
  },

  getCategoryProducts: (req, res, callback) => {
    let key = req.query.key;
    let value = req.query.value;

    Product_category.findByPk(req.params.category_id, {
      include: [Product]
    }).then(category => {
      const categoryId = category.id;
      let products = category.Products.map(r => ({
        ...r.dataValues,
        name: r.dataValues.name.substring(0, 20)
      }));

      // 上架才顯示
      products = products.filter(d => d.launched === true)

      // 產品排序
      if (key === "createdAt" && value === "desc") {
        products = products.sort((a, b) => b.createdAt - a.createdAt);
      } else if (key === "createdAt" && value === "asc") {
        products = products.sort((a, b) => a.createdAt - b.createdAt);
      } else if (key === "price" && value === "desc") {
        products = products.sort((a, b) => b.price - a.price);
      } else if (key === "price" && value === "asc") {
        products = products.sort((a, b) => a.price - b.price);
      }

      // 產品分頁
      const pageLimit = 12;
      let page = Number(req.query.page) || 1;
      let pages = Math.ceil(products.length / pageLimit);
      let totalPage = Array.from({ length: pages }).map(
        (item, index) => index + 1
      );
      let prev = page - 1 < 1 ? 1 : page - 1;
      let next = page + 1 > pages ? pages : page + 1;
      let paginationData = [];
      paginationData = products || paginationData;
      let offset = (page - 1) * pageLimit;
      let pageData = paginationData.slice(offset, offset + pageLimit);

      Product_category.findAll().then(categories => {
        callback({
          categories,
          products: pageData,
          category,
          categoryId,
          totalPage,
          prev,
          next,
          page,
          key,
          value
        });
      });
    });
  },

  getProduct: (req, res, callback) => {
    Product.findByPk(req.params.id, {
      include: [
        { model: Product_category, include: [Product] },
        { model: Comment, include: [User, Product] },
        {
          model: Order,
          as: "orders",
          include: [User, { model: Payment_status, as: "PaymentStatus" }]
        }
      ]
    }).then(product => {
      const comment = product.Comments.map(r => ({
        ...r.dataValues,
        createdAt: Number(r.createdAt),
        updatedAt: Number(r.updatedAt)
      }));

      // 評價分頁
      const pageLimit = 10;
      let page = Number(req.query.page) || 1;
      let pages = Math.ceil(comment.length / pageLimit);
      let totalPage = Array.from({ length: pages }).map(
        (item, index) => index + 1
      );
      let prev = page - 1 < 1 ? 1 : page - 1;
      let next = page + 1 > pages ? pages : page + 1;
      let paginationData = [];
      paginationData = comment || paginationData;
      let offset = (page - 1) * pageLimit;
      let pageData = paginationData.slice(offset, offset + pageLimit);

      // 篩選相似商品
      const category = product.Product_category;
      const categoryId = category.id;
      const categoryProducts = category.Products;
      let products = categoryProducts.filter(d => d.id != req.params.id);

      // 上架才顯示
      products = products.filter(d => d.launched === true)
      let productsFilter = products.slice(0, 6);
      productsFilter = productsFilter.map(r => ({
        ...r.dataValues,
        name: r.name.substring(0, 20)
      }));

      Product_category.findAll().then(categories => {
        // 評價平均分數
        const ratingAve = average(comment);

        const orders = product.orders;

        callback({
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
        });
      });
    });
  },

  searchProduct: (req, res, callback) => {
    const keyword = req.query.keyword;

    Product.findAll({ include: [Product_category] }).then(products => {
      let search = products.filter(product => {
        return product.name.toLowerCase().includes(keyword.toLowerCase());
      });

      search = search.map(r => ({
        ...r.dataValues,
        name: r.name.substring(0, 30)
      }));

      // 上架才顯示
      search = search.filter(d => d.launched === true)

      // 產品排序
      let key = req.query.key;
      let value = req.query.value;

      if (key === "createdAt" && value === "desc") {
        search = search.sort((a, b) => b.createdAt - a.createdAt);
      } else if (key === "createdAt" && value === "asc") {
        search = search.sort((a, b) => a.createdAt - b.createdAt);
      } else if (key === "price" && value === "desc") {
        search = search.sort((a, b) => b.price - a.price);
      } else if (key === "price" && value === "asc") {
        search = search.sort((a, b) => a.price - b.price);
      }

      // 產品分頁
      const pageLimit = 16;
      let page = Number(req.query.page) || 1;
      let pages = Math.ceil(search.length / pageLimit);
      let totalPage = Array.from({ length: pages }).map(
        (item, index) => index + 1
      );
      let prev = page - 1 < 1 ? 1 : page - 1;
      let next = page + 1 > pages ? pages : page + 1;
      let paginationData = [];
      paginationData = search || paginationData;
      let offset = (page - 1) * pageLimit;
      let pageData = paginationData.slice(offset, offset + pageLimit);

      Product_category.findAll().then(categories => {
        callback({
          products: pageData,
          keyword,
          key,
          value,
          categories,
          totalPage,
          prev,
          next,
          pageData,
          page
        });
      });
    });
  },

  postProductRate: (req, res, callback) => {
    Comment.create({
      comment: req.body.comment,
      rating: req.body.rating,
      ProductId: req.body.ProductId,
      UserId: req.user.id
    }).then(() => {
      callback({ status: 'success', message: "已成功新增評價" });
    });
  },

  deleteProductRate: (req, res, callback) => {
    Comment.findByPk(req.params.id).then(comment => {
      comment.destroy().then(comment => {
        callback({ status: 'success', message: "已成功刪除評價", comment });
      });
    });
  },

  postDeliveryNotice: (req, res, callback) => {
    let { email, email_confirm } = req.body;

    if (email !== email_confirm) {
      return callback({ status: 'error', message: "請確認輸入的電子郵件是否相同" })
    }

    Delivery_notice.create({
      ProductId: req.body.ProductId,
      email: req.body.email
    }).then(() => {
      return callback({ status: 'success', message: "已送出申請，待補充庫存後，相關人員會寄e-mail通知您" })
    });
  }
};

module.exports = productService;