//商家基本資料 admin_Storeinfo

//變數區
let storeInfoForm = document.querySelector(".storeinfo_form");

//事件監聽
storeInfoForm.addEventListener("click", editStoreInfo);
//監聽動作
function editStoreInfo() {
  if (event.target.id == "storeinfo_edit") {
    let inputStoreName = document.querySelector("#storeName");
    let inputStoreDescription = document.querySelector("#storedescription");
    let btnEdit = document.querySelector("#storeinfo_edit");
    let brnSubmit = document.querySelector("#storeinfo_submit");
    //隱藏 edit btn - 顯示 submit btn
    btnEdit.classList.add("d-none");
    brnSubmit.classList.remove("d-none");
    //開放 name description 編輯
    inputStoreName.removeAttribute("disabled");
    inputStoreDescription.removeAttribute("disabled");
  }
}
