$(document).ready(function () {
  login();
  logout(); loadDataNavbar();
  getData();
});

function login() {
  $("#loginBtn").click(function (e) {
    e.preventDefault();
    $("#loginModal").modal("show");
    $("#submitloginBtn").click(function (e) {
      e.preventDefault();
      var emailaddress = $("#email").val().trim();
      if (emailaddress == '') {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1700,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
        })

        Toast.fire({
          icon: 'warning',
          title: 'Type something',
        });
      }
      else (
        $.ajax({
          type: "post",
          url: "https://students.trungthanhweb.com/api/checkLoginhtml",
          data: {
            email: emailaddress
          },
          dataType: "JSON",
          success: function (res) {
            if (res.check == true) {
              console.log(res.apitoken);
              localStorage.setItem("token", res.apitoken);
              const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1700,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer)
                  toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
              })

              Toast.fire({
                icon: 'success',
                title: 'Signed in successfully'
              }).then(() => {
                window.location.reload();
              });
            }
            else {
              const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 1700,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener('mouseenter', Swal.stopTimer)
                  toast.addEventListener('mouseleave', Swal.resumeTimer)
                }
              })

              Toast.fire({
                icon: 'error',
                title: 'Email not exist'
              })
            }
          }
        })
      )
    });
  })
}
//------------------------------------------------------------------------------------
function logout() {
  $("#logoutBtn").click(function (e) {
    e.preventDefault();
    if (localStorage.getItem("token") && localStorage.getItem("token") != null) {
      localStorage.removeItem("token")
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1700,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener('mouseenter', Swal.stopTimer)
          toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
      })

      Toast.fire({
        icon: 'success',
        title: 'Logout successfully'
      }).then(() => {
        window.location.reload();
      })
    }
  });
}
//------------------------------------------------------------------------------------
function getData() {
  const params = new URLSearchParams(window.location.search)
  if (params.has("id")) {
    var id = params.get("id");
  }
  else {
    window.location.replace("index.html")
  }

  $.ajax({
    type: "GET",
    url: "https://students.trungthanhweb.com/api/single",
    data: {
      apitoken: localStorage.getItem("token"),
      id: id,
    },
    dataType: "JSON",
    success: function (res) {
      const gallery = res.gallery;
      var str = ""
      gallery.forEach(el => {
        str += `
        <div class="item"><img class="pointer sliderimage" src="`+ el + `" alt=""></div>
        `
        $("#owl").append(str);
        str = "";
      });
      const products = res.products[0];
      var imageURL = "https://students.trungthanhweb.com/images/"
      var image = imageURL + products.images;
      $("#productimage").attr("src", image);
      const name = products.name;
      const discount = products.discount;
      //(discounted) price = price - (discount*price)
      //or price = price * (100-discount) %
      const price = Intl.NumberFormat('en-US').format(products.price * (100 - discount) / 100);
      const catename = products.catename;
      const brandname = products.brandname;
      $("#productname").text(name);
      $("#discount").text(discount);
      $("#price").text(price);
      $("#catename").text(catename);
      $("#brandname").text(brandname);
      var addToCartBtn=`
        <button class="btn-success w-100 addToCartBtn" data-id="`+products.id+`" style="height: 40px;">Thêm vào cart</button>
        `
        $(".shoppingBtn").html(addToCartBtn);
      
      //----------------------------------content left--------------------------------
      const content = products.content
      $("#content").html(content);
      $("#xemThemBtn").click(function (e) { 
        e.preventDefault();
        $("#content").toggleClass("hideContent", "showContent");
        $("#xemThemBtn").hide();
      });
      //----------------------------------content right--------------------------------
      const cateproduct = res.cateproducts;
      const brandproducts = res.brandproducts;
      var str = ""
      brandproducts.forEach(el => {
        str += `
        <div class="item">
            <div class="card w-100">
              <img src="`+ (imageURL + el.image) + `" class="card-img-top" alt="..."/>
              <div class="card-body">
                <h5 class="card-title text-primary">`+ el.name + `</h5>
                <p class="card-text">
                  Giá: `+ Intl.NumberFormat('en-US').format(el.price) + `
                  <p>Loại sản phẩm: `+ el.catename + `</p>
                  <p>Thương hiệu: `+ el.brandname + `</p>
                </p>
                <a href="detail.html?id=`+ el.id + `" class="btn btn-primary" data-id=` + el.id + `>Chi tiết</a>
              </div>
            </div>
          </div>
        `
        $("#sameBrandProducts").append(str);
        str = "";
      });
      var str = ""
      cateproduct.forEach(el => {
        str += `
        <div class="item">
            <div class="card w-100">
              <img src="`+ (imageURL + el.image) + `" class="card-img-top w-100" alt="..."/>
              <div class="card-body">
                <h5 class="card-title text-primary">`+ el.name + `</h5>
                <p class="card-text">
                  Giá: `+ Intl.NumberFormat('en-US').format(el.price) + `
                  <p>Loại sản phẩm: `+ el.catename + `</p>
                  <p>Thương hiệu: `+ el.brandname + `</p>
                </p>
                <a href="detail.html?id=`+ el.id + `" class="btn btn-primary" data-id=` + el.id + `>Chi tiết</a>
              </div>
            </div>
          </div>
        `
        $("#sameCateProducts").append(str);
        str = "";

      })
      owl(); clickimage(); 
      addToCart();
  }});
}
//-------------------------------------------------------------------------------
function clickimage() {
  $(".sliderimage").click(function (e) {
    e.preventDefault();
    var src = $(this).attr("src")
    $("#productimage").attr("src", src);
  });
}
//------------------------------------------------------------------------------------
function loadDataNavbar() {
  $("#logoutBtn").hide();
  if (localStorage.getItem("token") && localStorage.getItem("token") != null) {
    $("#logoutBtn").show();
    $("#loginBtn").hide()
    $.ajax({
      type: "GET",
      url: "https://students.trungthanhweb.com/api/home",
      data: {
        apitoken: localStorage.getItem("token"),
      },
      dataType: "JSON",
      success: function (res) {
        const brands = res.brands;
        const categrories = res.categrories;
        if (brands.length > 0) {
          var str = ""
          brands.forEach(el => {
            str += `
                        <li><a class="dropdown-item" href="brand.html?id=`+ el.id + `">`+ el.name + `</a></li>
                        `
          });
          $("#brandUL").html(str);
        }
        if (categrories.length > 0) {
          var str = ""
          categrories.forEach(el => {
            str += `
                        <li><a class="dropdown-item" href="cate.html?id=`+ el.id + `">`+ el.name + `</a></li>
                        `
          });
          $("#cateUL").html(str);
        }
      }
    })
  }
}
//------------------------------------------------------------------------------------
function owl() {
    $('#owl').owlCarousel({
    loop: true,
    margin: 10,
    nav: true,
    responsive: {
      0: {
        items: 2.5
      },
      600: {
        items: 4.5
      },
      1000: {
        items: 4.5
      }
    }
  })
  $('#sameBrandProducts').owlCarousel({
    loop: true,
    margin: 10,
    nav: true,
    responsive: {//pixel màn hình áp dụng cho các thiết bị xem
      0: {
        items: 2.5
      },
      600: {
        items: 2.5
      },
      1000: {
        items: 2.5
      }
    }
  })
  $('#sameCateProducts').owlCarousel({
    loop: true,
    margin: 10,
    nav: true,
    responsive: {//pixel màn hình áp dụng cho các thiết bị xem
      0: {
        items: 2.5
      },
      600: {
        items: 2.5
      },
      1000: {
        items: 2.5
      }
    }
  })
}
//------------------------------------------------------------------------------------
function addToCart() {
  if (!localStorage.getItem("cart") || localStorage.getItem("cart") == null) {
      var arr = [];
  }
  else {
      var cart = localStorage.getItem("cart")
      var arr = JSON.parse(cart)
  }
  $(".addToCartBtn").click(function (e) {
      e.preventDefault();
      var id = Number($(this).attr("data-id"));
      console.log(id);
      var qty = 1;
      var item = [id, qty];
      var check = 0;
      arr.forEach(el => {
          if (el[0] == id) {
              el[1]++;
              check = 1;
          }
      });
      if (check == 0) {
          arr.push(item)

      }
      localStorage.setItem("cart", JSON.stringify(arr))
      const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 1700,
          timerProgressBar: true,
          didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer)
              toast.addEventListener('mouseleave', Swal.resumeTimer)
          }
      })

      Toast.fire({
          icon: 'success',
          title: 'Added to Cart'
      })
  });
}