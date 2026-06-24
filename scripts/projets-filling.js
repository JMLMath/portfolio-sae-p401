document.addEventListener('DOMContentLoaded', () => {
    
    // 1. EXTRACT URL ARGUMENT
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('id');

    if (!projectId) {
        redirectToHome();
        return;
    }

    // 2. FETCH DATA ASYNCHRONOUSLY
    fetch('data/projets.json')
        .then(response => {
            if (!response.ok) throw new Error("Fichier JSON introuvable");
            return response.json();
        })
        .then(data => {
            
            // 3. DATA MATCHING
            const project = data[projectId];

            if (!project) {
                redirectToHome();
                return;
            }

            // 4. DOM POPULATION
            populateProjectPage(project);
            
            // 5. GLOSSARY TRIGGER
            // On prévient le tooltip.js que le HTML a été mis à jour
            window.dispatchEvent(new Event('projetsDataRendered'));

        })
        .catch(error => {
            console.error("Erreur de chargement du projet :", error);
            redirectToHome();
        });
});

function redirectToHome() {
    window.location.replace('index.html#projets');
}

function populateProjectPage(project) {
    
    document.title = `Projet - ${project.nom}`;

    // --- Hero Section (B) ---
    const titleEl = document.getElementById('project-nom');
    // On garde textContent pour le titre principal par sécurité (pas de mots de glossaire dans le H1)
    if (titleEl) titleEl.textContent = project.nom;

    const contextEl = document.getElementById('project-contexte-annee');
    if (contextEl) {
        contextEl.innerHTML = `<strong>Contexte :</strong> ${project.contexte} &nbsp;|&nbsp; <strong>Année :</strong> ${project.annee}`;
    }

    // --- Objectif Section ---
    const objectifEl = document.getElementById('project-objectif');
    if (objectifEl) {
        // innerHTML permet aux <span class="defined-word"> de s'afficher correctement
        objectifEl.innerHTML = project.objectif; 
    }
    
    // --- Task Section (C) ---
    const missionsEl = document.getElementById('project-missions');
    if (missionsEl) {
        // innerHTML permet aux <span class="defined-word"> de s'afficher correctement
        missionsEl.innerHTML = project.missions; 
    }

    // --- Competences Section (D) ---
    const competencesGrid = document.getElementById('project-competences-grid');
    if (competencesGrid && Array.isArray(project.competences)) {
        
        competencesGrid.innerHTML = ''; 

        project.competences.forEach(comp => {
            const card = document.createElement('article');
            card.className = 'feature-card';

            const h3 = document.createElement('h3');
            // CORRECTION : Changé en innerHTML
            h3.innerHTML = comp.nom;

            const p = document.createElement('p');
            // CORRECTION : Changé en innerHTML pour activer les balises <span>
            p.innerHTML = comp.text;

            card.appendChild(h3);
            card.appendChild(p);
            competencesGrid.appendChild(card);
        });
    }

    // --- Review Section (E) ---
    const bilanEl = document.getElementById('project-bilan');
    if (bilanEl) {
        // innerHTML permet aux <span class="defined-word"> de s'afficher correctement
        bilanEl.innerHTML = project.bilan; 
    }
}