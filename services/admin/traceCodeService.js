const db = require("../../models");
const storeModel = db.Store;

const traceCodeService = {
  //顯示追蹤碼設定頁面
  getTrackCodePage: (req, res, callback) => {
    //取得管理者-storeId
    const storeId = req.user.StoreId;
    storeModel.findByPk(storeId).then(storedata => {
      return callback({
        storedata,
        layout: "admin_main"
      });
    });
  },
  //更新GA追蹤碼
  putGaTrackCode: (req, res, callback) => {
    //取得管理者-storeId
    const storeId = req.user.StoreId;
    const { trackGA } = req.body;

    storeModel.findByPk(storeId).then(storedata => {
      storedata.update({ trackGA }).then(data => {
        return callback({ status: 'success', message: "" })
      });
    });
  }
};
module.exports = traceCodeService;