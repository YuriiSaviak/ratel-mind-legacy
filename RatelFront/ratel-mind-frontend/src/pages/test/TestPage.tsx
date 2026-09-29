import {useEffect, useMemo, useState} from "react";
import {Location, useLocation, useNavigate} from "react-router-dom";
import superjson from "superjson";
import ratelHero from "../../assets/test/ratel_test.png";
import {QUESTIONS, SCALE, computeScores} from "../../testData";
import {FinalResult} from "../../types/Types.ts";
import {SavedResult} from "../../types/LocalStorageTypes.ts";
import {useProgressStatus} from "./hooks/useProgressStatus.ts";
import {useResultStatus} from "./hooks/useResultStatus.ts";
import {saveEventResult, saveResult} from "./utils/apiCalls.ts";
import {localizePillarName, localizeSkillName} from "./testShared.ts";

export default function TestPage() {
    const location: Location = useLocation();
    const navigate = useNavigate();
    const search: URLSearchParams = new URLSearchParams(location.search);
    const roomCode: string | null = (search.get("room") || "").trim() || null;
    const isEventMode: boolean = !!roomCode;

    const [completed, setCompleted] = useState(false);
    const [isOverlayOpen, setIsOverlayOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [isHydrated, setIsHydrated] = useState(false);

    const {
        currentIndex,
        answers,
        nickname,
        nicknameLocked,
        loadProgress,
        saveProgress,
        initProgressStatus,
        updateNickname,
        nextQuestion,
        previousQuestion
    } = useProgressStatus(setCompleted);

    const {resultMeta, loadResult, initResultStatus} = useResultStatus(setCompleted);

    const STORAGE_PREFIX = isEventMode ? `ratel_test_v2_room_${roomCode}` : "ratel_test_v2_default";
    const PROGRESS_KEY = `${STORAGE_PREFIX}_progress`;
    const RESULT_KEY = `${STORAGE_PREFIX}_result`;

    const currentQuestion = QUESTIONS[currentIndex];
    const answeredCount = useMemo(() => answers.size, [answers]);
    const hasAnswers = answeredCount > 0;
    const hasResult = !!resultMeta;
    const hasInProgress = hasAnswers && !completed && !hasResult;
    const progressPct = ((currentIndex + 1) / QUESTIONS.length) * 100;

    useEffect(() => {
        loadProgress(PROGRESS_KEY, isEventMode);
        loadResult(RESULT_KEY);
        setIsHydrated(true);
    }, [PROGRESS_KEY, RESULT_KEY, isEventMode, loadProgress, loadResult]);

    useEffect(() => {
        if (!isHydrated) {
            return;
        }
        saveProgress(PROGRESS_KEY, isEventMode, completed);
    }, [answers, currentIndex, completed, nickname, PROGRESS_KEY, isEventMode, isHydrated]);

    const openResultPage = () => {
        navigate(`/test/result${location.search}`);
    };

    const handleOpenTest = (mode = "fresh") => {
        setSubmitError("");

        if (mode === "fresh") {
            initResultStatus();
            setCompleted(false);
            initProgressStatus(nickname, isEventMode);

            try {
                localStorage.removeItem(PROGRESS_KEY);
                localStorage.removeItem(RESULT_KEY);
            } catch (e) {
                console.error(e);
            }
        }

        setIsOverlayOpen(true);
    };

    const handleCloseTest = () => {
        setIsOverlayOpen(false);
    };

    const handleConfirmNickname = (newNickname: string) => {
        if (!newNickname.trim()) {
            return;
        }
        updateNickname(newNickname);
    };

    const handleBack = () => {
        setSubmitError("");
        if (currentIndex > 0) {
            previousQuestion();
        }
    };

    const handleAnswerClick = (value: number) => {
        if (!currentQuestion || isSubmitting) {
            return;
        }

        const nextAnswers: Map<number, number> = new Map(answers);
        nextAnswers.set(currentQuestion.id, value);

        if (currentIndex < QUESTIONS.length - 1) {
            nextQuestion(nextAnswers);
        } else {
            void handleFinishTest(nextAnswers);
        }
    };

    const persistFallbackResult = (meta: FinalResult) => {
        const stored: SavedResult = {
            completed: true,
            meta,
            globalStats: null,
            roomStats: null,
        };
        localStorage.setItem(RESULT_KEY, superjson.stringify(stored));
    };

    const handleFinishTest = async (answersSnapshot: Map<number, number>) => {
        setSubmitError("");
        setIsSubmitting(true);

        try {
            const meta: FinalResult = computeScores(answersSnapshot);
            setCompleted(true);

            const orderedAnswers = QUESTIONS.map((q) => Number(answersSnapshot.get(q.id)));
            const invalid =
                orderedAnswers.length !== QUESTIONS.length ||
                orderedAnswers.some((v) => !Number.isInteger(v) || v < 1 || v > 5);

            if (invalid) {
                setSubmitError("Odpowiedz na wszystkie pytania (1–5), zanim zakończysz test.");
                setIsSubmitting(false);
                return;
            }

            if (isEventMode) {
                await saveEventResult(RESULT_KEY, {
                    roomCode,
                    nickname: (nickname || "anonymous").trim() || "anonymous",
                    totalScore: meta.totalScore,
                    level: meta.ratelLevel,
                    answers: orderedAnswers,
                }, meta);
            } else {
                await saveResult(RESULT_KEY, orderedAnswers, meta);
            }

            setIsOverlayOpen(false);
            openResultPage();
        } catch (err) {
            console.error(err);
            try {
                const meta: FinalResult = computeScores(answersSnapshot);
                persistFallbackResult(meta);
            } catch (storageError) {
                console.error(storageError);
            }
            setIsOverlayOpen(false);
            openResultPage();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <section className="testHero">
                <div className="testHero__media">
                    <img src={ratelHero} alt="Ratel Mind Test" className="testHero__image"/>
                    <div className="testHero__veil"/>
                </div>

                <div className="testHero__content">
                    <p className="testHero__eyebrow">Ratel Mind</p>
                    <h1 className="testHero__title">Test odporności psychicznej</h1>
                    <p className="testHero__subtitle">
                        Sprawdź, jak reagujesz na presję, stres i niepewność. Po teście otrzymasz profil filarów oraz wynik końcowy.
                    </p>

                    <div className="testHero__actions">
                        {!hasAnswers && !hasResult && (
                            <button className="btn btn--primary" onClick={() => handleOpenTest("fresh")}>
                                Przejdź test
                            </button>
                        )}

                        {hasInProgress && (
                            <>
                                <button className="btn btn--primary" onClick={() => handleOpenTest("continue")}>
                                    Kontynuuj test
                                </button>
                                <button className="btn btn--ghost" onClick={() => handleOpenTest("fresh")}>
                                    Zacznij od nowa
                                </button>
                            </>
                        )}

                        {hasResult && !hasInProgress && (
                            <>
                                <button className="btn btn--primary" onClick={openResultPage}>
                                    Zobacz wynik
                                </button>
                                <button className="btn btn--ghost" onClick={() => handleOpenTest("fresh")}>
                                    Przejdź test ponownie
                                </button>
                            </>
                        )}
                    </div>

                    <p className="testHero__meta">Czas wypełnienia: około 7–10 minut</p>
                    <div className="testHero__note">
                        Jeśli przypadkiem opuścisz tę stronę po rozpoczęciu testu, nic nie przepadnie. Po powrocie zobaczysz zapisane odpowiedzi z ostatniej sesji.
                    </div>

                    {isEventMode && (
                        <span className="badge badge--event">Tryb wydarzenia · pokój: {roomCode}</span>
                    )}
                </div>
            </section>

            {submitError && <p className="testHero__error">{submitError}</p>}

            {isOverlayOpen && (
                <div className="testOverlay">
                    <div className="testOverlay__bg" onClick={handleCloseTest}/>
                    <div className="testOverlay__card">
                        <div className="testOverlay__topRow">
                            <div className="testOverlay__progressLine">
                                <span className="progressLabel">Pytanie {currentIndex + 1} z {QUESTIONS.length}</span>
                                <div className="progressBar">
                                    <div className="progressBar__fill" style={{width: `${progressPct}%`}}/>
                                </div>
                            </div>

                            <button type="button" className="overlayClose" onClick={handleCloseTest}>×</button>
                        </div>

                        {isEventMode && !nicknameLocked && (
                            <div className="nicknameBlock">
                                <label className="nicknameLabel">Wybierz swój nick</label>
                                <input
                                    className="nicknameInput"
                                    value={nickname}
                                    onChange={(e) => handleConfirmNickname(e.target.value)}
                                    placeholder="np. SkyWalker"
                                />
                                <div className="nicknameHint">
                                    Twoja nazwa użytkownika będzie widoczna dla wszystkich osób w tym pokoju i nie będzie można jej zmienić w trakcie tej sesji.
                                </div>
                                <div style={{marginTop: 10}}>
                                    <button
                                        type="button"
                                        className="btn btn--primary btn--small"
                                        onClick={() => handleConfirmNickname(nickname)}
                                        disabled={!nickname.trim()}
                                    >
                                        Zatwierdź i rozpocznij
                                    </button>
                                </div>
                            </div>
                        )}

                        {(!isEventMode || nicknameLocked) && currentQuestion && (
                            <>
                                <p className="questionText">{currentQuestion.text}</p>

                                <div className="testFlow__scale">
                                    {Array.from({length: SCALE.max - SCALE.min + 1}, (_, i) => i + SCALE.min).map((v) => (
                                        <button
                                            key={v}
                                            type="button"
                                            className={answers.get(currentQuestion.id) === v ? "scaleBtn scaleBtn--active" : "scaleBtn"}
                                            onClick={() => handleAnswerClick(v)}
                                            disabled={isSubmitting}
                                        >
                                            {v}
                                        </button>
                                    ))}
                                </div>

                                <div className="testFlow__labels">
                                    <span>{SCALE.labels.get(1)}</span>
                                    <span>{SCALE.labels.get(5)}</span>
                                </div>

                                <div className="testFlow__nav">
                                    <button
                                        type="button"
                                        className="btn btn--ghost btn--small"
                                        onClick={handleBack}
                                        disabled={currentIndex === 0 || isSubmitting}
                                    >
                                        Wstecz
                                    </button>
                                    <span className="testFlow__hint">
                                        Twoja odpowiedź zapisuje się automatycznie po kliknięciu liczby.
                                    </span>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
