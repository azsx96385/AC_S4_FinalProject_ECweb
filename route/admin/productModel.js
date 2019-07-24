const express = require("express");
let router = express.Router();

//路由設定
router.get("/", (req, res) => {
  res.send("productModel");
});

//匯出路由
module.exports = router;
