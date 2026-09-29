import {useEffect, useMemo, useState} from "react";
import {Link, type Location, useLocation} from "react-router-dom";
import {api} from "../../app/Api.ts";
import {QUESTIONS} from "../../testData";
import {type AiAnalysis, type FinalResult, Pillar, Skill} from "../../types/Types.ts";
import {useResultStatus} from "./hooks/useResultStatus.ts";
import {localizePillarName, localizeSkillName, PILLAR_ORDER} from "./testShared.ts";

const ignoreCompletedStatus = () => undefined;

export default function TestAiInsightsPage() {
    const location: Location = useLocation();
    const search: URLSearchParams = new URLSearchParams(location.search);
    const roomCode: string | null = (search.get("room") || "").trim() || null;
    const isEventMode: boolean = !!roomCode;
    const storagePrefix = isEventMode ? `ratel_test_v2_room_${roomCode}` : "ratel_test_v2_default";
    const resultKey = `${storagePrefix}_result`;

    const {resultMeta, rawAnswers, loadResult} = useResultStatus(ignoreCompletedStatus);
    const [aiAnalysis, setAiAnalysis] = useState<AiAnalysis | null>(null);
    const [aiLoading, setAiLoading] = useState(false);
    const [aiError, setAiError] = useState("");

    useEffect(() => {
        loadResult(resultKey);
    }, [loadResult, resultKey]);

    useEffect(() => {
        if (!resultMeta || !rawAnswers || rawAnswers.length !== QUESTIONS.length || aiLoading || aiAnalysis) {
            return;
        }

        const responses = QUESTIONS.map((question, index) => ({
            id: question.id,
            text: question.text,
            answer: Number(rawAnswers[index] ?? 0),
        }));

        if (responses.some((item) => !Number.isInteger(item.answer) || item.answer < 1 || item.answer > 5)) {
            setAiError("Brak kompletnych odpowiedzi do porównania AI. Uruchom test ponownie, aby odświeżyć dane.");
            return;
        }

        const pillars = PILLAR_ORDER.map((pillarName) => {
            const pillarResult = resultMeta.pillarResults.get(pillarName);
            return {
                pillar: pillarName,
                sum: pillarResult?.sum ?? 0,
                level: pillarResult?.level ?? "Unknown",
                pct: pillarResult?.pct ?? 0,
            };
        });

        setAiLoading(true);
        setAiError("");

        api.aiAnalysis.compare({
            totalScore: resultMeta.totalScore,
            classicLevel: resultMeta.ratelLevel,
            responses,
            pillars,
        }).then((resp: { data: AiAnalysis }) => {
            setAiAnalysis(resp.data);
        }).catch((err: Error) => {
            console.error("AI analysis failed", err);
            setAiError("Nie udało się pobrać porównania AI.");
        }).finally(() => {
            setAiLoading(false);
        });
    }, [resultMeta, rawAnswers, aiAnalysis, aiLoading]);

    const meta: FinalResult | null = resultMeta;

    const getAiSourceLabel = (analysis: AiAnalysis) => {
        if (analysis.source === "openai") return `AI analysis · OpenAI · ${analysis.model}`;
        if (analysis.source === "groq") return `AI analysis · Groq · ${analysis.model}`;
        return "AI demo fallback";
    };

    const isLiveAiSource = (analysis: AiAnalysis) => analysis.source === "openai" || analysis.source === "groq";

    const topPillarName = useMemo(() => {
        if (!meta) return null;
        let best: Pillar | null = null;
        let bestSum = -1;

        for (const name of PILLAR_ORDER) {
            const pillar = meta.pillarResults.get(name);
            if (pillar && pillar.sum > bestSum) {
                best = name;
                bestSum = pillar.sum;
            }
        }

        return best;
    }, [meta]);

    const weakestPillarName = useMemo(() => {
        if (!meta) return null;
        let weakest: Pillar | null = null;
        let weakestSum = Number.POSITIVE_INFINITY;

        for (const name of PILLAR_ORDER) {
            const pillar = meta.pillarResults.get(name);
            if (pillar && pillar.sum < weakestSum) {
                weakest = name;
                weakestSum = pillar.sum;
            }
        }

        return weakest;
    }, [meta]);

    const aiDifferenceTitle = useMemo(() => {
        if (!aiAnalysis) return "";
        if (aiAnalysis.classicLevel === aiAnalysis.aiLevel) return "Oba podejścia wskazują ten sam poziom, ale akcentują inne niuanse.";
        if (aiAnalysis.aiLevel > aiAnalysis.classicLevel) return "AI ocenia profil nieco wyżej niż algorytm punktowy.";
        return "AI ocenia profil ostrożniej niż algorytm punktowy.";
    }, [aiAnalysis]);

    const aiDifferenceBody = useMemo(() => {
        if (!aiAnalysis || !meta) return "";

        const strongest = topPillarName ? localizePillarName(topPillarName) : "najmocniejszy filar";
        const weakest = weakestPillarName ? localizePillarName(weakestPillarName) : "obszar wymagający wsparcia";

        if (aiAnalysis.classicLevel === aiAnalysis.aiLevel) {
            return `Algorytm klasyczny opiera poziom głównie na sumie punktów (${meta.totalScore}/240), a AI patrzy dodatkowo na proporcje między filarami. W tym profilu AI najmocniej podkreśla filar ${strongest} oraz potrzebę dalszego rozwoju w obszarze ${weakest}.`;
        }

        if (aiAnalysis.aiLevel > aiAnalysis.classicLevel) {
            return `Suma punktów daje poziom ${aiAnalysis.classicLevel}, ale AI widzi więcej zasobów w układzie odpowiedzi i mocniej docenia stabilność w filarze ${strongest}. Jednocześnie nadal zaznacza, że obszar ${weakest} wymaga świadomego wzmacniania.`;
        }

        return `Algorytm klasyczny przypisuje poziom ${aiAnalysis.classicLevel} na podstawie wyniku całkowitego, natomiast AI zwraca większą uwagę na nierównowagę między filarami. Najwięcej ostrożności budzi obszar ${weakest}, mimo że filar ${strongest} pozostaje wyraźnym zasobem.`;
    }, [aiAnalysis, meta, topPillarName, weakestPillarName]);

    const classicMethodPoints = useMemo(() => {
        if (!meta) return [];
        return [
            `Wynik końcowy: ${meta.totalScore} / 240 punktów.`,
            "Poziom wynika z ustalonych progów i stałych reguł punktowych.",
            `Najmocniejszy filar: ${topPillarName ? localizePillarName(topPillarName) : "—"}.`,
            `Najsłabszy filar: ${weakestPillarName ? localizePillarName(weakestPillarName) : "—"}.`,
        ];
    }, [meta, topPillarName, weakestPillarName]);

    const aiMethodPoints = useMemo(() => {
        if (!aiAnalysis) return [];
        return [
            "AI interpretuje profil jakościowo, a nie tylko przez sumę punktów.",
            "Model analizuje relacje między filarami oraz układ odpowiedzi.",
            `Poziom AI: ${aiAnalysis.aiLevel} przy zgodności: ${aiAnalysis.agreement}.`,
            `Najmocniej podkreślone ryzyko: ${aiAnalysis.risks[0] ?? "brak dominującego ryzyka"}.`,
        ];
    }, [aiAnalysis]);

    const getSkillFocusLabel = (skill: Skill) => {
        switch (skill) {
            case Skill.SupportNetwork:
                return "gotowość do sięgania po wsparcie";
            case Skill.SituationAnalysis:
                return "analizę sytuacji i ocenę informacji";
            case Skill.Recovery:
                return "tempo odzyskiwania równowagi po trudności";
            case Skill.ResilienceInRelationships:
                return "odporność na napięcie, krytykę i relacyjne obciążenie";
            case Skill.Perseverance:
                return "wytrwałość przy długim lub frustrującym procesie";
            case Skill.Agency:
                return "poczucie wpływu i sprawczości";
            case Skill.Assertiveness:
                return "swobodę wyrażania granic i własnego zdania";
            case Skill.EmotionalRegulation:
                return "regulację emocji pod presją";
            case Skill.CognitiveFlexibility:
                return "elastyczność myślenia i zmianę perspektywy";
            case Skill.StressResilience:
                return "odporność na napięcie i reakcję stresową";
            case Skill.DecisionMaking:
                return "decyzyjność pod obciążeniem";
            case Skill.GoalDirectedAction:
                return "utrzymywanie kierunku działania mimo zmian";
            default:
                return "funkcjonowanie w tym obszarze";
        }
    };

    const questionBreakdown = useMemo(() => {
        if (!rawAnswers || rawAnswers.length !== QUESTIONS.length) return [];

        return QUESTIONS.map((question, index) => {
            const rawAnswer = Number(rawAnswers[index] ?? 0);
            const classicScore = question.reversed ? 6 - rawAnswer : rawAnswer;
            const classicFormula = question.reversed ? `6 - ${rawAnswer}` : `${rawAnswer}`;
            const pillarLabel = localizePillarName(question.pillar);
            const skillLabel = localizeSkillName(question.skill);
            const skillFocus = getSkillFocusLabel(question.skill);

            let classicImpact = "neutralny";
            if (classicScore >= 4) classicImpact = "wzmacnia wynik";
            else if (classicScore <= 2) classicImpact = "obniża wynik";

            let aiSignal = "sygnał mieszany";
            if (classicScore >= 4) aiSignal = "sygnał zasobu";
            else if (classicScore <= 2) aiSignal = "sygnał ryzyka";

            const technicalNote = question.reversed
                ? "To pytanie jest odwrócone, więc klasyczny algorytm najpierw przelicza odpowiedź odwrotnie."
                : "To pytanie liczy się bezpośrednio, więc klasyczny algorytm przyjmuje odpowiedź dosłownie.";

            let aiExplanationDetailed = "";
            if (question.reversed) {
                if (rawAnswer <= 2) {
                    aiExplanationDetailed = `AI zauważa, że użytkownik odrzuca negatywne stwierdzenie dotyczące ${skillFocus}. To jest ciekawy przypadek, bo model widzi brak deklarowanego problemu dokładnie w tym zachowaniu, a nie tylko dobry wynik po odwróceniu skali.`;
                } else if (rawAnswer >= 4) {
                    aiExplanationDetailed = `AI traktuje wysoką zgodę z odwróconym pytaniem jako wyraźny sygnał trudności w obszarze ${skillFocus}. W tym miejscu model reaguje mocniej na sens odpowiedzi niż na sam końcowy score.`;
                } else {
                    aiExplanationDetailed = `AI widzi tu częściową zgodę z odwróconym stwierdzeniem, więc traktuje ten item jako niejednoznaczny. To sugeruje, że ${skillFocus} może zależeć od kontekstu, a nie być stałym wzorcem.`;
                }
            } else if (classicScore >= 4) {
                aiExplanationDetailed = `AI czyta tę odpowiedź jako deklarację konkretnego zasobu. W pytaniu o ${skillFocus} użytkownik sam zgłasza wysoki poziom, więc model wzmacnia interpretację właśnie tego zachowania.`;
            } else if (classicScore === 3) {
                aiExplanationDetailed = `AI oznacza ten item jako graniczny. Przy pytaniu o ${skillFocus} odpowiedź 3/5 sugeruje stan pośredni — bez wyraźnego zasobu, ale też bez pełnego deficytu.`;
            } else {
                aiExplanationDetailed = `AI odczytuje tę odpowiedź bardziej dosłownie: w pytaniu o ${skillFocus} użytkownik nie potwierdza stabilnego działania, więc model traktuje to jako konkretny trop interpretacyjny do dalszej rozmowy.`;
            }

            let caseKindDetailed = "signal";
            if (question.reversed) caseKindDetailed = "reverse";
            if (classicScore === 3) caseKindDetailed = "mixed";

            return {
                id: question.id,
                text: question.text,
                pillar: pillarLabel,
                skill: skillLabel,
                rawAnswer,
                reversed: question.reversed ? "tak" : "nie",
                classicFormula,
                classicScore,
                classicImpact,
                aiSignal,
                technicalNote,
                classicExplanation:
                    classicScore >= 4
                        ? `Po przeliczeniu ten item działa na korzyść wyniku i wzmacnia kompetencję „${skillLabel}”.`
                        : classicScore === 3
                            ? "Po przeliczeniu ten item pozostaje neutralny i nie zmienia mocno końcowej klasyfikacji."
                            : `Po przeliczeniu ten item obniża wynik w obszarze „${skillLabel}”.`,
                aiExplanation:
                    classicScore >= 4
                        ? "AI odczytuje tę odpowiedź jako sygnał zasobu: użytkownik prawdopodobnie ma stabilniejszy wzorzec działania w tym obszarze."
                        : classicScore === 3
                            ? "AI traktuje tę odpowiedź jako sygnał mieszany: w tym obszarze nie widać ani mocnego zasobu, ani wyraźnego ryzyka."
                            : "AI interpretuje tę odpowiedź jako sygnał ryzyka: ten obszar może wymagać dodatkowego wsparcia lub doprecyzowania.",
                aiExplanationDetailed,
                caseKindDetailed,
            };
        });
    }, [rawAnswers]);

    const sampledQuestionBreakdown = useMemo(() => {
        if (!questionBreakdown.length) return [];

        const scored = questionBreakdown.map((row) => {
            let interestingness = 0;

            if (row.reversed === "tak") interestingness += 4;
            if (row.classicScore === 3) interestingness += 2;
            if (row.rawAnswer !== row.classicScore) interestingness += 2;
            if (topPillarName && row.pillar === localizePillarName(topPillarName) && row.classicScore <= 2) interestingness += 3;
            if (weakestPillarName && row.pillar === localizePillarName(weakestPillarName) && row.classicScore >= 4) interestingness += 3;
            if (row.classicScore <= 2 || row.classicScore >= 4) interestingness += 1;
            if (topPillarName && row.pillar === localizePillarName(topPillarName) && row.classicScore <= 2) {
                row.caseKindDetailed = "contradiction";
                interestingness += 2;
            }
            if (weakestPillarName && row.pillar === localizePillarName(weakestPillarName) && row.classicScore >= 4) {
                row.caseKindDetailed = "contradiction";
                interestingness += 2;
            }

            return {...row, interestingness};
        });

        const ordered = scored.sort((a, b) => {
            if (b.interestingness !== a.interestingness) return b.interestingness - a.interestingness;
            return a.id - b.id;
        });

        const picked: typeof ordered = [];
        const wantedKinds = ["contradiction", "reverse", "mixed"];

        for (const kind of wantedKinds) {
            const match = ordered.find((row) => row.caseKindDetailed === kind && !picked.some((item) => item.id === row.id));
            if (match) picked.push(match);
        }

        for (const row of ordered) {
            if (picked.length >= 3) break;
            if (!picked.some((item) => item.id === row.id)) picked.push(row);
        }

        return picked.sort((a, b) => a.id - b.id);
    }, [questionBreakdown, topPillarName, weakestPillarName]);

    if (!meta) {
        return (
            <section className="testEmptyState">
                <h1>Brak wyniku testu</h1>
                <p>Najpierw przejdź test, aby zobaczyć porównanie algorytmów.</p>
                <Link to={`/test${location.search}`} className="btn btn--primary">Wróć do testu</Link>
            </section>
        );
    }

    return (
        <section className="testResultPage">
            <div className="testResultPage__topBar">
                <Link to={`/test/result${location.search}`} className="btn btn--ghost btn--small">Wróć do wyniku</Link>
                <Link to={`/test/levels${location.search}`} className="btn btn--ghost btn--small">Poziomy i filary</Link>
            </div>

            <section className="testResult">
                <div className="aiCompareCard">
                    <div className="aiCompareCard__header">
                        <div>
                            <h3>Porównanie algorytmów</h3>
                            <p>Osobny widok pokazujący, jak klasyczny algorytm punktowy i interpretacja AI czytają ten sam profil odpowiedzi.</p>
                        </div>
                        {aiAnalysis && (
                            <span className={`aiCompareCard__source ${isLiveAiSource(aiAnalysis) ? "aiCompareCard__source--live" : "aiCompareCard__source--fallback"}`}>
                                {getAiSourceLabel(aiAnalysis)}
                            </span>
                        )}
                    </div>

                    {aiLoading && <p className="aiCompareCard__status">Generowanie analizy AI...</p>}
                    {aiError && <p className="aiCompareCard__status aiCompareCard__status--error">{aiError}</p>}

                    {aiAnalysis && (
                        <>
                            <div className="aiCompareCard__algorithms">
                                <div className="aiCompareCard__algorithmPane aiCompareCard__algorithmPane--classic">
                                    <div className="aiCompareCard__algorithmHead">
                                        <h4>Klasyczny algorytm</h4>
                                    </div>
                                    <div className="aiCompareMetric">
                                        <span className="aiCompareMetric__label">Poziom</span>
                                        <span className="aiCompareMetric__value">Poziom {aiAnalysis.classicLevel}</span>
                                    </div>
                                    <ul className="aiCompareCard__algorithmList">
                                        {classicMethodPoints.map((item) => <li key={item}>{item}</li>)}
                                    </ul>
                                </div>

                                <div className="aiCompareCard__algorithmDivider">
                                    <span>vs</span>
                                </div>

                                <div className="aiCompareCard__algorithmPane aiCompareCard__algorithmPane--ai">
                                    <div className="aiCompareCard__algorithmHead">
                                        <h4>Interpretacja AI</h4>
                                    </div>
                                    <div className="aiCompareMetric">
                                        <span className="aiCompareMetric__label">Poziom</span>
                                        <span className="aiCompareMetric__value">Poziom {aiAnalysis.aiLevel}</span>
                                    </div>
                                    <ul className="aiCompareCard__algorithmList">
                                        {aiMethodPoints.map((item) => <li key={item}>{item}</li>)}
                                    </ul>
                                </div>
                            </div>

                            <div className="aiCompareCard__metrics">
                                <div className="aiCompareMetric">
                                    <span className="aiCompareMetric__label">Zgodność poziomu</span>
                                    <span className="aiCompareMetric__value">{aiAnalysis.agreement}</span>
                                </div>
                                <div className="aiCompareMetric">
                                    <span className="aiCompareMetric__label">Mocny filar</span>
                                    <span className="aiCompareMetric__value">{topPillarName ? localizePillarName(topPillarName) : "—"}</span>
                                </div>
                                <div className="aiCompareMetric">
                                    <span className="aiCompareMetric__label">Ryzyko</span>
                                    <span className="aiCompareMetric__value">{weakestPillarName ? localizePillarName(weakestPillarName) : "—"}</span>
                                </div>
                            </div>

                            <p className="aiCompareCard__summary">{aiAnalysis.summary}</p>

                            <div className="aiCompareCard__grid">
                                <div className="aiCompareCard__box">
                                    <h4>Jak liczy algorytm klasyczny</h4>
                                    <p>Poziom klasyczny wynika bezpośrednio z łącznej liczby punktów: <strong>{meta.totalScore} / 240</strong>. To szybka, przewidywalna ocena oparta na sumie odpowiedzi oraz ustalonych progach punktowych.</p>
                                </div>
                                <div className="aiCompareCard__box">
                                    <h4>Co dodatkowo widzi AI</h4>
                                    <p>AI patrzy nie tylko na wynik łączny, ale też na proporcje między filarami, mocne strony i obszary ryzyka. Dzięki temu opis jest bardziej interpretacyjny, a nie wyłącznie punktowy.</p>
                                </div>
                                <div className="aiCompareCard__box aiCompareCard__box--full">
                                    <h4>Najważniejsza różnica w interpretacji</h4>
                                    <p className="aiCompareCard__differenceTitle">{aiDifferenceTitle}</p>
                                    <p>{aiDifferenceBody}</p>
                                </div>
                                <div className="aiCompareCard__box aiCompareCard__box--full">
                                    <h4>Najciekawsze przypadki interpretacyjne</h4>
                                    <p className="aiCompareCard__tableHint">
                                        Pokazujemy tylko 3 najbardziej interesujące przypadki z tej sesji — takie, w których AI wnosi dodatkowy kontekst albo zwraca uwagę na nieoczywistą interpretację odpowiedzi.
                                    </p>
                                    <div className="aiCompareCard__sampleList">
                                        {sampledQuestionBreakdown.map((row) => (
                                            <article key={row.id} className="aiCompareCard__sampleCard">
                                                <div className="aiCompareCard__sampleTop">
                                                    <div>
                                                        <span className="aiCompareCard__sampleId">Pytanie {row.id}</span>
                                                        <h5>{row.text}</h5>
                                                    </div>
                                                    <div className="aiCompareCard__sampleMeta">
                                                        <span>{row.pillar}</span>
                                                        <span>{row.skill}</span>
                                                    </div>
                                                </div>

                                                <p className="aiCompareCard__sampleTech">
                                                    <strong>Technicznie:</strong> odpowiedź <span className="aiCompareCard__mono">{row.rawAnswer}/5</span>,
                                                    {" "}{row.reversed === "tak" ? "reverse item" : "direct item"},
                                                    {" "}→ formuła <span className="aiCompareCard__mono">{row.classicFormula}</span>,
                                                    {" "}wynik klasyczny <span className="aiCompareCard__mono">{row.classicScore}/5</span>.
                                                </p>

                                                <div className="aiCompareCard__sampleCompare">
                                                    <div className="aiCompareCard__samplePane aiCompareCard__samplePane--classic">
                                                        <span className="aiCompareCard__sampleLabel">Klasyczny algorytm</span>
                                                        <span className={`aiCompareCard__chip ${row.classicScore >= 4 ? "aiCompareCard__chip--good" : row.classicScore <= 2 ? "aiCompareCard__chip--risk" : ""}`}>{row.classicImpact}</span>
                                                        <p>{row.classicExplanation}</p>
                                                    </div>
                                                    <div className="aiCompareCard__samplePane aiCompareCard__samplePane--ai">
                                                        <span className="aiCompareCard__sampleLabel">Interpretacja AI</span>
                                                        <span className={`aiCompareCard__chip ${row.classicScore >= 4 ? "aiCompareCard__chip--good" : row.classicScore <= 2 ? "aiCompareCard__chip--risk" : ""}`}>{row.aiSignal}</span>
                                                        <p>{row.aiExplanationDetailed ?? row.aiExplanation}</p>
                                                    </div>
                                                </div>

                                                <p className="aiCompareCard__sampleNote">{row.technicalNote}</p>
                                            </article>
                                        ))}
                                    </div>
                                </div>
                                <div className="aiCompareCard__box">
                                    <h4>Mocne strony według AI</h4>
                                    <ul>
                                        {aiAnalysis.strengths.map((item) => <li key={item}>{item}</li>)}
                                    </ul>
                                </div>
                                <div className="aiCompareCard__box">
                                    <h4>Obszary ryzyka według AI</h4>
                                    <ul>
                                        {aiAnalysis.risks.map((item) => <li key={item}>{item}</li>)}
                                    </ul>
                                </div>
                                <div className="aiCompareCard__box aiCompareCard__box--full">
                                    <h4>Rekomendacje AI</h4>
                                    <ul>
                                        {aiAnalysis.recommendations.map((item) => <li key={item}>{item}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </>
                    )}

                    {!aiLoading && !aiAnalysis && !aiError && (
                        <p className="aiCompareCard__status">Analiza AI pojawi się po odczytaniu odpowiedzi zapisanych w tej sesji testu.</p>
                    )}
                </div>
            </section>
        </section>
    );
}
