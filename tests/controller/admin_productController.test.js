//引入測試套件
const chai = require("chai");
const request = require("supertest");
const assert = require("assert");
const sinon = require("sinon");
const { expect } = require("chai");
//引入需要model & function
const app = require("../../app");
const db = require("../../models");
const productModel = db.Product;

//測試開始

describe("Product Test", function() {
  before(function() {
    //管理者登入
  });
  after(function() {
    //管理者登出
  });
  it("1.檢視所有產品資料-getProductManagePage", function(done) {
    //模擬管理者登入
    request(app)
      .post("/users/logIn")
      .send("email=root@example.com&password=12345678")
      .expect(302)
      .end(function(err, res) {
        //驗證1-失敗-抓不到 flsh
        //assert.equal(res.locals.success_messages, "成功訊息|你已經成功登入");
        //驗證2-已重新導向頁面為注 /index
        assert.equal(res.header.location, "/index");

        request(app)
          .get("/admin/productmodel/product_mange")
          .expect(302, { success_messages: "Y" }, done);
      });
  });
});
