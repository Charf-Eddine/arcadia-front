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
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapse${index}" aria-expanded="true" aria-controls="panelsStayOpen-collapse${index}">
                <i class="bi bi-info-circle me-2"></i>
                ${service.name}
            </button>
          </h2>
          <div id="panelsStayOpen-collapse${index}" class="accordion-collapse collapse show">
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

// Fonction pour afficher les habitats dans le carousel de Bootstrap
function displayHabitats(habitats) {
    const habitatsContainer = document.getElementById('habitat-container');
    habitatsContainer.innerHTML = '';

    // Séparer les cartes en groupes de 4 pour chaque "slide"
    const slides = [];
    for (let i = 0; i < habitats.length; i += 4) {
        const slideGroup = habitats.slice(i, i + 4);
        slides.push(slideGroup);
    }

    // Ajouter chaque groupe de cartes comme une "slide" dans le carousel
    slides.forEach((slideGroup, index) => {
        const slide = document.createElement('div');
        slide.classList.add('carousel-item');
        if (index === 0) slide.classList.add('active'); // Première slide active par défaut

        const row = document.createElement('div');
        row.classList.add('row', 'row-cols-1', 'row-cols-md-4', 'g-4', 'grid-cards');

        slideGroup.forEach(habitat => {
            const card = document.createElement('div');
            card.classList.add('col');

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

            // Redirection vers la page de détail lors du clic
            card.addEventListener('click', () => {
                window.location.href = `/habitat/${habitat.id}`;
            });

            row.appendChild(card);
        });

        slide.appendChild(row);
        habitatsContainer.appendChild(slide);
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

// Fonction pour afficher les animaux dans le carousel de Bootstrap
function displayAnimals(animals) {
    const animalsContainer = document.getElementById('animal-container');
    animalsContainer.innerHTML = '';

    // Séparer les cartes en groupes de 4 pour chaque "slide"
    const slides = [];
    for (let i = 0; i < animals.length; i += 4) {
        const slideGroup = animals.slice(i, i + 4);
        slides.push(slideGroup);
    }

    // Ajouter chaque groupe de cartes comme une "slide" dans le carousel
    slides.forEach((slideGroup, index) => {
        const slide = document.createElement('div');
        slide.classList.add('carousel-item');
        if (index === 0) slide.classList.add('active'); // Première slide active par défaut

        const row = document.createElement('div');
        row.classList.add('row', 'row-cols-1', 'row-cols-md-4', 'g-4', 'grid-cards');

        slideGroup.forEach(animal => {
            const card = document.createElement('div');
            card.classList.add('col');

            const imageUrl = animal.images.length > 0 ? `${apiUrl}/uploads/${animal.images[0].filename}` : 'default.jpg';

            card.innerHTML = `
            <div class="card h-100">
                <img src="${imageUrl}" class="card-img-top" alt="${animal.name}">
                <div class="card-body">
                    <h5 class="card-title">${animal.name}</h5>
                </div>
            </div>
            `;

            // Redirection vers la page de détail lors du clic
            card.addEventListener('click', () => {
                window.location.href = `/animal/${animal.id}`;
            });

            row.appendChild(card);
        });

        slide.appendChild(row);
        animalsContainer.appendChild(slide);
    });
}
/*======================================================================================================================*/

/*================================================== Avis des visiteurs ================================================*/
var currentPage = 1;
var resultsPerPage = 6;
var visitorReviews = [];

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
    visitorReviews = data;
    if (visitorReviews && visitorReviews.length > 0) {
        displayVisitorReviews();        
    }
    else {
        document.getElementById('visitor-reviews').classList.add('d-none');
    }
})
.catch(error => console.error('Erreur lors de la récupération des avis :', error));

// Fonction pour afficher les avis
function displayVisitorReviews() {
    const visitorReviewsContainer = document.getElementById('visitor-reviews-container');

    visitorReviewsContainer.innerHTML = '';
    const totalPages = Math.ceil(visitorReviews.length / resultsPerPage);

    const start = (currentPage - 1) * resultsPerPage;
    const end = start + resultsPerPage;
    const reviewsToDisplay = visitorReviews.slice(start, end);    

    reviewsToDisplay.forEach(review => {
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
        visitorReviewsContainer.appendChild(reviewCard);
    });

    updatePagination(totalPages);
}

function updatePagination(totalPages) {
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = ''; 

    for (let i = 1; i <= totalPages; i++) {
        const pageItem = `
        <li class="page-item ${i === currentPage ? 'active' : ''}">
            <a class="page-link" href="#" onclick="changePage(${i}, event)">${i}</a>
        </li>
        `;
        paginationContainer.insertAdjacentHTML('beforeend', pageItem);
    }
}

function changePage(page, event) {
    event.preventDefault();
    currentPage = page;
    displayVisitorReviews(visitorReviews);
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

function scrollToHash() {
    if (window.location.hash) {
        const targetElement = document.querySelector(window.location.hash);
        if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
        }
    }
}

// Exécute immédiatement après le chargement
scrollToHash();

// Réessaie après un léger délai si le premier essai échoue
setTimeout(scrollToHash, 100);