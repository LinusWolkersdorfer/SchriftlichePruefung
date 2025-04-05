const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 5000;

// Middleware für JSON-Daten
app.use(express.json());

// Verbindung zur SQLite-Datenbank herstellen
const db = new sqlite3.Database('database.db', (err) => {
    if (err) {
        console.error('Fehler beim Verbinden zur Datenbank:', err.message);
    } else {
        console.log('Verbindung zur SQLite-Datenbank hergestellt.');
    }
});

// Tabelle erstellen (falls nicht vorhanden)
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS questions (
            id INTEGER PRIMARY KEY,
            question TEXT,
            category TEXT,
            option1 TEXT,
            option2 TEXT,
            option3 TEXT,
            correctOption INTEGER
        )
    `);
});

// API: Fragen abrufen
app.get('/api/questions', (req, res) => {
    db.all('SELECT * FROM questions LIMIT 100', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// API: Eine Frage hinzufügen
app.post('/api/questions', (req, res) => {
    const { question, category, option1, option2, option3, correctOption } = req.body;
    db.run(
        'INSERT INTO questions (question, category, option1, option2, option3, correctOption) VALUES (?, ?, ?, ?, ?, ?)',
        [question, category, option1, option2, option3, correctOption],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
            } else {
                res.json({ id: this.lastID, message: 'Frage hinzugefügt' });
            }
        }
    );
});

// API: Auswertung (Antworten überprüfen)
app.post('/api/evaluate', (req, res) => {
    const { answers } = req.body; // answers = [{ id, selectedOption }]
    let score = 0;

    answers.forEach((answer) => {
        db.get('SELECT correctOption FROM questions WHERE id = ?', [answer.id], (err, row) => {
            if (!err && row && row.correctOption === answer.selectedOption) {
                score++;
            }

            if (answers.indexOf(answer) === answers.length - 1) {
                res.json({ totalQuestions: answers.length, correctAnswers: score });
            }
        });
    });
});

// Server starten
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
