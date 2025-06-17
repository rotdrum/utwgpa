
var endpoint = 'https://utwgpa.com'
var endpointv2 = "https://prd-api.utwgpa.com";
// var endpointv2 = "http://localhost:3005";
var bearbertoken = "21232f297a57a5a743894a0e4a801fc38251f1f40f8c3b8f5bed1667dae64de0";
var sidebartitle = localStorage.selectSystem ? localStorage.selectSystem : 'ระบบแก้ตัวนักเรียน';


// if((window.location.href.indexOf("/uat") > -1) || (window.location.href.indexOf("localhost") > -1)) {
//     endpoint = 'https://utwgpa.com/uat'
// }
// if(!localStorage.utwToken) {
//     Swal.fire({
//         icon: 'error',
//         title: 'Token หมดอายุ',
//         timer: 2000
//     }).then(() => {
//         window.location.href = `http://localhost/utwgpa/modify-grade/index.php`
//     })
// }

var sidebar = '';
var fs = String(localStorage.utwEmail).substring(0,1);
if(
    String(localStorage.utwEmail).length == 16 && 
    isFinite(localStorage.utwEmail[1]) && 
    isFinite(localStorage.utwEmail[2]) && 
    isFinite(localStorage.utwEmail[3]) && 
    isFinite(localStorage.utwEmail[4]) && 
    isFinite(localStorage.utwEmail[5]) && 
    fs == 's'
) {
    sidebartitle = `ระบบแก้ตัวนักเรียนและ<br>ลงทะเบียนเรียนซ้ำ`;
    sidebar += `
    <p style="font-weight: bold; color: #fff;">นักเรียน</p>
    
    <a onclick="activeSidebar(this)" href="./index.html" id="sidebar1" class="sidebar-items">
        <div class="sidebar-icon">
            <i class="fas fa-house"></i>
        </div>
        <p style="color: #fff;">ลงทะเบียนแก้ตัวและ<br>ลงทะเบียนเรียนซ้ำ</p>
    </a>
    

    <div class="hr"></div>
    
    <a onclick="gotologout()" style="cursor: pointer;" id="sidebar7" class="sidebar-items ">
        <div class="sidebar-icon">
            <i class="fa-solid fa-right-from-bracket"></i>
        </div>
        <p style="color: #fff;">ออกจากระบบ</p>
    </a>
    `
}
else if(localStorage.utwEmail == '' || true) {
    
    sidebar += `
        <p style="font-weight: bold; color: #fff;">อาจารย์ประจำวิชา</p>
        
        <!-- <a onclick="activeSidebar(this)" href="./coursesubject.html" id="sidebar1" class="sidebar-items ">
            <div class="sidebar-icon">
                <i class="fas fa-house"></i>
            </div>
            <p style="color: #fff;">รายวิชา</p>
        </a> -->
        
        <a onclick="activeSidebar(this)" href="./courseregister.html" id="sidebar4" class="sidebar-items">
            <div class="sidebar-icon">
                <i class="fas fa-house"></i>
            </div>
            <p style="color: #fff;">รายการภาระงาน</p>
        </a>
        <a onclick="activeSidebar(this)" href="./coursestudent.html" id="sidebar2" class="killmenu-register sidebar-items">
            <div class="sidebar-icon">
                <i class="fas fa-house"></i>
            </div>
            <p style="color: #fff;">ลงทะเบียนแก้ตัวนักเรียน</p>
        </a>
        <a onclick="activeSidebar(this)" href="./coursefollow.html" id="sidebar3" class="killmenu-me sidebar-items">
            <div class="sidebar-icon">
                <i class="fas fa-house"></i>
            </div>
            <p style="color: #fff;">ติดตามผล</p>
        </a>
        <a onclick="activeSidebar(this)" href="./reportstudentfixdone.html" id="sidebar41" class="killmenu-me sidebar-items">
            <div class="sidebar-icon">
                <i class="fas fa-house"></i>
            </div>
            <p style="color: #fff;">ประวัติผลแก้ตัวสำเร็จ</p>
        </a>
        
        
        <div class="hr"></div>
        
        <p style="font-weight: bold; color: #fff;">อาจารย์ประจำชั้น</p>
       
        <a onclick="activeSidebar(this)" href="./courseunder.html" id="sidebar6" class="killmenu-class sidebar-items ">
            <div class="sidebar-icon">
                <i class="fas fa-house"></i>
            </div>
            <p style="color: #fff;">ติดตามผล</p>
        </a>
         <a onclick="activeSidebar(this)" href="./courseunder-success.html" id="sidebar61" class="killmenu-class sidebar-items ">
            <div class="sidebar-icon">
                <i class="fas fa-house"></i>
            </div>
            <p style="color: #fff;">ประวัติแก้ตัวสำเร็จ</p>
        </a>

        <div class="hr"></div>

        <p style="font-weight: bold; color: #fff;">รายงาน</p>
        <a onclick="activeSidebar(this)" href="./coursereport-success.html" id="sidebar10" class="sidebar-items ">
            <div class="sidebar-icon">
                <i class="fa-solid fa-print"></i>
            </div>
            <p style="color: #fff;">สำเร็จ</p>
        </a>
        <a onclick="activeSidebar(this)" href="./coursereport.html" id="sidebar9" class="sidebar-items ">
            <div class="sidebar-icon">
                <i class="fa-solid fa-eye"></i>
            </div>
            <p style="color: #fff;">ตรวจสอบ</p>
        </a>

        

        <div class="hr"></div>
        <a onclick="activeSidebar(this)" href="../../repeat-grade/dashboard/registeragain.html" id="sidebar9" class="sidebar-items ">
            <div class="sidebar-icon">
                <i class="fa-solid fa-shuffle"></i>
            </div>
            <p style="color: #fff;">ระบบลงทะเบียนเรียนซ้ำ</p>
        </a>
        <a onclick="gotologout()" style="cursor: pointer;" id="sidebar7" class="sidebar-items ">
            <div class="sidebar-icon">
                <i class="fa-solid fa-right-from-bracket"></i>
            </div>
            <p style="color: #fff;">ออกจากระบบ</p>
        </a>
        `
}
$('#sidebar').html(sidebar).promise().done(() => {
    if(localStorage.utw_sidebar) {
        $(".sidebar-items").removeClass('sidebar-items-active')
        $("#"+localStorage.utw_sidebar).addClass('sidebar-items-active')

        $.ajax({
            method: 'post',
            url: endpointv2 + '/utw-modify-api/course-getone',
            data: {
                _method: "GET",
                key_address: 'modify_grade_page_active',
            }, success: response => {
                console.log(response)
                if(response.status.code == 200) {
                    if(!response.data.in_data.page_teacher_register_grade) {
                        $('.killmenu-register').removeAttr('href').removeAttr('onclick').attr('onclick','onmaintain()').css('cursor', 'pointer')
                        $('.killmenu-register p').css('color',"#adadad")
                        $('.killmenu-register .sidebar-icon').css({
                            background: '#636363',
                            color: '#9d9d9d'
                        })
                    }
                    if(!response.data.in_data.page_teacher_me_follow) {
                        $('.killmenu-me').removeAttr('href').removeAttr('onclick').attr('onclick','onmaintain()').css('cursor', 'pointer')
                        $('.killmenu-me p').css('color',"#adadad")
                        $('.killmenu-me .sidebar-icon').css({
                            background: '#636363',
                            color: '#9d9d9d'
                        })
                    }
                    if(!response.data.in_data.page_teacher_class_follow) {
                        $('.killmenu-class').removeAttr('href').removeAttr('onclick').attr('onclick','onmaintain()').css('cursor', 'pointer')
                        $('.killmenu-class p').css('color',"#adadad")
                        $('.killmenu-class .sidebar-icon').css({
                            background: '#636363',
                            color: '#9d9d9d'
                        })
                    }
                    
                }
                else {
                    errswal()
                }
            }, error: err => {
                errswal()
                console.log(err)
            }
        })
    }
})

function onmaintain() {
    Swal.fire({
        icon: 'warning',
        title: 'ขออภัยในความไม่สะดวก',
        text: 'ไม่สามารถใช้งานเมนูนี้ได้ เนื่องจากอยู่นอกระยะเวลาทำรายการ'
    })
}

function activeSidebar(elem) {
    localStorage.setItem('utw_sidebar', elem.id)
}

var profile = ` <div class="content-profile-img">
                    <img src="${localStorage.utwImg}" alt="">
                </div>
                <p>${localStorage.utwFullname}</p>`;
$("#boxProfile").html(profile);

function toggleSidebar() {
    $(".sidebar").css('display','block')
    setTimeout(() => {
        $(".sidebar").css({
            'transform':'translateX(0px)',
        })
    }, 100)
}

function keepSidebar() {
    $(".sidebar").css({
        'transform':'translateX(-500px)',
    })
    setTimeout(() => {
        $(".sidebar").css('display','none')
    }, 100)
}

$("#sidebartitle").html(`
<img src="../imgs/utw.gif" style="margin-right: 10px; width: 50px; object-fit: contain;">
<div>
    <h6 style="font-weight: bold; color: #fff;">${sidebartitle}</h6>
    <p style="font-size: .8rem; color: #fff;">โรงเรียนอุทัยวิทยาคม</p>
</div>`)

var width = $(window).width();
$(window).on('resize', function() {
    if ($(this).width() !== width) {
        console.log(width)
      width = $(this).width();
      if(width >= 1200) {
        $('.sidebar').css('display', 'block')
        setTimeout(() => {
            $('.sidebar').css('transform', 'translateX(0px)')
        }, 100)
      } else {
        $('.sidebar').css('display', 'block')
        setTimeout(() => {
            $('.sidebar').css({'transform':'translateX(-500px)'})
        }, 100)
          $('.sidebar').css({'display':'none'})
      }
    }
});

function gotologout() {
    localStorage.clear();
    sessionStorage.clear(); 
    location.replace('../logout.html')
}


function errswal(msg) {
    msg = msg ? msg : 'มีบางอย่างผิดพลาด'
    Swal.fire({
        icon: 'error',
        title: msg,
    })
}

function dateengtodatethai(date) {
    if(date) {
      var d = String(date).split('-')
      date = `${d[2]}/${d[1]}/${parseInt(d[0])+543}`
      return date;
    }
    else {
      return 'invalid format'
    }
}

function loading(bool) {
    if(bool) {
        $("#loading").css('display', 'flex')
    } else {
        $("#loading").css('display', 'none')
    }
}
  
$('body').append(`
  <div id="loading" style="z-index: 9999999; width: 100%; height: 100vh; position: fixed; top: 0;left:0;right:0;bottom:0;display:none;justify-content:center;align-items:center; background: rgba(0,0,0,0.3);">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
`)

function close_modal() {
    $('.modal').hide()
    $("html").css('overflow','scroll')
}

function getDateNow() {
    var d = new Date();
    var dy = d.getFullYear();
    var dm = (d.getMonth()+1) < 10 ? '0'+(d.getMonth()+1) : (d.getMonth()+1);
    var dd = d.getDate() < 10 ? '0'+d.getDate() : d.getDate();
  
    var th = d.getHours() < 10 ? '0'+d.getHours() : d.getHours();
    var tm = d.getMinutes() < 10 ? '0'+d.getMinutes() : d.getMinutes();
    var ts = d.getSeconds() < 10 ? '0'+d.getSeconds() : d.getSeconds();
    return `${dy}-${dm}-${dd} ${th}:${tm}:${ts}`;
}
function getDateMil(mil) {
    var d = new Date(mil)
    var dy = d.getFullYear();
    var dm = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
    var dd = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
  
    var th = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
    var tm = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
    var ts = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
    return `${dy}-${dm}-${dd} ${th}:${tm}:${ts}`;
}

if(!localStorage.utwAccessToken) {
    localStorage.clear()
    window.location.href = '../logout.html'
}

function openmd(mid) {
    $(mid).css('display','flex')
    $("html").css('overflow','hidden')
}


function dateentoth(date) {
    var d = String(date).split('-')
    var dd = d[2];
    var dm = d[1];
    var dy = parseInt(d[0]) + 543;
    return `${dd}/${dm}/${dy}`;
}
function datethtoen(date) {
    var d = String(date).split('/')
    //  08/02/2566
    var dd = d[0];
    var dm = d[1];
    var dy = parseInt(d[2]) - 543;
    return `${dy}-${dm}-${dd}`;
}