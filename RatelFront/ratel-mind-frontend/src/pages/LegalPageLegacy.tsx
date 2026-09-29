import {Link} from "react-router-dom";
import type {LegalDocument} from "../content/legalContent.ts";

type LegalPageLegacyProps = {
  document: LegalDocument;
};

export default function LegalPageLegacy({document}: LegalPageLegacyProps) {
  return (
    <section className="legalPage">
      <div className="legalHero">
        <p className="legalHero__eyebrow">{document.eyebrow}</p>
        <h1 className="legalHero__title">{document.title}</h1>
        <p className="legalHero__intro">{document.intro}</p>
        <p className="legalHero__updated">{document.updatedAt}</p>
      </div>

      <div className="legalBody">
        {document.sections.map((section) => (
          <article key={section.title} className="legalSection">
            <h2>{section.title}</h2>
            {section.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {section.bullets && (
              <ul>
                {section.bullets.map((bullet) => (
                  <li key={bullet}>{bullet}</li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>

      <div className="legalFooterCta">
        <p>Masz pytania dotyczące prywatności, cookies lub zasad korzystania z serwisu?</p>
        <Link to="/contact" className="btn btn--primary">
          Skontaktuj się z nami
        </Link>
      </div>
    </section>
  );
}
