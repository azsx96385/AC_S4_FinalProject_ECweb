const db = require("../../models");
const storeModel = db.Store;
const traceCodeController = {
  //顯示追蹤碼設定頁面
  getTrackCodePage: (req, res) => {
    //取得管理者-storeId
    const storeId = req.user.StoreId;
    storeModel.findByPk(storeId).then(storedata => {
      return res.render("admin/marketingmodel_trace_code", {
        storedata,
        layout: "admin_main"
      });
    });
  },
  //更新GA追蹤碼
  putGaTrackCode: (req, res) => {
    //取得管理者-storeId
    const storeId = req.user.StoreId;
    const { trackGA } = req.body;

    storeModel.findByPk(storeId).then(storedata => {
      storedata.update({ trackGA }).then(data => {
        return res.redirect("back");
      });
    });
  }
};
module.exports = traceCodeController;
