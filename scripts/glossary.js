document.addEventListener('DOMContentLoaded', () => {
    // 1. Create a single tooltip element and add it to the body
    const tooltip = document.createElement('div');
    tooltip.className = 'glossary-tooltip';
    document.body.appendChild(tooltip);

    let dictionary = {};

    // 2. Fetch the JSON dictionary
    fetch('data/words-defs.json')
        .then(response => response.json())
        .then(data => {
            dictionary = data;
        })
        .catch(error => console.error('Erreur de chargement du dictionnaire:', error));

    // 3. Select defined words dynamically using a MutationObserver
    function attachListeners() {
        // Select only words that haven't had listeners attached yet
        const definedWords = document.querySelectorAll('.defined-word:not(.tooltip-attached)');

        definedWords.forEach(word => {
            // Mark the word so we don't attach listeners to it again on the next mutation
            word.classList.add('tooltip-attached');

            // Desktop Interactions
            word.addEventListener('mouseenter', (e) => {
                handleTooltipOpen(e.target);
            });

            word.addEventListener('mouseleave', () => {
                hideTooltip();
            });

            // Mobile Interactions
            word.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevents document click from immediately closing it
                handleTooltipOpen(e.target);
            });
        });
    }

    // Run it once immediately for any words already in the static HTML
    attachListeners();

    // Create the observer to watch for new DOM elements being injected
    const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                attachListeners();
            }
        }
    });

    // Start observing the entire document body for added nodes
    observer.observe(document.body, { 
        childList: true, 
        subtree: true 
    });
    // Close mobile tooltip if tapping anywhere else on the screen
    document.addEventListener('click', () => {
        hideTooltip();
    });

    // Core Logic Functions
    function handleTooltipOpen(element) {
        const term = element.textContent.trim();
        
        // Look up the term in the fetched dictionary
        if (dictionary[term]) {
            tooltip.textContent = dictionary[term];
            tooltip.classList.add('is-active');

            // Calculate position to place it above the word
            const rect = element.getBoundingClientRect();
            const scrollY = window.scrollY || window.pageYOffset;
            const scrollX = window.scrollX || window.pageXOffset;

            // 10px gap between tooltip and word
            const topPosition = rect.top + scrollY - tooltip.offsetHeight - 10; 
            // Center the tooltip horizontally over the word
            const leftPosition = rect.left + scrollX + (rect.width / 2) - (tooltip.offsetWidth / 2);

            tooltip.style.top = `${topPosition}px`;
            tooltip.style.left = `${leftPosition}px`;
        }
    }

    function hideTooltip() {
        tooltip.classList.remove('is-active');
    }
});