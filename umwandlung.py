import json
import csv

# Input-Datei und Output-Datei
input_file = "Fragenkatalog_Jaegerpruefung.csv"  # Exportiere zuerst dein PDF in ein CSV-Format
output_file = "Fragenkatalog_Jaegerpruefung.json"

# Daten aus CSV-Datei lesen und in JSON-Format umwandeln
def convert_to_json(input_file, output_file):
    with open(input_file, "r", encoding="cp1252") as csvfile:
        reader = csv.DictReader(csvfile)
        fragen_liste = []
        for row in reader:
            frage = {
                "id": row["ID"],
                "question": row["Frage"],
                "category": row["Sachgebiet"],
                "answers": [
                    {"text": row["Antwort Nr. 1"], "correct": row["Richtige Antwort = Nr."] == "1"},
                    {"text": row["Antwort Nr. 2"], "correct": row["Richtige Antwort = Nr."] == "2"},
                    {"text": row["Antwort Nr. 3"], "correct": row["Richtige Antwort = Nr."] == "3"},
                ],
            }
            fragen_liste.append(frage)

    # Daten als JSON-Datei speichern
    with open(output_file, "w", encoding="cp1252") as jsonfile:
        json.dump(fragen_liste, jsonfile, ensure_ascii=False, indent=4)

# Funktion ausführen
convert_to_json(input_file, output_file)
print(f"Die Daten wurden erfolgreich in {output_file} gespeichert!")
