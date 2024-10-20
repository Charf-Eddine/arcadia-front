const usersPerPage = 10; // Nombre d'utilisateurs par page
let currentPage = 1;
let users = []; // Tableau pour stocker tous les utilisateurs
let currentUserId = null;

// Récupérer la liste des utilisateurs au chargement de la page
fetchUsers();

// Fonction pour appeler l'API et récupérer la liste des utilisateurs
function fetchUsers() {
    fetch(`${apiUrl}/users`)
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
}

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
                    <button type="button" class="btn btn-primary btn-sm" onclick="editUser(${user.id})" data-bs-toggle="modal" data-bs-target="#userModal">Éditer</button>
                    <button type="button" class="btn btn-danger btn-sm" onclick="confirmDelete(${user.id})" data-bs-toggle="modal" data-bs-target="#deleteUserModal">Supprimer</button>
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

function clearModal() {
    document.getElementById('userModalLabel').innerText = 'Créer un utilisateur';
    document.getElementById('firstname').value = '';
    document.getElementById('lastname').value = '';
    document.getElementById('email').value = '';
    document.getElementById('role').value = '';
    document.getElementById('password').value = '';
    currentUserId = null;
}

function editUser(userId) {
    fetch(`${apiUrl}/users/${userId}`)
    .then(response => response.json())
    .then(user => {
      document.getElementById('userModalLabel').innerText = "Éditer l'utilisateur";
      document.getElementById('firstname').value = user.firstname;
      document.getElementById('lastname').value = user.lastname;
      document.getElementById('email').value = user.email;
      document.getElementById('role').value = user.role;
      document.getElementById('password').value = user.password;
      currentUserId = user.id;
    });
}

function saveUser() {
    const firstname = document.getElementById('firstname').value;
    const lastname = document.getElementById('lastname').value;
    const email = document.getElementById('email').value;
    const role = document.getElementById('role').value;
    const password = document.getElementById('password').value;

    const user = { firstname, lastname, email, role, password };

    if (currentUserId) {
        // Editer un utilisateur existant
        fetch(`${apiUrl}/users/${currentUserId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        }).then(() => {
            fetchUsers();
            document.getElementById('userForm').reset();
            document.querySelector('[data-bs-dismiss="modal"]').click();
        });
    } else {
        // Créer un nouvel utilisateur
        fetch(`${apiUrl}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        }).then(() => {
            fetchUsers();
            document.getElementById('userForm').reset();
            document.querySelector('[data-bs-dismiss="modal"]').click();
        });
    }
}

function confirmDelete(userId) {
    currentUserId = userId;
}

function deleteUser() {
    fetch(`${apiUrl}/users/${currentUserId}`, {
        method: 'DELETE'
    }).then(() => {
        fetchUsers();

        // Fermer explicitement le modal en utilisant l'API Bootstrap
        const deleteUserModalElement = document.getElementById('deleteUserModal');
        const modalInstance = bootstrap.Modal.getInstance(deleteUserModalElement);
        modalInstance.hide();
    });
}