# Projekt-Tagebuch: Rheinpegel

## 1. Worum geht es?

**Rheinpegel** ist eine kleine Web-App (eine Webseite, die wie eine App im Handy-Browser läuft).
Sie zeigt die aktuellen **Wasserstände des Rheins** an.

- Man wählt eine **Messstation** (Pegel) aus einer Liste – oder lässt per **GPS** den nächstgelegenen Pegel suchen.
- Angezeigt werden: aktueller Wasserstand, ein **Diagramm** der letzten 7 Tage und – wenn vorhanden – eine **Vorhersage**.
- Die Daten kommen live von **Pegelonline** (offizieller Dienst der Wasserstraßen- und Schifffahrtsverwaltung des Bundes).

### Wo ist die App online?

- Code liegt auf GitHub: `marchens1977/Rheinpegel`
- Online über **GitHub Pages** (kostenloser Webseiten-Dienst von GitHub): https://marchens1977.github.io/Rheinpegel/
  (vom Nutzer am Handy bestätigt)

### Technischer Aufbau (wichtige Dateien)

| Datei | Was steckt drin |
|---|---|
| `index.html` | Die komplette App: Aussehen (CSS), Inhalt (HTML) und Logik (JavaScript) in einer Datei |
| `manifest.webmanifest` | „Ausweis“ der App: Name, Farben, Symbol – damit man sie installieren kann |
| `sw.js` | Service Worker (kleiner Helfer im Browser): speichert die App-Dateien, damit sie installierbar ist und ohne Netz startet. **Bei Änderungen an App-Dateien die Versionsnummer `rheinpegel-vX` erhöhen.** |
| `icons/` | App-Symbol (`icon.svg` = Vorlage, PNGs in 180/192/512 Pixel) |
| `werkzeuge/icons-erzeugen.js` | Macht aus `icon.svg` die PNG-Symbole |
| `test/` | Automatische Prüfung (siehe Abschnitt 8) |
| `CLAUDE.md` | Dieses Tagebuch |

- **Chart.js** (Zeichen-Bibliothek für das Diagramm) wird aus dem Internet geladen, fest auf Version **4.4.1**.
- Datenquellen (Pegelonline-Schnittstelle, „API“ = Adresse, über die ein Programm Daten abfragen kann):
  - Stationsliste: `stations.json?water=RHEIN`
  - Messwerte der letzten 7 Tage: `.../W/measurements.json?start=P7D`
  - Vorhersage: `.../W/forecast.json`, falls dort nur alte Werte stehen, wird eine zweite Quelle abgefragt
- Wichtige Funktionen in `index.html`: `init`, `populateSelect`, `loadStationData`, `fetchForecastData`, `renderList`, `renderChart`, `calculateDistance`, `saveStation`/`loadSavedStation` (Lieblings-Pegel).
- Kein Server, keine Datenbank, keine Installation nötig – die Datei läuft direkt im Browser.

## 2. Wichtige Regeln und Entscheidungen

- **Zoom auf dem Handy bleibt erlaubt** (wichtig für gute Lesbarkeit / Barrierefreiheit).
- **Chart.js bleibt auf einer festen Version** (4.4.1), damit ein Update die App nicht plötzlich kaputt macht.
- Die App soll **einfach bleiben**: eine Datei, ohne Installation, gut auf dem Smartphone bedienbar.
- **Farben: Mets-Stil** – Blau `#002D72` und Orange `#FF5910` (als Farb-Variablen `--blau` / `--orange` oben im CSS). Nur die Farben, kein Mets-Logo (Markenrecht).
- **Installierbar als Web-App (PWA), keine APK.** Grund: Die App braucht nur Internet und GPS – das kann der Browser. Eine PWA aktualisiert sich von selbst über GitHub Pages, eine APK müsste man bei jeder Änderung neu bauen und neu installieren.
- Pegeldaten werden **nie** zwischengespeichert (immer live); nur die App-Dateien werden für den Offline-Start gespeichert.
- Der zuletzt gewählte Pegel wird im Browser gemerkt (`localStorage`) und beim Öffnen direkt angezeigt.
- Gearbeitet wird in einem **eigenen Arbeitszweig** (Branch = Kopie des Codes zum Ausprobieren); in die Hauptversion (`main`) kommt es über einen **Pull Request** (Änderungsvorschlag).

## 3. Verlauf (was bisher erledigt wurde)

| Datum | Was | PR |
|---|---|---|
| 12.11.2026 | Erste Version der App per Upload auf GitHub hochgeladen | – |
| 15.11.2026 | App umbenannt in „Rheinpegel“ | – |
| 15.11.2026 | Zoom wieder erlaubt, Chart.js auf 4.4.1 festgelegt, Vorhersage mit zweiter Quelle, GPS-Knopf mit Hinweisen | – |
| 16.11.2026 | Dieses Projekt-Tagebuch (`CLAUDE.md`) angelegt | #1 |
| 18.11.2026 | Regel „Hilfsprogramme und Tests gehören ins Projekt“ ergänzt (Abschnitt 8) | #2 |
| 18.11.2026 | Online-Adresse der App bestätigt und eingetragen | #3 |
| 19.11.2026 | Neues Design in Blau/Orange (Mets-Farben), installierbar als Web-App (PWA) mit Symbol und Offline-Start, Lieblings-Pegel wird gemerkt, erste automatische Prüfung angelegt | #4 |

## 4. Offene Ideen / nächste Schritte

- [x] Prüfen und hier eintragen, unter welcher Adresse die App online ist
- [ ] Warnfarbe bei sehr hohem oder sehr niedrigem Pegel
- [x] Lieblings-Pegel merken (wird beim Öffnen direkt angezeigt)
- [x] App auf dem Handy-Startbildschirm ablegen können (wie eine echte App)
- [x] Schöneres Aussehen (Blau/Orange)
- [ ] Dunkel-Modus
- [ ] Falls doch eine APK gewünscht: PWA mit „Bubblewrap“/PWABuilder in eine APK verpacken (nicht nötig, solange die PWA reicht)

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

- **`test/app-test.js`** – automatische Prüfung der ganzen App.
  - Start: `cd test && npm install && npm test` (Bild der App dazu: `node app-test.js --bild` → `test/screenshots/app.png`, wird nicht hochgeladen)
  - Startet einen kleinen lokalen Webserver und öffnet die App in einem unsichtbaren Browser in Handy-Größe.
  - Pegelonline wird durch **Beispieldaten** ersetzt (in der Claude-Umgebung ist Pegelonline gesperrt). Chart.js kommt aus einer lokalen Kopie (gleiche Version 4.4.1, über `npm install`).
  - Prüft: Manifest und Symbole, Chart.js-Version, Zoom erlaubt, Farben, Stationsliste (nur Rhein, sortiert), Wasserstand, Vorhersage, Diagramm, Lieblings-Pegel, Service Worker aktiv, Start ohne Internet, keine JavaScript-Fehler.
- **`werkzeuge/icons-erzeugen.js`** – erzeugt die PNG-Symbole aus `icons/icon.svg`. Start: `node werkzeuge/icons-erzeugen.js`

### Tests für den Nutzer (kann Claude nicht selbst prüfen) – zum Abhaken

- [ ] App auf dem Samsung-Handy in Chrome öffnen: Lädt die Stationsliste mit **echten** Daten? Erscheinen Wasserstand, Diagramm und Vorhersage?
- [ ] GPS-Knopf auf dem Handy ausprobieren: Wird der nächste Pegel gefunden?
- [ ] Neues Design in Blau/Orange gefällt und ist gut lesbar
- [ ] Installieren: Erscheint der Knopf „App installieren“ (oder im Chrome-Menü ⋮ „App installieren“ / „Zum Startbildschirm hinzufügen“)? Liegt danach das blau-orange Symbol auf dem Startbildschirm?
- [ ] Installierte App öffnet sich ohne Browser-Leiste, oben in Blau
- [ ] App schließen und wieder öffnen: Wird der zuletzt gewählte Pegel direkt angezeigt?
- [ ] Flugmodus an, App öffnen: Startet sie und zeigt einen verständlichen Hinweis statt einer leeren Seite?
