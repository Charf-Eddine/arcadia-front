const usersPerPage = 5; // Nombre d'utilisateurs par page
let currentPage = 1;
let users = []; // Tableau pour stocker tous les utilisateurs

// Fonction pour appeler l'API et récupérer la liste des utilisateurs
fetch(apiUrl + "/users")
.then(response => {
    if(response.ok){
        return response.json();
    }
    else{
        alert("Erreur lors de la récupération des utilisateurs");
    }
})
.then(data => {
    users = data;
    renderUsers(currentPage);
    renderPagination();
})
.catch(error => console.error('Erreur lors de la récupération des utilisateurs :', error));

function renderUsers(page) {
    const userTableBody = document.getElementById('userTableBody');
    userTableBody.innerHTML = ''; // Efface le tableau existant

    const start = (page - 1) * usersPerPage;
    const end = start + usersPerPage;
    const paginatedUsers = users.slice(start, end); // Récupère les utilisateurs de la page courante

    paginatedUsers.forEach(user => {
        const row = `
            <tr>
                <td>${user.firstname}</td>
                <td>${user.lastname}</td>
                <td>${user.email}</td>
                <td>${displayUserRole(user)}</td>
                <td>
                    <button class="btn btn-primary btn-sm" onclick="editUser(${user.id})">Éditer</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id})">Supprimer</button>
                </td>
            </tr>
        `;
        userTableBody.insertAdjacentHTML('beforeend', row);
    });
}

function renderPagination() {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(users.length / usersPerPage);
    pagination.innerHTML = ''; // Efface la pagination existante

    for (let i = 1; i <= totalPages; i++) {
        const pageItem = `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
            </li>
        `;
        pagination.insertAdjacentHTML('beforeend', pageItem);
    }
}

function changePage(page) {
    currentPage = page;
    renderUsers(currentPage); // Met à jour l'affichage des utilisateurs pour la nouvelle page
    renderPagination()
}

function displayUserRole(user) {
    switch(user.role) {
        case "admin" : {
            return "Administrateur";
        }
        case "employee" : {
            return "Employé";
        }
        case "veterinarian" : {
            return "Vétérinaire";
        }
        default : {
            return "";
        }
    }
}

function editUser(userId) {
    alert("Édition de l'utilisateur avec ID: " + userId);
}

function deleteUser(userId) {
    if (confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
        alert("Utilisateur supprimé avec ID: " + userId);
    }
}