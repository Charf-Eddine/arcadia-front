// Fonction pour appeler l'API et récupérer la liste des services
fetch(apiUrl + "/services")
.then(response => {
    if(response.ok){
        return response.json();
    }
    else{
        alert("Erreur lors de la récupération des services");
    }
})
.then(data => {
    displayServices(data);
})
.catch(error => console.error('Erreur lors de la récupération des services :', error));

// Fonction pour afficher les services dans le composant Accordion de Bootstrap
function displayServices(services) {
    const accordionContainer = document.getElementById('servicesAccordion');

    services.forEach((service, index) => {
        const accordionItem = `
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse${index}" aria-expanded="false" aria-controls="panelsStayOpen-collapse${index}">
                ${service.name}
            </button>
          </h2>
          <div id="panelsStayOpen-collapse${index}" class="accordion-collapse collapse">
            <div class="accordion-body">
                ${service.description}
            </div>
          </div>
        </div>
        `;
        accordionContainer.innerHTML += accordionItem;
    });
}