const accessToken = getToken();
var servicesPerPage = 5; // Nombre de services par page
var currentPage = 1;
var services = []; // Tableau pour stocker tous les services
var currentServiceId = null;

// Récupérer la liste des services au chargement de la page
fetchServices();

// Fonction pour appeler l'API et récupérer la liste des services
function fetchServices() {
    fetch(`${apiUrl}/services`, {
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
            alert("Erreur lors de la récupération des services");
        }
    })
    .then(data => {
        services = data;
        renderServices(currentPage);
        renderPagination();
    })
    .catch(error => console.error('Erreur lors de la récupération des services :', error));
}

function renderServices(page) {
    const serviceTableBody = document.getElementById('serviceTableBody');
    serviceTableBody.innerHTML = ''; // Efface le tableau existant

    const start = (page - 1) * servicesPerPage;
    const end = start + servicesPerPage;
    const paginatedServices = services.slice(start, end); // Récupère les services de la page courante

    paginatedServices.forEach(service => {
        const row = `
            <tr>
                <td>${service.name}</td>
                <td>${service.description}</td>
                <td>
                    <button type="button" class="btn btn-primary btn-sm" onclick="editService(${service.id})" data-bs-toggle="modal" data-bs-target="#serviceModal">Éditer</button>
                    <button type="button" class="btn btn-danger btn-sm" onclick="confirmDelete(${service.id})" data-bs-toggle="modal" data-bs-target="#deleteServiceModal">Supprimer</button>
                </td>
            </tr>
        `;
        serviceTableBody.insertAdjacentHTML('beforeend', row);
    });
}

function renderPagination() {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(services.length / servicesPerPage);
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
    renderServices(currentPage); // Met à jour l'affichage des services pour la nouvelle page
    renderPagination();
}

function clearModal() {
    document.getElementById('serviceModalLabel').innerText = 'Créer un service';
    document.getElementById('name').value = '';
    document.getElementById('description').value = '';
    currentServiceId = null;
}

function editService(serviceId) {
    fetch(`${apiUrl}/services/${serviceId}`, {
        method: 'GET',
        headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(service => {
      document.getElementById('serviceModalLabel').innerText = "Éditer le service";
      document.getElementById('name').value = service.name;
      document.getElementById('description').value = service.description;
      currentServiceId = service.id;
    });
}

function saveService() {
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;

    const service = { name, description };

    if (currentServiceId) {
        // Editer un service existant
        fetch(`${apiUrl}/services/${currentServiceId}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(service)
        }).then(() => {
            fetchServices();
            document.getElementById('serviceForm').reset();
            document.querySelector('[data-bs-dismiss="modal"]').click();
        });
    } else {
        // Créer un nouvel utilisateur
        fetch(`${apiUrl}/services`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(service)
        }).then(() => {
            fetchServices();
            document.getElementById('serviceForm').reset();
            document.querySelector('[data-bs-dismiss="modal"]').click();
        });
    }
}

function confirmDelete(serviceId) {
    currentServiceId = serviceId;
}

function deleteService() {
    fetch(`${apiUrl}/services/${currentServiceId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
    }).then(() => {
        fetchServices();

        // Fermer explicitement le modal en utilisant l'API Bootstrap
        const deleteServiceModalElement = document.getElementById('deleteServiceModal');
        const modalInstance = bootstrap.Modal.getInstance(deleteServiceModalElement);
        modalInstance.hide();
    });
}