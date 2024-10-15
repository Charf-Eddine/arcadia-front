// Fonction pour appeler l'API et récupérer la liste des horaires
fetch(apiUrl + "/schedules")
.then(response => {
    if(response.ok){
        return response.json();
    }
    else{
        alert("Erreur lors de la récupération des horaires");
    }
})
.then(data => {
    displayServices(data);
})
.catch(error => console.error('Erreur lors de la récupération des horaires :', error));

// Fonction pour afficher les horaires dans le tableau
function displayServices(schedules) {
    const tableBody = document.querySelector('#schedulesTable tbody');
    schedules.forEach(schedule => {
        const row = document.createElement('tr');
        const weekDayCell = document.createElement('td');
        const scheduleCell = document.createElement('td');

        weekDayCell.classList.add('text-dark');
        scheduleCell.classList.add('text-dark');

        weekDayCell.textContent = schedule.weekDay;
        if (schedule.opening && schedule.closing) {
            scheduleCell.textContent = formatTime(schedule.opening) + " - " + formatTime(schedule.closing);
        }
        else if (!schedule.opening && !schedule.closing) {
            scheduleCell.textContent = "Fermé";
        }
        else {
            scheduleCell.textContent = "";
        }

        row.appendChild(weekDayCell);
        row.appendChild(scheduleCell);
        tableBody.appendChild(row);
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