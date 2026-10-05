# Ratel Mind Legacy

Ten projekt jest odseparowany od głównego `Ratel_PROJ-master` i może działać niezależnie.

## Porty i baza danych

- Frontend (Vite): `http://localhost:5174`
- Frontend preview: `http://localhost:4174`
- Backend (Spring Boot): `http://localhost:8081`
- Postgres (Docker): `localhost:5433`
- Nazwa bazy: `ratel_mind_legacy`

## Uruchomienie

### 1. Baza danych

W katalogu:

`C:\Users\lolik\Desktop\Ratel_PROJ\Ratel_PROJ-master-legacy\ratel-mind-backend\local-ratel-mind`

uruchom:

```powershell
docker compose up -d
```

### 2. Backend

W katalogu:

`C:\Users\lolik\Desktop\Ratel_PROJ\Ratel_PROJ-master-legacy\ratel-mind-backend`

uruchom:

```powershell
.\mvnw.cmd spring-boot:run
```

Backend domyślnie startuje na porcie `8081` i łączy się z:

`jdbc:postgresql://localhost:5433/ratel_mind_legacy`

### 3. Frontend

W katalogu:

`C:\Users\lolik\Desktop\Ratel_PROJ\Ratel_PROJ-master-legacy\RatelFront\ratel-mind-frontend`

uruchom:

```powershell
npm install
npm run dev
```

Frontend używa:

`VITE_API_BASE_URL=http://localhost:8081`

## Zmienne środowiskowe

Przed uruchomieniem wysyłki formularzy ustaw w środowisku backendu:

```powershell
$env:EMAIL_USERNAME="twoj-adres@gmail.com"
$env:EMAIL_PASSWORD="haslo-aplikacji-gmail"
$env:EMAIL_RECEIVER="adres-odbiorcy@example.com"
```

Klucze AI są opcjonalne. Aby włączyć analizę przez OpenRouter, ustaw:

```powershell
$env:OPENROUTER_API_KEY="twoj-klucz-openrouter"
$env:OPENROUTER_MODEL="openai/gpt-4o"
```

Możesz też opcjonalnie ustawić `OPENROUTER_SITE_URL` i `OPENROUTER_SITE_NAME` dla nagłówków OpenRouter. Bez klucza aplikacja korzysta z demonstracyjnej analizy fallback.

## Oddzielenie od mastera

Legacy ma teraz własne:

- porty (`5174`, `4174`, `8081`, `5433`)
- kontener Docker (`ratel-mind-legacy-db`)
- wolumen Docker (`postgres_legacy_data`)
- bazę danych (`ratel_mind_legacy`)

Dzięki temu nie powinien kolidować z głównym projektem.
