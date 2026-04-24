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

Installer deretter avhengigheter:

```bash
npm install
```

---

## Viktige scripts

| Script | Beskrivelse |
|--------|-------------|
| `npm run dev` | Start utviklingsserver med hot reload |
| `npm run build` | Bygg for produksjon (kjører TypeScript-sjekk og Vite build) |
| `npm run lint` | Sjekk koden for lintingfeil med Biome |
| `npm run lint:fix` | Fiks lintingfeil automatisk |
| `npm run test:run` | Kjør alle tester én gang |
| `npm test` | Kjør tester i watch-modus |

