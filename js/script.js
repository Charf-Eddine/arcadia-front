const tokenCookieName = "accessToken";
const roleCookieName = "role";
const apiUrl = "http://localhost:3001";

const signoutButton =  document.getElementById("signoutButton");
signoutButton.addEventListener("click", signout);

function getRole() {
    return getCookie(roleCookieName);
}

function signout(){
    eraseCookie(tokenCookieName);
    window.location.replace("/");
}

function setToken(token){
    setCookie(tokenCookieName, token, 7);
}

function getToken(){
    return getCookie(tokenCookieName);
}

function setCookie(name,value,days) {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days*24*60*60*1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(const element of ca) {
        let c = element;
        while (c.startsWith(' ')) c = c.substring(1,c.length);
        if (c.startsWith(nameEQ)) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function isConnected(){
    if(getToken() == null || getToken == undefined){
        return false;
    }
    else{
        return true;
    }
}

function showAndHideElementsForRoles() {
    const userConnected = isConnected();
    const role = getRole();

    let allElementsToEdit = document.querySelectorAll('[data-show]')

    allElementsToEdit.forEach(element => {
        switch(element.dataset.show) {
            case 'disconnected':
                if (userConnected) {
                    element.classList.add("d-none");
                }
                break;
            case 'connected':
                if (!userConnected) {
                    element.classList.add("d-none");
                }
                break;
            case 'admin':
                if (!userConnected || role != "admin") {
                    element.classList.add("d-none");
                }
                break;                
            case 'employee':
                if (!userConnected || role != "employee") {
                    element.classList.add("d-none");
                }
                break;   
            case 'veterinarian':
                if (!userConnected || role != "veterinarian") {
                    element.classList.add("d-none");
                }
                break;
        }
    })
}