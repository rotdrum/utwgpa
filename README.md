<h1 align="center">SYSTEM WEBSITE UTW-GPA</h1>

# VERSION DOCUMENT
    - UTW-CORS-API
        PHP@7.4 =
    - UTW-MODIFY-GRADE-API
        PHP@7.4 =
    - UTW-REGISTER-API
        Node@18 >=
        Npm@8 >=
    - UTW-FILE-UPLOAD-API
        Node@18 >=
        Npm@8 >=
    - MODIFY-GRADE
        PHP@7.4 =
        COMPOSER@2.0 ^

# STEP CONNECTION DOCUMENT
    - UTW-CORS-API
        []
    - UTW-MODIFY-GRADE-API
        []
    - UTW-REGISTER-API
        change .env (AuthRepo) 
        npm i
        npm run start
    - UTW-FILE-UPLOAD-API
        change .env (AuthRepo) 
        npm i
        npm run start
    - MODIFY-GRADE
        composer install (run command)
        change Google_Client (config.php)

<p align="center">
    <img src="https://realbearpro.com/img/logo-full.png" width="100" />
    <br/>
    CC. REALBEAR PRODUCTION 
</p>


