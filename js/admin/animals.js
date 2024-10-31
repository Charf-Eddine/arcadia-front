const accessToken = getToken();
var animalsPerPage = 5; // Nombre des animaux par page
var currentPage = 1;
var animals = []; // Tableau pour stocker tous les animaux
var currentAnimalId = null;
var selectedImages = [];

// Récupérer la liste des animaux au chargement de la page
fetchAnimals();

// Fonction pour appeler l'API et récupérer la liste des animaux
function fetchAnimals() {
    fetch(`${apiUrl}/animals`, {
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
            alert("Erreur lors de la récupération des animaux");
        }
    })
    .then(data => {
        animals = data;
        renderAnimals(currentPage);
        renderPagination();
    })
    .catch(error => console.error('Erreur lors de la récupération des animaux :', error));
}

function renderAnimals(page) {
    const animalTableBody = document.getElementById('animalTableBody');
    animalTableBody.innerHTML = ''; // Efface le tableau existant

    const start = (page - 1) * animalsPerPage;
    const end = start + animalsPerPage;
    const paginatedAnimals = animals.slice(start, end); // Récupère les animaux de la page courante

    paginatedAnimals.forEach(animal => {
        const imagesHtml = animal.images.map(image => `<img src="${apiUrl}/uploads/${image.filename}" alt="${animal.name}" style="width: 50px; height: auto; margin-right: 5px;">`).join('');
        const row = `
            <tr>
                <td>${animal.name}</td>
                <td>${animal.breed.name}</td>
                <td>${animal.habitat.name}</td>
                <td>${imagesHtml}</td>
                <td>
                    <button type="button" class="btn btn-primary btn-sm" onclick="editAnimal(${animal.id})" data-bs-toggle="modal" data-bs-target="#animalModal">Éditer</button>
                    <button type="button" class="btn btn-danger btn-sm" onclick="confirmDelete(${animal.id})" data-bs-toggle="modal" data-bs-target="#deleteAnimalModal">Supprimer</button>
                </td>
            </tr>
        `;
        animalTableBody.insertAdjacentHTML('beforeend', row);
    });
}

function renderPagination() {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(animals.length / animalsPerPage);
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
    renderAnimals(currentPage); // Met à jour l'affichage des animaux pour la nouvelle page
    renderPagination();
}

async function loadBreeds() {
    try {
        const response = await fetch(`${apiUrl}/breeds`, {
            method: 'GET',
            headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
            }
        });
        const breeds = await response.json();
        const breedSelect = document.getElementById('breedId');
        breedSelect.innerHTML = '<option value="" disabled selected>Sélectionner la race</option>';
        
        breeds.forEach(breed => {
            const option = document.createElement('option');
            option.value = breed.id;
            option.textContent = breed.name;
            breedSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Erreur lors du chargement des races:', error);
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
    currentAnimalId = null;
    document.getElementById('animalModalLabel').innerText = 'Créer un animal';
    document.getElementById('name').value = '';
    document.getElementById('breedId').value = '';
    document.getElementById('habitatId').value = '';
    document.getElementById('images').value = '';
    selectedImages = [];
    const previewContainer = document.getElementById('previewContainer');
    previewContainer.innerHTML = '';
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

async function editAnimal(animalId) {
    await loadBreeds();
    await loadHabitats();
    fetch(`${apiUrl}/animals/${animalId}`, {
        method: 'GET',
        headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(async animal => {
        document.getElementById('animalModalLabel').innerText = "Éditer l'animal";
        document.getElementById('name').value = animal.name;
        document.getElementById('breedId').value = animal.breed.id;
        document.getElementById('habitatId').value = animal.habitat.id;
        currentAnimalId = animal.id;

        // Initialiser la liste selectedImages avec les images existantes
        selectedImages = [];

        // Récupérer chaque image existante et la convertir en objet File
        for (const image of animal.images) {
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

function saveAnimal() {
    const name = document.getElementById('name').value;
    const breedId = document.getElementById('breedId').value;
    const habitatId = document.getElementById('habitatId').value;

    const formData = new FormData();
    formData.append('name', name);
    formData.append('breedId', breedId);
    formData.append('habitatId', habitatId);

    // Ajouter les fichiers de selectedImages à formData
    selectedImages.forEach((image) => {
        formData.append('images', image.file); // Utiliser l'objet File
    });

    const method = currentAnimalId ? 'PATCH' : 'POST';
    const url = currentAnimalId ? `${apiUrl}/animals/${currentAnimalId}` : `${apiUrl}/animals`;

    fetch(url, {
        method,
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: formData
    }).then(() => {
        fetchAnimals();
        document.getElementById('animalForm').reset();
        selectedImages = []; // Réinitialiser les images sélectionnées
        document.getElementById('previewContainer').innerHTML = ''; // Vider les prévisualisations
        document.querySelector('[data-bs-dismiss="modal"]').click();
    }).catch(error => {
        console.error('Erreur lors de la sauvegarde de l\'animal:', error);
    });
}

function confirmDelete(animalId) {
    currentAnimalId = animalId;
}

function deleteAnimal() {
    fetch(`${apiUrl}/animals/${currentAnimalId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
    }).then(() => {
        fetchAnimals();

        // Fermer explicitement le modal en utilisant l'API Bootstrap
        const deleteAnimalModalElement = document.getElementById('deleteAnimalModal');
        const modalInstance = bootstrap.Modal.getInstance(deleteAnimalModalElement);
        modalInstance.hide();
    });
}