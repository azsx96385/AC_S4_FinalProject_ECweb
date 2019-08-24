require("dotenv").config()

const URL = process.env.URL
const MerchantID = process.env.PICKUP_MERCHANT_ID
const PayGateWay = "https://logistics.ecpay.com.tw/Express/map"
const ReturnURL = URL + "/pickup/callback?from=ReturnURL"

const getPickupInfo = () => {

  data = {
    'MerchantID': MerchantID, // 商店代號
    'MerchantTradeNo': 'Ecpay' + Date.now(), // 商店交易編號
    'LogisticsType': 'CVS', // 超商取貨
    'LogisticsSubType': 'UNIMARTC2C', // 7-11 C2C
    'IsCollection': 'Y', // 代收貨款
    'ServerReplyURL': ReturnURL, // 取得超商店鋪代號返回商店網址
  }

  pickupInfo = {
    'MerchantID': MerchantID, // 商店代號
    'PayGateWay': PayGateWay,
    'MerchantTradeNo': data.MerchantTradeNo,
    'LogisticsType': data.LogisticsType,
    'LogisticsSubType': data.LogisticsSubType,
    'IsCollection': data.IsCollection,
    'ServerReplyURL': data.ServerReplyURL,
  }


  return pickupInfo
}

module.exports = getPickupInfo