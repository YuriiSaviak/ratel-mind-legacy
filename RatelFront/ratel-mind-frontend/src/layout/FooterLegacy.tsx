import {Link} from "react-router-dom";
import LogoWhite from "../assets/SVG_ratel_mind_logo_white.svg";

const sitemapLinks = [
  {to: "/about", label: "O nas"},
  {to: "/test", label: "Rozwiąż test"},
  {to: "/workshops", label: "Warsztaty"},
];

const legalLinks = [
  {to: "/privacy-policy", label: "Polityka prywatności"},
  {to: "/cookie-policy", label: "Polityka cookies"},
  {to: "/terms-and-conditions", label: "Regulamin"},
];

export default function FooterLegacy() {
  return (
    <footer className="footer">
      <div className="container footer__shell">
        <div className="footer__brand">
          <img src={LogoWhite} alt="Ratel Mind" className="footer__logo"/>
          <p className="footer__lead">
            Psychologia odporności psychicznej w praktycznej, nowoczesnej i odpowiedzialnej formie.
          </p>
        </div>

        <div className="footer__grid">
          <div className="footer__column">
            <span className="footer__label">Mapa strony</span>
            <nav className="footer__links" aria-label="Mapa strony">
              {sitemapLinks.map((item) => (
                <Link key={item.to} to={item.to} className="footer__link">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="footer__column">
            <span className="footer__label">Dokumenty</span>
            <nav className="footer__links" aria-label="Dokumenty prawne">
              {legalLinks.map((item) => (
                <Link key={item.to} to={item.to} className="footer__link">
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="footer__column">
            <span className="footer__label">Kontakt</span>
            <div className="footer__meta">
              <a className="footer__link" href="mailto:kontakt@ratelmind.pl">kontakt@ratelmind.pl</a>
              <a className="footer__link" href="https://linkedin.com/company/ratelmind" target="_blank" rel="noreferrer">
                LinkedIn
              </a>
              <a className="footer__link" href="https://instagram.com/ratel_mind" target="_blank" rel="noreferrer">
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          <span>(c) 2026 Ratel Mind</span>
          <span>Wersja polska serwisu</span>
        </div>
      </div>
    </footer>
  );
}
