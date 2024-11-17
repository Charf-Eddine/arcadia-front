const accessToken = getToken();
var habitatsPerPage = 5; // Nombre de habitats par page
var currentPage = 1;
var habitats = []; // Tableau pour stocker tous les habitats
var currentHabitatId = null;
var selectedImages = [];

// Récupérer la liste des habitats au chargement de la page
fetchHabitats();

// Fonction pour appeler l'API et récupérer la liste des habitats
function fetchHabitats() {
    fetch(`${apiUrl}/habitats`, {
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
            alert("Erreur lors de la récupération des habitats");
        }
    })
    .then(data => {
        habitats = data;
        renderHabitats(currentPage);
        renderPagination();
    })
    .catch(error => console.error('Erreur lors de la récupération des habitats :', error));
}

function renderHabitats(page) {
    const habitatTableBody = document.getElementById('habitatTableBody');
    habitatTableBody.innerHTML = ''; // Efface le tableau existant

    const start = (page - 1) * habitatsPerPage;
    const end = start + habitatsPerPage;
    const paginatedHabitats = habitats.slice(start, end); // Récupère les habitats de la page courante

    paginatedHabitats.forEach(habitat => {
        const imagesHtml = habitat.images.map(image => `<img src="${apiUrl}/uploads/${image.filename}" alt="${habitat.name}" style="width: 50px; height: auto; margin-right: 5px;">`).join('');
        const row = `
            <tr>
                <td>${habitat.name}</td>
                <td>${habitat.description}</td>
                <td>${imagesHtml}</td>
                <td>
                    <button type="button" class="btn btn-primary btn-sm" onclick="editHabitat('${habitat.id}')" data-bs-toggle="modal" data-bs-target="#habitatModal">Éditer</button>
                    <button type="button" class="btn btn-danger btn-sm" onclick="confirmDelete('${habitat.id}')" data-bs-toggle="modal" data-bs-target="#deleteHabitatModal">Supprimer</button>
                </td>
            </tr>
        `;
        habitatTableBody.insertAdjacentHTML('beforeend', row);
    });
}

function renderPagination() {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(habitats.length / habitatsPerPage);
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
    renderHabitats(currentPage); // Met à jour l'affichage des habitats pour la nouvelle page
    renderPagination();
}

function clearModal() {
    document.getElementById('habitatModalLabel').innerText = 'Créer un habitat';
    document.getElementById('name').value = '';
    document.getElementById('description').value = '';
    currentHabitatId = null;
}

// Fonction pour prévisualiser les images sélectionnées
function previewImages() {
    const files = document.getElementById('images').files;

    Array.from(files).forEach((file) => {
        // Vérifier si le fichier est déjà dans la liste pour éviter les doublons
        if (!selectedImages.some(image => image.file.name === file.name && image.file.size === file.size)) {
            selectedImages.push({
                file: file, // Ajouter le fichier ici
                url: URL.createObjectURL(file), // Créer une URL temporaire pour l'affichage
                existing: false, // Indiquer qu'il s'agit d'une nouvelle image
            });
        }
    });

    // Vider la valeur de l'input file pour masquer le nom ou le nombre d'images sélectionnées
    document.getElementById('images').value = "";

    // Mettre à jour la prévisualisation
    updatePreview();
}

// Fonction pour mettre à jour les prévisualisations dans le formulaire
function updatePreview() {
    const previewContainer = document.getElementById('previewContainer');
    previewContainer.innerHTML = '';

    selectedImages.forEach((image, index) => {
        const imgPreview = document.createElement('div');
        imgPreview.className = 'preview-item position-relative m-1';

        // Utiliser l'URL de l'objet File pour l'affichage
        const imageUrl = image.url;

        imgPreview.innerHTML = `
            <img src="${imageUrl}" alt="Image Preview" class="img-thumbnail" style="width: 100px; height: 100px;">
            <button type="button" class="btn-close position-absolute top-0 end-0" aria-label="Remove" onclick="removeImage(${index})"></button>
        `;
        previewContainer.appendChild(imgPreview);
    });
}

// Fonction pour retirer une image de la sélection
function removeImage(index) {
    selectedImages.splice(index, 1); // Supprimer l'image de la liste sélectionnée
    updatePreview(); // Mettre à jour la prévisualisation
}

async function editHabitat(habitatId) {
    fetch(`${apiUrl}/habitats/${habitatId}`, {
        method: 'GET',
        headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(async habitat => {
        document.getElementById('habitatModalLabel').innerText = "Éditer l'habitat";
        document.getElementById('name').value = habitat.name;
        document.getElementById('description').value = habitat.description;
        currentHabitatId = habitat.id;

        // Initialiser la liste selectedImages avec les images existantes
        selectedImages = [];

        // Récupérer chaque image existante et la convertir en objet File
        for (const image of habitat.images) {
            const response = await fetch(`${apiUrl}/uploads/${image.filename}`);
            const blob = await response.blob(); // Télécharger l'image comme Blob

            // Créer un objet File à partir du Blob
            const file = new File([blob], image.filename, { type: blob.type });
            selectedImages.push({
                file: file, // Ajouter le fichier ici
                url: URL.createObjectURL(blob), // URL pour l'affichage
                existing: true, // Indiquer qu'il s'agit d'une image existante
            });
        }

        // Mettre à jour la prévisualisation
        updatePreview();
    });
}

function saveHabitat() {
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);

    // Ajouter les fichiers de selectedImages à formData
    selectedImages.forEach((image) => {
        formData.append('images', image.file); // Utiliser l'objet File
    });

    const method = currentHabitatId ? 'PATCH' : 'POST';
    const url = currentHabitatId ? `${apiUrl}/habitats/${currentHabitatId}` : `${apiUrl}/habitats`;

    fetch(url, {
        method,
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        body: formData
    }).then(() => {
        fetchHabitats();
        document.getElementById('habitatForm').reset();
        selectedImages = []; // Réinitialiser les images sélectionnées
        document.getElementById('previewContainer').innerHTML = ''; // Vider les prévisualisations
        document.querySelector('[data-bs-dismiss="modal"]').click();
    }).catch(error => {
        console.error('Erreur lors de la sauvegarde de l\'habitat:', error);
    });
}

function confirmDelete(habitatId) {
    currentHabitatId = habitatId;
}

function deleteHabitat() {
    fetch(`${apiUrl}/habitats/${currentHabitatId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
    }).then(() => {
        fetchHabitats();

        // Fermer explicitement le modal en utilisant l'API Bootstrap
        const deleteHabitatModalElement = document.getElementById('deleteHabitatModal');
        const modalInstance = bootstrap.Modal.getInstance(deleteHabitatModalElement);
        modalInstance.hide();
    });
}