import {Fragment} from "react";
import type {CSSProperties} from "react";
import {Link} from "react-router-dom";
import dividerBadge from "../assets/about/divider-badge.svg";
import workshopsBackground from "../assets/about/ratel_warsztaty.png";
import workshopsBackgroundSecond from "../assets/about/ratel_warsztaty2.png";

const workshopSteps = [
  {
    title: "Diagnoza",
    text: "Każdy uczestnik rozpoczyna od wypełnienia badania Ratel Mind. To narzędzie diagnostyczne mierzy cztery kluczowe filary odporności psychicznej oraz omawia najważniejsze kompetencje odpornościowe, tworząc jasny punkt wyjścia do dalszego rozwoju.",
  },
  {
    title: "Profil odporności grupy",
    text: "Na podstawie wyników grupy identyfikujemy jej najważniejsze zasoby oraz obszary wymagające największego wsparcia. Dzięki temu możemy oprzeć warsztat na rzeczywistych potrzebach psychologicznych uczestników, zamiast korzystać z ogólnych założeń i gotowych schematów.",
  },
  {
    title: "Praktyka oparta na realnych wynikach",
    text: "Podczas warsztatu koncentrujemy się na tym, co naprawdę ma znaczenie. Wzmacniamy istniejące zasoby, pracujemy nad obszarami wymagającymi rozwoju i przekładamy wnioski na praktyczne ćwiczenia budujące odporność, które uczestnicy mogą zastosować od razu.",
  },
  {
    title: "Praktyczne narzędzia do codziennego wykorzystania",
    text: "Uczestnicy otrzymują konkretne techniki i strategie, które mogą wykorzystywać w codziennym życiu, edukacji lub pracy. Celem nie jest wyłącznie zwiększenie świadomości, ale przede wszystkim realne zastosowanie w praktyce.",
  },
  {
    title: "Opcjonalna konsultacja indywidualna",
    text: "Po zakończeniu warsztatu każdy uczestnik może skorzystać z indywidualnej konsultacji. To spotkanie daje możliwość głębszego omówienia wyników, otrzymania spersonalizowanych rekomendacji oraz wyznaczenia jasnego kierunku dalszego rozwoju.",
  },
];

const workshopBenefits = [
  {
    title: "Indywidualne podejście",
    text: "Każdy warsztat jest dopasowany do rzeczywistych potrzeb grupy, na podstawie realnych wyników uczestników, a nie ogólnych założeń.",
  },
  {
    title: "Praktyczne zastosowanie",
    text: "Uczestnicy otrzymują narzędzia, które są zrozumiałe, użyteczne i możliwe do zastosowania w codziennym życiu, edukacji lub pracy.",
  },
  {
    title: "Równowaga",
    text: "Wzmacniamy istniejące zasoby, jednocześnie rozwijając obszary wymagające większego wsparcia. Dzięki temu odporność budowana jest w sposób trwały i zrównoważony.",
  },
  {
    title: "Realne efekty",
    text: "Warsztaty zwiększają samoświadomość, rozwijają kompetencje odpornościowe i pomagają lepiej funkcjonować w sytuacjach stresu oraz presji.",
  },
];

function renderSteps(
  steps: typeof workshopSteps,
  startIndex = 0,
) {
  return steps.map((step, index) => (
    <Fragment key={step.title}>
      <article className={`workshopProcessCard workshopProcessCard--${index % 2 === 0 ? "left" : "right"}`}>
        <div className="workshopProcessCard__step">Krok {startIndex + index + 1}</div>
        <h3>{step.title}</h3>
        <p>{step.text}</p>
      </article>

      {index < steps.length - 1 && (
        <div className="workshopsProcess__connector" aria-hidden="true">
          <span className="workshopsProcess__line"/>
          <span className="workshopsProcess__arrow"/>
        </div>
      )}
    </Fragment>
  ));
}

export default function WorkshopsPageLegacy() {
  const highlightedSteps = workshopSteps.slice(0, 2);
  const supportingSteps = workshopSteps.slice(2);
  const heroStageStyle = {
    "--workshops-stage-image": `url(${workshopsBackground})`,
  } as CSSProperties;
  const plainStageStyle = {
    "--workshops-stage-image": `url(${workshopsBackgroundSecond})`,
  } as CSSProperties;

  return (
    <div className="workshopsPage">
      <section className="workshopsHero">
        <h1>Warsztaty</h1>
        <div className="workshopsHero__copy">
          <p>
            <strong>Nasze warsztaty łączą diagnozę, praktykę i indywidualny rozwój.</strong>{" "}
            Każde szkolenie rozpoczyna się od analizy rzeczywistych wyzwań uczestników i opiera się na
            mocnych wynikach oraz potrzebach grupy.
          </p>
          <p>
            Dzięki temu nie pracujemy na ogólnych założeniach. Każdy warsztat rozwija to, co wnosi już
            zespół albo uczestnik.
          </p>
          <p>
            Nie pracujemy na gotowych scenariuszach. Każdy warsztat rozwija to, co wnosi już zespół albo
            uczestnik.
          </p>
        </div>
      </section>

      <section className="workshopsFlow">
        <h2>Jak to działa</h2>

        <div className="workshopsProcess">
          <div className="workshopsProcessStage workshopsProcessStage--hero" style={heroStageStyle}>
            {renderSteps(highlightedSteps, 0)}
          </div>

          <div className="workshopsProcessStage workshopsProcessStage--plain" style={plainStageStyle}>
            {renderSteps(supportingSteps, highlightedSteps.length)}
          </div>
        </div>
      </section>

      <div className="workshopsDivider" aria-hidden="true">
        <div className="workshopsDivider__icon">
          <img src={dividerBadge} alt="" className="workshopsDivider__badge"/>
        </div>
        <div className="workshopsDivider__line"/>
      </div>

      <section className="workshopsWhy">
        <h2>Dlaczego to działa</h2>
        <div className="workshopsWhy__list">
          {workshopBenefits.map((benefit) => (
            <article key={benefit.title} className="workshopsBenefit">
              <div className="workshopsBenefit__tag">{benefit.title}</div>
              <div className="workshopsBenefit__body">{benefit.text}</div>
            </article>
          ))}
        </div>
      </section>

      <section className="workshopsCta">
        <p>
          Nasz model opiera się na spersonalizowanym budowaniu odporności psychicznej, a nie na
          jednolitych programach, modnych hasłach i rozwiązaniach bez kontekstu.
        </p>
        <Link to="/contact" className="btn btn--primary btn--small">
          Napisz do nas
        </Link>
      </section>
    </div>
  );
}
