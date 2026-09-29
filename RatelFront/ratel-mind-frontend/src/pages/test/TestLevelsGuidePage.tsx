import {Link, useLocation} from "react-router-dom";
import {LEVEL_DETAILS, PILLAR_DETAILS} from "../../testData";
import {Pillar} from "../../types/Types.ts";
import {localizePillarName} from "./testShared.ts";

const LEVELS = [1, 2, 3, 4, 5] as const;
const PILLARS = [Pillar.Cognitive, Pillar.Emotional, Pillar.Behavioral, Pillar.Social] as const;

export default function TestLevelsGuidePage() {
    const location = useLocation();

    return (
        <section className="levelsGuidePage">
            <div className="levelsGuidePage__header">
                <div>
                    <p className="levelsGuidePage__eyebrow">Ratel Mind</p>
                    <h1>Opis poziomów i filarów odporności</h1>
                    <p className="levelsGuidePage__lead">
                        Ta strona pomaga odczytać zarówno wynik końcowy testu, jak i znaczenie czterech filarów odporności psychicznej. Dzięki temu łatwiej zrozumiesz, co dokładnie pokazuje Twój raport.
                    </p>
                </div>
                <div className="levelsGuidePage__actions">
                    <Link to={`/test/result${location.search}`} className="btn btn--ghost">Wróć do wyniku</Link>
                    <Link to={`/test/ai${location.search}`} reloadDocument className="btn btn--ghost">Zobacz interpretację AI</Link>
                </div>
            </div>

            <div className="levelsGuidePage__section">
                <div className="levelsGuidePage__sectionHead">
                    <h2>Poziomy ogólne</h2>
                    <p>Każdy poziom pokazuje inny etap budowania odporności psychicznej i inny sposób reagowania na presję, stres oraz niepewność.</p>
                </div>
                <div className="levelsGuidePage__grid">
                    {LEVELS.map((level) => {
                        const detail = LEVEL_DETAILS.get(level);
                        if (!detail) return null;

                        return (
                            <article key={level} className="levelGuideCard">
                                <div className="levelGuideCard__number">Poziom {level}</div>
                                <h3>{detail.motto}</h3>
                                <p className="levelGuideCard__description">{detail.description}</p>
                                <blockquote>„{detail.quote}”</blockquote>
                                <p className="levelGuideCard__tip">
                                    <strong>Wskazówka:</strong> {detail.tip}
                                </p>
                            </article>
                        );
                    })}
                </div>
            </div>

            <div className="levelsGuidePage__section">
                <div className="levelsGuidePage__sectionHead">
                    <h2>Co oznaczają filary</h2>
                    <p>Filar pokazuje konkretny obszar funkcjonowania. To właśnie z tych czterech obszarów składa się cały wynik i mapa widoczna na stronie rezultatu.</p>
                </div>

                <div className="levelsGuidePage__pillars">
                    {PILLARS.map((pillar) => {
                        const detail = PILLAR_DETAILS.get(pillar);
                        if (!detail) return null;

                        return (
                            <article key={pillar} className="pillarGuideCard">
                                <div className="pillarGuideCard__top">
                                    <span className="pillarGuideCard__eyebrow">{localizePillarName(pillar)}</span>
                                    <h3>{detail.title}</h3>
                                </div>
                                <p className="pillarGuideCard__description">{detail.description}</p>
                                <ul className="pillarGuideCard__skills">
                                    {Array.from(detail.skills.entries()).map(([skillName, description]) => (
                                        <li key={skillName}>
                                            <strong>{skillName}.</strong> {description}
                                        </li>
                                    ))}
                                </ul>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
