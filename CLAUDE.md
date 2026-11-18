# Projekt-Tagebuch: Rheinpegel

## 1. Worum geht es?

**Rheinpegel** ist eine kleine Web-App (eine Webseite, die wie eine App im Handy-Browser läuft).
Sie zeigt die aktuellen **Wasserstände des Rheins** an.

- Man wählt eine **Messstation** (Pegel) aus einer Liste – oder lässt per **GPS** den nächstgelegenen Pegel suchen.
- Angezeigt werden: aktueller Wasserstand, ein **Diagramm** der letzten 7 Tage und – wenn vorhanden – eine **Vorhersage**.
- Die Daten kommen live von **Pegelonline** (offizieller Dienst der Wasserstraßen- und Schifffahrtsverwaltung des Bundes).

### Wo ist die App online?

- Code liegt auf GitHub: `marchens1977/Rheinpegel`
- Vermutlich über **GitHub Pages** erreichbar unter: https://marchens1977.github.io/Rheinpegel/
  (noch nicht bestätigt – bitte einmal prüfen und hier eintragen)

### Technischer Aufbau (wichtige Dateien)

| Datei | Was steckt drin |
|---|---|
| `index.html` | Die komplette App: Aussehen (CSS), Inhalt (HTML) und Logik (JavaScript) in einer Datei |
| `CLAUDE.md` | Dieses Tagebuch |

- **Chart.js** (Zeichen-Bibliothek für das Diagramm) wird aus dem Internet geladen, fest auf Version **4.4.1**.
- Datenquellen (Pegelonline-Schnittstelle, „API“ = Adresse, über die ein Programm Daten abfragen kann):
  - Stationsliste: `stations.json?water=RHEIN`
  - Messwerte der letzten 7 Tage: `.../W/measurements.json?start=P7D`
  - Vorhersage: `.../W/forecast.json`, falls dort nur alte Werte stehen, wird eine zweite Quelle abgefragt
- Wichtige Funktionen in `index.html`: `init`, `populateSelect`, `loadStationData`, `fetchForecastData`, `renderList`, `renderChart`, `calculateDistance`.
- Kein Server, keine Datenbank, keine Installation nötig – die Datei läuft direkt im Browser.

## 2. Wichtige Regeln und Entscheidungen

- **Zoom auf dem Handy bleibt erlaubt** (wichtig für gute Lesbarkeit / Barrierefreiheit).
- **Chart.js bleibt auf einer festen Version** (4.4.1), damit ein Update die App nicht plötzlich kaputt macht.
- Die App soll **einfach bleiben**: eine Datei, ohne Installation, gut auf dem Smartphone bedienbar.
- Gearbeitet wird in einem **eigenen Arbeitszweig** (Branch = Kopie des Codes zum Ausprobieren); in die Hauptversion (`main`) kommt es über einen **Pull Request** (Änderungsvorschlag).

## 3. Verlauf (was bisher erledigt wurde)

| Datum | Was | PR |
|---|---|---|
| 12.11.2026 | Erste Version der App per Upload auf GitHub hochgeladen | – |
| 15.11.2026 | App umbenannt in „Rheinpegel“ | – |
| 15.11.2026 | Zoom wieder erlaubt, Chart.js auf 4.4.1 festgelegt, Vorhersage mit zweiter Quelle, GPS-Knopf mit Hinweisen | – |
| 16.11.2026 | Dieses Projekt-Tagebuch (`CLAUDE.md`) angelegt | #1 |
| 18.11.2026 | Regel „Hilfsprogramme und Tests gehören ins Projekt“ ergänzt (Abschnitt 8) | #2 |

## 4. Offene Ideen / nächste Schritte

- [ ] Prüfen und hier eintragen, unter welcher Adresse die App online ist
- [ ] Warnfarbe bei sehr hohem oder sehr niedrigem Pegel
- [ ] Lieblings-Pegel merken (wird beim Öffnen direkt angezeigt)
- [ ] App auf dem Handy-Startbildschirm ablegen können (wie eine echte App)
- [ ] Dunkel-Modus / schöneres Aussehen

## 5. Hinweise zur Zusammenarbeit

- Der Nutzer ist **Programmier-Laie** (nutzt KI für „Vibe-Coding“).
- **Einfaches Deutsch**, Fachbegriffe vermeiden oder kurz erklären.
- **Kleine, nummerierte Schritte.**
- Immer klar sagen: **Was übernimmt Claude** – und **was muss der Nutzer selbst tun**.
- Claude soll **alles übernehmen, was möglich ist** (inkl. Pull Request anlegen und mergen).
- Hardware des Nutzers: nur ein **Samsung-Smartphone (Chrome)** und ein **Raspberry Pi 400**. Kein PC/Mac.

## 6. Regel zum Modell

Wenn du nicht auf Opus läufst (z. B. Fable) und eine Aufgabe abgeschlossen ist, erinnere den Nutzer am Ende der Antwort:
**„Tipp: Du kannst jetzt mit /model claude-opus-5-5 zurückstellen.“**

## 7. Regel zum Tagebuch

**Nach jeder größeren Änderung dieses Tagebuch aktualisieren** (Verlauf, Entscheidungen, offene Ideen).

## 8. Regel: Hilfsprogramme und Tests gehören ins Projekt

1. Automatische Prüfungen (Tests = kleine Programme, die von selbst nachschauen, ob die App noch richtig funktioniert) und Hilfsprogramme, die über eine einzelne Aufgabe hinaus nützlich sind, werden **im Projekt gespeichert** (z. B. Ordner `werkzeuge/` oder `test/`) – nicht nur im Arbeitsbereich der Sitzung, der beim Archivieren verloren geht.
2. Hier im Tagebuch steht, **wie man sie startet und was sie prüfen**.
3. **Nach jeder Code-Änderung** die vorhandenen Prüfungen laufen lassen; bei neuen Funktionen passende Prüfpunkte ergänzen.
4. Gibt es noch keine automatische Prüfung, **bei der nächsten Code-Änderung eine einfache anlegen**.
5. Was Claude nicht selbst testen kann (z. B. echte Anmeldungen, das echte Handy, den Raspberry Pi), hier im Tagebuch **als Test für den Nutzer** vermerken.

### Vorhandene Prüfungen und Hilfsprogramme

- Noch keine. (Stand 18.11.2026 – wird bei der nächsten Code-Änderung angelegt.)

### Tests für den Nutzer (kann Claude nicht selbst prüfen)

- App auf dem Samsung-Handy in Chrome öffnen: Lädt die Stationsliste? Erscheinen Wasserstand, Diagramm und Vorhersage?
- GPS-Knopf auf dem Handy ausprobieren: Wird der nächste Pegel gefunden?
