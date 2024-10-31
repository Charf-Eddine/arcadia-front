var veterinaryReportsPerPage = 5; // Nombre de rapport par page
var currentPage = 1;
var veterinaryReports = []; // Tableau pour stocker tous les rapports
var currentVeterinaryReportId = null;

const accessToken = getToken();
const role = getRole();
var userProfile = null;

const addReportButton = document.getElementById('addReportButton');
const actionsHeader = document.getElementById('actionsHeader');

if (role === 'veterinarian') {
    addReportButton.style.display = 'block'; // Affiche le bouton
    actionsHeader.style.display = 'table-cell'; // Affiche la colonne Actions
} else {
    addReportButton.style.display = 'none'; // Cache le bouton
    actionsHeader.style.display = 'none'; // Cache la colonne Actions
}

// Récupérer la liste des rapports au chargement de la page
fetchVeterinaryReports();

// Fonction pour appeler l'API et récupérer la liste des rapports
function fetchVeterinaryReports() {
    fetch(`${apiUrl}/veterinary-reports`)
    .then(response => {
        if(response.ok){
            return response.json();
        }
        else{
            alert("Erreur lors de la récupération des rapports");
        }
    })
    .then(data => {
        veterinaryReports = data;
        renderVeterinaryReports(currentPage);
        renderPagination();
    })
    .catch(error => console.error('Erreur lors de la récupération des rapports :', error));
}

function renderVeterinaryReports(page) {
    const veterinaryReportTableBody = document.getElementById('veterinaryReportTableBody');
    veterinaryReportTableBody.innerHTML = ''; // Efface le tableau existant

    const start = (page - 1) * veterinaryReportsPerPage;
    const end = start + veterinaryReportsPerPage;
    const paginatedVeterinaryReports = veterinaryReports.slice(start, end); // Récupère les rapports de la page courante

    paginatedVeterinaryReports.forEach(veterinaryReport => {
        const actionsColumn = role === 'veterinarian' ? `
            <td>
                <button type="button" class="btn btn-primary btn-sm" onclick="editVeterinaryReport(${veterinaryReport.id})" data-bs-toggle="modal" data-bs-target="#veterinaryReportModal">Éditer</button>
                <button type="button" class="btn btn-danger btn-sm" onclick="confirmDelete(${veterinaryReport.id})" data-bs-toggle="modal" data-bs-target="#deleteVeterinaryReportModal">Supprimer</button>
            </td>
        ` : ``; // Colonne vide si l'utilisateur n'est pas vétérinaire

        const row = `
            <tr>
                <td>${formatDate(veterinaryReport.passageDate)}</td>
                <td>${veterinaryReport.animal.name}</td>
                <td>${veterinaryReport.food}</td>
                <td>${veterinaryReport.foodWeight}</td>
                <td>${veterinaryReport.state}</td>
                <td>${veterinaryReport.stateDetail}</td>
                <td>${veterinaryReport.user.firstname} ${veterinaryReport.user.lastname}</td>
                ${actionsColumn}
            </tr>
        `;

        veterinaryReportTableBody.insertAdjacentHTML('beforeend', row);
    });
}

function renderPagination() {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(veterinaryReports.length / veterinaryReportsPerPage);
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
    renderVeterinaryReports(currentPage); // Met à jour l'affichage des rapports pour la nouvelle page
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
        const response = await fetch(`${apiUrl}/animals`);
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
    document.getElementById('veterinaryReportModalLabel').innerText = 'Saisir le compte rendu';
    document.getElementById('animalId').value = '';
    document.getElementById('food').value = '';
    document.getElementById('foodWeight').value = '';
    document.getElementById('state').value = '';
    document.getElementById('stateDetail').value = '';
    
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

    currentVeterinaryReportId = null;
}

async function editVeterinaryReport(veterinaryReportId) {
    await loadAnimals();
    fetch(`${apiUrl}/veterinary-reports/${veterinaryReportId}`)
    .then(response => response.json())
    .then(veterinaryReport => {
      document.getElementById('veterinaryReportModalLabel').innerText = "Éditer le compte rendu";
      document.getElementById('animalId').value = veterinaryReport.animal.id;
      document.getElementById('food').value = veterinaryReport.food;
      document.getElementById('foodWeight').value = veterinaryReport.foodWeight;
      document.getElementById('state').value = veterinaryReport.state;
      document.getElementById('stateDetail').value = veterinaryReport.stateDetail;
      document.getElementById('userId').value = veterinaryReport.user.id;
      document.getElementById('user').value = veterinaryReport.user.firstname + " " + veterinaryReport.user.lastname;

      user = veterinaryReport.user;

      // Date et heure actuelles en heure locale
      const now = new Date(veterinaryReport.passageDate);
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');

      // Format pour le champ `datetime-local`
      const formattedDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

      // Affectation de la date et heure courantes au champ `passageDate`
      document.getElementById('passageDate').value = formattedDateTime;

      currentVeterinaryReportId = veterinaryReport.id;
    });
}

function saveVeterinaryReport() {
    const passageDate = document.getElementById('passageDate').value;
    const animalId = parseInt(document.getElementById('animalId').value, 10);
    const food = document.getElementById('food').value;
    const foodWeight = parseFloat(document.getElementById('foodWeight').value);
    const state = document.getElementById('state').value;
    const stateDetail = document.getElementById('stateDetail').value;
    const userId = parseInt(document.getElementById('userId').value, 10);

    const veterinaryReport = { passageDate, animalId, food, foodWeight, state, stateDetail, userId };

    if (currentVeterinaryReportId) {
        // Editer un rapport existant
        fetch(`${apiUrl}/veterinary-reports/${currentVeterinaryReportId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(veterinaryReport)
        }).then(() => {
            fetchVeterinaryReports();
            document.getElementById('veterinaryReportForm').reset();
            document.querySelector('[data-bs-dismiss="modal"]').click();
        });
    } else {
        // Créer un nouveau rapport
        fetch(`${apiUrl}/veterinary-reports`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(veterinaryReport)
        }).then(() => {
            fetchVeterinaryReports();
            document.getElementById('veterinaryReportForm').reset();
            document.querySelector('[data-bs-dismiss="modal"]').click();
        });
    }
}

function confirmDelete(veterinaryReportId) {
    currentVeterinaryReportId = veterinaryReportId;
}

function deleteVeterinaryReport() {
    fetch(`${apiUrl}/veterinary-reports/${currentVeterinaryReportId}`, {
        method: 'DELETE'
    }).then(() => {
        fetchVeterinaryReports();

        // Fermer explicitement le modal en utilisant l'API Bootstrap
        const deleteVeterinaryReportModalElement = document.getElementById('deleteVeterinaryReportModal');
        const modalInstance = bootstrap.Modal.getInstance(deleteVeterinaryReportModalElement);
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