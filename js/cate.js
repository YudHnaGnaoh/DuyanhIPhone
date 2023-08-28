$(document).ready(function () {
    login(); logout(); loadDataNavbar(); getData(); searchProduct();
});
///------------------------------------------------------------------------------------
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
                          <li><a class="dropdown-item" href="cate.html?id=`+ el.id + `">` + el.name + `</a></li>
                          `
                    });
                    $("#cateUL").html(str);
                }
            }
        })
    }
}
//------------------------------------------------------------------------------------
$(".clearBtn").click(function (e) { 
    e.preventDefault();
    window.location.reload()
});
//------------------------------------------------------------------------------------
function getData() {
    const params = new URLSearchParams(window.location.search);
    if (!params.has("id")) {
        window.location.replace("index.html")
    }
    var id = params.get("id");
    var page = 1;
    if (params.has("page")) {
        page = params.get("page")
    }
    $.ajax({
        type: "GET",
        url: "https://students.trungthanhweb.com/api/getCateProducts",
        data: {
            apitoken: localStorage.getItem("token"),
            id: id,
            page: page
        },
        dataType: "JSON",
        success: function (res) {
            if (res.check == true) {
                const categrories = res.categrories;
                const products = res.products.data;
                if (categrories.length > 0) {
                    var str = ""
                    products.forEach(el => {
                        str += `
                        <div class="col-md-4 mb-3">
                            <div class="card">
                            <img
                                src="https://students.trungthanhweb.com/images/`+ el.image + `"
                                class="card-img-top"
                                alt="..."
                            />
                            <div class="card-body">
                                <h5 class="card-title text-primary">`+ el.name + `</h5>
                                <p class="card-text">
                                Giá: `+ Intl.NumberFormat('en-US').format(el.price) + `
                                <p>Loại sản phẩm: `+ el.catename + `</p>
                                <p>Thương hiệu: `+ el.brandname + `</p>
                                </p>
                                <a href="detail.html?id=`+ el.id + `" class="btn btn-primary" data-id=` + el.id + `>Chi tiết</a>
                                <a class="btn btn-success addToCartBtn" data-id=`+ el.id + `>Thêm</a>
                            </div>
                            </div>
                        </div>
                        `
                        $("#resultProduct").html(str)
                        
                        addToCart()
                        var lastpage = res.products.last_page;
                        var str2 = "";
                        var i = 1;
                        while (i <= lastpage) {
                            if (i == res.products.current_page) {
                                str2+= `
                                    <li class="page-item active"><a class="page-link" href="cate.html?id=`+ id + `&page=` + i + `">` + i + `</a></li>
                                    `
                            }
                            else {
                                str2+= `
                                    <li class="page-item"><a class="page-link" href="cate.html?id=`+ id + `&page=`+i+`">`+i+`</a></li>
                                    `
                            }
                            i++;
                            
                        }$("#pagination").html(str2)
                        $("#searchPriceBtn").click(function (e) { 
                            e.preventDefault();
                            searchPrice(id);
                        });
                    });
                }
            }
        }
    });
}
//------------------------------------------------------------------------------------
function searchPrice(id){
    var minPrice = $("#fromPrice").val();
    var maxPrice = $("#toPrice").val();
    var option = ""
    if(minPrice!=""&&maxPrice!=""){
        option = "pricebetween";
    }
    else if(minPrice==""&&maxPrice!=""){
        option = "maxprice";
    }
    else if(minPrice!=""&&maxPrice==""){
        option = "minprice";
    }
    switch (option) {
        case "pricebetween":
            $.ajax({
                type: "GET",
                url: "https://students.trungthanhweb.com/api/searchCatePrice",
                data: {
                    apitoken: localStorage.getItem("token"),
                    price1:minPrice,
                    price2:maxPrice,
                    id:id,
                },
                dataType: "JSON",
                success: function (res) {
                    if (res.check==true)
                    var str="";
                    res.products.forEach(el => {
                        str+=`
                        <div class="col-md-4 mb-3">
                            <div class="card">
                            <img
                                src="https://students.trungthanhweb.com/images/`+ el.image + `"
                                class="card-img-top"
                                alt="..."
                            />
                            <div class="card-body">
                                <h5 class="card-title text-primary">`+ el.name + `</h5>
                                <p class="card-text">
                                Giá: `+ Intl.NumberFormat('en-US').format(el.price) + `
                                <p>Loại sản phẩm: `+ el.catename + `</p>
                                <p>Thương hiệu: `+ el.brandname + `</p>
                                </p>
                                <a href="detail.html?id=`+ el.id + `" class="btn btn-primary" data-id=` + el.id + `>Chi tiết</a>
                                <a href="#" class="btn btn-success addToCartBtn" data-id=`+ el.id + `>Thêm</a>
                            </div>
                            </div>
                        </div>
                        `
                        $("#resultProduct").html(str)
                        $("#pagination").hide();
                        addToCart()
                        
                    });
                }
            });
        break;
        case "maxprice":
            $.ajax({
                type: "GET",
                url: "https://students.trungthanhweb.com/api/searchCatePrice",
                data: {
                    apitoken: localStorage.getItem("token"),
                    price2:maxPrice,
                    id:id,
                },
                dataType: "JSON",
                success: function (res) {
                    if (res.check==true)
                    var str="";
                    res.products.forEach(el => {
                        str+=`
                        <div class="col-md-4 mb-3">
                            <div class="card">
                            <img
                                src="https://students.trungthanhweb.com/images/`+ el.image + `"
                                class="card-img-top"
                                alt="..."
                            />
                            <div class="card-body">
                                <h5 class="card-title text-primary">`+ el.name + `</h5>
                                <p class="card-text">
                                Giá: `+ Intl.NumberFormat('en-US').format(el.price) + `
                                <p>Loại sản phẩm: `+ el.catename + `</p>
                                <p>Thương hiệu: `+ el.brandname + `</p>
                                </p>
                                <a href="detail.html?id=`+ el.id + `" class="btn btn-primary" data-id=` + el.id + `>Chi tiết</a>
                                <a href="#" class="btn btn-success addToCartBtn" data-id=`+ el.id + `>Thêm</a>
                            </div>
                            </div>
                        </div>
                        `
                        $("#resultProduct").html(str)
                        $("#pagination").hide();
                        addToCart()
                    });
                }
            });
        break;
        case "minprice":
            $.ajax({
                type: "GET",
                url: "https://students.trungthanhweb.com/api/searchCatePrice",
                data: {
                    apitoken: localStorage.getItem("token"),
                    price1:minPrice,
                    id:id,
                },
                dataType: "JSON",
                success: function (res) {
                    if (res.check==true)
                    var str="";
                    res.products.forEach(el => {
                        str+=`
                        <div class="col-md-4 mb-3">
                            <div class="card">
                            <img
                                src="https://students.trungthanhweb.com/images/`+ el.image + `"
                                class="card-img-top"
                                alt="..."
                            />
                            <div class="card-body">
                                <h5 class="card-title text-primary">`+ el.name + `</h5>
                                <p class="card-text">
                                Giá: `+ Intl.NumberFormat('en-US').format(el.price) + `
                                <p>Loại sản phẩm: `+ el.catename + `</p>
                                <p>Thương hiệu: `+ el.brandname + `</p>
                                </p>
                                <a href="detail.html?id=`+ el.id + `" class="btn btn-primary" data-id=` + el.id + `>Chi tiết</a>
                                <a href="#" class="btn btn-success addToCartBtn" data-id=`+ el.id + `>Thêm</a>
                            </div>
                            </div>
                        </div>
                        `
                        $("#resultProduct").html(str)
                        $("#pagination").hide();
                        addToCart()
                    });
                }
            });
        break;
    }
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
//------------------------------------------------------------------------------------
function searchProduct() {
    $("#searchProduct").keyup(function (e) {
      e.preventDefault();
      var name = $("#searchProduct").val().trim();
      console.log(name);
      if (name != null) {
        $.ajax({
          type: "GET",
          url: "https://students.trungthanhweb.com/api/getSearchProducts",
          data: {
            apitoken:localStorage.getItem("token"),
            name:name
          },
          dataType: "JSON",
          success: function (res) {
            if (res.check==true){
              if (res.result.length>0) {
                var str = ""
                res.result.forEach(el => {
                str += `
                <div class="col-md-4 mb-3">
                <div class="card">
                <img
                    src="https://students.trungthanhweb.com/images/`+ el.image + `"
                    class="card-img-top"
                    alt="..."
                />
                <div class="card-body">
                    <h5 class="card-title text-primary">`+ el.name + `</h5>
                    <p class="card-text">
                    Giá: `+ Intl.NumberFormat('en-US').format(el.price) + `
                    <p>Loại sản phẩm: `+ el.catename + `</p>
                    <p>Thương hiệu: `+ el.brandname + `</p>
                    </p>
                    <a href="detail.html?id=`+ el.id + `" class="btn btn-primary" data-id=` + el.id + `>Chi tiết</a>
                    <a class="btn btn-success addToCartBtn" data-id=`+ el.id + `>Thêm</a>
                </div>
                </div>
            </div>
            `
              })
              $("#resultProduct").html(str)
              $("#pagination").hide()
              addToCart()
              }
            }
          }
        });
      } 
    });
  }
