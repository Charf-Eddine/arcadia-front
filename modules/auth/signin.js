const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const signinButton =  document.getElementById("signinButton");
const signinForm =  document.getElementById("signinForm");

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
    let dataForm = new FormData(signinForm);
    
    let myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    let raw = JSON.stringify({
        "username": dataForm.get("email"),
        "password": dataForm.get("password")
    });

    let requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(apiUrl + "/auth/login", requestOptions)
    .then(response => {
        if(response.ok){
            return response.json();
        }
        else{
            mailInput.classList.add("is-invalid");
            passwordInput.classList.add("is-invalid");
        }
    })
    .then(result => {
        const token = result.accessToken;
        setToken(token);
        //placer ce token en cookie

        setCookie(roleCookieName, result.role, 7);
        window.location.replace("/");
    })
    .catch(error => {
        // Afficher un toast d'erreur
        showToast('danger', "Email ou mot de passe incorrect");
    });
}

const togglePassword = document.querySelector('.toggle-password');

togglePassword.addEventListener('click', function () {
    // Vérifie le type actuel de l'input
    const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordInput.setAttribute('type', type);
    
    // Change l'icône en fonction de l'état
    this.classList.toggle('bi-eye'); // Ajoute l'icône "oeil"
    this.classList.toggle('bi-eye-slash'); // Enlève l'icône "oeil barré"
});