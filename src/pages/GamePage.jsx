import { useState, useEffect, useRef, useCallback } from "react";
import "../css/gamePage.css";

import antImg        from "../assets/ant.svg";
import antFace       from "../assets/ant-face.svg";
import upPart        from "../assets/up-part.svg";
import groundPart    from "../assets/ground-part.svg";
import homeIcon      from "../assets/home-icon.svg";
import questionBoard from "../assets/question-board.svg";

import meal   from "../assets/food-meal.svg";
import meat   from "../assets/food-meat.svg";
import orange from "../assets/food-orange.svg";

import spider   from "../assets/scary-spider.svg";
import sandwich from "../assets/scary-sandwitch.svg";
import shoe     from "../assets/scary-shoe.svg";

const GOOD_IMGS = [meal, meat, orange];
const BAD_IMGS  = [spider, sandwich, shoe];

const QUESTIONS = [
  { q: "כמה ארוחות עיקריות מומלץ לאכול ביום?",   options: ["2","3","5","1"],          correct: 1 },
  { q: "מה מקור האנרגיה העיקרי לגוף?",            options: ["חלבון","שומן","פחמימות","ויטמינים"], correct: 2 },
  { q: "מה עוזר לבניית שרירים והתאוששות?",        options: ["סוכר","חלבון","מלח","קפאין"],       correct: 1 },
  { q: "כמה מנות פירות/ירקות ביום מומלצות?",      options: ["פעם אחת","פעמיים","5 מנות","רק בצהריים"], correct: 2 },
  { q: "מה לא מחליף ארוחה מלאה?",                options: ["סלט","חטיף","כריך","מרק"],          correct: 1 },
];

const TOTAL_Q   = 4; // game ends after exactly 4 questions
const GAME_W    = 390;
const ANT_W     = 80;
const ITEM_SIZE = 65;
const GROUND_H  = 90;
const SCORE_STEP = 1 / TOTAL_Q;

let idCounter = 0;
function newItem() {
  const isGood = Math.random() > 0.45;
  const imgs   = isGood ? GOOD_IMGS : BAD_IMGS;
  return {
    id:   ++idCounter,
    x:    Math.random() * (GAME_W - ITEM_SIZE),
    y:    -ITEM_SIZE,
    img:  imgs[Math.floor(Math.random() * imgs.length)],
    good: isGood,
  };
}

export default function GamePage({ onNext, onHome }) {
  const [antX, setAntX]               = useState(GAME_W / 2 - ANT_W / 2);
  const [items, setItems]              = useState([newItem()]);
  const [question, setQuestion]        = useState(null);
  const [qIndex, setQIndex]            = useState(0);
  const [wrong, setWrong]              = useState(null);
  const [score, setScore]              = useState(0);
  const [paused, setPaused]            = useState(false);
  const [gameOver, setGameOver]        = useState(false);
  const [showIntro, setShowIntro]      = useState(true);
  const [introClosing, setIntroClosing] = useState(false);
  const [qVisible, setQVisible]        = useState(false);

  // tutorial states
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutAntX, setTutAntX]           = useState(GAME_W / 2 - ANT_W / 2);

  const antXRef    = useRef(antX);
  const pausedRef  = useRef(true);
  const dragging   = useRef(false);
  const dragStartX = useRef(0);
  const antStartX  = useRef(0);
  const frameRef   = useRef(null);
  const qIndexRef  = useRef(qIndex);
  const scoreRef   = useRef(score);
  const tutFrameRef = useRef(null);
  const tutDone    = useRef(false);
  const showTutorialRef = useRef(false);

  useEffect(() => { antXRef.current   = antX;   }, [antX]);
  useEffect(() => { qIndexRef.current = qIndex; }, [qIndex]);
  useEffect(() => { scoreRef.current  = score;  }, [score]);
  useEffect(() => { showTutorialRef.current = showTutorial; }, [showTutorial]);

  // ── tutorial animation ──
  const startTutorialAnim = useCallback(() => {
    let t = 0;
    const center = GAME_W / 2 - ANT_W / 2;
    const range  = 100;
    const animate = () => {
      t += 0.018;
      const x = center + Math.sin(t * Math.PI * 1.4) * range;
      setTutAntX(x);
      tutFrameRef.current = requestAnimationFrame(animate);
    };
    tutFrameRef.current = requestAnimationFrame(animate);
  }, []);

  const dismissTutorial = useCallback(() => {
    if (!tutDone.current && showTutorialRef.current) {
      tutDone.current = true;
      cancelAnimationFrame(tutFrameRef.current);
      setShowTutorial(false);
      // snap real ant to where tutorial ant was
      pausedRef.current = false;
    }
  }, []);

  // ── intro close ──
  const closeIntro = () => {
    setIntroClosing(true);
    setTimeout(() => {
      setShowIntro(false);
      setIntroClosing(false);
      setShowTutorial(true);
      showTutorialRef.current = true;
      startTutorialAnim();
    }, 300);
  };

  const introStartY = useRef(null);
  const onIntroTouchStart = (e) => { introStartY.current = e.touches[0].clientY; };
  const onIntroTouchEnd   = (e) => {
    if (introStartY.current === null) return;
    const delta = e.changedTouches[0].clientY - introStartY.current;
    introStartY.current = null;
    if (delta > 60) closeIntro();
  };
  const onIntroMouseDown = (e) => {
    introStartY.current = e.clientY;
    const up = (ev) => {
      window.removeEventListener("mouseup", up);
      if (introStartY.current === null) return;
      const delta = ev.clientY - introStartY.current;
      introStartY.current = null;
      if (delta > 60) closeIntro();
    };
    window.addEventListener("mouseup", up);
  };

  // ── game loop ──
  useEffect(() => {
    if (gameOver) return;
    let last = performance.now();

    function loop(now) {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      if (!pausedRef.current) {
        const speed = 185;
        setItems((prev) => {
          let caughtGood = false;
          let caughtBad  = false;

          const next = prev
            .map((item) => ({ ...item, y: item.y + speed * dt }))
            .filter((item) => {
              const bottom   = item.y + ITEM_SIZE;
              const gameH    = window.innerHeight;
              const antTop   = gameH - GROUND_H - ANT_W - 10;
              const antLeft  = antXRef.current;
              const antRight = antLeft + ANT_W;

              const caught =
                bottom >= antTop &&
                bottom <= antTop + 45 &&
                item.x + ITEM_SIZE > antLeft + 10 &&
                item.x < antRight - 10;

              if (caught) {
                if (item.good) caughtGood = true;
                else           caughtBad  = true;
                return false;
              }
              return item.y <= gameH;
            });

          if (caughtBad) {
            scoreRef.current = Math.max(0, scoreRef.current - SCORE_STEP);
            setScore(scoreRef.current);
          }

          if (caughtGood) {
            pausedRef.current = true;
            const qi = qIndexRef.current % QUESTIONS.length;
            setQuestion({ ...QUESTIONS[qi], idx: qi });
            setWrong(null);
            setTimeout(() => setQVisible(true), 50);
          }

          if (next.length < 2 && Math.random() < 0.04) next.push(newItem());
          return next;
        });
      }

      frameRef.current = requestAnimationFrame(loop);
    }

    frameRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frameRef.current);
  }, [gameOver]);

  // ── drag handlers ──
  const onTouchStart = useCallback((e) => {
    if (e.target.closest(".gp-question-overlay") || e.target.closest(".gp-topbar")) return;
    dismissTutorial();
    dragging.current   = true;
    dragStartX.current = e.touches[0].clientX;
    antStartX.current  = antXRef.current;
  }, [dismissTutorial]);

  const onTouchMove = useCallback((e) => {
    if (!dragging.current) return;
    const dx = e.touches[0].clientX - dragStartX.current;
    const nx = Math.max(0, Math.min(GAME_W - ANT_W, antStartX.current + dx));
    setAntX(nx);
  }, []);

  const onTouchEnd = useCallback(() => { dragging.current = false; }, []);

  const onMouseDown = useCallback((e) => {
    if (e.target.closest(".gp-question-overlay") || e.target.closest(".gp-topbar")) return;
    dismissTutorial();
    dragging.current   = true;
    dragStartX.current = e.clientX;
    antStartX.current  = antXRef.current;
  }, [dismissTutorial]);

  const onMouseMove = useCallback((e) => {
    if (!dragging.current) return;
    const dx = e.clientX - dragStartX.current;
    const nx = Math.max(0, Math.min(GAME_W - ANT_W, antStartX.current + dx));
    setAntX(nx);
  }, []);

  const onMouseUp = useCallback(() => { dragging.current = false; }, []);

  // ── answer handler ──
  const handleAnswer = (optIdx) => {
    if (!question) return;

    const isCorrect = optIdx === question.correct;

    if (isCorrect) {
      const newScore = Math.min(TOTAL_Q, scoreRef.current + 1);
      scoreRef.current = newScore;
      setScore(newScore);
    } else {
      setWrong(optIdx);
      return; // keep question open on wrong answer
    }

    const nextQIndex = qIndexRef.current + 1;

    setQVisible(false);
    setTimeout(() => {
      setQuestion(null);
      setQIndex(nextQIndex);
      pausedRef.current = false;
      setItems((prev) => [...prev, newItem()]);

      // end game after TOTAL_Q questions answered correctly
      if (nextQIndex >= TOTAL_Q) {
        setTimeout(() => setGameOver(true), 400);
      }
    }, 400);
  };

  // ── pause toggle ──
  const togglePause = () => {
    if (question || showTutorial) return;
    pausedRef.current = !pausedRef.current;
    setPaused(pausedRef.current);
  };

  const progressPct = (score / TOTAL_Q) * 100;

  if (gameOver) {
    return (
      <div className="gp-gameover">
        <img src={antFace} className="gp-gameover-img" alt="" />
        <p className="gp-gameover-text" dir="rtl">כל הכבוד! סיימת את המשחק!</p>
        <button className="gp-gameover-btn" onClick={onNext}>המשך ←</button>
      </div>
    );
  }

  return (
    <div
      className="gp-container"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
    >
      <div className="gp-bg" />

      {/* top bar */}
      <div className="gp-topbar">
        <button className="gp-home-btn" onClick={onHome}>
          <img src={homeIcon} alt="home" />
        </button>
        <div className="gp-progress-track">
          <div className="gp-progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
        <img src={antFace} className="gp-antface" alt="" />
        <div className="helpUpPart"></div>
        <img src={upPart} className="upPart" />
      </div>

      {/* pause button — hidden during tutorial */}
      {!showTutorial && (
        <button className="gp-pause-btn" onClick={togglePause}>
          {paused ? "▶ המשך" : "⏸ עצור"}
        </button>
      )}

      {paused && !question && !showTutorial && (
        <div className="gp-paused-overlay">
          <p className="gp-paused-text" dir="rtl">המשחק מושהה</p>
        </div>
      )}

      {/* falling items — hidden during tutorial */}
      {!showTutorial && items.map((item) => (
        <img
          key={item.id}
          src={item.img}
          className={`gp-item ${item.good ? "gp-item-good" : "gp-item-bad"}`}
          alt=""
          style={{ left: item.x, top: item.y }}
        />
      ))}

      {/* real ant — hidden during tutorial */}
      {!showTutorial && (
        <img src={antImg} className="gp-ant" alt="" style={{ left: antX }} />
      )}

      {/* ground */}
      <img src={groundPart} className="gp-ground" alt="" />

      {/* question overlay */}
      {question && (
        <div className="gp-question-overlay">
          <div className={`gp-question-board ${qVisible ? "gp-q-in" : "gp-q-out"}`}>
            <img src={questionBoard} className="gp-qboard-img" alt="" />
            <div className="gp-qboard-content">
              <p className="gp-qtext" dir="rtl">{question.q}</p>
              <div className="gp-options">
                {question.options.map((opt, i) => (
                  <button
                    key={i}
                    className={`gp-opt-btn ${wrong === i ? "gp-wrong" : ""}`}
                    onClick={() => handleAnswer(i)}
                    dir="rtl"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* tutorial overlay */}
      {showTutorial && (
        <div className="gp-tutorial-overlay">
          {/* animated ant */}
          <img
            src={antImg}
            className="gp-ant gp-tut-ant"
            alt=""
            style={{ left: tutAntX }}
          />
          {/* finger hint follows the ant */}
          <div
            className="gp-tutorial-hint"
            style={{ left: tutAntX + ANT_W / 2 }}
          >
            <span className="gp-tut-arrow">←</span>
            <span className="gp-tut-finger">☝</span>
            <span className="gp-tut-arrow">→</span>
          </div>
          <p className="gp-tut-label" dir="rtl">גררי את הנמלה לצדדים כדי להתחיל</p>
        </div>
      )}

      {/* intro bottom sheet */}
      {showIntro && (
        <div className="overlay">
          <div className={`bottom-sheet ${introClosing ? "slide-down" : ""}`}>
            <div
              className="drag-handle-wrapper"
              onTouchStart={onIntroTouchStart}
              onTouchEnd={onIntroTouchEnd}
              onMouseDown={onIntroMouseDown}
            >
              <div className="drag-handle" />
              <span className="drag-hint">גררו למטה להתחלה</span>
            </div>
            <div className="sheet-content" dir="rtl">
              <img src={antFace} className="sheet-food-img" alt="" />
              <div className="sheet-red-bar">ברוכות הבאות למשחק!</div>
              <p className="sheet-text">
                תפסי פירות ואוכל בריא כדי לקבל שאלות תזונה ולהעלות את הניקוד.
              </p>
              <p className="sheet-text" style={{ top: "57%" }}>
                שימי לב — פריטים מפחידים יורידו לך ניקוד!
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}