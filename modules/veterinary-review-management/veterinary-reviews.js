var veterinaryReviewsPerPage = 5; // Nombre d'avis par page
var currentPage = 1;
var veterinaryReviews = []; // Tableau pour stocker tous les avis
var currentVeterinaryReviewId = null;

const accessToken = getToken();
const role = getRole();
var userProfile = null;

// Récupérer la liste des avis au chargement de la page
fetchVeterinaryReviews();

// Fonction pour appeler l'API et récupérer la liste des avis
function fetchVeterinaryReviews() {
    fetch(`${apiUrl}/veterinary-reviews/find-by-user`, {
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
        veterinaryReviews = data;
        renderVeterinaryReviews(currentPage);
        renderPagination();
    })
    .catch(error => console.error('Erreur lors de la récupération des avis :', error));
}

function renderVeterinaryReviews(page) {
    const veterinaryReviewTableBody = document.getElementById('veterinaryReviewTableBody');
    veterinaryReviewTableBody.innerHTML = ''; // Efface le tableau existant

    const start = (page - 1) * veterinaryReviewsPerPage;
    const end = start + veterinaryReviewsPerPage;
    const paginatedVeterinaryReviews = veterinaryReviews.slice(start, end); // Récupère les avis de la page courante

    paginatedVeterinaryReviews.forEach(veterinaryReview => {
        const row = `
            <tr>
                <td>${formatDate(veterinaryReview.date)}</td>
                <td>${veterinaryReview.habitat.name}</td>
                <td>${veterinaryReview.comment}</td>
                <td>
                    <button type="button" class="btn btn-danger btn-sm" onclick="confirmDelete(${veterinaryReview.id})" data-bs-toggle="modal" data-bs-target="#deleteVeterinaryReviewModal">Supprimer</button>
                </td>
            </tr>
        `;
        veterinaryReviewTableBody.insertAdjacentHTML('beforeend', row);
    });
}

function renderPagination() {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(veterinaryReviews.length / veterinaryReviewsPerPage);
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
    renderVeterinaryReviews(currentPage); // Met à jour l'affichage des avis pour la nouvelle page
    renderPagination();
}

async function loadUserProfile() {
    try {
        const response = await fetch(`${apiUrl}/auth/profile`, {
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        userProfile = await response.json();
    } catch (error) {
        console.error('Erreur lors du chargement du profil de l\'utilisateur:', error);
        throw error;
    }
}

async function loadHabitats() {
    try {
        const response = await fetch(`${apiUrl}/habitats`, {
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
            }
        });
        const habitats = await response.json();
        const habitatSelect = document.getElementById('habitatId');
        habitatSelect.innerHTML = '<option value="" disabled selected>Sélectionner l\'habitat</option>';
        
        habitats.forEach(habitat => {
            const option = document.createElement('option');
            option.value = habitat.id;
            option.textContent = habitat.name;
            habitatSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des habitats:', error);
    }
}

function clearModal() {
    document.getElementById('veterinaryReviewModalLabel').innerText = 'Ajouter un avis';
    document.getElementById('habitatId').value = '';
    document.getElementById('comment').value = '';
    currentVeterinaryReviewId = null;
}

function saveVeterinaryReview() {
    const date = new Date();
    const habitatId = parseInt(document.getElementById('habitatId').value, 10);
    const comment = document.getElementById('comment').value;
    const userId = userProfile.sub;

    const veterinaryReview = { date, habitatId, comment, userId };

    // Ajouter un avis
    fetch(`${apiUrl}/veterinary-reviews`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(veterinaryReview)
    }).then(() => {
        fetchVeterinaryReviews();
        document.getElementById('veterinaryReviewForm').reset();
        document.querySelector('[data-bs-dismiss="modal"]').click();
    });
}

function confirmDelete(veterinaryReviewId) {
    currentVeterinaryReviewId = veterinaryReviewId;
}

function deleteVeterinaryReview() {
    fetch(`${apiUrl}/veterinary-reviews/${currentVeterinaryReviewId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
    }).then(() => {
        fetchVeterinaryReviews();

        // Fermer explicitement le modal en utilisant l'API Bootstrap
        const deleteVeterinaryReviewModalElement = document.getElementById('deleteVeterinaryReviewModal');
        const modalInstance = bootstrap.Modal.getInstance(deleteVeterinaryReviewModalElement);
        modalInstance.hide();
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