const adminService = require("../../services/admin/adminService")

const adminController = {
  //顯示商店基本資料
  getStoreInfo: (req, res) => {
    adminService.getStoreInfo(req, res, (data) => {
      res.render("admin/indexModel_storeinfo", data)
    })
  },
  //更新商店基本資料
  putStoreInfo: (req, res) => {
    adminService.putStoreInfo(req, res, (data) => {
      return res.redirect("back");
    })
  }
};

module.exports = adminController;
