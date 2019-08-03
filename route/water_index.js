//const app = require("express");
let saleModel = require("./admin/saleModel");
let productModel = require("./admin/productModel");
let marketingModel = require("./admin/marketingModel");

module.exports = app => {
  //設定路由群組
  app.get("/", (req, res) => {
    return res.render("admin/marketingmodel_trace_code", {
      layout: "admin_main"
    });
  });
  //admin===============================================
  //銷售模組
  app.use("/salemodel", saleModel);
  //產品模組
  app.use("/productmodel", productModel);
  //行銷模組
  app.use("/marketingmodel", marketingModel);
};
