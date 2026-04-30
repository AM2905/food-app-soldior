import { useState, useRef } from "react";
import "../css/badSigns.css";

import upPart from "../assets/up-part.svg";
import spider from "../assets/scary-spider.svg";
import sandwich from "../assets/scary-k2.svg";
import cloud from "../assets/scary-cloud.svg";
import shoe from "../assets/scary-shoe.svg";
import antSign from "../assets/ant-sign.svg";
import antFace from "../assets/ant-face.svg";
import check from "../assets/warning-mark.svg";
import talkingBubble from "../assets/talking-bubble.svg";

const signs = [
  { id: 1, img: spider,   label: "הפסקת מחזור (או שינויים משמעותיים במחזור)" },
  { id: 2, img: sandwich, label: "תחושת חולשה או עייפות קיצונית" },
  { id: 3, img: cloud,    label: "שינוי משמעותי במשקל (עלייה או ירידה)" },
  { id: 4, img: shoe,     label: "כאבי שרירים ועצמות מתמשכים / חריגים", big: true },
];

export default function BadSigns({ onNext }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [doneIds, setDoneIds] = useState([]);
  const [antText, setAntText] = useState(null);
  const [antState, setAntState] = useState("hidden");
  const [showNext, setShowNext] = useState(false);

  const [showEndScreen, setShowEndScreen] = useState(false); // ✅ חדש

  const [showIntro, setShowIntro] = useState(true);
  const [introClosing, setIntroClosing] = useState(false);

  const startY = useRef(null);

  const closeIntro = () => {
    setIntroClosing(true);
    setTimeout(() => {
      setShowIntro(false);
      setIntroClosing(false);
    }, 300);
  };

  const onTouchStart = (e) => { startY.current = e.touches[0].clientY; };
  const onTouchEnd = (e) => {
    if (startY.current === null) return;
    const delta = e.changedTouches[0].clientY - startY.current;
    startY.current = null;
    if (delta > 60) closeIntro();
  };

  const onMouseDown = (e) => {
    startY.current = e.clientY;
    const onMouseUp = (ev) => {
      window.removeEventListener("mouseup", onMouseUp);
      if (startY.current === null) return;
      const delta = ev.clientY - startY.current;
      startY.current = null;
      if (delta > 60) closeIntro();
    };
    window.addEventListener("mouseup", onMouseUp);
  };

  const handleSignClick = (index, sign) => {
    const newText = sign.label;

    if (index === activeIndex) {
      const newDone = [...doneIds, sign.id];
      setDoneIds(newDone);
      setActiveIndex((prev) => prev + 1);

      if (newDone.length === signs.length) {
        setTimeout(() => setShowNext(true), 2000);
      }
    }

    if (antState === "visible" || antState === "entering") {
      setAntState("exiting");
      setTimeout(() => {
        setAntText(newText);
        setAntState("entering");
        setTimeout(() => setAntState("visible"), 500);
      }, 500);
    } else {
      setTimeout(() => {
        setAntText(newText);
        setAntState("entering");
        setTimeout(() => setAntState("visible"), 500);
      }, 0);
    }
  };

  return (
    <div className="badSigns-container">

      {/* ✅ מסך סיום */}
      {showEndScreen && (
        <div className="end-screen">
            
          <img style={{ width: "93%", top: "4%" }} src={talkingBubble} className="logo" />
        <p className="bubble-text">עכשיו אני צריכה לוודא שהבנתי בשביל להצליח להגיע לקן</p>
         
          <button className="end-btn" onClick={onNext}>
            בואו נתחיל!
          </button>
        </div>
      )}

      {!showEndScreen && (
        <>
          <span className="bad-title">סימנים שחשוב לשים לב אליהם</span>
          <span className="bad-subtitle">לחצו בשביל לגלות</span>
          <img src={upPart} className="upPartPls" />

          <div className="signs-grid">
            {signs.map((sign, index) => {
              const isDone = doneIds.includes(sign.id);
              const isActive = index === activeIndex;

              return (
                <div
                  key={sign.id}
                  className={`sign-item ${isActive ? "shake" : ""} ${isDone ? "done" : ""}`}
                  onClick={() => handleSignClick(index, sign)}
                >
                  <img src={sign.img} className={`sign-img ${sign.big ? "sign-img-big" : ""}`} alt="" />
                  {isDone && <img src={check} className="sign-check" alt="" />}
                </div>
              );
            })}
          </div>

          {antState !== "hidden" && (
            <div className={`ant-wrapper ant-${antState}`}>
              <div className="ant-sign-box">
                <p className="ant-sign-text" dir="rtl">{antText}</p>
              </div>
              <img src={antSign} className="ant-img" alt="" />
            </div>
          )}

          {showNext && (
            <button
              className="bad-next-btn"
              onClick={() => setShowEndScreen(true)} // ✅ במקום onNext
            >
              המשך
            </button>
          )}

          {showIntro && (
            <div className="overlay">
              <div className={`bottom-sheet ${introClosing ? "slide-down" : ""}`}>
                <div
                  className="drag-handle-wrapper"
                  onTouchStart={onTouchStart}
                  onTouchEnd={onTouchEnd}
                  onMouseDown={onMouseDown}
                >
                  <div className="drag-handle" />
                  <span className="drag-hint">גררו למטה לסגירה</span>
                </div>

                <div className="sheet-content" dir="rtl">
                  <img src={antFace} className="sheet-food-img" alt="" />

                  <div className="sheet-red-bar-two" style={{whiteSpace: "normal"}}>
                    אם את חווה אחד או יותר מהדברים הבאים אל תתעלמי, פני לבדיקה רפואית
                  </div>

                  <p className="sheet-text" style={{position:"static"}}>
                    אלו יכולים להיות סימנים לכך שהגוף לא מקבל את מה שהוא צריך
                  </p>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}