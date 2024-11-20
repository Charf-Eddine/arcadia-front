const accessToken = getToken();
var schedules = []; // Tableau pour stocker tous les horaires
var currentWeekDay = null;

// Récupérer la liste des horaires au chargement de la page
fetchSchedules();

// Fonction pour appeler l'API et récupérer la liste des horaires
function fetchSchedules() {
    fetch(`${apiUrl}/schedules`, {
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
            alert("Erreur lors de la récupération des horaires");
        }
    })
    .then(data => {
        schedules = data;
        renderSchedules();
    })
    .catch(error => console.error('Erreur lors de la récupération des horaires :', error));
}

function renderSchedules() {
    const scheduleTableBody = document.getElementById('scheduleTableBody');
    scheduleTableBody.innerHTML = ''; // Efface le tableau existant
    schedules.forEach(schedule => {
        var value = ""
        if (schedule.opening && schedule.closing) {
            value = formatTime(schedule.opening) + " - " + formatTime(schedule.closing);
        }
        else if (!schedule.opening || !schedule.closing) {
            value = "Fermé";
        }
        const row = `
            <tr>
                <td>${schedule.weekDay}</td>
                <td>${value}</td>
                <td>
                    <button type="button" class="btn btn-primary btn-sm" onclick="editSchedule('${schedule.weekDay}')" data-bs-toggle="modal" data-bs-target="#scheduleModal">Éditer</button>
                </td>
            </tr>
        `;
        scheduleTableBody.insertAdjacentHTML('beforeend', row);
    });
}

function formatTime(timeString) {
    // Vérifier que la chaîne est au bon format
    if (!/^(\d{2}):(\d{2}):(\d{2})$/.test(timeString)) {
        throw new Error('Le format de l\'heure est invalide. Utilisez "HH:MM:SS".');
    }

    // Extraire les heures et les minutes
    const [hours, minutes] = timeString.split(':');
    
    // Formater la chaîne comme "HHhMM"
    return `${hours}h${minutes}`;
}


function editSchedule(weekDay) {
    fetch(`${apiUrl}/schedules/${weekDay}`, {
        method: 'GET',
        headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(schedule => {
      document.getElementById('scheduleModalLabel').innerText = "Éditer les horaires";
      document.getElementById('weekDay').value = schedule.weekDay;
      document.getElementById('opening').value = schedule.opening ? schedule.opening.slice(0, 5) : "";
      document.getElementById('closing').value = schedule.closing ? schedule.closing.slice(0, 5) : "";
      currentWeekDay = weekDay;
    });
}

function saveSchedule() {
    const weekDay = currentWeekDay;
    const opening = document.getElementById('opening').value ? document.getElementById('opening').value : null;
    const closing = document.getElementById('closing').value ? document.getElementById('closing').value : null;
    const schedule = { weekDay, opening, closing };

    fetch(`${apiUrl}/schedules/${currentWeekDay}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(schedule)
    }).then(() => {
        // Afficher un toast de succès
        showToast('success', 'Données enregistées avec succès');
        fetchSchedules();
        document.getElementById('scheduleForm').reset();
        document.querySelector('[data-bs-dismiss="modal"]').click();
    });
}