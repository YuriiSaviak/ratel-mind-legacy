export type LegalSection = {
  title: string;
  paragraphs: string[];
  bullets?: string[];
};

export type LegalDocument = {
  eyebrow: string;
  title: string;
  intro: string;
  updatedAt: string;
  sections: LegalSection[];
};

export const privacyPolicyContent: LegalDocument = {
  eyebrow: "Dokument prawny",
  title: "Polityka prywatności",
  intro:
    "Dbamy o Twoją prywatność i przejrzystość przetwarzania danych. Poniżej opisujemy, jakie dane zbieramy, w jakim celu z nich korzystamy oraz jakie prawa przysługują Ci w związku z korzystaniem z serwisu Ratel Mind.",
  updatedAt: "Ostatnia aktualizacja: 30 marca 2026",
  sections: [
    {
      title: "1. Administrator danych",
      paragraphs: [
        "Administratorem danych osobowych przetwarzanych w ramach serwisu Ratel Mind jest Ratel Mind. W sprawach dotyczących prywatności możesz skontaktować się z nami za pośrednictwem formularza kontaktowego dostępnego na stronie Kontakt.",
        "Dokładne dane identyfikacyjne administratora, adres korespondencyjny oraz dane rejestrowe zostaną uzupełnione przed publikacją wersji produkcyjnej serwisu.",
      ],
    },
    {
      title: "2. Jakie dane przetwarzamy",
      paragraphs: [
        "Zakres danych zależy od sposobu korzystania z serwisu. Możemy przetwarzać dane podane dobrowolnie w formularzu kontaktowym, dane techniczne związane z działaniem strony oraz informacje niezbędne do zapamiętania Twoich ustawień i zgód.",
      ],
      bullets: [
        "imię i nazwisko lub inne dane wpisane w formularzu kontaktowym,",
        "adres e-mail i numer telefonu, jeśli zdecydujesz się je podać,",
        "treść wiadomości przesyłanej przez formularz,",
        "informacje techniczne, takie jak adres IP, typ przeglądarki, ustawienia urządzenia i dane o sesji,",
        "dane zapisane lokalnie w przeglądarce, na przykład status zgody na cookies oraz postęp w teście.",
      ],
    },
    {
      title: "3. Cele i podstawy przetwarzania",
      paragraphs: [
        "Przetwarzamy dane wyłącznie w zakresie niezbędnym do świadczenia usług, odpowiadania na wiadomości oraz poprawy działania serwisu.",
      ],
      bullets: [
        "obsługa formularza kontaktowego i odpowiedź na przesłane zapytanie,",
        "zapewnienie działania strony, bezpieczeństwa i ciągłości usług,",
        "zapamiętywanie ustawień interfejsu oraz zgód cookies,",
        "analiza techniczna i rozwój serwisu, jeżeli użytkownik wyrazi na to zgodę.",
      ],
    },
    {
      title: "4. Przechowywanie danych",
      paragraphs: [
        "Dane przechowujemy przez okres niezbędny do realizacji celu, dla którego zostały zebrane, lub przez okres wynikający z obowiązków prawnych. Dane przesłane przez formularz kontaktowy są przechowywane tak długo, jak jest to potrzebne do obsługi korespondencji i ewentualnego dalszego kontaktu.",
      ],
    },
    {
      title: "5. Odbiorcy danych",
      paragraphs: [
        "Dane mogą być powierzane podmiotom wspierającym nas technicznie, takim jak dostawcy hostingu, infrastruktury IT, usług pocztowych lub narzędzi bezpieczeństwa. Każdorazowo dzieje się to z poszanowaniem zasad poufności i minimalizacji danych.",
      ],
    },
    {
      title: "6. Twoje prawa",
      paragraphs: [
        "Masz prawo do dostępu do swoich danych, ich sprostowania, usunięcia, ograniczenia przetwarzania, przenoszenia danych oraz wniesienia sprzeciwu wobec przetwarzania w przypadkach przewidzianych prawem.",
        "Masz także prawo cofnąć zgodę w dowolnym momencie, jeżeli przetwarzanie odbywa się na podstawie zgody. Cofnięcie zgody nie wpływa na zgodność z prawem przetwarzania dokonanego przed jej cofnięciem.",
      ],
    },
    {
      title: "7. Cookies i technologie podobne",
      paragraphs: [
        "Szczegółowe informacje dotyczące wykorzystywania plików cookies i podobnych technologii znajdziesz w osobnym dokumencie: Polityka cookies.",
      ],
    },
    {
      title: "8. Zmiany dokumentu",
      paragraphs: [
        "Polityka prywatności może być aktualizowana wraz z rozwojem serwisu, zmianami technologicznymi lub wymogami prawa. Aktualna wersja jest zawsze publikowana na tej stronie wraz z datą ostatniej aktualizacji.",
      ],
    },
  ],
};

export const cookiePolicyContent: LegalDocument = {
  eyebrow: "Dokument prawny",
  title: "Polityka dotycząca plików cookie",
  intro:
    "Ta strona korzysta z plików cookies oraz podobnych technologii, aby działać prawidłowo, zapamiętywać Twoje ustawienia i wspierać rozwój serwisu. Poniżej wyjaśniamy, czym są cookies i jak możesz zarządzać zgodą.",
  updatedAt: "Ostatnia aktualizacja: 30 marca 2026",
  sections: [
    {
      title: "1. Czym są pliki cookies",
      paragraphs: [
        "Cookies to niewielkie pliki tekstowe zapisywane na Twoim urządzeniu podczas odwiedzania strony internetowej. Umożliwiają rozpoznanie przeglądarki, utrzymanie sesji, zapamiętanie preferencji oraz analizę sposobu korzystania z serwisu.",
      ],
    },
    {
      title: "2. Jakich cookies używamy",
      paragraphs: [
        "W serwisie Ratel Mind możemy korzystać z kilku kategorii cookies, zależnie od Twojej zgody i aktualnie używanych funkcji.",
      ],
      bullets: [
        "niezbędne: wspierają podstawowe działanie strony, bezpieczeństwo i zapis ustawień sesji,",
        "funkcjonalne: zapamiętują preferencje użytkownika, na przykład wybory interfejsu,",
        "analityczne: pomagają zrozumieć, jak użytkownicy korzystają z serwisu i które elementy wymagają poprawy,",
        "marketingowe: będą stosowane wyłącznie po wdrożeniu odpowiednich narzędzi i po uzyskaniu wyraźnej zgody.",
      ],
    },
    {
      title: "3. W jakim celu używamy cookies",
      paragraphs: [
        "Cookies pomagają nam zapewnić stabilne działanie strony, chronić jej integralność, zapamiętać decyzje użytkownika oraz rozwijać serwis w oparciu o zanonimizowane dane statystyczne, jeśli użytkownik wyrazi na to zgodę.",
      ],
    },
    {
      title: "4. Zarządzanie zgodą",
      paragraphs: [
        "Podczas pierwszej wizyty wyświetlamy okno zgody na cookies. Możesz zaakceptować wszystkie kategorie, odrzucić wszystkie opcjonalne kategorie albo zapisać własne ustawienia.",
        "Swoją decyzję możesz w każdej chwili zmienić, usuwając zapisane dane strony w przeglądarce lub korzystając z ustawień cookies, jeśli taka funkcja została udostępniona w serwisie.",
      ],
    },
    {
      title: "5. Cookies stron trzecich",
      paragraphs: [
        "W miarę rozwoju serwisu możemy korzystać z narzędzi podmiotów trzecich, takich jak systemy analityczne, formularze lub osadzone treści. Wdrożenie takich narzędzi będzie poprzedzone aktualizacją tej polityki oraz odpowiednim mechanizmem zgody.",
      ],
    },
    {
      title: "6. Jak wyłączyć cookies",
      paragraphs: [
        "Możesz ograniczyć lub zablokować cookies z poziomu ustawień swojej przeglądarki. Pamiętaj jednak, że wyłączenie cookies niezbędnych może wpłynąć na działanie niektórych funkcji strony.",
      ],
    },
  ],
};

export const termsContent: LegalDocument = {
  eyebrow: "Dokument prawny",
  title: "Regulamin",
  intro:
    "Niniejszy regulamin określa zasady korzystania z serwisu internetowego Ratel Mind. Korzystając ze strony, akceptujesz poniższe warunki w zakresie, w jakim mają one zastosowanie do udostępnianych funkcji i treści.",
  updatedAt: "Ostatnia aktualizacja: 30 marca 2026",
  sections: [
    {
      title: "1. Postanowienia ogólne",
      paragraphs: [
        "Serwis Ratel Mind ma charakter informacyjny, edukacyjny i rozwojowy. Udostępniane treści oraz test odporności psychicznej służą samopoznaniu i wsparciu rozwoju, ale nie stanowią diagnozy medycznej ani psychoterapeutycznej.",
      ],
    },
    {
      title: "2. Zasady korzystania z serwisu",
      paragraphs: [
        "Użytkownik zobowiązuje się korzystać z serwisu zgodnie z prawem, dobrymi obyczajami oraz w sposób nienaruszający praw administratora i osób trzecich.",
      ],
      bullets: [
        "zakazane jest dostarczanie treści bezprawnych, obraźliwych lub wprowadzających w błąd,",
        "zakazane jest podejmowanie działań mogących zakłócić funkcjonowanie strony,",
        "wyniki testu powinny być interpretowane z uwzględnieniem ich informacyjnego i wspierającego charakteru.",
      ],
    },
    {
      title: "3. Test i wyniki",
      paragraphs: [
        "Test dostępny w serwisie prezentuje profil odporności psychicznej na podstawie udzielonych odpowiedzi. Wynik ma charakter orientacyjny i nie zastępuje konsultacji ze specjalistą.",
        "Administrator zastrzega sobie prawo do modyfikacji pytań, sposobu prezentacji wyników i funkcji serwisu w celu poprawy jakości oraz bezpieczeństwa działania.",
      ],
    },
    {
      title: "4. Formularz kontaktowy",
      paragraphs: [
        "Korzystając z formularza kontaktowego, użytkownik potwierdza, że przekazywane dane są prawdziwe i aktualne. Administrator może odpowiedzieć na wiadomość drogą elektroniczną lub telefoniczną, w zależności od zakresu zapytania i podanych danych kontaktowych.",
      ],
    },
    {
      title: "5. Własność intelektualna",
      paragraphs: [
        "Treści, grafiki, układ strony, nazwa marki, elementy identyfikacji wizualnej oraz autorskie materiały opublikowane w serwisie podlegają ochronie prawnej. Ich kopiowanie, rozpowszechnianie lub wykorzystywanie bez zgody administratora jest zabronione, chyba że przepisy prawa stanowią inaczej.",
      ],
    },
    {
      title: "6. Odpowiedzialność",
      paragraphs: [
        "Administrator dokłada należytej staranności, aby serwis działał poprawnie, jednak nie gwarantuje jego pełnej dostępności w każdym czasie. Nie ponosi odpowiedzialności za skutki korzystania z treści serwisu w sposób sprzeczny z ich przeznaczeniem.",
      ],
    },
    {
      title: "7. Zmiany regulaminu",
      paragraphs: [
        "Regulamin może być aktualizowany wraz z rozwojem serwisu lub zmianami przepisów prawa. Aktualna wersja jest zawsze publikowana na tej stronie.",
      ],
    },
  ],
};
