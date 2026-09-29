import {useEffect, useState} from "react";
import {Link} from "react-router-dom";

const COOKIE_KEY = "ratel_mind_cookie_preferences";

type CookiePreferences = {
  necessary: true;
  functional: boolean;
  analytics: boolean;
};

const defaultPreferences: CookiePreferences = {
  necessary: true,
  functional: false,
  analytics: false,
};

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>(defaultPreferences);

  useEffect(() => {
    const saved = localStorage.getItem(COOKIE_KEY);
    if (!saved) {
      setIsVisible(true);
      return;
    }

    try {
      const parsed = JSON.parse(saved) as CookiePreferences;
      setPreferences({
        necessary: true,
        functional: !!parsed.functional,
        analytics: !!parsed.analytics,
      });
    } catch {
      setIsVisible(true);
    }
  }, []);

  const persistPreferences = (next: CookiePreferences) => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify(next));
    setPreferences(next);
    setIsVisible(false);
    setIsExpanded(false);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <aside className="cookieConsent" aria-live="polite">
      <div className="cookieConsent__content">
        <p className="cookieConsent__eyebrow">Ustawienia prywatności</p>
        <h2>Szanujemy Twoją prywatność</h2>
        <p className="cookieConsent__text">
          Używamy niezbędnych plików cookies, aby strona działała poprawnie. Za Twoją zgodą możemy też
          zapisać ustawienia funkcjonalne i dane analityczne pomagające rozwijać serwis.
        </p>

        <div className="cookieConsent__actions">
          <button
            type="button"
            className="btn btn--primary btn--small"
            onClick={() => persistPreferences({necessary: true, functional: true, analytics: true})}
          >
            Akceptuj wszystkie
          </button>
          <button
            type="button"
            className="btn btn--ghost btn--small"
            onClick={() => persistPreferences(defaultPreferences)}
          >
            Tylko niezbędne
          </button>
          <button
            type="button"
            className="btn btn--outline btn--small"
            onClick={() => setIsExpanded((value) => !value)}
          >
            {isExpanded ? "Ukryj ustawienia" : "Dostosuj"}
          </button>
        </div>

        {isExpanded && (
          <div className="cookieConsent__panel">
            <label className="cookieConsent__option">
              <span>
                <strong>Niezbędne</strong>
                <small>Zawsze aktywne. Odpowiadają za działanie strony i zapis Twojej decyzji.</small>
              </span>
              <input type="checkbox" checked disabled />
            </label>

            <label className="cookieConsent__option">
              <span>
                <strong>Funkcjonalne</strong>
                <small>Pozwalają zapamiętać ustawienia i usprawnić korzystanie z serwisu.</small>
              </span>
              <input
                type="checkbox"
                checked={preferences.functional}
                onChange={(e) => setPreferences((current) => ({...current, functional: e.target.checked}))}
              />
            </label>

            <label className="cookieConsent__option">
              <span>
                <strong>Analityczne</strong>
                <small>Pomagają nam zrozumieć, które elementy strony działają najlepiej.</small>
              </span>
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={(e) => setPreferences((current) => ({...current, analytics: e.target.checked}))}
              />
            </label>

            <div className="cookieConsent__panelActions">
              <button
                type="button"
                className="btn btn--primary btn--small"
                onClick={() => persistPreferences(preferences)}
              >
                Zapisz ustawienia
              </button>
              <Link to="/cookie-policy" className="cookieConsent__link">
                Przeczytaj politykę cookies
              </Link>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
