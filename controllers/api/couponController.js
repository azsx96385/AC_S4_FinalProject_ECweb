const couponService = require("../../services/couponService")

const couponController = {
  getCouponMakePage: (req, res) => {
    couponService.getCouponMakePage(req, res, (data) => {
      res.json(data);
    })
  },

  postCouponMake: (req, res) => {
    couponService.postCouponMake(req, res, (data) => {
      res.json(data);
    })
  },

  checkCoupon: async (req, res) => {
    couponService.checkCoupon(req, res, (data) => {
      res.json(data);
    })
  },

  getCouponOrderEdit: (req, res) => {
    couponService.getCouponOrderEdit(req, res, (data) => {
      res.json(data);
    })
  },

  getCouponManagePage: (req, res) => {
    couponService.getCouponManagePage(req, res, (data) => {
      res.json(data);
    })
  },

  getCouponEditPage: (req, res) => {
    couponService.getCouponEditPage(req, res, (data) => {
      res.json(data);
    })
  },

  postCouponEdit: (req, res) => {
    couponService.postCouponEdit(req, res, (data) => {
      res.json(data);
    })
  }
}

module.exports = couponController