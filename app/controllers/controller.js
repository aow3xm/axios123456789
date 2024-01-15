/**
 * GET: lấy danh sách, lấy chi tiết
 * POST: tạo mới
 * PUT: cập nhật
 * DELETE: xoá
 */

// hiệu ứng loading: bật on 1 lần trước khi api chây, bật off 2 lần trong then và catch
function turnOnLoading() {
  document.getElementById("spinner").style.display = "block";
}

function turnOffLoading() {
  document.getElementById("spinner").style.display = "none";
}
function resetForm() {
  var listInput = document.querySelectorAll("input");
  for (var i = 0; i < listInput.length; i++) {
    listInput[i].value = "";
  }
}

var idEdited = null;

function renderProducts(productArray) {
  var contentHTML = "";
  for (var i = productArray.length - 1; i >= 0; i--) {
    var product = productArray[i];
    var trString = ` <tr>
                        <td>${product.id}</td>
                        <td>${product.name}</td>
                        <td>${product.price}</td>
                        <td>${product.img}</td>
                        <td>${product.desc}</td>
                        <td>

                        <button
                        onclick=deleteProduct(${product.id})

                        class="btn btn-danger">Delete</button>
                        <button
                        onclick=editProduct(${product.id})

                        class="btn btn-primary">Edit</button>
                        </td>
                    </tr>`;

    contentHTML = contentHTML + trString;
  }
  document.getElementById("tblDanhSachSP").innerHTML = contentHTML;
}
// gọi api lấy danh sách sản phẩm hiện có từ server
function fetchProductList() {
  turnOnLoading();
  axios({
    url: "https://6597f7bd668d248edf23d034.mockapi.io/product",
    method: "GET",
  })
    .then(function (res) {
      console.log("😀 - res", res.data);
      // gọi hàm renderProducts sau khi lấy data từ server
      renderProducts(res.data);
      turnOffLoading();
    })
    .catch(function (err) {
      console.log("😀 - err", err);
      turnOffLoading();
    });
}
fetchProductList();

//   xoá 1 sp từ server
function deleteProduct(id) {
  turnOnLoading();
  //   gọi api xoá sp
  axios({ url: `https://6597f7bd668d248edf23d034.mockapi.io/product/${id}`, method: "DELETE" })
    .then(function (res) {
      // xoá thành công , gọi lại api lấy dssp mới nhất từ server
      fetchProductList();
      console.log("😀 - res", res.data);
    })
    .catch(function (err) {
      turnOffLoading();
      // xoá thất bại
      console.log("😀 - err", err);
    });
}

// thêm 1 sp ( thêm trên server)

function createProduct() {
  turnOnLoading();

  // lấy data user nhập
  var tenSp = document.getElementById("TenSP").value;
  var giaSp = document.getElementById("GiaSP").value;
  var hinhSp = document.getElementById("HinhSP").value;
  var moTaSp = document.getElementById("MoTaSP").value;
  // tạo object mới có key trùng với schema trên server

  var sp = {
    name: tenSp,
    price: giaSp,
    img: hinhSp,
    desc: moTaSp,
  };
  console.log("😀 - createProduct - sp", sp);
  // Gọi api
  axios({
    url: "https://6597f7bd668d248edf23d034.mockapi.io/product",
    method: "POST",
    data: sp,
  })
    .then(function (res) {
      // render lại dssp sau khi thêm sp thành công
      fetchProductList();
      // tắt modal sau khi thêm thành công
      $("#myModal").modal("hide");
      resetForm();
    })
    .catch(function (err) {
      turnOffLoading();

      console.log("😀 - createProduct - err", err);
    });
}

// khi user click button edit ~ get by id  ~ lấy thông tin chi tiết của 1 sp dựa vào id

function editProduct(id) {

  idEdited = id;
  axios({ url: `https://6597f7bd668d248edf23d034.mockapi.io/product/${id}`, method: "GET" })
    .then(function (res) {
      console.log("😀 - res - lấy thông tin thành công", res.data);
      // hiển thị response lên layout
      $("#myModal").modal("show");
      var sp = res.data;
      document.getElementById("GiaSP").value = sp.price;
      document.getElementById("TenSP").value = sp.name;
      document.getElementById("HinhSP").value = sp.img;
      document.getElementById("MoTaSP").value = sp.desc;
    })
    .catch(function (err) {
      console.log("😀 - err", err);
    });
}

function updateProduct() {
  // lấy data user nhập
  var tenSp = document.getElementById("TenSP").value;
  var giaSp = document.getElementById("GiaSP").value;
  var hinhSp = document.getElementById("HinhSP").value;
  var moTaSp = document.getElementById("MoTaSP").value;
  // tạo object mới có key trùng với schema trên server

  var sp = {
    name: tenSp,
    price: giaSp,
    img: hinhSp,
    desc: moTaSp,
  };
  axios({
    url: `https://6597f7bd668d248edf23d034.mockapi.io/product/${idEdited}`,
    method: "PUT",
    data: sp,
  })
    .then(function (res) {
      // update thành công
      // tắt modal
      $("#myModal").modal("hide");
      // render ddsp
      fetchProductList();
    })
    .catch(function (err) {

    });
}

// axios()tcf
