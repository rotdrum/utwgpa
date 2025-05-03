var endpoint = 'https://utwgpa.com';
var endpointv2 = "https://uat-api.utwgpa.com";
// var endpointv2 = "http://localhost:3005";
var endpoint_img = '';
const bearer = 'Bearer 6685214FSAFASddaF894a0e4a801fc38251f1f40f8c3b8f5bed1667dae64de0dasd';

var process = 'UAT';

if((window.location.href.indexOf("/uat") > -1) || (window.location.href.indexOf("localhost") > -1)) {
  endpoint = 'https://utwgpa.com/uat';
}

function errswal(msg) {
  console.log('msg', msg);
  Swal.fire({
      icon: 'error',
      title: 'System error 500',
      text: msg ? msg : ''
  })
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