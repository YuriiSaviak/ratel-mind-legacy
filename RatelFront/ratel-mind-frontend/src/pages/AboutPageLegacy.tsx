import { Link } from "react-router-dom";
import dividerBadge from "../assets/about/divider-badge.svg";
import iconEducation from "../assets/about/icon-education.svg";
import iconProgram from "../assets/about/icon-program.svg";
import quoteAccent from "../assets/about/quote-accent.svg";
import ratelWide from "../assets/about/ratel_about_why.png";
import iconTest from "../assets/about/icon-test.svg";
import iconWorkshop from "../assets/about/icon-workshop.svg";

const commitments = [
    {
        title: "Testy odporności",
        text: "Zrozum, jak myślisz, czujesz i reagujesz pod presją. Odkryj, w czym jesteś silny i gdzie możesz się rozwijać.",
        icon: iconTest,
    },
    {
        title: "Warsztaty",
        text: "Praktyczne warsztaty oparte na badaniach naukowych, które wzmacniają odporność w sytuacjach codziennych i zawodowych.",
        icon: iconWorkshop,
    },
    {
        title: "Programy rozwojowe",
        text: "Długoterminowe programy rozwijające kompetencje poznawcze, emocjonalne, behawioralne i społeczne krok po kroku.",
        icon: iconProgram,
    },
    {
        title: "Wiedza i edukacja",
        text: "Wiedza oparta na badaniach naukowych, przedstawiona w prosty, praktyczny sposób, gotowy do zastosowania w realnym życiu.",
        icon: iconEducation,
    },
];

const teamMembers = [
    {
        name: "Jan Kaczmarek",
        role: "Współzałożyciel i psycholog",
        description: "Jan koncentruje się na praktycznych podejściach opartych na badaniach naukowych, odpowiadających na wyzwania psychologiczne, z którymi mierzą się młodsze pokolenia. Przekłada złożoną teorię na jasne, konkretne narzędzia wspierające budowanie odporności psychicznej w codziennym życiu.",
    },
    {
        name: "Przemysław Szyller",
        role: "Współzałożyciel i psycholog",
        description: "Przemysław specjalizuje się w uporządkowanych, indywidualnie dopasowanych podejściach, które pozwalają odkryć osobiste potrzeby psychologiczne. Projektuje strategie wzmacniania odporności dopasowane do unikalnych zasobów i ścieżki rozwoju każdej osoby.",
    },
];

export default function AboutPageLegacy() {
    return (
        <div className="aboutPage">
            <section className="aboutHero">
                <h1 className="aboutTitle">O nas</h1>
                <p className="aboutLead">
                    <strong>Ratel Mind</strong> powstał na styku psychologii i realnych
                    wyzwań codzienności.
                </p>
                <p className="aboutLead aboutLead--secondary">
                    Zauważyliśmy wyraźną lukę między teorią a praktyką.
                </p>

                <div className="aboutCopy">
                    <p>
                        Często słyszymy, że powinniśmy być „odporni”, ale rzadko ktoś
                        pokazuje nam, jak tę odporność rozwijać.
                    </p>
                    <p>
                        Wierzymy, że odporność psychiczna nie jest wrodzoną cechą. To
                        umiejętność, którą można świadomie budować.
                    </p>
                    <p>
                        Inspiracją jest dla nas ratel, symbol wytrwałości i zdolności
                        do regeneracji pod presją. Pomagamy odkrywać własne zasoby
                        oraz wzmacniać obszary wymagające większej uwagi.
                    </p>
                    <p>
                        Nasze narzędzie diagnostyczne, oparte na badaniach naukowych,
                        analizuje odporność w czterech kluczowych wymiarach:
                        poznawczym, emocjonalnym, behawioralnym i społecznym. To one
                        wpływają na to, jak reagujesz na trudności oraz jak szybko
                        odzyskujesz równowagę.
                    </p>
                    <p>
                        Ratel Mind to nie tylko test. To przemyślana ścieżka rozwoju,
                        która obejmuje warsztaty, programy i praktyczne narzędzia
                        wspierające budowanie odporności psychicznej w codziennym
                        życiu.
                    </p>
                </div>
            </section>

            <section className="aboutCommitment">
                <h2 className="aboutSectionTitle">Nasza misja</h2>

                <blockquote className="aboutQuote">
                    <img className="aboutQuote__art" src={quoteAccent} alt="" />
                    <p>
                        Wspieramy ludzi w budowaniu odporności psychicznej tak, aby
                        była zrozumiała, praktyczna i możliwa do zastosowania w
                        codziennym życiu.
                    </p>
                </blockquote>
            </section>

            <div className="aboutSectionBreak" aria-hidden="true">
                <div className="aboutSectionBreak__icon">
                    <img src={dividerBadge} alt="" />
                </div>
                <div className="aboutSectionBreak__line" />
            </div>

            <section className="aboutHow">
                <h2 className="aboutSectionTitle aboutSectionTitle--center">
                    Jak budujemy odporność
                </h2>

                <div className="aboutCommitmentGrid">
                    {commitments.map((item) => (
                        <article key={item.title} className="aboutCommitmentCard">
                            <div className="aboutCommitmentCard__icon" aria-hidden="true">
                                <img src={item.icon} alt="" />
                            </div>
                            <h3>{item.title}</h3>
                            <p>{item.text}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="aboutTeam">
                <h2 className="aboutSectionTitle aboutSectionTitle--center">
                    Team Ratel Mind
                </h2>

                <div className="aboutTeamGrid">
                    {teamMembers.map((member, index) => (
                        <article key={index} className="aboutMemberCard">
                            <div className="aboutMemberCard__photo" aria-label="Placeholder na zdjęcie">
                                <span>Tu wstaw zdjęcie</span>
                            </div>
                            <div className="aboutMemberCard__body">
                                <h3>{member.name}</h3>
                                <p className="aboutMemberCard__role">{member.role}</p>
                                <p>{member.description}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <div className="aboutSectionBreak" aria-hidden="true">
                <div className="aboutSectionBreak__icon">
                    <img src={dividerBadge} alt="" />
                </div>
                <div className="aboutSectionBreak__line" />
            </div>

            <section className="aboutWhy">
                <div className="aboutWhy__visual">
                    <img src={ratelWide} alt="Ilustracja ratela" />
                </div>

                <div className="aboutWhy__content">
                    <h2 className="aboutSectionTitle aboutSectionTitle--center">
                        Dlaczego Ratel?
                    </h2>

                    <div className="aboutCopy">
                        <p>
                            Ratel przetrwa w jednych z najtrudniejszych warunków na
                            świecie. Stawia czoła zagrożeniom i szybko odzyskuje
                            równowagę po uderzeniu.
                        </p>
                        <p>
                            Nie dlatego, że się nie boi.
                        </p>
                        <p>
                            Dlatego, że potrafi się dostosować.
                        </p>
                        <p>
                            Ratel Mind powstał w oparciu o tę samą zasadę. Współczesne
                            życie wymaga odporności. Niepewność, presja i ciągłe
                            zmiany nie są już wyjątkiem. Dziś stanowią codzienne
                            środowisko funkcjonowania. Nie obiecujemy niezniszczalności.
                            Pomagamy rozwijać umiejętności psychologiczne, które
                            pozwalają radzić sobie ze stresem, niepewnością i
                            trudnościami bez utraty jasności myślenia, kierunku
                            działania i kontaktu z samym sobą.
                        </p>
                        <p>
                            <strong>
                                Odporność to nie twardość. To zdolność do regeneracji.
                            </strong>
                        </p>
                        <p>
                            Naszym celem jest dostarczanie szkoleń i narzędzi, które
                            przyspieszają proces regeneracji i wzmacniają odporność
                            psychiczną, abyś mógł chronić relacje, wykorzystywać
                            pojawiające się szanse i zachować stabilność nawet w
                            momentach głębokiej niepewności.
                        </p>
                    </div>
                </div>
            </section>

            <section className="aboutCta">
                <p>
                    <strong>
                        Nasz model opiera się na ugruntowanych badaniach nad
                        odpornością psychiczną oraz na dorobku psychologii poznawczej,
                        emocjonalnej i społecznej.
                    </strong>
                    <br />
                    Otrzymaj spersonalizowany raport odporności bezpłatnie.
                </p>

                <Link to="/test" className="btn btn--primary">
                    Rozwiąż test
                </Link>
            </section>
        </div>
    );
}
