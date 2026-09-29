# Porownanie klasycznego i AI-wspomaganego algorytmu klasyfikacji odpornosci psychicznej

## 1. Cel pracy

Celem pracy jest implementacja systemu wspomaganego przez sztuczna inteligencje do klasyfikacji odpornosci psychicznej oraz porownanie go z istniejacym algorytmem klasyfikacji zaimplementowanym w aplikacji webowej.

Praca ma odpowiedziec na pytanie:

**Czy zastosowanie AI poprawia jakosc interpretacji wynikow oraz uzytecznosc klasyfikacji w porownaniu do klasycznego algorytmu punktowego?**

## 2. Stan obecny systemu

W aktualnej wersji systemu (legacy) klasyfikacja dziala wedlug algorytmu klasycznego:

- test sklada sie z 48 pytan,
- kazda odpowiedz ma skale 1-5,
- czesc pytan jest odwrotnie punktowana,
- na podstawie odpowiedzi obliczany jest:
  - wynik laczny,
  - poziom ogolny,
  - wyniki dla 4 filarow,
  - wyniki dla 12 umiejetnosci.

Obecnie logika obliczen jest zaimplementowana po stronie frontendowej, a backend zapisuje jedynie gotowy wynik do bazy danych.

## 3. Algorytm klasyczny

### 3.1. Sposob punktacji

Kazda odpowiedz otrzymuje wartosc od 1 do 5.

Dla pytan standardowych:

- 1 = 1 punkt
- 2 = 2 punkty
- 3 = 3 punkty
- 4 = 4 punkty
- 5 = 5 punktow

Dla pytan odwrotnych:

- 1 = 5 punktow
- 2 = 4 punkty
- 3 = 3 punkty
- 4 = 2 punkty
- 5 = 1 punkt

Formalnie:

`score = 6 - answer` dla pytan odwrotnych  
`score = answer` dla pytan standardowych

### 3.2. Wynik ogolny

Suma punktow z 48 pytan daje wynik w zakresie od 48 do 240.

Poziomy ogolne:

- 48-60 -> poziom 1
- 61-120 -> poziom 2
- 121-180 -> poziom 3
- 181-219 -> poziom 4
- 220-240 -> poziom 5

### 3.3. Filary

System analizuje 4 filary:

- poznawczy,
- emocjonalny,
- behawioralny,
- spoleczny.

Kazdy filar ma maksymalnie 60 punktow.

Poziomy dla filaru:

- 12-24 -> niski
- 25-49 -> sredni
- 50-60 -> wysoki

### 3.4. Umiejetnosci

W ramach 4 filarow system analizuje lacznie 12 umiejetnosci.

Kazda umiejetnosc ma maksymalnie 20 punktow.

Poziomy dla umiejetnosci:

- 4-7 -> niski
- 8-15 -> sredni
- 16-20 -> wysoki

## 4. Planowany algorytm AI

Drugi algorytm bedzie algorytmem wspomaganym przez sztuczna inteligencje.

Jego zadaniem nie bedzie zastapienie testu, lecz:

- dodatkowa interpretacja odpowiedzi,
- alternatywna klasyfikacja poziomu odpornosci,
- wskazanie dominujacych obszarow i slabosci,
- wygenerowanie spersonalizowanych rekomendacji.

### 4.1. Dane wejsciowe dla AI

Do modelu AI beda przekazywane:

- odpowiedzi uzytkownika na 48 pytan,
- wynik ogolny,
- wyniki 4 filarow,
- wyniki 12 umiejetnosci,
- ewentualnie dodatkowe metadane, np. czas odpowiedzi.

### 4.2. Dane wyjsciowe z AI

Model AI powinien zwracac uporzadkowana odpowiedz, np. w formacie JSON:

```json
{
  "aiLevel": 2,
  "dominantPillars": ["Behavioral", "Social"],
  "summary": "Uzytkownik wykazuje sredni poziom odpornosci psychicznej z przewaga zasobow behawioralnych i spolecznych.",
  "recommendations": [
    "wzmacnianie regulacji emocjonalnej",
    "trening elastycznosci poznawczej",
    "utrwalanie strategii regeneracji"
  ]
}
```

## 5. Sposob porownania algorytmow

W pracy beda porownywane dwa podejscia:

1. algorytm klasyczny (punktowy),
2. algorytm AI-wspomagany.

### 5.1. Kryteria porownania

Porownanie moze obejmowac:

- zgodnosc poziomu koncowego,
- zgodnosc dominujacych filarow,
- stabilnosc wynikow,
- interpretowalnosc wynikow,
- jakosc i praktyczna wartosc rekomendacji.

### 5.2. Przyklad pytan badawczych

- Czy AI prowadzi do tej samej klasyfikacji poziomu co algorytm klasyczny?
- Czy AI lepiej opisuje profil uzytkownika niz sam wynik punktowy?
- Czy rekomendacje generowane przez AI sa bardziej szczegolowe i praktyczne?
- Czy sposob interakcji z testem (np. czas odpowiedzi) moze wplywac na ocene AI?

## 6. Zakres implementacji w systemie legacy

### 6.1. Backend

Planowane rozszerzenia:

- wydzielenie klasycznego algorytmu do backendu,
- dodanie serwisu AI do generowania klasyfikacji i interpretacji,
- zapis obu wynikow do bazy danych,
- endpoint porownujacy wynik klasyczny i AI.

### 6.2. Baza danych

Planowane przechowywanie:

- odpowiedzi uzytkownika,
- klasyczny wynik punktowy,
- klasyczny poziom,
- wynik AI,
- opis AI,
- rekomendacje AI,
- czas wykonania testu lub czasy odpowiedzi (opcjonalnie).

### 6.3. Frontend

Planowane rozszerzenia:

- prezentacja klasycznego wyniku,
- prezentacja wyniku AI,
- ekran porownania obu klasyfikacji,
- sekcja rekomendacji wygenerowanych przez AI.

## 7. Uzasadnienie wyboru rozwiazania

Algorytm klasyczny jest przejrzysty, stabilny i latwy do interpretacji matematycznej.  
Algorytm AI moze dostarczyc glebszej interpretacji, bardziej naturalnego opisu oraz spersonalizowanych rekomendacji.

Polaczenie obu podejsc pozwala:

- zachowac obiektywny model punktowy,
- jednoczesnie sprawdzic, czy AI wnosi dodatkowa wartosc analityczna i praktyczna.

## 8. Proponowany kolejny krok

Na etapie implementacji najpierw zostanie zachowany istniejacy algorytm klasyczny jako punkt odniesienia, a nastepnie zostanie dodany modul AI, ktory bedzie analizowal te same dane wejsciowe i generowal alternatywna klasyfikacje oraz rekomendacje.

To pozwoli przeprowadzic bezposrednie porownanie obu metod w ramach jednej aplikacji webowej.
