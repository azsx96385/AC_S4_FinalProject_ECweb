const productService = require("../../services/admin/productService")

const productController = {
  //  顯示產品管理頁面
  getProductManagePage: (req, res) => {
    productService.getProductManagePage(req, res, (data) => {
      res.render("admin/productmodel_products", data);
    })
  },
  //   單一 | 顯示新增單一商品頁面
  getProductCreatePage: (req, res) => {
    productService.getProductCreatePage(req, res, (data) => {
      return res.render("admin/productmodel_editproduct", data);
    })
  },
  //   單一 | 新增產品
  postProduct: (req, res) => {
    productService.postProduct(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      return res.redirect("/admin/productmodel/product_mange");
    })
  },
  //   單一 | 刪除單一商品
  deleteProduct: (req, res) => {
    productService.deleteProduct(req, res, (data) => {
      return res.redirect("back");
    })
  },
  //   單一 | 顯示單一產品編輯頁面
  getProduct: (req, res) => {
    productService.getProduct(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
      }
      return res.render("admin/productmodel_editproduct", data);
    })
  },
  //   單一 | 編輯單一產品
  putProduct: (req, res) => {
    productService.putProduct(req, res, (data) => {
      return res.redirect("/admin/productmodel/product_mange");
    })
  },
  //   單一 | 更改商品狀態-上架
  //   單一 | 更改商品狀態-下架
  putProductLauched: (req, res) => {
    productService.putProductLauched(req, res, (data) => {
      res.redirect("back");
    })
  },
  //   批次 | 變更產品狀態-上架
  //   批次 | 變更產品狀態-下架
  //   批次 | 變更刪除產品
  //   批次 | 顯示批次上傳頁面
  //   批次 | 批次上傳 //=======================

  // 顯示全部訂單頁面
  // getOrderManagePage: (req, res) => {
  //   res.render("admin/productmodel_orders", {
  //     layout: "admin_main"
  //   });
  // },
  // 單一 | 顯示單筆訂單
  // getOrder: (req, res) => {
  //   res.render("admin/vproductmodel_orderdetail", {
  //     layout: "admin_main"
  //   });
  // },

  // 顯示訂單處理中頁面
  // 顯示未付款頁面
  // 顯示備貨中頁面

  // 單一 | 更改訂單狀態
  // 單一 | 更改訂單付款狀態
  // 單一 | 更改訂單送貨狀態
  // 單一 | 更改訂單訂購人資訊

  //-----------------------------
  getDeliveryNotice: (req, res) => {
    productService.getDeliveryNotice(req, res, (data) => {
      res.render("admin/deliveryNotice", data);
    })
  },

  deleteDeliveryNotice: (req, res) => {
    productService.deleteDeliveryNotice(req, res, (data) => {
      res.redirect(`/admin/productmodel/deliveryNotice`);
    })
  }
};
module.exports = productController;
