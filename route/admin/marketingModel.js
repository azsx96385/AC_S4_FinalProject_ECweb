const express = require("express");
let router = express.Router();
const tackCodeController = require("../../controllers/admin/tracecodeController");

//路由設定
//[行銷管理]==================================================

//追蹤碼設定頁面
router.get("/track_code", tackCodeController.getTrackCodePage);

//更新GA追蹤碼

router.put("/track_code/ga_trackcode", tackCodeController.putGaTrackCode);

// router.get("/", (req, res) => {
//   return res.render("admin/", {
//     layout: "admin_main"
//   });
// });

//匯出路由
module.exports = router;
