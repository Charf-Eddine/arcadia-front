fetch(apiUrl + "/statistics/most-popular-animals")
.then(response => {
    if(response.ok){
        return response.json();
    }
    else{
        alert("Erreur lors de la récupération des statistiques");
    }
})
.then(data => {
    displayAnimalRanking(data);
})
.catch(error => console.error('Erreur lors de la récupération des statistiques :', error));

// Fonction pour afficher le classement des animaux dans le tableau
function displayAnimalRanking(schedules) {
    const tableBody = document.querySelector('#animalRankingTable tbody');
    schedules.forEach((animal, index) => {
        const row = document.createElement('tr');
        const rankCell = document.createElement('td');
        const animalNameCell = document.createElement('td');
        const consultationCountCell = document.createElement('td');
        


        rankCell.textContent = index + 1;
        animalNameCell.textContent = animal.name;
        consultationCountCell.textContent = animal.consultationCount;

        row.appendChild(rankCell);
        row.appendChild(animalNameCell);
        row.appendChild(consultationCountCell);
        tableBody.appendChild(row);
    });
}