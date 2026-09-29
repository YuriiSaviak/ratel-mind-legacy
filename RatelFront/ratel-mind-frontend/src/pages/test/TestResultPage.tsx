import {useEffect, useMemo} from "react";
import {Link, type Location, useLocation} from "react-router-dom";
import {LEVEL_DETAILS, PILLAR_DETAILS} from "../../testData";
import {type FinalResult, type LevelDetail, Pillar, type RoomRankingEntry, Skill} from "../../types/Types.ts";
import {useResultStatus} from "./hooks/useResultStatus.ts";
import {getLevelBadgeClass, localizeLevel} from "./utils/util.ts";
import {localizePillarName, localizeSkillName, PILLAR_ORDER, PILLAR_SKILLS_ORDER} from "./testShared.ts";

type PillarSnapshot = {
    pillarName: Pillar;
    sum: number;
    pct: number;
    level: string;
};

type TopSkillEntry = {
    pillarName: Pillar;
    skillName: Skill;
    sum: number;
    level: string;
};

const ignoreCompletedStatus = () => undefined;

function renderLevelBadge(level: string | null, sum: number) {
    return (
        <span className={getLevelBadgeClass(level)}>
            {localizeLevel(level)} · {sum}/20
        </span>
    );
}

export default function TestResultPage() {
    const location: Location = useLocation();
    const search: URLSearchParams = new URLSearchParams(location.search);
    const roomCode: string | null = (search.get("room") || "").trim() || null;
    const isEventMode: boolean = !!roomCode;
    const storagePrefix = isEventMode ? `ratel_test_v2_room_${roomCode}` : "ratel_test_v2_default";
    const resultKey = `${storagePrefix}_result`;

    const {globalStats, roomStats, resultMeta, loadResult} = useResultStatus(ignoreCompletedStatus);

    useEffect(() => {
        loadResult(resultKey);
    }, [loadResult, resultKey]);

    const meta: FinalResult | null = resultMeta;
    const levelInfo: LevelDetail | null = meta ? LEVEL_DETAILS.get(meta.ratelLevel) ?? null : null;

    const pillarSnapshot: PillarSnapshot[] = useMemo(() => (
        PILLAR_ORDER.map((pillarName) => {
            const pillarData = meta?.pillarResults.get(pillarName);
            return {
                pillarName,
                sum: pillarData?.sum ?? 0,
                pct: pillarData?.pct ?? 0,
                level: pillarData?.level ?? "Unknown",
            };
        })
    ), [meta]);

    const topPillarName: Pillar | null = useMemo(() => {
        if (!meta) return null;
        return [...PILLAR_ORDER].sort((a, b) => {
            const aScore = meta.pillarResults.get(a)?.sum ?? 0;
            const bScore = meta.pillarResults.get(b)?.sum ?? 0;
            return bScore - aScore;
        })[0] ?? null;
    }, [meta]);

    const topPillarInfo = topPillarName ? PILLAR_DETAILS.get(topPillarName) ?? null : null;

    const topSkillsInfo = useMemo(() => {
        if (!meta) return {skills: [] as TopSkillEntry[]};

        const skills: TopSkillEntry[] = [];

        for (const pillarName of PILLAR_ORDER) {
            const pillarSkills = meta.skillResults.get(pillarName);
            if (!pillarSkills) continue;

            for (const skillName of PILLAR_SKILLS_ORDER[pillarName]) {
                const skillData = pillarSkills.get(skillName);
                if (!skillData) continue;

                skills.push({
                    pillarName,
                    skillName,
                    sum: skillData.sum,
                    level: skillData.level,
                });
            }
        }

        skills.sort((a, b) => b.sum - a.sum);

        return {skills: skills.slice(0, 4)};
    }, [meta]);

    if (!meta) {
        return (
            <section className="testEmptyState">
                <h1>Brak wyniku testu</h1>
                <p>Najpierw przejdź test, aby zobaczyć swój raport odporności.</p>
                <Link to={`/test${location.search}`} className="btn btn--primary">Wróć do testu</Link>
            </section>
        );
    }

    return (
        <section className="testResultPage">
            <div className="testResultPage__topBar">
                <Link to={`/test${location.search}`} className="btn btn--ghost btn--small">Wróć do testu</Link>
                <button className="btn btn--ghost btn--small" onClick={() => window.print()}>Pobierz PDF</button>
            </div>

            <section className="testResult">
                <div className="testResult__header">
                    <div>
                        <h2>Twój wynik</h2>
                        <p>Ogólny poziom odporności oraz rozkład wyników w czterech filarach.</p>
                    </div>
                </div>

                {levelInfo && (
                    <div className="levelNarrative">
                        <div className="levelNarrative__top">
                            <div>
                                <h3 className="levelNarrative__title">Poziom {meta.ratelLevel} — {levelInfo.motto}</h3>
                                <p className="levelNarrative__desc">{levelInfo.description}</p>
                            </div>
                            <Link to={`/test/levels${location.search}`} className="levelNarrative__link">Zobacz opis wszystkich poziomów</Link>
                        </div>
                        <p className="levelNarrative__quote">„{levelInfo.quote}”</p>
                        <p className="levelNarrative__tip">👉 {levelInfo.tip}</p>
                    </div>
                )}

                <div className="testResult__top">
                    <div className="summaryCard">
                        <div className="summaryLabel">Ogólny poziom odporności psychicznej</div>
                        <div className="summaryValue">{meta.ratelLevel}</div>
                        <div className="summarySub">Łączna liczba punktów: {meta.totalScore} / 240</div>
                    </div>
                    <div className="summaryCard">
                        <div className="summaryLabel">Twój percentyl</div>
                        <div className="summaryValue">{globalStats ? `${Math.round(globalStats.percentile)}%` : "—"}</div>
                        <div className="summarySub">W porównaniu do wszystkich osób, które wypełniły test.</div>
                    </div>
                </div>

                <div className="testResult__layout testResult__layout--top">
                    <div className="diamondCard">
                        <div className="diamondCard__header">
                            <div>
                                <h3 className="diamondCard__title">Mapa filarów</h3>
                                <p className="diamondCard__hint">Szybki podgląd Twojego profilu odporności.</p>
                            </div>
                            <div className="diamondCard__badge">Poziom {meta.ratelLevel}</div>
                        </div>

                        <div className="diamondWrap">
                            <div className="diamondRadar">
                                <div className="diamondRadar__label diamondRadar__label--top">
                                    <span className="diamondRadar__name">{localizePillarName(Pillar.Cognitive)}</span>
                                    <span className="diamondRadar__meta">{pillarSnapshot[0].sum}/60 · {localizeLevel(pillarSnapshot[0].level)}</span>
                                </div>
                                <div className="diamondRadar__label diamondRadar__label--right">
                                    <span className="diamondRadar__name">{localizePillarName(Pillar.Behavioral)}</span>
                                    <span className="diamondRadar__meta">{pillarSnapshot[2].sum}/60 · {localizeLevel(pillarSnapshot[2].level)}</span>
                                </div>
                                <div className="diamondRadar__label diamondRadar__label--bottom">
                                    <span className="diamondRadar__name">{localizePillarName(Pillar.Social)}</span>
                                    <span className="diamondRadar__meta">{pillarSnapshot[3].sum}/60 · {localizeLevel(pillarSnapshot[3].level)}</span>
                                </div>
                                <div className="diamondRadar__label diamondRadar__label--left">
                                    <span className="diamondRadar__name">{localizePillarName(Pillar.Emotional)}</span>
                                    <span className="diamondRadar__meta">{pillarSnapshot[1].sum}/60 · {localizeLevel(pillarSnapshot[1].level)}</span>
                                </div>

                                <svg className="diamondSvg" viewBox="0 0 260 260" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <linearGradient id="diamondAreaFill" x1="0" y1="0" x2="1" y2="1">
                                            <stop offset="0%" stopColor="#7fb3ff" stopOpacity="0.42"/>
                                            <stop offset="100%" stopColor="#2f68d8" stopOpacity="0.18"/>
                                        </linearGradient>
                                    </defs>
                                    <g transform="translate(130,130)">
                                        {[0.22, 0.44, 0.66, 0.88].map((radius, index) => {
                                            const size = 74 * radius;
                                            return <polygon key={index} className="diamondGrid" points={`${0},${-size} ${size},${0} ${0},${size} ${-size},${0}`}/>;
                                        })}
                                        <line className="diamondAxis" x1="0" y1="-74" x2="0" y2="74"/>
                                        <line className="diamondAxis" x1="-74" y1="0" x2="74" y2="0"/>

                                        {(() => {
                                            const base = 74;
                                            const toRadius = (pct: number) => (pct / 100) * base;
                                            const pCog = [0, -toRadius(pillarSnapshot[0].pct)];
                                            const pBeh = [toRadius(pillarSnapshot[2].pct), 0];
                                            const pSoc = [0, toRadius(pillarSnapshot[3].pct)];
                                            const pEmo = [-toRadius(pillarSnapshot[1].pct), 0];
                                            const points = [pCog, pBeh, pSoc, pEmo].map((point) => point.join(",")).join(" ");

                                            return (
                                                <>
                                                    <polygon className="diamondUser" points={points}/>
                                                    {[pCog, pBeh, pSoc, pEmo].map((point, index) => (
                                                        <circle key={index} className="diamondPoint" cx={point[0]} cy={point[1]} r="5"/>
                                                    ))}
                                                </>
                                            );
                                        })()}
                                    </g>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className="pillarList">
                        <div className="pillarList__header">
                            <div>
                                <h3>Twoje filary</h3>
                                <p className="pillarList__hint">Każdy słupek pokazuje Twój poziom dla danego filaru (niski / średni / wysoki).</p>
                            </div>
                            <Link to={`/test/levels${location.search}`} className="pillarList__link">
                                Opisy poziomów i filarów
                            </Link>
                        </div>

                        <ul>
                            {PILLAR_ORDER.map((pillarName) => {
                                const pillarData = meta.pillarResults.get(pillarName);
                                if (!pillarData) return null;

                                const level = pillarData.level;
                                const pct = pillarData.pct ?? 0;
                                let barClass = "pillarList__barFill pillarList__barFill--medium";
                                if (level?.toLowerCase().startsWith("high")) barClass = "pillarList__barFill pillarList__barFill--high";
                                else if (level?.toLowerCase().startsWith("low")) barClass = "pillarList__barFill pillarList__barFill--low";

                                return (
                                    <li key={pillarName} className="pillarList__item">
                                        <div className="pillarList__name">{localizePillarName(pillarName)}</div>
                                        <div className="pillarList__barWrap">
                                            <div className="pillarList__barBg">
                                                <div className={barClass} style={{width: `${pct}%`}}/>
                                            </div>
                                            <div className="pillarList__meta">
                                                <span>{localizeLevel(level)}</span>
                                                <span>{pillarData.sum} / 60</span>
                                            </div>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                {topPillarInfo && topPillarName && (
                    <div className="pillarNarrative">
                        <h3 className="pillarNarrative__title">Twój najsilniejszy filar: {localizePillarName(topPillarName)}</h3>
                        <p className="pillarNarrative__text">{topPillarInfo.description}</p>
                        <ul className="pillarNarrative__skills">
                            {Array.from(topPillarInfo.skills.entries()).map(([skillName, description]) => (
                                <li key={skillName}>
                                    <strong>{localizeSkillName(skillName)}.</strong> {description}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {topSkillsInfo.skills.length > 0 && (
                    <div className="topSkillsBlock">
                        <h3>Twoje najsilniejsze umiejętności</h3>
                        <p className="topSkillsBlock__hint">
                            To cztery najwyżej ocenione kompetencje w Twoim profilu. Pokazują obszary, w których już dziś masz najwięcej zasobów.
                        </p>
                        <div className="topSkillsGrid">
                            {topSkillsInfo.skills.map((skill) => {
                                const description = PILLAR_DETAILS.get(skill.pillarName)?.skills.get(skill.skillName);
                                return (
                                    <div key={`${skill.pillarName}-${skill.skillName}`} className="topSkillCard">
                                        <div className="topSkillCard__top">
                                            <div className="topSkillCard__pill">{localizePillarName(skill.pillarName)}</div>
                                            <div className="topSkillCard__badge">{renderLevelBadge(skill.level, skill.sum)}</div>
                                        </div>
                                        <div className="topSkillCard__name">{localizeSkillName(skill.skillName)}</div>
                                        {description && <p className="topSkillCard__desc">{description}</p>}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <div className="skillsBlock">
                    <h3>Szczegółowy profil umiejętności</h3>
                    <p className="skillsBlock__hint">
                        Pełna tabela pokazuje wynik dla każdej kompetencji składającej się na filary odporności psychicznej.
                    </p>
                    <div className="skillTableWrap">
                        <table className="skillTable">
                            <thead>
                            <tr>
                                <th>Filar</th>
                                <th>Umiejętność</th>
                                <th>Umiejętność</th>
                                <th>Umiejętność</th>
                            </tr>
                            </thead>
                            <tbody>
                            {PILLAR_ORDER.map((pillarName) => (
                                <tr key={pillarName}>
                                    <td className="skillTable__pillarCell">{localizePillarName(pillarName)}</td>
                                    {PILLAR_SKILLS_ORDER[pillarName].map((skillName) => {
                                        const skillData = meta.skillResults.get(pillarName)?.get(skillName) ?? null;
                                        return (
                                            <td key={skillName}>
                                                <div className="skillCell">
                                                    <span className="skillCell__name">{localizeSkillName(skillName)}</span>
                                                    {skillData ? (
                                                        renderLevelBadge(skillData.level, skillData.sum)
                                                    ) : (
                                                        <span className="levelBadge levelBadge--medium">Brak danych</span>
                                                    )}
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {roomStats && (
                    <div className="roomStats">
                        <h3>Ranking wydarzenia</h3>
                        <p className="roomStats__hint">Twoja pozycja w pokoju <strong>{roomStats.roomCode}</strong>.</p>
                        <div className="rankTableWrap">
                            <table className="rankTable">
                                <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nick</th>
                                    <th>Poziom</th>
                                    <th>Wynik</th>
                                </tr>
                                </thead>
                                <tbody>
                                {roomStats.ranking?.map((entry: RoomRankingEntry) => {
                                    const isMe = roomStats.currentUser && roomStats.currentUser.nickname === entry.nickname;
                                    return (
                                        <tr key={`${entry.nickname}-${entry.position}`} className={isMe ? "rankRowMe" : ""}>
                                            <td>{entry.position}</td>
                                            <td>{entry.nickname}</td>
                                            <td>{entry.level}</td>
                                            <td>{entry.totalScore}</td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                <div className="testResultPage__bottomCta">
                    <Link to={`/test/ai${location.search}`} reloadDocument className="btn btn--primary testResultPage__aiLink">
                        Zobacz interpretację AI i porównanie algorytmów
                    </Link>
                </div>
            </section>
        </section>
    );
}
