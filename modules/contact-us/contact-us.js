const emailInput = document.getElementById("emailInput");
const titleInput = document.getElementById("titleInput");
const messageTextarea = document.getElementById("messageTextarea");
const contactUsButton =  document.getElementById("contactUsButton");
const contactUsForm =  document.getElementById("contactUsForm");

emailInput.addEventListener("keyup", validateForm); 
titleInput.addEventListener("keyup", validateForm);
messageTextarea.addEventListener("keyup", validateForm); 
contactUsButton.addEventListener("click", contactUs); 

contactUsButton.disabled = true;

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

function contactUs() {
    // Crée un nouvel objet FormData à partir du formulaire contenu dans la variable "formInscription"
    let dataForm = new FormData(contactUsForm);

    // Crée un nouvel objet Headers pour définir les en-têtes de la requête HTTP
    let myHeaders = new Headers();
    // Ajoute l'en-tête "Content-Type" avec la valeur "application/json"
    myHeaders.append("Content-Type", "application/json");

    // Convertit les données du formulaire en une chaîne JSON
    let raw = JSON.stringify({
        "email": dataForm.get("email"),
        "subject": dataForm.get("title"),
        "message": dataForm.get("message")
    });

    // Configure les options de la requête HTTP
    let requestOptions = {
        // Méthode de la requête : "POST" pour envoyer des données au serveur
        method: 'POST',
        // Définit les en-têtes de la requête en utilisant l'objet Headers créé précédemment
        headers: myHeaders,
        // Corps de la requête : les données JSON converties en chaîne
        body: raw,
        // Redirection à suivre en cas de besoin ("follow" suit automatiquement les redirections)
        redirect: 'follow'
    };
    
    fetch(apiUrl + "/mailing/contact-us", requestOptions)
      .then((response) => {
        if(response.ok){
            // Afficher un toast de succès
            showToast('success', 'Mail envoyé avec succès');

            // Réinitialiser les champs seulement après un envoi réussi
            emailInput.value = "";
            titleInput.value = "";
            messageTextarea.value = "";

            return true;
        }
        else{
            // Afficher un toast d'erreur
            showToast('danger', "Erreur d'envoi de mail");
        }
      })
      .catch((error) => {
        console.error(error);
        showToast('danger', "Erreur de connexion au serveur");
      }); 
}