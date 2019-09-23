const db = require("../../models");
const fs = require("fs");
const productCategoryModel = db.Product_category;
const productModel = db.Product;
const { Delivery_notice } = db;

const imgur = require("imgur-node-api");
const multer = require("multer");
const upload = multer({ dest: "temp/" }).array("images");

const productController = {
  //  顯示產品管理頁面
  getProductManagePage: (req, res) => {
    //從登入之使用者-調出所屬商店資料
    const storeId = req.user.StoreId;

    //設定預設值|offset limit wherequery--> 商店id / 上下架與否
    let offset = 0;
    let pageLimit = 5;
    let whereQuery = { StoreId: storeId };
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
        let nextPage = page + 1 > pages ? pages : page + 1;

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
    const storeId = req.user.StoreId;
    //調出所有類別資料
    productCategoryModel
      .findAll({ where: { StoreId: storeId } })
      .then(categories => {
        return res.render("admin/productmodel_editproduct", {
          categories: categories,
          storeId: storeId,
          layout: "admin_main"
        });
      });
  },
  //   單一 | 新增產品
  postProduct: (req, res) => {
    //1. 防呆 -欄位漏填回傳
    console.log(req.body);
    const { StoreId, launched, count, name, description, price } = req.body;
    if (!StoreId || !launched || !count || !name || !description || !price) {
      req.flash("error_messages", "錯誤訊息|資料漏填");
      return res.redirect("back");
    }
    const { files } = req;
    //包裹圖片上傳
    let ImgsUrl = new Promise((resolve, reject) => {
      let count = 0;
      let images = [];
      files.forEach(file => {
        imgur.setClientID(process.env.IMGUR_CLIENT_ID);
        imgur.upload(file.path, (err, img) => {
          if (err) console.log(err);

          images.push(img.data.link);
          count++;
          console.log(count);
          if (count == files.length) {
            console.log(images);
            return resolve(images);
          }
        });
      });
    });

    //2.檢查產品的新增是否有圖片

    if (files.length > 0) {
      console.log("偵測到圖片");
      //先做圖片上傳-上傳完畢後-回傳儲存網址的陣列
      ImgsUrl.then(images => {
        console.log(
          images,
          "----------------------------------------------------------"
        );
        //3.新增資料
        return productModel
          .create({
            ProductCategoryId: req.body.ProductCategoryId,
            StoreId: req.body.StoreId,
            count: req.body.count,
            name: req.body.name,
            description: req.body.description,
            launched: req.body.launched,
            price: req.body.price,
            image: images ? images[0] : null,
            imageI: images ? images[1] : null,
            imageII: images ? images[2] : null
          })
          .then(data => {
            console.log("成功訊息|產品已經成功新增");
            req.flash("success_messages", "成功訊息|產品已經成功新增");
            return res.redirect("/admin/productmodel/product_mange");
          });
      });
    } else {
      console.log("沒偵測到圖片");
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
          return res.redirect("/admin/productmodel/product_mange");
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
  getProduct: (req, res) => {
    //先調出產品資料
    const productId = req.params.productId;
    //比對 user - storeid & product 的 storeId
    productCategoryModel.findAll().then(categories => {
      productModel.findByPk(productId).then(product => {
        //相同才顯示-不相同-返回錯誤訊息
        if (product.ProductCategoryId) {
          return res.render("admin/productmodel_editproduct", {
            categories: categories,
            product: product,
            layout: "admin_main"
          });
        } else {
          console.log("錯誤訊息|你沒有權限");
          req.flash("error_messages", "錯誤訊息|你沒有權限");
        }
      });
    });
  },
  putProduct: (req, res) => {
    //取出產品資料&讀取req.body資料
    //驗證product.storeID 與 user.storeID 是否相符
    const productId = req.params.productId;
    const { file } = req;
    if (file) {
      console.log("xxxxxx", file.path);
      imgur.setClientID(process.env.IMGUR_CLIENT_ID);
      imgur.upload(file.path, (err, img) => {
        console.log(img.data.link);
        if (err) console.log(err);
        return productModel.findByPk(productId).then(product => {
          product
            .update({
              ProductCategoryId: req.body.ProductCategoryId,
              count: req.body.count,
              name: req.body.name,
              description: req.body.description,
              launched: req.body.launched,
              price: req.body.price,
              image: file ? img.data.link : null
            })
            .then(data => {
              return res.redirect("/admin/productmodel/product_mange");
            });
        });
      });
    } else {
      return productModel.findByPk(productId).then(product => {
        product
          .update({
            ProductCategoryId: req.body.ProductCategoryId,
            count: req.body.count,
            name: req.body.name,
            description: req.body.description,
            launched: req.body.launched,
            price: req.body.price
          })
          .then(data => {
            return res.redirect("/admin/productmodel/product_mange");
          });
      });
    }
  },
  //   單一 | 編輯單一產品
  //   單一 | 更改商品狀態-上架
  //   單一 | 更改商品狀態-下架
  putProductLauched: (req, res) => {
    const { productId, launched } = req.query;
    return productModel.findByPk(productId).then(product => {
      //驗證storeID
      console.log("更動前", product.launched);
      //驗證通過
      //修改上下架
      if (launched === "1") {
        product.update({ launched: true });
        console.log("系統通知｜產品已上架");
      } else if (launched === "0") {
        product.update({ launched: false });
        console.log("系統通知｜產品已下架");
      }
      console.log("更動後", product.launched);
      res.redirect("back");
    });
  },
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
  },

  // 顯示訂單處理中頁面
  // 顯示未付款頁面
  // 顯示備貨中頁面

  // 單一 | 更改訂單狀態
  // 單一 | 更改訂單付款狀態
  // 單一 | 更改訂單送貨狀態
  // 單一 | 更改訂單訂購人資訊

  //-----------------------------
  getDeliveryNotice: (req, res) => {
    Delivery_notice.findAll({ include: [productModel] }).then(
      deliveryNotices => {
        res.render("admin/deliveryNotice", {
          deliveryNotices,
          layout: "admin_main"
        });
      }
    );
  },

  deleteDeliveryNotice: (req, res) => {
    Delivery_notice.findByPk(req.params.id).then(deliveryNotice => {
      deliveryNotice.destroy().then(deliveryNotice => {
        res.redirect(`/admin/deliveryNotice`);
      });
    });
  }
};
module.exports = productController;
