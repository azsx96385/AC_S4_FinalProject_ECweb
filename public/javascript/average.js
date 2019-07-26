const average = (value) => {
  let reducePlus = value.reduce((prev, curr) => {
    return prev + curr.rating
  }, 0);

  ave = (reducePlus / value.length).toFixed(1)
  return Number(ave)
}

module.exports = average