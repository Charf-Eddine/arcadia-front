const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const signinButton =  document.getElementById("signinButton");

emailInput.addEventListener("keyup", validateForm);
passwordInput.addEventListener("keyup", validateForm);
signinButton.addEventListener("click", checkCredentials);

signinButton.disabled = true;

function validateForm(){
    const emailOk = validateEmail(emailInput);
    const passwordOk = validateRequired(passwordInput);

    if (emailOk && passwordOk) {
        signinButton.disabled = false;
    }
    else {
        signinButton.disabled = true;
    }
}

function validateRequired(input){
    if(input.value != ''){
        input.classList.add("is-valid");
        input.classList.remove("is-invalid"); 
        return true;
    }
    else{
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false;
    }
}

function validateEmail(input){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const email = input.value;
    if(email.match(emailRegex)){
        input.classList.add("is-valid");
        input.classList.remove("is-invalid"); 
        return true;
    }
    else{
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false;
    }
}

function checkCredentials(){
    //Ici, il faudra appeler l'API pour vérifier les credentials en BDD
    
    if(emailInput.value == "test@mail.com" && passwordInput.value == "123"){
        //Il faudra récupérer le vrai token
        const token = "lkjsdngfljsqdnglkjsdbglkjqskjgkfjgbqslkfdgbskldfgdfgsdgf";
        setToken(token);
        //placer ce token en cookie

        setCookie("role", "admin", 7);
        window.location.replace("/");
    }
    else{
        emailInput.classList.add("is-invalid");
        passwordInput.classList.add("is-invalid");
    }
}