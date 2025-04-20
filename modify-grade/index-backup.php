

<html>
 <head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>Login ระบบแก้ตัวนักเรียน</title>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
    <link rel="stylesheet" href="global.css">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.1.1/css/all.min.css" integrity="sha512-KfkfwYDsLkIlwQp6LFnl8zNdLGxu9YAA1QvwINks4PhcElQSvqcyVLLD9aMhXd13uQjoXtEKNosOWaZqXgel0g==" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <script src="https://code.jquery.com/jquery-3.6.0.js" integrity="sha256-H+K7U5CnXl1h5ywQfKtSj8PCmoN9aaq30gDh27Xc0jk=" crossorigin="anonymous"></script>
    <?php

//index.php

//Include Configuration File
include('config.php');

$login_button = '';

if(isset($_GET["code"]))
{
  // echo "11111";
 $token = $google_client->fetchAccessTokenWithAuthCode($_GET["code"]);


 if(!isset($token['error']))
 {
  // echo "2222";
 
  $google_client->setAccessToken($token['access_token']);

 
  $_SESSION['access_token'] = $token['access_token'];
  $oktoken = $token['access_token'];

 



  $google_service = new Google_Service_Oauth2($google_client);

 
  $data = $google_service->userinfo->get();
  // echo "3333";

  $accessToken = $_SESSION['access_token'];
  $firstname = '';
  $lastname = '';
  $email = '';
  $gender = '';
  $picture = '';
  if(!empty($data['given_name'])) {
    $firstname = $data['given_name'];
    // echo $firstname;
  }
  if(!empty($data['family_name'])) {
    $lastname = $data['family_name'];
  }
  if(!empty($data['email'])) {
    $email = $data['email'];
  }
  if(!empty($data['gender'])) {
    $gender = $data['gender'];
  }
  if(!empty($data['picture'])) {
    $picture = $data['picture'];
  }
 }
}


if(!isset($_SESSION['access_token']))
{
    $login_button = '<a href="'.$google_client->createAuthUrl().'" class="btnb btn-signin mt-5" data-onsuccess="onSignIn">
                        <img src="./imgs/googlelogo.png" style="width: 40px; object-fit: contain; margin-right: 15px;">
                        <span>เข้าสู่ระบบด้วย Google+</span>
                    </a>';
//  $login_button = '<a href="'.$google_client->createAuthUrl().'">Login With Google</a>';
}




?>

<style>
      @keyframes slidetothejail {
        0% {
          background-position: 0 50%;
        }
        50% {
          background-position: 100% 50%;
        }
        100% {
          background-position: 0% 50%;
        }
      }
      .main{
    width: 500px;
    height: 500px;
    background: transparent;
    position: relative;
}
.box1{
    width: 30px;
    height: 500px ;
    background: linear-gradient(to left,#f1c40f, #e74c3c, #e74c3c);
    background-size: 400%;
    transform: rotate(-30deg);
    position: absolute;
    top: 3%;
    right: 23%;
    border-radius: 25px;
    animation: col 10s ease-in-out  infinite;
}
.box2{
    width: 500px;
    height: 30px ;
    background: linear-gradient(to left,#f1c40f, #e74c3c, #e74c3c);
    background-size: 400%;
    transform: rotate(0deg);
    position: absolute;
    bottom: 3%;
    border-radius: 25px;
    animation: col 10s ease-in-out  infinite;
}
.box3{
    width: 500px;
    height: 30px ;
    background: linear-gradient(to left,#f1c40f, #e74c3c, #e74c3c);
    background-size: 400%;
    transform: rotate(-60deg);
    position: absolute;
    top: 50%;
    left: -23.5%;
    border-radius: 25px;
    animation: col 10s ease-in-out  infinite;
}
@keyframes col{
    0%{
        background-position: 0;
    }
    100%{
        background-position: 400%;
    }
}
@keyframes col2{
  0% {
      background-position: 0 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
}
.indexBG {
  z-index: 1; position: relative; width: 100%; height: 100vh; background-size: 400% !important; animation: slidetothejail 10s ease infinite; display: flex; flex-direction: column; justify-content: center; align-items: center; background: linear-gradient(-45deg, #e74c3c, #f1c40f, #e74c3c);
}
    </style>
    <?php
$endpointNew = $endpoint;

if(!isset($_SERVER['HTTPS'])) {
  $endpointNew = 'https://utwgpa.com/uat';
}

if(strpos($email,"@utw") > 0 ) {
  echo "
  <script>
    const endpointNew = '$endpointNew/utw-cors-api/check-mail.php';
    const email = '$email';

    console.log('email', email);
console.log('endpoint', endpointNew);

      const formData = new URLSearchParams();
    formData.append('_method', 'GET');
    formData.append('email', email);

    fetch(endpointNew, {
      method: 'POST',
      body: formData.toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': 'PHPSESSID=vd3hhkelv20pa3av99823ab1u2'
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log('Raw Response:', data);
      const statusCode = data.status.code;
      const oktoken = '$oktoken'; // ค่า $oktoken ที่ส่งมาจาก PHP
      const email = '$email'; // ค่า $email ที่ส่งมาจาก PHP
      const firstname = '$firstname'; // ค่า $firstname ที่ส่งมาจาก PHP
      const lastname = '$lastname'; // ค่า $lastname ที่ส่งมาจาก PHP
      const picture = '$picture'; // ค่า $picture ที่ส่งมาจาก PHP
        console.log('data data :', data.data);
      if(statusCode == 201) {
        window.location.href = './keeptoken.html?token=' + oktoken + '&email=' + email + '&fname=' + firstname + '&lname=' + lastname + '&kyc=signup&img=' + picture + '&userid=' + data.data.id + '&actk=' + oktoken;
    }
      else if(statusCode == 200) {
        const tokenlogin = data.data.access_token;
        window.location.href = './keeptoken.html?token=' + tokenlogin + '&email=' + email + '&kyc=signin&img=' + picture + '&userid=' + data.data.id + '&userno=' + data.data.user_no + '&tn=' + data.data.tname + '&fname=' + data.data.fname + '&lname=' + data.data.lname + '&actk=' + oktoken;
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
  </script>
  ";

  // print_r($obj);
  /*
  if($obj->status->code == 201) {
      header('location: ./keeptoken.html?token='.$oktoken.'&email='.$email.'&fname='.$firstname.'&lname='.$lastname.'&kyc=signup&img='.$picture.'&userid='.$obj->data->id.'&actk='.$oktoken);
  }
  else if($obj->status->code == 200) {
      $tokenlogin = $obj->data->access_token;
      header('location: ./keeptoken.html?token='.$tokenlogin.'&email='.$email.'&kyc=signin&img='.$picture.'&userid='.$obj->data->id.'&userno='.$obj->data->user_no.'&tn='.$obj->data->tname.'&fname='.$obj->data->fname.'&lname='.$obj->data->lname.'&actk='.$oktoken);
  }
  
  curl_close($curl);

  */
}
else if($email == '') {

}
else {
  echo '<p style="display: none;">somethingiswentwront</p>';
  $noti =  "<script>  Swal.fire({  icon: 'error',   title: 'โปรดใช้อีเมลโรงเรียนอุทัยวิทยาคม',  text: 'example@utw.ac.th' }).then((res) => {if(res.isConfirmed){window.location.href='logout.php'}}) </script>";
  echo $noti;
  $login_button = '<a href="'.$google_client->createAuthUrl().'" class="btnb btn-signin mt-5" data-onsuccess="onSignIn">
                      <img src="./imgs/googlelogo.png" style="width: 40px; object-fit: contain; margin-right: 15px;">
                      <span>เข้าสู่ระบบด้วย Google+</span>
                  </a>';
  session_destroy();
  $firstname = '';
  $lastname = '';
  $email = '';
  $gender = '';
  $picture = '';
  header('./logout.php');

}
?>
 </head>
 <body style="background: #F9F9F9; width: 100%; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center;">

      <section class=" indexBG" id="indexBG" style="">
    <!-- <section id="indexBG" style="z-index: 1; position: relative; width: 100%; height: 100vh; background-size: 400% !important; animation: slidetothejail 10s ease infinite; display: flex; flex-direction: column; justify-content: center; align-items: center; background: linear-gradient(-45deg, #e74c3c, #f1c40f, #e74c3c);"> -->
        <div class="card p-5" style=" border-radius: 20px; z-index: 3; display: flex; flex-direction: column; align-items: center;">
          <!-- <img src="https://media.discordapp.net/attachments/457119817376202765/939102543592714280/maxme.png" style="width: 300px; object-fit: contain; margin-bottom: 50px;"> -->
          <img src="./imgs/utw.gif" style="width: 100px; object-fit: contain; margin-bottom: 20px;">
          <h3 style="text-align: center;">เข้าสู่ระบบด้วยบัญชี Gmail ของโรงเรียนเท่านั้น</h3>
          <h6 style="text-align: center;">Sign in @utw.ac.th</h6>
          
          <?php
            if($login_button == '') {
                echo '<h3><a href="logout.php" class="btn btn-danger">Logout</a></h3>';
            }
            else {
                echo $login_button;
            }
        ?>
        </div>

        <div style="position: fixed; bottom: 100px; right: 50px; transform: rotate(45deg) scale(3); z-index: 2;">
          <div class="main">
            <div class="box1">
    
            </div>
            <div class="box2">
    
            </div>
            <div class="box3">
    
            </div>
          </div>
        </div>
    </section>

  
  </div>

    
  <script>

  </script>
 </body>
</html>

