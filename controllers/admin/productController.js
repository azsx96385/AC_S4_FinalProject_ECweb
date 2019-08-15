const db = require("../../models");
const fs = require("fs");
const productCategoryModel = db.Product_category;
const productModel = db.Product;
const productController = {
  //  顯示產品管理頁面
  getProductManagePage: (req, res) => {
    //從登入之使用者-調出所屬商店資料
    //設定預設值|offset limit wherequery--> 商店id / 上下架與否
    let offset = 0;
    let pageLimit = 5;
    let whereQuery = { StoreId: 1 };
    if (req.query.launched) {
      whereQuery["launched"] = req.query.launched;
    }
    if (req.query.page) {
      offset = (req.query.page - 1) * pageLimit;
    }
    //調出所有該商店的商品，渲染再前端頁面
    productModel
      .findAndCountAll({
        where: whereQuery,
        include: [{ model: productCategoryModel }],
        offset: offset,
        limit: pageLimit
      })
      .then(shopProducts => {
        let page = Number(req.query.page) || 1; //初次載入獲如果沒傳入頁碼，預設0
        let pages = Math.ceil(shopProducts.count / pageLimit); //計算需要幾頁
        let totalPage = Array.from({ length: pages }).map(
          (item, index) => index + 1
        ); //創造頁碼陣列
        //[定義上下頁頁碼]---------------- //使用三元運算子
        let prePage = page - 1 < 1 ? 1 : page - 1;
        let nextPage = page + 1 > page ? page : page + 1;

        res.render("admin/productmodel_products", {
          shopProductsCount: shopProducts.count,
          shopProducts: shopProducts.rows,
          launched: req.query.launched,
          page: page, // 用來讓該頁的頁碼 active and disable
          totalPage: totalPage, //用來產生頁碼
          prePage: prePage, //用來設定上一頁 url
          nextPage: nextPage, //用來設定下一頁 url
          layout: "admin_main"
        });
      });
  },
  //   單一 | 顯示新增單一商品頁面
  getProductCreatePage: (req, res) => {
    //預設參數
    let StoreId = 1;
    //調出所有類別資料
    productCategoryModel.findAll().then(categories => {
      return res.render("admin/productmodel_editproduct", {
        categories: categories,
        layout: "admin_main"
      });
    });
  },
  //   單一 | 上傳圖片
  //   單一 | 新增產品
  postProduct: (req, res) => {
    //加入防呆
    console.log(req.body);
    //檢查產品的新增是否有圖片
    const { file } = req;
    if (file) {
      //存在圖片->從temp讀出圖片
      fs.readFile(file.path, (err, data) => {
        if (err) console.log("Imgur ERR:", err);
        fs.writeFile(`upload/${file.originalname}`, data, () => {
          return productModel
            .create({
              ProductCategoryId: req.body.ProductCategoryId,
              StoreId: req.body.StoreId,
              count: req.body.count,
              name: req.body.name,
              description: req.body.description,
              launched: req.body.launched,
              price: req.body.price,
              image: file ? `/upload/${file.originalname}` : null
            })
            .then(data => {
              console.log("成功訊息|產品已經成功新增");
              return res.redirect("/admin/productmodel/product_mange");
            });
        });
      });
    } else {
      return productModel
        .create({
          ProductCategoryId: req.body.ProductCategoryId,
          StoreId: req.body.StoreId,
          count: req.body.count,
          name: req.body.name,
          description: req.body.description,
          launched: req.body.launched,
          price: req.body.price,
          image: null
        })
        .then(data => {
          console.log("成功訊息|產品已經成功新增");
          return res.redirect("/admin/productmodel/product_mange", {
            layout: "admin_main"
          });
        });
    }
  },
  //   單一 | 刪除單一商品
  deleteProduct: (req, res) => {
    //取得storeID-req.user.storeID
    //取得productID-req.params
    const productId = req.params.productId;
    productModel.findByPk(productId).then(product => {
      product.destroy().then(data => {
        return res.redirect("back");
      });
    });
  },
  //   單一 | 顯示單一產品編輯頁面
  //   單一 | 編輯單一產品
  //   單一 | 更改商品狀態-上架
  //   單一 | 更改商品狀態-下架
  //   批次 | 變更產品狀態-上架
  //   批次 | 變更產品狀態-下架
  //   批次 | 變更刪除產品
  //   批次 | 顯示批次上傳頁面
  //   批次 | 批次上傳 //=======================

  // 顯示全部訂單頁面
  getOrderManagePage: (req, res) => {
    res.render("admin/productmodel_orders", {
      layout: "admin_main"
    });
  },
  // 單一 | 顯示單筆訂單
  getOrder: (req, res) => {
    res.render("admin/vproductmodel_orderdetail", {
      layout: "admin_main"
    });
  }

  // 顯示訂單處理中頁面
  // 顯示未付款頁面
  // 顯示備貨中頁面

  // 單一 | 更改訂單狀態
  // 單一 | 更改訂單付款狀態
  // 單一 | 更改訂單送貨狀態
  // 單一 | 更改訂單訂購人資訊
};
module.exports = productController;
