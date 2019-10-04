let ordererSearchBar = document.getElementById("orderer_search_bar");
let orderStatusNavBar = document.getElementById("orderstatus_navbar");
let paymentStatusNavBar = document.getElementById("paymentstatus_navbar");
let shipmentStatusNavBar = document.getElementById("shipmentstatus_navbar");

function displayFilter(btnType) {
  let filtersId = [
    "orderer_search_bar",
    "orderstatus_navbar",
    "paymentstatus_navbar",
    "shipmentstatus_navbar"
  ];
  if (btnType == "btn_orderer") {
    filtersId.splice(filtersId.indexOf("orderer_search_bar"), 1);
    document.getElementById("orderer_search_bar").classList.remove("d-none");
  } else if (btnType == "btn_orderstatus") {
    filtersId.splice(filtersId.indexOf("orderstatus_navbar"), 1);
    document.getElementById("orderstatus_navbar").classList.remove("d-none");
  } else if (btnType == "btn_paymentstatus") {
    filtersId.splice(filtersId.indexOf("paymentstatus_navbar"), 1);
    document.getElementById("paymentstatus_navbar").classList.remove("d-none");
  } else if (btnType == "btn_shipmentstatus") {
    filtersId.splice(filtersId.indexOf("shipmentstatus_navbar"), 1);
    document.getElementById("shipmentstatus_navbar").classList.remove("d-none");
  }
  //檢查剩餘的篩選器，class 有沒有 d-none
  filtersId.forEach(item => {
    let itemClassList = document.getElementById(item).classList;
    let itemClassArray = Object.values(itemClassList);
    if (!itemClassArray.includes("d-none")) {
      itemClassList.add("d-none");
    }
  });
}
