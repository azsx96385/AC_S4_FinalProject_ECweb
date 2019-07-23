const moment = require("moment");
const getStarts = require('../public/javascript/getStars')

module.exports = {
  ifCond: function (a, b, options) {
    if (a === b) {
      return options.fn(this);
    }
    return options.inverse(this);
  },
  moment: function (a) {
    return moment(a).format("YYYY-MM-DD");
  },
  moment_hr_min: function (a) {
    return moment(a).format("DD-HH-MM");
  },
  star: function (startsNum) {
    const yellowNum = Math.floor(startsNum)
    const grayNum = Math.floor(5 - startsNum)
    const decimalNum = (startsNum - yellowNum).toFixed(1)
    return getStarts(yellowNum, decimalNum, grayNum)
  }
};
