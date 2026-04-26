# trading-frontend

Frontend-applikasjon for visualisering og analyse av aksjedata. Appen lar deg se historiske kurser og prediksjoner for aksjer, og gjennomføre eksperimenter der du sporer kjøp og salg over tid.

## Funksjoner

- **Aksjevisning** – Se kurser som linje- eller lysestakediagram med volum, prediksjoner og støttelinjer
- **SVR-analyse** – Visualiser maskinlæringsbaserte prediksjoner med øvre og nedre epsilon-grenser
- **Eksperimenter** – Opprett og følg opp tradingeksperimenter med inn- og utgang, og beregn profitt
- **Støttelinjer** – Legg til egendefinerte prislinjer i chartene dine

Bygget med React, TypeScript og Vite. Bruker [lightweight-charts](https://github.com/tradingview/lightweight-charts) for charting og [TanStack Query](https://tanstack.com/query) for datahenting.

---

## Oppsett med nvm

Prosjektet bruker Node.js versjon spesifisert i `.nvmrc`. Installer og aktiver riktig versjon med [nvm](https://github.com/nvm-sh/nvm):

```bash
nvm install
nvm use
```

---

## Start dev-server med ett script

Etter at du har satt opp riktig Node-versjon (se over), kan du starte alt med ett kommando:

```bash
./start-dev.sh
```

Scriptet kjører `nvm install`, `nvm use`, `npm install` og `npm run dev` i rekkefølge.

> **Merk:** Første gang må du gjøre scriptet kjørbart:
> ```bash
> chmod +x start-dev.sh
> ```

---

## Viktige scripts

| Script | Beskrivelse |
|--------|-------------|
| `npm run dev` | Start utviklingsserver med hot reload |
| `npm run build` | Bygg for produksjon (kjører TypeScript-sjekk og Vite build) |
| `npm run lint` | Sjekk koden for lintingfeil med Biome |
| `npm run lint:fix` | Fiks lintingfeil automatisk |
| `npm run test:run` | Kjør alle enhetstester én gang |
| `npm test` | Kjør enhetstester i watch-modus |
| `npm run test:e2e` | Kjør Playwright E2E-tester |
| `npm run test:server` | Start lokal testserver med fixture-data (port 8002) |
| `npm run dev:test` | Start Vite mot testserveren (for manuell testing) |

---

## Testing

### Enhetstester

Kjøres med [Vitest](https://vitest.dev/):

```bash
npm run test:run
```

### E2E-tester (Playwright)

E2E-testene bruker [Playwright](https://playwright.dev/) og trenger ikke en ekte backend. En lokal testserver serverer fixture-data fra `e2e/fixtures/` over HTTP.

Første gang må du installere Chromium:

```bash
npx playwright install chromium
```

Kjør alle E2E-tester:

```bash
npm run test:e2e
```

Playwright starter testserveren (port 8002) og Vite (port 5173) automatisk.

### Manuell testing mot fixture-data

For å kjøre appen i nettleser mot fixture-data (uten ekte backend), start begge serverne i hvert sitt terminalvindu:

```bash
# Terminal 1 – fixture-server
npm run test:server

# Terminal 2 – Vite mot fixture-server
npm run dev:test
```

Åpne deretter [http://localhost:5173](http://localhost:5173).

Fixture-filene ligger i `e2e/fixtures/` og dekker endepunktene `/resources`, `/experiments`, eksperimentdetaljer og chartdata.

