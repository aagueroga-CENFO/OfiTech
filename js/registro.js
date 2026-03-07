document.getElementById("registroForm").addEventListener("submit", function(event){

    event.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const apellido1 = document.getElementById("apellido1").value.trim();
    const apellido2 = document.getElementById("apellido2").value.trim();
    const direccion = document.getElementById("direccion").value.trim();
    const correo = document.getElementById("correo").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    const soloLetras = /^[A-Za-zÁÉÍÓÚáéíóúñÑ\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;

    // 1 Validar campos obligatorios
    if(!nombre || !apellido1 || !direccion || !correo || !password || !confirmPassword){
        alert("Todos los campos obligatorios deben completarse");
        return;
    }

    // 2 Validar nombres solo letras
    if(!soloLetras.test(nombre)){
        alert("El nombre solo puede contener letras");
        return;
    }

    if(!soloLetras.test(apellido1)){
        alert("El primer apellido solo puede contener letras");
        return;
    }

    if(apellido2 && !soloLetras.test(apellido2)){
        alert("El segundo apellido solo puede contener letras");
        return;
    }

    // 3 Validar longitud nombres
    if(nombre.length < 2){
        alert("El nombre debe tener al menos 2 caracteres");
        return;
    }

    // 4 Validar dirección
    if(direccion.length < 5 || direccion.length > 200){
    alert("La dirección debe tener entre 5 y 200 caracteres");
    return;
    }

    // 5 Validar correo
    if(!emailRegex.test(correo)){
        alert("Ingrese un correo electrónico válido");
        return;
    }

    // 6 Validar contraseña fuerte
    if(!passwordRegex.test(password)){
        alert("La contraseña debe tener mínimo 8 caracteres, incluyendo al menos una letra y un número");
        return;
    }

    // 7 Confirmar contraseña
    if(password !== confirmPassword){
        alert("Las contraseñas no coinciden");
        return;
    }

    alert("Cuenta creada correctamente");

    window.location.href = "index.html";

});