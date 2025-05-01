var endpoint = 'https://utwgpa.com'
var endpointv2 = "http://167.71.212.42:3005";
var sidebartitle = localStorage.selectSystem ? localStorage.selectSystem : 'ระบบแก้ตัวนักเรียน';

if((window.location.href.indexOf("/uat") > -1) || (window.location.href.indexOf("localhost") > -1)) {
  endpoint = 'https://utwgpa.com/uat';
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

Date.prototype.minusDays = function (days) {
  this.setDate(this.getDate() - parseInt(days));
  return this;
};
Date.prototype.addDays = function (days) {
  this.setDate(this.getDate() + parseInt(days));
  return this;
};
Date.prototype.minusHours = function (h) {
  this.setTime(this.getTime() - (h * 60 * 60 * 1000));
  return this;
};
Date.prototype.addHours = function (h) {
  this.setTime(this.getTime() + (h * 60 * 60 * 1000));
  return this;
};
Date.prototype.minusMinutes = function (h) {
  this.setTime(this.getTime() - (h * 60 * 1000));
  return this;
};
Date.prototype.addMinutes = function (h) {
  this.setTime(this.getTime() + (h * 60 * 1000));
  return this;
};

var arr = [], date_text, new_date, flag=0;
function set_cal(ele, aa, level) {
  var cal = 365*13;
  if(level) {
    cal = 365*16;
  }
  // console.log("ele", $(ele).val())
  $( ele ).datepicker({
      yearRange: "-100:+0",
      defaultDate: new Date().minusDays(cal),
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
