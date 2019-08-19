const express = require("express");
let router = express.Router();

//路由設定
//[行銷管理]==================================================
router.get("/trace_code", (req, res) => {
  return res.render("admin/marketingmodel_trace_code", {
    layout: "admin_main"
  });
});

// router.get("/", (req, res) => {
//   return res.render("admin/", {
//     layout: "admin_main"
//   });
// });

// router.get("/", (req, res) => {
//   return res.render("admin/", {
//     layout: "admin_main"
//   });
// });

//匯出路由
module.exports = router;
