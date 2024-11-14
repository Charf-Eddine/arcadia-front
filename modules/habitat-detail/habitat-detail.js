export function initPage({ id }) {
    const habitatId = id;
    // Fonction pour appeler l'API et récupérer les détails de l'habitat
    fetch(`${apiUrl}/habitats/${habitatId}`)
    .then(response => {
        if(response.ok){
            return response.json();
        }
        else{
            alert("Erreur lors de la récupération de l'habitat");
        }
    })
    .then(data => {
        displayHabitat(data);
    })
    .catch(error => console.error("Erreur lors de la récupération de l'habitats :", error));

    // Fonction pour afficher la page détail de l'habitat
    function displayHabitat(habitat) {
        document.getElementById("name").textContent = habitat.name;
        document.getElementById("description").textContent = habitat.description;

        
        if (habitat.images && habitat.images.length > 0) {
            const carouselImagesContainer = document.getElementById('carousel-images');
            habitat.images.forEach((image, index) => {
            const carouselItem = document.createElement('div');
            const imgSrc = `${apiUrl}/uploads/${image.filename}`;
            carouselItem.className = 'carousel-item' + (index === 0 ? ' active' : '');
            carouselItem.innerHTML = `<img src="${imgSrc}" class="d-block w-100" alt="Image ${index + 1}">`;
            carouselImagesContainer.appendChild(carouselItem);
            });

            
            // Masquer les boutons "Suivant" et "Précédent" si une seule image
            if (habitat.images.length <= 1) {
            document.getElementById('carousel-prev').classList.add('d-none');
            document.getElementById('carousel-next').classList.add('d-none');
            }
        }

        const animalsContainer = document.getElementById('animal-container');

        // Vider le contenu actuel du conteneur
        animalsContainer.innerHTML = '';
        
        // Parcourir chaque animal et créer une carte Bootstrap
        if (habitat.animals && habitat.animals.length > 0) {
            habitat.animals.forEach(animal => {
                const card = document.createElement('div');
                card.classList.add('col');
            
                // Sélectionne la première image de l'animal ou une image par défaut si non disponible
                const imageUrl = animal.images.length > 0 ? `${apiUrl}/uploads/${animal.images[0].filename}` : 'default.jpg';
            
                card.innerHTML = `
                <div class="card h-100">
                    <img src="${imageUrl}" class="card-img-top" alt="${animal.name}">
                    <div class="card-body">
                    <h5 class="card-title">${animal.name}</h5>
                    </div>
                </div>
                `;

                // Ajoute un écouteur d'événements pour rediriger la page détail lors du clic
                card.addEventListener('click', () => {
                    window.location.href = `/animal/${animal.id}`;
                });

                animalsContainer.appendChild(card);
            });    
        }
        else {
            document.getElementById('animals').classList.add('d-none');
        }

        if (habitat.veterinaryReviews && habitat.veterinaryReviews.length > 0) {
            document.getElementById("veterinary-comment").innerText  = habitat.veterinaryReviews[0].comment;
        }
        else {
            document.getElementById('veterinary-review').classList.add('d-none');
        }
    }
}