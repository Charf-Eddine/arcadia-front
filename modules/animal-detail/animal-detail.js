export function initPage({ id }) {
    const animalId = id;
    // Fonction pour appeler l'API et récupérer les détails de l'animal
    fetch(`${apiUrl}/animals/${animalId}`)
    .then(response => {
        if(response.ok){
            return response.json();
        }
        else{
            alert("Erreur lors de la récupération de l'animal");
        }
    })
    .then(data => {
        displayAnimal(data);
    })
    .catch(error => console.error("Erreur lors de la récupération de l'animal :", error));

    // Fonction pour afficher la page détail de l'animal
    function displayAnimal(animal) {
        document.getElementById("name").textContent = animal.name;
        document.getElementById("breed").textContent = animal.breed.name;
        document.getElementById("habitat").textContent = animal.habitat.name;

        if (animal.images && animal.images.length > 0) {
            const carouselImagesContainer = document.getElementById('carousel-images');
            animal.images.forEach((image, index) => {
            const carouselItem = document.createElement('div');
            const imgSrc = `${apiUrl}/uploads/${image.filename}`;
            carouselItem.className = 'carousel-item' + (index === 0 ? ' active' : '');
            carouselItem.innerHTML = `<img src="${imgSrc}" class="d-block w-100" alt="Image ${index + 1}">`;
            carouselImagesContainer.appendChild(carouselItem);
            });

            
            // Masquer les boutons "Suivant" et "Précédent" si une seule image
            if (animal.images.length <= 1) {
            document.getElementById('carousel-prev').classList.add('d-none');
            document.getElementById('carousel-next').classList.add('d-none');
            }
        }

        if (animal.veterinaryReports && animal.veterinaryReports.length > 0) {
            document.getElementById("food").textContent = animal.veterinaryReports[0].food;
            document.getElementById("foodWeight").textContent = animal.veterinaryReports[0].foodWeight;
            document.getElementById("state").textContent = animal.veterinaryReports[0].state;
            document.getElementById("stateDetail").textContent = animal.veterinaryReports[0].stateDetail;
        }
        else {
            document.getElementById('veterinary-report').classList.add('d-none');
        }

        // Incrémenter le nombre de consultations de l'animal pour les statistiques
        fetch(`${apiUrl}/statistics/${encodeURIComponent(animal.name)}/increment-consultation`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json'
            }
        })
        .then(response => {
            if (!response.ok) {
            throw new Error('Erreur lors de l\'incrémentation de la consultation de l\'animal');
            }
            return response.json();
        })
        .catch(error => {
            console.error('Erreur:', error);
        });        
    }
}