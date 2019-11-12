const express = require("express");
let router = express.Router();

let adminController = require("../../../controllers/api/admin/adminController");

//路由設定

//顯示後台首頁-商店基本資料頁面
router.get("/", adminController.getStoreInfo);

//編輯商業基本資料
router.put("/", adminController.putStoreInfo);

//匯出路由
module.exports = router;
