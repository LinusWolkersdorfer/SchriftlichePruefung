const fs = require('fs');

// JSON-Datei laden
const data = JSON.parse(fs.readFileSync('Fragenkatalog_Jaegerpruefung.json', 'utf-8'));

let totalChecked = 0;
let longestCorrectCount = 0;
let significantCases = [];

data.forEach((question) => {
    const answers = question.answers;

    // ❌ 1. Filter: Überspringen, wenn irgendeine Antwort nur ein Wort ist
    const hasOneWord = answers.some(ans => {
        const text = ans.text.trim().replace(/\.$/, '');
        return /^[A-Za-zÄÖÜäöüß]+$/.test(text);
    });
    if (hasOneWord) return;

    // 🔎 2. Längste Antwort identifizieren
    const sorted = [...answers].sort((a, b) => b.text.length - a.text.length);
    const longest = sorted[0];
    const rest = sorted.slice(1);

    const avgLength = rest.reduce((sum, a) => sum + a.text.length, 0) / rest.length;
    const ratio = longest.text.length / avgLength;

    // ✅ 2. Filter: nur wenn längste Antwort mindestens 1.5x so lang wie andere
    if (ratio > 3.0) {
        totalChecked++;
        if (longest.correct) longestCorrectCount++;

        significantCases.push({
            id: question.id,
            correct: longest.correct,
            ratio: ratio,
            question: question.question
        });
    }
});

// 📊 Ergebnisse
console.log(`\nFragen nach Filtern analysiert: ${totalChecked}`);
console.log(`Davon war längste Antwort korrekt: ${longestCorrectCount}`);
console.log(`Quote: ${(longestCorrectCount / totalChecked * 100).toFixed(2)} %`);

// 🔝 Top-Beispiele
console.log(`\nBeispiele mit besonders langer Antwort (Top 5):`);
significantCases
    .sort((a, b) => b.ratio - a.ratio)
    .slice(0, 5)
    .forEach(entry => {
        console.log(`ID: ${entry.id} | ${(entry.ratio).toFixed(2)}x länger | ${entry.correct ? '✅ korrekt' : '❌ falsch'}`);
    });
