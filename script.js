// Funkce pro kontrolu existence souborů v adresáři titulky
function checkSubtitleFiles() {
    console.log('Kontrola souborů ve složce /titulky...');
    // Zde by byla logika pro kontrolu existence souborů
}

// Funkce pro načtení a zpracování RSS kanálu
async function loadFromRSS() {
    try {
        const response = await fetch('rss.xml');
        const text = await response.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(text, 'application/xml');
        
        const items = xml.querySelectorAll('item');
        const tableBody = document.getElementById('table-body');
        tableBody.innerHTML = ''; // Vyčištění tabulky
        
        items.forEach(item => {
            const title = item.querySelector('title').textContent;
            const link = item.querySelector('link').textContent;
            const description = item.querySelector('description').textContent;
            const pubDate = item.querySelector('pubDate').textContent;
            const category = item.querySelector('category')?.textContent || 'Seriál';
            
            // Parsování názvu pro získání detailů
            const parsedTitle = parseTitle(title);
            
            // Formátování data
            const date = new Date(pubDate);
            const formattedDate = date.toISOString().split('T')[0];
            
            // Vytvoření řádku tabulky
            const row = document.createElement('tr');
            
            // Rozhodnutí, zda jde o seriál nebo film
            const hasSeries = parsedTitle.serie && parsedTitle.serie !== '-';
            
            row.innerHTML = `
                <td>${formattedDate}</td>
                <td>${parsedTitle.nazev}</td>
                <td>${hasSeries ? parsedTitle.serie : '-'}</td>
                <td>${hasSeries ? parsedTitle.dil : '-'}</td>
                <td>
                    <a href="${link}" class="zip-button" download>
                        📦 Stáhnout ZIP
                    </a>
                    <div class="subtitle-info">${getSubtitleDescription(description)}</div>
                </td>
                <td>
                    <div class="video-links">
                        <a href="#" class="video-link" onclick="alert('Přehrávám verzi 1080p')">🎬 1080p</a>
                        <a href="#" class="video-link" onclick="alert('Přehrávám verzi 720p')">🎬 720p</a>
                    </div>
                </td>
            `;
            
            tableBody.appendChild(row);
        });
        
        console.log('Data úspěšně načtena z RSS');
    } catch (error) {
        console.error('Chyba při načítání RSS:', error);
        // Pokud RSS selže, načti ukázková data
        loadSampleData();
    }
}

// Pomocná funkce pro parsování názvu
function parseTitle(title) {
    // Formát: "Název - S01E01 (popis)" nebo "Název filmu (popis)"
    const seriesMatch = title.match(/(.*?)\s*-\s*S(\d+)E(\d+)/);
    const movieMatch = title.match(/(.*?)\s*\(/);
    
    if (seriesMatch) {
        return {
            nazev: seriesMatch[1].trim(),
            serie: seriesMatch[2],
            dil: seriesMatch[3]
        };
    } else if (movieMatch) {
        return {
            nazev: movieMatch[1].trim(),
            serie: '-',
            dil: '-'
        };
    } else {
        return {
            nazev: title,
            serie: '-',
            dil: '-'
        };
    }
}

// Pomocná funkce pro získání popisu titulků
function getSubtitleDescription(description) {
    if (description.includes('České a anglické')) return 'české a anglické titulky';
    if (description.includes('pro neslyšící')) return 'titulky pro neslyšící';
    if (description.includes('Vícejazyčné')) return 'vícejazyčné titulky';
    if (description.includes('Dvojjazyčné')) return 'dvojjazyčné titulky';
    return 'české titulky';
}

// Ukázková data pro případ, že RSS není dostupný
function loadSampleData() {
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = `
        <tr>
            <td>2024-01-15</td>
            <td>Přátelé (Friends)</td>
            <td>1</td>
            <td>1</td>
            <td>
                <a href="/titulky/Pratele_S01E01.zip" class="zip-button" download>
                    📦 Stáhnout ZIP (CZ titulky)
                </a>
                <div class="subtitle-info">včetně českých titulků</div>
            </td>
            <td>
                <div class="video-links">
                    <a href="#" class="video-link" onclick="alert('Přehrávám verzi 1080p')">🎬 1080p</a>
                    <a href="#" class="video-link" onclick="alert('Přehrávám verzi 720p')">🎬 720p</a>
                </div>
            </td>
        </tr>
        <!-- Další ukázková data... -->
    `;
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
    loadFromRSS(); // Načtení dat z RSS
    
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

// Funkce pro ruční aktualizaci RSS
function refreshRSS() {
    loadFromRSS();
}

// Funkce pro export aktuální tabulky do RSS formátu
function exportToRSS() {
    const rows = document.querySelectorAll('#table-body tr');
    let rssXML = '<?xml version="1.0" encoding="UTF-8"?>\n';
    rssXML += '<rss version="2.0">\n';
    rssXML += '  <channel>\n';
    rssXML += '    <title>Export tabulky titulků</title>\n';
    rssXML += '    <link>https://vase-stranka.cz/</link>\n';
    rssXML += '    <description>Aktuální přehled titulků</description>\n';
    
    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        rssXML += '    <item>\n';
        rssXML += `      <title>${cells[1]?.textContent || ''}</title>\n`;
        rssXML += `      <link>${cells[4]?.querySelector('a')?.href || ''}</link>\n`;
        rssXML += `      <pubDate>${new Date(cells[0]?.textContent || '').toUTCString()}</pubDate>\n`;
        rssXML += '    </item>\n';
    });
    
    rssXML += '  </channel>\n';
    rssXML += '</rss>';
    
    return rssXML;
}