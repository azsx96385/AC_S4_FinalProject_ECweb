const db = require("../../models");
const storeModel = db.Store;
const storeCategoryModel = db.Store_category;

const adminService = {
  //顯示商店基本資料
  getStoreInfo: (req, res, callback) => {
    //從登入者取得-商店ID
    const storeId = req.user.StoreId;
    //使用ID從DB調商店資料
    return storeModel
      .findByPk(storeId, { include: [{ model: storeCategoryModel }] })
      .then(storeData => {
        //回傳資料
        callback({
          storeData: storeData,
          layout: "admin_main"
        });
      });
  },
  //更新商店基本資料
  putStoreInfo: (req, res, callback) => {
    //取得表單資料
    const storeId = req.user.StoreId;
    const { name, description } = req.body;
    //取出Store model 更新
    storeModel.findByPk(storeId).then(storeData => {
      storeData.update({ name, description }).then(data => {
        return callback({ status: 'success', message: "" })
      });
    });
  }
}

module.exports = adminService