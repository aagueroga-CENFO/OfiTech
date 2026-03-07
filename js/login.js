document.getElementById("loginForm").addEventListener("submit", function(event){

    event.preventDefault();

    let correo = document.getElementById("correo").value.trim();
    let password = document.getElementById("password").value.trim();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 1 Validar campos vacíos
    if(!correo || !password){
        alert("Debe ingresar correo y contraseña");
        return;
    }

    // 2 Validar formato de correo
    if(!emailRegex.test(correo)){
        alert("Ingrese un correo electrónico válido");
        return;
    }

    alert("Inicio de sesión exitoso");

    window.location.href = "index.html";

});