const fs = require('fs');

// Lade die JSON-Datei
const data = JSON.parse(fs.readFileSync('Fragenkatalog_Jaegerpruefung.json', 'utf8'));

const longWords = new Set(); // Set, damit keine Duplikate

data.forEach((item) => {
    // Alle Wörter aus der Frage extrahieren
    const questionWords = item.question.split(/\s+/);

    // Alle Wörter aus den Antworten extrahieren
    const answerWords = item.answers.flatMap(a => a.text.split(/\s+/));

    [...questionWords, ...answerWords].forEach(word => {
        // Sonderzeichen entfernen, z.B. Satzzeichen
        const cleanWord = word.replace(/[.,!?;:"'()\-]/g, '');

        if (cleanWord.length > 20) {
            longWords.add(cleanWord);
        }
    });
});

console.log("Wörter mit mehr als 20 Zeichen:");
console.log([...longWords]);
