const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const signinButton =  document.getElementById("signinButton");
signinButton.disabled = true;

emailInput.addEventListener("keyup", validateForm); 
passwordInput.addEventListener("keyup", validateForm);

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