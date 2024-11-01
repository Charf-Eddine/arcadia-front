/*=================================================== Introduction =====================================================*/
var carousel = new bootstrap.Carousel('#carouselInterval', {
    interval: 3000,
    ride: 'carousel'
});
/*======================================================================================================================*/

/*======================================================= Services =====================================================*/
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
/*======================================================================================================================*/

/*====================================================== Habitats ======================================================*/
// Fonction pour appeler l'API et récupérer la liste des habitats
fetch(apiUrl + "/habitats")
.then(response => {
    if(response.ok){
        return response.json();
    }
    else{
        alert("Erreur lors de la récupération des habitats");
    }
})
.then(data => {
    displayHabitats(data);
})
.catch(error => console.error('Erreur lors de la récupération des habitats :', error));

// Fonction pour afficher les habitats dans le composant Grid cards de Bootstrap
function displayHabitats(habitats) {
    const habitatsContainer = document.getElementById('habitat-container');

    // Vider le contenu actuel du conteneur
    habitatsContainer.innerHTML = '';
    
    // Parcourir chaque habitat et créer une carte Bootstrap
    habitats.forEach(habitat => {
        const card = document.createElement('div');
        card.classList.add('col');
    
        // Sélectionne la première image de l'habitat ou une image par défaut si non disponible
        const imageUrl = habitat.images.length > 0 ? `${apiUrl}/uploads/${habitat.images[0].filename}` : 'default.jpg';
    
        card.innerHTML = `
        <div class="card h-100">
            <img src="${imageUrl}" class="card-img-top" alt="${habitat.name}">
            <div class="card-body">
            <h5 class="card-title">${habitat.name}</h5>
            <p class="card-text">${habitat.description}</p>
            </div>
        </div>
        `;
    
        habitatsContainer.appendChild(card);
    });
}
/*======================================================================================================================*/

/*======================================================= Animaux ======================================================*/
// Fonction pour appeler l'API et récupérer la liste des animaux
fetch(apiUrl + "/animals")
.then(response => {
    if(response.ok){
        return response.json();
    }
    else{
        alert("Erreur lors de la récupération des animaux");
    }
})
.then(data => {
    displayAnimals(data);
})
.catch(error => console.error('Erreur lors de la récupération des animaux :', error));

// Fonction pour afficher les animaux dans le composant Grid cards de Bootstrap
function displayAnimals(animals) {
    const animalsContainer = document.getElementById('animal-container');

    // Vider le contenu actuel du conteneur
    animalsContainer.innerHTML = '';
    
    // Parcourir chaque animal et créer une carte Bootstrap
    animals.forEach(animal => {
        const card = document.createElement('div');
        card.classList.add('col');
    
        // Sélectionne la première image de l'animal ou une image par défaut si non disponible
        const imageUrl = animal.images.length > 0 ? `${apiUrl}/uploads/${animal.images[0].filename}` : 'default.jpg';
    
        card.innerHTML = `
        <div class="card h-100">
            <img src="${imageUrl}" class="card-img-top" alt="${animal.name}">
            <div class="card-body">
            <h5 class="card-title">${animal.name}</h5>
            </div>
        </div>
        `;
    
        animalsContainer.appendChild(card);
    });
}
/*======================================================================================================================*/

/*================================================== Avis des visiteurs ================================================*/
// Fonction pour appeler l'API et récupérer la liste des avis
fetch(apiUrl + "/visitor-reviews/list/accepted")
.then(response => {
    if(response.ok){
        return response.json();
    }
    else{
        alert("Erreur lors de la récupération des avis");
    }
})
.then(data => {
    displayVisitorReviews(data);
})
.catch(error => console.error('Erreur lors de la récupération des avis :', error));

// Fonction pour afficher les avis
function displayVisitorReviews(visitorReviews) {
    const visitorReviewscontainer = document.getElementById('visitor-review-container');

    visitorReviews.forEach(review => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'col-md-4';
        reviewCard.innerHTML = `
            <div class="review-card">
                <div class="review-pseudo">
                    <i class="bi bi-person-circle"></i>
                    ${review.pseudo}
                </div>
                <div class="review-date">${formatDate(review.date)}</div>
                <div class="review-comment">${review.comment}</div>
            </div>
        `;
        visitorReviewscontainer.appendChild(reviewCard);
    });
}

function formatDate(isoDate) {
    const date = new Date(isoDate);
  
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
  
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
  
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function saveVisitorReview() {
    const pseudo = document.getElementById('pseudo').value;
    const comment = document.getElementById('comment').value;

    const visitorReview = { pseudo, comment };

    // Ajouter un avis
    fetch(`${apiUrl}/visitor-reviews`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(visitorReview)
    }).then(() => {
        document.getElementById('visitorReviewForm').reset();
        document.querySelector('[data-bs-dismiss="modal"]').click();
    });
}
/*======================================================================================================================*/