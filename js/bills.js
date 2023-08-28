$(document).ready(function () {
    login();
    logout(); 
    loadDataNavbar();
    loadData()
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
  function loadData() {
    if (localStorage.getItem("token") && localStorage.getItem("token")!=null){
        $.ajax({
            type: "GET",
            url: "https://students.trungthanhweb.com/api/bills",
            data: {
                apitoken: localStorage.getItem("token"),
            },
            dataType: "JSON",
            success: function (res) {
                if (res.check==true && res.bills.length>0){
                    var str="";
                    const bills = res.bills
                    bills.forEach(el => {
                        str+=`
                        <li class="billsList list-group-item list-group-item-action" style="cursor: pointer" data-id="`+el.id+`">`+el.tenKH+`<br>`+el.created_at+`</li>
                        `
                    });
                    $("#bills").html(str);
                    $("#bills").removeClass("hideclass");
                    billsdetail()
                }
                else {
                  window.location.replace("index.html")
                }
            }
        });
    }
    else {
      window.location.replace("index.html")
    }
  }
  //------------------------------------------------------------------------------------
  function billsdetail() {
    $(".billsList").click(function (e) { 
      e.preventDefault();
      $(".list-group-item").removeClass("active")
      $(this).addClass("active")
      var id = $(this).attr("data-id")
      $.ajax({
        type: "GET",
        url: "https://students.trungthanhweb.com/api/singlebill",
        data: {
          apitoken: localStorage.getItem("token"),
          id:id
        },
        dataType: "JSON",
        success: function (res) {
          const bills = res.result
          console.log(res);
          if (bills.length>0) {
            var str="";
            var sum = 0;
            bills.forEach((el,index) => {
              str+=`
              <tr>
                  <th scope="row">`+(index++)+`</th>
                  <td> <img style="height: 130px; padding: 3px" src="https://students.trungthanhweb.com/images/`+el.image+`" alt=""></td>
                  <td>`+el.productname+`</td>
                  <td>`+Intl.NumberFormat('en-US').format(el.price)+`</td>
                  <td>`+el.discount+`%</td>
                  <td>`+el.qty+`</td>
                  <td>`+Intl.NumberFormat('en-US').format(((el.price)*(el.qty))-((el.price)*(el.qty)*(el.discount)/100))+`</td>
                </tr>
              `
              sum += ((el.price)*(el.qty))-((el.price)*(el.qty)*(el.discount)/100);
            });
            str += `
            <tr style="font-weight: bold;font-size: 15px;">
            <td colspan="6" style="font-size: 20px; ;text-align: left; padding-left: 20px;">Final payment</td>
            <td colspan="1">`+ Intl.NumberFormat('en-US').format(sum) + `</td>
            `
            $("#billsDetailBody").html(str);
            $("#billsDetail").removeClass("hideclass");
          }
        }
      });
    });
  }