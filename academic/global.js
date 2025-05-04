var endpoint = 'https://utwgpa.com';
// var endpointv2 = 'http://localhost:3005';
var endpointv2 = 'https://uat-api.utwgpa.com';
var endpoint_img = '';
var bearbertoken = "21232f297a57a5a743894a0e4a801fc38251f1f40f8c3b8f5bed1667dae64de0";

const bearer = 'Bearer 6685214FSAFASddaF894a0e4a801fc38251f1f40f8c3b8f5bed1667dae64de0dasd';
var process = 'UAT';

if((window.location.href.indexOf("/uat") > -1) || (window.location.href.indexOf("localhost") > -1)) {
  endpoint = 'https://utwgpa.com/uat';
}

// if(process == 'UAT') {
//   endpoint = 'https://utwgpa.com/uat'
//   endpoint_img = 'http://localhost:3003/imgs/register/'
// }
// else if(process == 'PRD') {
//   endpoint = 'https://utwgpa.com'
//   endpoint_img = 'https://prd.api-holowtel.com/buffet/imgs/register/'
// }

MD5 = function (e) {
    function h(a, b) {
      var c, d, e, f, g;
      e = a & 2147483648;
      f = b & 2147483648;
      c = a & 1073741824;
      d = b & 1073741824;
      g = (a & 1073741823) + (b & 1073741823);
      return c & d
        ? g ^ 2147483648 ^ e ^ f
        : c | d
          ? g & 1073741824
            ? g ^ 3221225472 ^ e ^ f
            : g ^ 1073741824 ^ e ^ f
          : g ^ e ^ f;
    }

    function k(a, b, c, d, e, f, g) {
      a = h(a, h(h((b & c) | (~b & d), e), g));
      return h((a << f) | (a >>> (32 - f)), b);
    }

    function l(a, b, c, d, e, f, g) {
      a = h(a, h(h((b & d) | (c & ~d), e), g));
      return h((a << f) | (a >>> (32 - f)), b);
    }

    function m(a, b, d, c, e, f, g) {
      a = h(a, h(h(b ^ d ^ c, e), g));
      return h((a << f) | (a >>> (32 - f)), b);
    }

    function n(a, b, d, c, e, f, g) {
      a = h(a, h(h(d ^ (b | ~c), e), g));
      return h((a << f) | (a >>> (32 - f)), b);
    }

    function p(a) {
      var b = "",
        d = "",
        c;
      for (c = 0; 3 >= c; c++)
        (d = (a >>> (8 * c)) & 255),
          (d = "0" + d.toString(16)),
          (b += d.substr(d.length - 2, 2));
      return b;
    }
    var f = [],
      q,
      r,
      s,
      t,
      a,
      b,
      c,
      d;
    e = (function (a) {
      a = a.replace(/\r\n/g, "\n");
      for (var b = "", d = 0; d < a.length; d++) {
        var c = a.charCodeAt(d);
        128 > c
          ? (b += String.fromCharCode(c))
          : (127 < c && 2048 > c
            ? (b += String.fromCharCode((c >> 6) | 192))
            : ((b += String.fromCharCode((c >> 12) | 224)),
              (b += String.fromCharCode(((c >> 6) & 63) | 128))),
            (b += String.fromCharCode((c & 63) | 128)));
      }
      return b;
    })(e);
    f = (function (b) {
      var a,
        c = b.length;
      a = c + 8;
      for (
        var d = 16 * ((a - (a % 64)) / 64 + 1),
        e = Array(d - 1),
        f = 0,
        g = 0;
        g < c;

      )
        (a = (g - (g % 4)) / 4),
          (f = (g % 4) * 8),
          (e[a] |= b.charCodeAt(g) << f),
          g++;
      a = (g - (g % 4)) / 4;
      e[a] |= 128 << ((g % 4) * 8);
      e[d - 2] = c << 3;
      e[d - 1] = c >>> 29;
      return e;
    })(e);
    a = 1732584193;
    b = 4023233417;
    c = 2562383102;
    d = 271733878;
    for (e = 0; e < f.length; e += 16)
      (q = a),
        (r = b),
        (s = c),
        (t = d),
        (a = k(a, b, c, d, f[e + 0], 7, 3614090360)),
        (d = k(d, a, b, c, f[e + 1], 12, 3905402710)),
        (c = k(c, d, a, b, f[e + 2], 17, 606105819)),
        (b = k(b, c, d, a, f[e + 3], 22, 3250441966)),
        (a = k(a, b, c, d, f[e + 4], 7, 4118548399)),
        (d = k(d, a, b, c, f[e + 5], 12, 1200080426)),
        (c = k(c, d, a, b, f[e + 6], 17, 2821735955)),
        (b = k(b, c, d, a, f[e + 7], 22, 4249261313)),
        (a = k(a, b, c, d, f[e + 8], 7, 1770035416)),
        (d = k(d, a, b, c, f[e + 9], 12, 2336552879)),
        (c = k(c, d, a, b, f[e + 10], 17, 4294925233)),
        (b = k(b, c, d, a, f[e + 11], 22, 2304563134)),
        (a = k(a, b, c, d, f[e + 12], 7, 1804603682)),
        (d = k(d, a, b, c, f[e + 13], 12, 4254626195)),
        (c = k(c, d, a, b, f[e + 14], 17, 2792965006)),
        (b = k(b, c, d, a, f[e + 15], 22, 1236535329)),
        (a = l(a, b, c, d, f[e + 1], 5, 4129170786)),
        (d = l(d, a, b, c, f[e + 6], 9, 3225465664)),
        (c = l(c, d, a, b, f[e + 11], 14, 643717713)),
        (b = l(b, c, d, a, f[e + 0], 20, 3921069994)),
        (a = l(a, b, c, d, f[e + 5], 5, 3593408605)),
        (d = l(d, a, b, c, f[e + 10], 9, 38016083)),
        (c = l(c, d, a, b, f[e + 15], 14, 3634488961)),
        (b = l(b, c, d, a, f[e + 4], 20, 3889429448)),
        (a = l(a, b, c, d, f[e + 9], 5, 568446438)),
        (d = l(d, a, b, c, f[e + 14], 9, 3275163606)),
        (c = l(c, d, a, b, f[e + 3], 14, 4107603335)),
        (b = l(b, c, d, a, f[e + 8], 20, 1163531501)),
        (a = l(a, b, c, d, f[e + 13], 5, 2850285829)),
        (d = l(d, a, b, c, f[e + 2], 9, 4243563512)),
        (c = l(c, d, a, b, f[e + 7], 14, 1735328473)),
        (b = l(b, c, d, a, f[e + 12], 20, 2368359562)),
        (a = m(a, b, c, d, f[e + 5], 4, 4294588738)),
        (d = m(d, a, b, c, f[e + 8], 11, 2272392833)),
        (c = m(c, d, a, b, f[e + 11], 16, 1839030562)),
        (b = m(b, c, d, a, f[e + 14], 23, 4259657740)),
        (a = m(a, b, c, d, f[e + 1], 4, 2763975236)),
        (d = m(d, a, b, c, f[e + 4], 11, 1272893353)),
        (c = m(c, d, a, b, f[e + 7], 16, 4139469664)),
        (b = m(b, c, d, a, f[e + 10], 23, 3200236656)),
        (a = m(a, b, c, d, f[e + 13], 4, 681279174)),
        (d = m(d, a, b, c, f[e + 0], 11, 3936430074)),
        (c = m(c, d, a, b, f[e + 3], 16, 3572445317)),
        (b = m(b, c, d, a, f[e + 6], 23, 76029189)),
        (a = m(a, b, c, d, f[e + 9], 4, 3654602809)),
        (d = m(d, a, b, c, f[e + 12], 11, 3873151461)),
        (c = m(c, d, a, b, f[e + 15], 16, 530742520)),
        (b = m(b, c, d, a, f[e + 2], 23, 3299628645)),
        (a = n(a, b, c, d, f[e + 0], 6, 4096336452)),
        (d = n(d, a, b, c, f[e + 7], 10, 1126891415)),
        (c = n(c, d, a, b, f[e + 14], 15, 2878612391)),
        (b = n(b, c, d, a, f[e + 5], 21, 4237533241)),
        (a = n(a, b, c, d, f[e + 12], 6, 1700485571)),
        (d = n(d, a, b, c, f[e + 3], 10, 2399980690)),
        (c = n(c, d, a, b, f[e + 10], 15, 4293915773)),
        (b = n(b, c, d, a, f[e + 1], 21, 2240044497)),
        (a = n(a, b, c, d, f[e + 8], 6, 1873313359)),
        (d = n(d, a, b, c, f[e + 15], 10, 4264355552)),
        (c = n(c, d, a, b, f[e + 6], 15, 2734768916)),
        (b = n(b, c, d, a, f[e + 13], 21, 1309151649)),
        (a = n(a, b, c, d, f[e + 4], 6, 4149444226)),
        (d = n(d, a, b, c, f[e + 11], 10, 3174756917)),
        (c = n(c, d, a, b, f[e + 2], 15, 718787259)),
        (b = n(b, c, d, a, f[e + 9], 21, 3951481745)),
        (a = h(a, q)),
        (b = h(b, r)),
        (c = h(c, s)),
        (d = h(d, t));

    return (p(a) + p(b) + p(c) + p(d)).toLowerCase();
};
// onclick="activeSidebar(this)" href="./groupsara.html" 

var sidebar = '<p style="font-weight: bold; color: #fff;">เมนู</p>';
if(localStorage.bbtoken || true) {
    sidebar += `
    <a onclick="activeSidebar(this)" href="./dashboard.html" id="sidebar-dashboard" class="sidebar-items">
        <div class="sidebar-icon">
          <i class="bi bi-clipboard-data-fill"></i>
        </div>
        <p style="color: #fff;margin: 0;">Dashboard</p>
    </a>

    <a onclick="openSubmenu(this); activeSidebar(this);" id="sidebar-general" class="sidebar-items" >
        <div class="d-flex justify-content-between w-100">
          <div class="d-flex align-items-center">
            <div class="sidebar-icon">
            <i class="bi bi-file-earmark-spreadsheet-fill"></i>
            </div>
            <p style="color: #fff;margin: 0;">ข้อมูลพื้นฐาน</p>
          </div>
          <b class="text-white"><i class="bi bi-chevron-down"></i></b>
        </div>
    </a>
    <div id="sidebar-general-sub" class="sub-menu list-group" style="display: none;">
      <a  href="./generalstudent.html"  class="list-group-item list-group-item-action">ข้อมูลนักเรียน</a>
      <a  href="./generalteacher.html"  class="list-group-item list-group-item-action">ข้อมูลครู</a>
      <a  href="./generalgroupsara.html"  class="list-group-item list-group-item-action">ข้อมูลกลุ่มสาระการเรียนรู้</a>
      <a  href="./generalsubject.html"  class="list-group-item list-group-item-action">ข้อมูลรายวิชา</a>
      <a  href="./generalbuilding.html"  class="list-group-item list-group-item-action">ข้อมูลอาคาร</a>
      <a  href="./generalroom.html"  class="list-group-item list-group-item-action">ข้อมูลห้องเรียน</a>
    </div>

    <a onclick="openSubmenu(this); activeSidebar(this);" id="sidebar-register" class="sidebar-items" >
        <div class="d-flex justify-content-between w-100">
          <div class="d-flex align-items-center">
            <div class="sidebar-icon">
            <i class="bi bi-file-earmark-spreadsheet-fill"></i>
            </div>
            <p style="color: #fff;margin: 0;">ระบบรับสมัครนักเรียน</p>
          </div>
          <b class="text-white"><i class="bi bi-chevron-down"></i></b>
        </div>
    </a>
    <div id="sidebar-register-sub" class="sub-menu list-group" style="display: none;">
     <a  href="./register-dashboard.html"  class="list-group-item list-group-item-action">dashboard</a>
     <a  href="./register-m1.html"  class="list-group-item list-group-item-action">รายการสมัคร (ม.1)</a>
      <a  href="./registerstudent1.html"  class="list-group-item list-group-item-action">รอตรวจเอกสาร (ม.1)</a>
      <a  href="./registerstudentreject1.html"  class="list-group-item list-group-item-action">ส่งแก้เอกสาร (ม.1)</a>
      <a  href="./registerstudentunapprove1.html"  class="list-group-item list-group-item-action">ไม่อนุมัติ (ม.1)</a>
      
      <a  href="./register-m4.html"  class="list-group-item list-group-item-action">รายการสมัคร (ม.4)</a>
      <a  href="./registerstudent4.html"  class="list-group-item list-group-item-action">รอตรวจเอกสาร (ม.4)</a>
      <a  href="./registerstudentreject4.html"  class="list-group-item list-group-item-action">ส่งแก้เอกสาร (ม.4)</a>
      <a  href="./registerstudentunapprove4.html"  class="list-group-item list-group-item-action">ไม่อนุมัติ (ม.4)</a>
      
    </div>

    <a onclick="openSubmenu(this); activeSidebar(this);" id="sidebar-fixstudent" class="sidebar-items" >
        <div class="d-flex justify-content-between w-100">
          <div class="d-flex align-items-center">
            <div class="sidebar-icon">
              <i class="bi bi-person-circle"></i>
            </div>
            <p style="color: #fff;margin: 0;">ระบบแก้ตัวนักเรียน</p>
          </div>
          <b class="text-white"><i class="bi bi-chevron-down"></i></b>
        </div>
    </a>
    <div id="sidebar-fixstudent-sub" class="sub-menu list-group" style="display: none;">
      <a  href="./groupsara.html"  class="list-group-item list-group-item-action">รายงานข้อมูลปัจจุบัน</a>
    </div>


    <a onclick="openSubmenu(this); activeSidebar(this);" id="sidebar-repeatstudent" class="sidebar-items" >
        <div class="d-flex justify-content-between w-100">
          <div class="d-flex align-items-center">
            <div class="sidebar-icon">
              <i class="bi bi-person-circle"></i>
            </div>
            <p style="color: #fff;margin: 0;">ระบบลงทะเบียนเรียนซ้ำ</p>
          </div>
          <b class="text-white"><i class="bi bi-chevron-down"></i></b>
        </div>
    </a>
    <div id="sidebar-repeatstudent-sub" class="sub-menu list-group" style="display: none;">
      <a  href="./groupsara-repeat-student.html"  class="list-group-item list-group-item-action">รายชื่อนักเรียนลงทะเบียนเรียนซ้ำ</a>
      <a  href="./groupsara-repeat.html"  class="list-group-item list-group-item-action">รายงานข้อมูลปัจจุบัน</a>
      <a  href="./groupsara-repeat-admin-now-old.html"  class="list-group-item list-group-item-action">รายงานข้อมูลเก่า</a>
      <a  href="./groupsara-repeat-admin.html"  class="list-group-item list-group-item-action">ตรวจงานแทนและเปลี่ยนครู</a>
      <a  href="./groupsara-repeat-manual.html"  class="list-group-item list-group-item-action">จัดการข้อมูล (News)</a>
      <a  href="./groupsara-repeat-limit.html"  class="list-group-item list-group-item-action">นักเรียนดำเนินการเกินเวลา</a>
    </div>
    

    <a onclick="openSubmenu(this); activeSidebar(this);" id="sidebar-groupsara" class="sidebar-items" >
        <div class="d-flex justify-content-between w-100">
          <div class="d-flex align-items-center">
            <div class="sidebar-icon">
              <i class="bi bi-person-circle"></i>
            </div>
            <p style="color: #fff;margin: 0;">รายงาน</p>
          </div>
          <b class="text-white"><i class="bi bi-chevron-down"></i></b>
        </div>
    </a>
    <div id="sidebar-groupsara-sub" class="sub-menu list-group" style="display: none;">
      <a  href="./studentrepeat.html"  class="list-group-item list-group-item-action">รายงานลงทะเบียนเรียนซ้ำ</a>
      <a  href="./studentrepeat-success.html"  class="list-group-item list-group-item-action">รายงานลงทะเบียนเรียนซ้ำสำเร็จ</a>
      <a  href="./studentfixdone.html"  class="list-group-item list-group-item-action">รายงานนักเรียนแก้ตัวสำเร็จ</a>
      <a  href="./sormor1.html"  class="list-group-item list-group-item-action">รายงานห้องสอบการสมัคร</a>
      <a  href="./registerreportexport1.html"  class="list-group-item list-group-item-action">รายงานการสมัคร (ม.1)</a>
      <a  href="./registerreportexport4.html"  class="list-group-item list-group-item-action">รายงานการสมัคร (ม.4)</a>
    </div>

    <a onclick="openSubmenu(this); activeSidebar(this);" id="sidebar-setting" class="sidebar-items" >
        <div class="d-flex justify-content-between w-100">
          <div class="d-flex align-items-center">
            <div class="sidebar-icon">
            <i class="bi bi-gear-wide-connected"></i>
            </div>
            <p style="color: #fff;margin: 0;">ตั้งค่าระบบ</p>
          </div>
          <b class="text-white"><i class="bi bi-chevron-down"></i></b>
        </div>
    </a>
    <div id="sidebar-setting-sub" class="sub-menu list-group" style="display: none;">
      <a  href="./settingstudent.html"  class="list-group-item list-group-item-action">ระบบแก้ตัวนักเรียน</a>
      <a  href="./studentregister.html"  class="list-group-item list-group-item-action">ระบบรับสมัครนักเรียน</a>
      <a  href="./repeatregister.html"  class="list-group-item list-group-item-action">ระบบลงทะเบียนเรียนซ้ำ</a>
    </div>

    
    
    <a onclick="gotologout()"  id="sidebar-logout" class="sidebar-items">
        <div class="sidebar-icon">
          <i class="bi bi-box-arrow-right"></i>
        </div>
        <p style="color: #fff;margin: 0;">ออกจากระบบ</p>
    </a>
    
    
    `
}

$('#sidebar').html(sidebar).promise().done(() => {
    if(localStorage.bbsidebar) {
        $(".sidebar-items").removeClass('sidebar-items-active')
        $("#"+localStorage.bbsidebar).addClass('sidebar-items-active')
    }
})

var lastsub = '';
var lastop = true
function openSubmenu(elem) {
  if(lastsub == elem.id) {
    lastop = !lastop;
    if(lastop) {
      $(`#${elem.id}-sub`).slideDown()
    }
    else {
      $(`#${elem.id}-sub`).slideUp()
    }
  }else {
    lastop = true
    $('.sub-menu').slideUp()
    $(`#${elem.id}-sub`).slideDown()
    lastsub = elem.id;
  }
}

function activeSidebar(elem) {
    localStorage.setItem('bbsidebar', elem.id)
}

function toggleSidebar() {
  $('.overlaysidebar').show();
    $(".sidebar").css('display','block')
    setTimeout(() => {
        $(".sidebar").css({
            'transform':'translateX(0px)',
        })
    }, 100)
}

function keepSidebar() {
  $('.overlaysidebar').hide();

    $(".sidebar").css({
        'transform':'translateX(-500px)',
    })
    setTimeout(() => {
        $(".sidebar").css('display','none')
    }, 100)
}

$("#sidebartitle").html(`
<img src="../imgs/logomain.png" style="margin-right: 10px; width: 50px; object-fit: contain;">
<div>
    <h6 style="font-weight: bold; color: #fff; margin-bottom: 10px;">กลุ่มบริหารวิชาการ</h6>
    <p style="font-size: .8rem; color: #fff;margin-bottom: 0;">โรงเรียนอุทัยวิทยาคม</p>
</div>

`)


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
    location.replace('../index.html')
}


function errswal(msg) {
  Swal.fire({
    icon: 'error',
    title: 'มีบางอย่างผิดพลาด',
    text: msg
  })
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

function miltodate(mil) {
  mil = parseInt(mil)
  var d = new Date(mil);
  var dy = d.getFullYear();
  var dm = (d.getMonth()+1) < 10 ? '0'+(d.getMonth()+1) : (d.getMonth()+1);
  var dd = d.getDate() < 10 ? '0'+d.getDate() : d.getDate();

  var th = d.getHours() < 10 ? '0'+d.getHours() : d.getHours();
  var tm = d.getMinutes() < 10 ? '0'+d.getMinutes() : d.getMinutes();
  var ts = d.getSeconds() < 10 ? '0'+d.getSeconds() : d.getSeconds();
  return `${dy}-${dm}-${dd} ${th}:${tm}:${ts}`;
}

function numberWithCommas(x) {
  x = x.toString();
  var pattern = /(-?\d+)(\d{3})/;
  while (pattern.test(x))
      x = x.replace(pattern, "$1,$2");
  return x;
}

function loading(bool) {
  if(bool) {
      $("#loading").css('display', 'flex')
  } else {
    setTimeout(() => {
      $("#loading").css('display', 'none')
    }, 500)
  }
}

$('body').append(`
<div id="loading" style="z-index: 9999999; width: 100%; height: 100vh; position: fixed; top: 0;left:0;right:0;bottom:0;display:none;justify-content:center;align-items:center; background: rgba(0,0,0,0.3);">
  <div class="spinner-border text-primary" role="status">
    <span class="visually-hidden">Loading...</span>
  </div>
</div>
`)

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

function errswal() {
  Swal.fire({
      icon: 'error',
      title: 'System error 500'
  })
}

$.ajax({
  method: 'post',
  url: endpoint+ '/utw-cors-api/check-token-admin.php',
  data: {
      token: localStorage.utwAdminToken
  }, error: err => {
      // Swal.fire({
      //   icon: 'error',
      //   title: 'Token หมดอายุ'
      // }).then((res) => {
      //   if(res.isConfirmed) {
      //     localStorage.clear()
      //     window.location.href = '../'
      //   }
      //   else {
      //     localStorage.clear()
      //     window.location.href = '../logout.php'
      //   }
      // })
  }
})

var arr = [], date_text, new_date, flag=0;
function set_cal(ele) {
  // console.log("ele", $(ele).val())
  $( ele ).datepicker({
      onSelect:(date_text) => {
        // console.log("onSelect")
        arr=date_text.split("/");
        new_date=arr[0]+"/"+arr[1]+"/"+(parseInt(arr[2])+543).toString();
        $(ele).val(new_date);
        $(ele).css("color","");
      },
      beforeShow:() => {
        // console.log("beforeShow")
        if(new_date == '') {
          // console.log("null active");
          if($(ele).val()!="") {
            // console.log("beforeShow")
            arr=$(ele).val().split("/");
            new_date=arr[0]+"/"+arr[1]+"/"+(parseInt(arr[2])).toString();
            $(ele).val(new_date);
          }
        }
        else {
          // console.log("active");
          if($(ele).val()!="") {
            // console.log("beforeShow")
            arr=$(ele).val().split("/");
            new_date=arr[0]+"/"+arr[1]+"/"+(parseInt(arr[2])-543).toString();
            $(ele).val(new_date);
          }
        }
        $(ele).css("color","white");
      },
      onClose:() => {
          $(ele).css("color","");
          if($(ele).val()!="") {
            // console.log("onClose")
              arr=$(ele).val().split("/");
              if(parseInt(arr[2])<2500)
              {
                  new_date=arr[0]+"/"+arr[1]+"/"+(parseInt(arr[2])+543).toString();
                  $(ele).val(new_date);
              }
          }
      },
      dateFormat:"dd/mm/yy", //กำหนดรูปแบบวันที่เป็น วัน/เดือน/ปี
      changeMonth:true,//กำหนดให้เลือกเดือนได้
      changeYear:true,//กำหนดให้เลือกปีได้
      showOtherMonths:true,//กำหนดให้แสดงวันของเดือนก่อนหน้าได้
  });
  $(ele).val(new_date);
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
Date.prototype.addDays = function (days) {
  this.setDate(this.getDate() + parseInt(days));
  return this;
};