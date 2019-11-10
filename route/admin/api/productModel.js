//引入需要的套件
const express = require("express");
let router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "temp/" }).array("images");
//引入需要的Controller
const productController = require("../../../controllers/admin/productController");
const orderController = require("../../../controllers/api/admin/orderController");

//路由設定

//[產品管理]==================================================
// 顯示產品管理頁面
router.get("/product_mange", productController.getProductManagePage);
// 單一 | 顯示新增單一商品頁面
router.get("/create", productController.getProductCreatePage);
// 單一 | 新增產品
router.post("/create", upload, productController.postProduct);
// 單一 | 刪除單一商品
router.delete("/delete/:productId", productController.deleteProduct);
// 單一 | 更改商品狀態-下架/上架
router.put("/update", productController.putProductLauched);
// 單一 | 顯示單一產品編輯頁面
router.get("/update/:productId", productController.getProduct);
// 單一 | 編輯單一產品
router.put("/update/:productId", upload, productController.putProduct);

// 批次 | 變更產品狀態-上架
// 批次 | 變更產品狀態-下架
// 批次 | 變更刪除產品
// 批次 | 顯示批次上傳頁面
// 批次 | 批次上傳

//[訂單管理]==================================================
// 顯示全部訂單頁面
router.get("/order_mange", orderController.getOrderManagePage);
// 單一 | 顯示單筆訂單
router.get("/order_mange/:id", orderController.getOrder);

// 顯示訂單處理中頁面
// 顯示未付款頁面
// 顯示備貨中頁面

// 單一 | 更改訂單狀態
router.put("/order_mange/:orderId/oderstatus", orderController.putOrderStatus);
// 單一 | 更改訂單付款狀態
router.put(
  "/order_mange/:orderId/payment_status",
  orderController.putPaymentStatus
);
// // 單一 | 更改訂單送貨狀態
router.put(
  "/order_mange/:orderId/shipment_status",
  orderController.putShipmentStatus
);
// 單一 | 更改訂單訂購人資訊

//[貨到通知管理]==================================================
// 管理貨到通知頁面
router.get("/deliveryNotice", productController.getDeliveryNotice);
// 刪除貨到通知資料
router.delete("/deliveryNotice/:id", productController.deleteDeliveryNotice);

//匯出路由
module.exports = router;
