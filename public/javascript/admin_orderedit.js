//orderData
const orderData = document.getElementById("orderData");
const orderStatus = document.getElementById("orderStatus");
const orderMemo = document.getElementById("orderMemo");
//orderer
// const ordererInfo = document.getElementById("ordererInfo");
// const ordererInfoDetail = document.getElementById("ordererInfoDetail");
//payment
const payment = document.getElementById("payment");
const paymentDetail = document.getElementById("paymentDetail");
const paymentStatus = document.getElementById("paymentStatus");
const paymentType = document.getElementById("paymentType");
//shipment
const shipment = document.getElementById("shipment");
const shipmentDetail = document.getElementById("shipmentDetail");
const shipmentStatus = document.getElementById("shipmentStatus");
const shipmentType = document.getElementById("shipmentType");
//==========================================
orderData.addEventListener("click", orderDataEdit);
// ordererInfo.addEventListener("click", ordererInfoEdit);
payment.addEventListener("click", paymentEdit);
shipment.addEventListener("click", shipmentEdit);

//-----------------------
let saveBtn =
  '<button id="save" type="submit" class="btn btn-sm btn-success ">儲存</button>';

function orderDataEdit() {
  let eventId = event.target.id;
  console.log(eventId);
  if (eventId === "edit") {
    orderData.querySelector("#edit").remove();
    orderData.innerHTML = saveBtn;
    orderStatus.classList.remove("d-none");
    orderMemo.removeAttribute("disabled");
    // orderData.querySelector("#edit").classList.add("d-none");
    // orderData.querySelector("#save").classList.remove("d-none");
  }
  // if (eventId === "save") {
  //   // orderData.querySelector("#edit").classList.remove("d-none");
  //   // orderData.querySelector("#save").classList.add("d-none");
  //   orderStatus.classList.add("d-none");
  //   orderMemo.setAttribute("disabled", "");
  // }
}

// function ordererInfoEdit() {
//   let eventId = event.target.id;
//   let allInput = ordererInfoDetail.querySelectorAll("input");
//   if (eventId === "edit") {
//     ordererInfo.querySelector("#edit").classList.add("d-none");
//     ordererInfo.querySelector("#save").classList.remove("d-none");
//     allInput.forEach(element => {
//       element.removeAttribute("disabled");
//     });
//   }
//   if (eventId === "save") {
//     ordererInfo.querySelector("#edit").classList.remove("d-none");
//     ordererInfo.querySelector("#save").classList.add("d-none");
//     allInput.forEach(element => {
//       element.setAttribute("disabled", "");
//     });
//   }
// }

function paymentEdit() {
  let eventId = event.target.id;
  if (eventId === "edit") {
    payment.querySelector("#edit").remove();
    payment.innerHTML = saveBtn;

    paymentStatus.classList.remove("d-none");
    paymentType.classList.remove("d-none");
  }
}

function shipmentEdit() {
  let eventId = event.target.id;
  let allInput = shipmentDetail.querySelectorAll("input");
  if (eventId === "edit") {
    shipment.querySelector("#edit").remove();
    shipment.innerHTML = saveBtn;
    shipmentStatus.classList.remove("d-none");
    shipmentType.classList.remove("d-none");
    allInput.forEach(item => {
      item.removeAttribute("disabled");
    });
  }
}
