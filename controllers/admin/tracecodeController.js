const traceCodeService = require("../../services/admin/traceCodeService")

const traceCodeController = {
  //顯示追蹤碼設定頁面
  getTrackCodePage: (req, res) => {
    traceCodeService.getTrackCodePage(req, res, (data) => {
      return res.render("admin/marketingmodel_trace_code", data);
    })
  },
  //更新GA追蹤碼
  putGaTrackCode: (req, res) => {
    traceCodeService.putGaTrackCode(req, res, (data) => {
      return res.redirect("back");
    })
  }
};

module.exports = traceCodeController;
