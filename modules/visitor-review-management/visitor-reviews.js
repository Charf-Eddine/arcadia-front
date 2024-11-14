const accessToken = getToken();
var visitorReviewsPerPage = 5; // Nombre d'avis par page
var currentPage = 1;
var visitorReviews = []; // Tableau pour stocker tous les avis
var currentVisitorReviewId = null;

// Récupérer la liste des avis au chargement de la page
fetchVisitorReviews();

// Fonction pour appeler l'API et récupérer la liste des avis
function fetchVisitorReviews() {
    fetch(`${apiUrl}/visitor-reviews`, {
        method: 'GET',
        headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
        }
    })
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
        renderVisitorReviews(currentPage);
        renderPagination();
    })
    .catch(error => console.error('Erreur lors de la récupération des avis :', error));
}

function renderVisitorReviews(page) {
    const visitorReviewTableBody = document.getElementById('visitorReviewTableBody');
    visitorReviewTableBody.innerHTML = ''; // Efface le tableau existant

    const start = (page - 1) * visitorReviewsPerPage;
    const end = start + visitorReviewsPerPage;
    const paginatedVisitorReviews = visitorReviews.slice(start, end); // Récupère les avis de la page courante

    paginatedVisitorReviews.forEach(visitorReview => {
        const isVisibleColumn = visitorReview.isVisible === true ? 
        `
        <td>
            <i class="bi bi-check-circle text-success"></i>
        </td>
        ` :
        `
        <td>
            <i class="bi bi-x-circle text-danger"></i>
        </td>
        `;

        const actionsColumn = visitorReview.isVisible === true ? 
        `
        <td>
            <button type="button" class="btn btn-danger btn-sm" onclick="rejectReview(${visitorReview.id})">Rejeter</button>
        </td>
        ` :
        `
        <td>
            <button type="button" class="btn btn-primary btn-sm" onclick="acceptReview(${visitorReview.id})">Accepter</button>
        </td>
        ` 

        const row = `
            <tr>
                <td>${formatDate(visitorReview.date)}</td>
                <td>${visitorReview.pseudo}</td>
                <td>${visitorReview.comment}</td>
                ${isVisibleColumn}
                ${actionsColumn}
            </tr>
        `;
        visitorReviewTableBody.insertAdjacentHTML('beforeend', row);
    });
}

function renderPagination() {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(visitorReviews.length / visitorReviewsPerPage);
    pagination.innerHTML = ''; // Efface la pagination existante

    for (let i = 1; i <= totalPages; i++) {
        const pageItem = `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage(${i}, event)">${i}</a>
            </li>
        `;
        pagination.insertAdjacentHTML('beforeend', pageItem);
    }
}

function changePage(page, event) {
    if (event) {
        event.preventDefault(); // Empêche le rechargement de la page
    }
    currentPage = page;
    renderVisitorReviews(currentPage); // Met à jour l'affichage des avis pour la nouvelle page
    renderPagination();
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

function acceptReview(id) {
    fetch(`${apiUrl}/visitor-reviews/accept-review/${id}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        } 
    }).then(() => {
        fetchVisitorReviews();
    });
}

function rejectReview(id) {
    fetch(`${apiUrl}/visitor-reviews/reject-review/${id}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        }
    }).then(() => {
        fetchVisitorReviews();
    });
}