const couponService = require("../services/couponService")

const couponController = {
  getCouponMakePage: (req, res) => {
    couponService.getCouponMakePage(req, res, (data) => {
      res.render('couponMake', data)
    })
  },

  postCouponMake: (req, res) => {
    couponService.postCouponMake(req, res, (data) => {
      res.render('couponShow', data)
    })
  },

  checkCoupon: async (req, res) => {
    couponService.checkCoupon(req, res, (data) => {
      if (data['status'] === 'error') {
        req.flash('error_messages', data['message'])
        return res.redirect('back')
      }
      req.flash('success_messages', data['message'])
      return res.redirect(`/cart?couponId=${data['couponId']}`)
    })
  },

  getCouponOrderEdit: (req, res) => {
    couponService.getCouponOrderEdit(req, res, (data) => {
      return res.render('orderEdit', data)
    })
  },

  //admin管理coupon
  getCouponManagePage: (req, res) => {
    couponService.getCouponManagePage(req, res, (data) => {
      res.render('couponManagePage', data)
    })
  },

  getCouponEditPage: (req, res) => {
    couponService.getCouponEditPage(req, res, (data) => {
      res.render('couponEditPage', data)
    })
  },

  postCouponEdit: (req, res) => {
    couponService.postCouponEdit(req, res, (data) => {
      req.flash('success_messages', data['message'])
      res.redirect('/admin/coupon/managePage')
    })
  }
}

module.exports = couponController