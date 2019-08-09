const express = require("express");
let router = express.Router();
//引入需要的Controller
const productController = require("../../controllers/admin/productController");

//路由設定
//[產品管理]==================================================
// 顯示產品管理頁面
router.get("/product_mange", productController.getProductManagePage);
// 單一 | 顯示新增單一商品頁面
router.get("/create", productController.getProductCreatePage);

// 單一 | 上傳圖片
// 單一 | 新增產品
router.post("/create", productController.postProduct);
// 單一 | 刪除單一商品
// 單一 | 顯示單一產品編輯頁面
// 單一 | 編輯單一產品
// 單一 | 更改商品狀態-上架
// 單一 | 更改商品狀態-下架
// 批次 | 變更產品狀態-上架
// 批次 | 變更產品狀態-下架
// 批次 | 變更刪除產品
// 批次 | 顯示批次上傳頁面
// 批次 | 批次上傳

//[訂單管理]==================================================
// 顯示全部訂單頁面
router.get("/order_mange", (req, res) => {
  return res.render("admin/productmodel_orders", {
    layout: "admin_main"
  });
});
// 單一 | 顯示單筆訂單
router.get("/order_mange/:id", (req, res) => {
  return res.render("admin/productmodel_orderdetail", {
    layout: "admin_main"
  });
});

// 顯示訂單處理中頁面
// 顯示未付款頁面
// 顯示備貨中頁面

// 單一 | 更改訂單狀態
// 單一 | 更改訂單付款狀態
// 單一 | 更改訂單送貨狀態
// 單一 | 更改訂單訂購人資訊

//匯出路由
module.exports = router;
