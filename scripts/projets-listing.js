document.addEventListener('DOMContentLoaded', () => {
    
    const gridContainer = document.getElementById('projects-grid');
    const cardTemplate = document.getElementById('project-card-template');

    // Prevent errors if the elements aren't found on the page
    if (!gridContainer || !cardTemplate) return;

    // Fetch the JSON data
    fetch('data/projets.json')
        .then(response => {
            if (!response.ok) throw new Error("Impossible de charger les projets.");
            return response.json();
        })
        .then(data => {
            
            // Loop through each key/value pair in the JSON object
            for (const [id, projectData] of Object.entries(data)) {
                
                // 1. Clone the hidden template
                const newCard = cardTemplate.cloneNode(true);
                
                // 2. Remove the template ID and make it visible
                newCard.removeAttribute('id');
                newCard.style.display = 'block'; 

                // 3. Inject the data
                const titleElement = newCard.querySelector('.project-title-placeholder');
                const linkElement = newCard.querySelector('.project-link-placeholder');

                if (titleElement) {
                    titleElement.textContent = projectData.nom;
                }

                if (linkElement) {
                    // Assuming your actual file is projet.html
                    linkElement.href = `projet.html?id=${id}`; 
                }

                // 4. Add the new card to the grid
                gridContainer.appendChild(newCard);
            }
        })
        .catch(error => {
            console.error("Erreur d'importation :", error);
        });
});