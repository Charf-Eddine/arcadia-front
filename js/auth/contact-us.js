const emailInput = document.getElementById("emailInput");
const titleInput = document.getElementById("titleInput");
const messageTextarea = document.getElementById("messageTextarea");
const contactUsButton =  document.getElementById("contactUsButton");
contactUsButton.disabled = true;

emailInput.addEventListener("keyup", validateForm); 
titleInput.addEventListener("keyup", validateForm);
messageTextarea.addEventListener("keyup", validateForm); 

function validateForm(){
    const emailOk = validateEmail(emailInput);
    const titleOk = validateRequired(titleInput);
    const messageOk = validateRequired(messageTextarea);

    if (emailOk && titleOk && messageOk) {
        contactUsButton.disabled = false;
    }
    else {
        contactUsButton.disabled = true;
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