const express = require('express');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = 5000;

// Middleware für JSON-Daten
app.use(express.json());

const cors = require('cors');
app.use(cors());

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

const multer = require("multer");
const fs = require("fs");
const csvParser = require("csv-parser");

// Multer für den Datei-Upload konfigurieren
const upload = multer({ dest: "uploads/" });

// API-Route zum Hochladen und Verarbeiten der CSV-Datei
app.post("/api/upload", upload.single("csv"), (req, res) => {
    // Überprüfe, ob die Datei vorhanden ist
    if (!req.file) {
        console.error("Keine Datei hochgeladen!");
        return res.status(400).json({ error: "Keine Datei hochgeladen." });
    }
    
    const filePath = req.file.path;

    // CSV-Daten einlesen und in die Datenbank einfügen
    const questions = [];
    fs.createReadStream(filePath)
        .pipe(csvParser())
        .on("data", (row) => {
            const { question, category, option1, option2, option3, correctOption } = row;
            questions.push([question, category, option1, option2, option3, parseInt(correctOption)]);
        })
        .on("end", () => {
            // Fragen in die Datenbank einfügen
            const sql = `
                INSERT INTO questions (question, category, option1, option2, option3, correctOption)
                VALUES (?, ?, ?, ?, ?, ?)
            `;
            questions.forEach((q) => {
                db.run(sql, q, (err) => {
                    if (err) {
                        console.error("Fehler beim Einfügen der Frage:", err.message);
                    }
                });
            });

            // Temporäre Datei löschen
            fs.unlinkSync(filePath);

            res.status(200).json({ message: "CSV-Datei erfolgreich verarbeitet!" });
        })
        .on("error", (error) => {
            console.error("Fehler beim Verarbeiten der CSV-Datei:", error);
            res.status(500).json({ error: "Fehler beim Verarbeiten der Datei." });
        });
});


// Server starten
app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
