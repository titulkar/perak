// Funkce pro kontrolu existence souborů v adresáři titulky
function checkSubtitleFiles() {
    console.log('Kontrola souborů ve složce /titulky...');
    // Zde by byla logika pro kontrolu existence souborů
    // Například pomocí fetch API nebo AJAX
}

// Funkce pro dynamické přidávání nových řádků
function addNewEntry(datum, nazev, serie, dil, zipSoubor, popisTitulku, videoOdkazy) {
    const tableBody = document.querySelector('tbody');
    const newRow = document.createElement('tr');
    
    newRow.innerHTML = `
        <td>${datum}</td>
        <td>${nazev}</td>
        <td>${serie}</td>
        <td>${dil}</td>
        <td>
            <a href="/titulky/${zipSoubor}" class="zip-button" download>
                📦 Stáhnout ZIP
            </a>
            <div class="subtitle-info">${popisTitulku}</div>
        </td>
        <td>
            <div class="video-links">
                ${videoOdkazy}
            </div>
        </td>
    `;
    
    tableBody.appendChild(newRow);
}

// Funkce pro potvrzení stažení
function confirmDownload(event, fileName) {
    if (!confirm(`Opravdu chcete stáhnout soubor ${fileName}?`)) {
        event.preventDefault();
        return false;
    }
    return true;
}

// Inicializace po načtení stránky
document.addEventListener('DOMContentLoaded', function() {
    checkSubtitleFiles();
    
    // Přidání potvrzení ke všem zip odkazům
    const zipLinks = document.querySelectorAll('.zip-button');
    zipLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            const fileName = this.href.split('/').pop();
            return confirmDownload(event, fileName);
        });
    });
    
    console.log('Aplikace inicializována');
});

// Funkce pro načtení dat z JSON souboru (ukázka)
async function loadDataFromJSON(jsonFile) {
    try {
        const response = await fetch(jsonFile);
        const data = await response.json();
        
        data.forEach(item => {
            addNewEntry(
                item.datum,
                item.nazev,
                item.serie,
                item.dil,
                item.zipSoubor,
                item.popisTitulku,
                item.videoOdkazy
            );
        });
    } catch (error) {
        console.error('Chyba při načítání dat:', error);
    }
}