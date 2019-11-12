const traceCodeService = require("../../../services/admin/traceCodeService")

const traceCodeController = {
  getTrackCodePage: (req, res) => {
    traceCodeService.getTrackCodePage(req, res, (data) => {
      return res.json(data)
    })
  },

  putGaTrackCode: (req, res) => {
    traceCodeService.putGaTrackCode(req, res, (data) => {
      return res.json(data)
    })
  }
}

module.exports = traceCodeController;