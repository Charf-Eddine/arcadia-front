var dailyFeedsPerPage = 5; // Nombre de rapport par page
var currentPage = 1;
var dailyFeeds = []; // Tableau pour stocker tous les rapports
var currentDailyFeedId = null;

const accessToken = getToken();
const role = getRole();
var userProfile = null;

// Récupérer la liste des rapports au chargement de la page
fetchDailyFeeds();

// Fonction pour appeler l'API et récupérer la liste des rapports
function fetchDailyFeeds() {
    fetch(`${apiUrl}/daily-feeds`, {
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
            alert("Erreur lors de la récupération des rapports");
        }
    })
    .then(data => {
        dailyFeeds = data;
        renderDailyFeeds(currentPage);
        renderPagination();
    })
    .catch(error => console.error('Erreur lors de la récupération des rapports :', error));
}

function renderDailyFeeds(page) {
    const dailyFeedTableBody = document.getElementById('dailyFeedTableBody');
    dailyFeedTableBody.innerHTML = ''; // Efface le tableau existant

    const start = (page - 1) * dailyFeedsPerPage;
    const end = start + dailyFeedsPerPage;
    const paginatedDailyFeeds = dailyFeeds.slice(start, end); // Récupère les rapports de la page courante

    paginatedDailyFeeds.forEach(dailyFeed => {
        const row = `
            <tr>
                <td>${formatDate(dailyFeed.passageDate)}</td>
                <td>${dailyFeed.animal.name}</td>
                <td>${dailyFeed.food}</td>
                <td>${dailyFeed.foodWeight}</td>
                <td>${dailyFeed.user.firstname} ${dailyFeed.user.lastname}</td>
                <td>
                    <button type="button" class="btn btn-primary btn-sm" onclick="editDailyFeed(${dailyFeed.id})" data-bs-toggle="modal" data-bs-target="#dailyFeedModal">Éditer</button>
                    <button type="button" class="btn btn-danger btn-sm" onclick="confirmDelete(${dailyFeed.id})" data-bs-toggle="modal" data-bs-target="#deleteDailyFeedModal">Supprimer</button>
                </td>
            </tr>
        `;
        dailyFeedTableBody.insertAdjacentHTML('beforeend', row);
    });
}

function renderPagination() {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(dailyFeeds.length / dailyFeedsPerPage);
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
    renderDailyFeeds(currentPage); // Met à jour l'affichage des rapports pour la nouvelle page
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
        document.getElementById('userId').value = userProfile.sub;
        document.getElementById('user').value = userProfile.user.firstname + " " + userProfile.user.lastname;
    } catch (error) {
        console.error('Erreur lors du chargement du profil de l\'utilisateur:', error);
        throw error;
    }
}

async function loadAnimals() {
    try {
        const response = await fetch(`${apiUrl}/animals`, {
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
            }
        });
        const animals = await response.json();
        const animalSelect = document.getElementById('animalId');
        animalSelect.innerHTML = '<option value="" disabled selected>Sélectionner l\'animal</option>';
        
        animals.forEach(animal => {
            const option = document.createElement('option');
            option.value = animal.id;
            option.textContent = animal.name;
            animalSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des animaux:', error);
    }
}

function clearModal() {
    document.getElementById('dailyFeedModalLabel').innerText = 'Saisir l\'alimentation quotidienne';
    document.getElementById('animalId').value = '';
    document.getElementById('food').value = '';
    document.getElementById('foodWeight').value = '';
    
    // Date et heure actuelles en heure locale
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');

    // Format pour le champ `datetime-local`
    const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

    // Affectation de la date et heure courantes au champ `passageDate`
    document.getElementById('passageDate').value = formattedDateTime;

    currentDailyFeedId = null;
}

async function editDailyFeed(dailyFeedId) {
    await loadAnimals();
    fetch(`${apiUrl}/daily-feeds/${dailyFeedId}`, {
        method: 'GET',
        headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(dailyFeed => {
      document.getElementById('dailyFeedModalLabel').innerText = "Éditer l\'alimentation quotidienne";
      document.getElementById('animalId').value = dailyFeed.animal.id;
      document.getElementById('food').value = dailyFeed.food;
      document.getElementById('foodWeight').value = dailyFeed.foodWeight;
      document.getElementById('userId').value = dailyFeed.user.id;
      document.getElementById('user').value = dailyFeed.user.firstname + " " + dailyFeed.user.lastname;

      user = dailyFeed.user;

      // Date et heure actuelles en heure locale
      const now = new Date(dailyFeed.passageDate);
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');

      // Format pour le champ `datetime-local`
      const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

      // Affectation de la date et heure courantes au champ `passageDate`
      document.getElementById('passageDate').value = formattedDateTime;

      currentDailyFeedId = dailyFeed.id;
    });
}

function saveDailyFeed() {
    const passageDate = document.getElementById('passageDate').value;
    const animalId = parseInt(document.getElementById('animalId').value, 10);
    const food = document.getElementById('food').value;
    const foodWeight = parseFloat(document.getElementById('foodWeight').value);
    const userId = parseInt(document.getElementById('userId').value, 10);

    const dailyFeed = { passageDate, animalId, food, foodWeight, userId };

    if (currentDailyFeedId) {
        // Editer un rapport existant
        fetch(`${apiUrl}/daily-feeds/${currentDailyFeedId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dailyFeed)
        }).then(() => {
            fetchDailyFeeds();
            document.getElementById('dailyFeedForm').reset();
            document.querySelector('[data-bs-dismiss="modal"]').click();
        });
    } else {
        // Créer un nouveau rapport
        fetch(`${apiUrl}/daily-feeds`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dailyFeed)
        }).then(() => {
            fetchDailyFeeds();
            document.getElementById('dailyFeedForm').reset();
            document.querySelector('[data-bs-dismiss="modal"]').click();
        });
    }
}

function confirmDelete(dailyFeedId) {
    currentDailyFeedId = dailyFeedId;
}

function deleteDailyFeed() {
    fetch(`${apiUrl}/daily-feeds/${currentDailyFeedId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
    }).then(() => {
        fetchDailyFeeds();

        // Fermer explicitement le modal en utilisant l'API Bootstrap
        const deleteDailyFeedModalElement = document.getElementById('deleteDailyFeedModal');
        const modalInstance = bootstrap.Modal.getInstance(deleteDailyFeedModalElement);
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