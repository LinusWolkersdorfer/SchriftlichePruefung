#!/bin/bash

# Frontend-Abhängigkeiten installieren
echo "Installiere Abhängigkeiten für das Frontend..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "Fehler beim Installieren der Frontend-Abhängigkeiten."
    exit 1
fi

# Backend-Abhängigkeiten installieren
echo "Installiere Abhängigkeiten für das Backend..."
cd ../backend
npm install
if [ $? -ne 0 ]; then
    echo "Fehler beim Installieren der Backend-Abhängigkeiten."
    exit 1
fi

# Backend starten
echo "Starte Backend..."
node backend.js &
BACKEND_PID=$!

# Frontend starten
echo "Starte Frontend..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

# Beide Prozesse laufen lassen
echo "Backend läuft mit PID $BACKEND_PID"
echo "Frontend läuft mit PID $FRONTEND_PID"
echo "Drücke Strg+C, um beide Prozesse zu stoppen."

# Cleanup beim Beenden des Skripts
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT

# Verhindert, dass das Skript sofort beendet wird
wait
