import { useState, useRef } from "react";
import "../css/goodEating.css";

import upPart from "../assets/up-part.svg";
import meal from "../assets/food-meal.svg";
import meat from "../assets/food-meat.svg";
import orange from "../assets/food-orange.svg";
import bread from "../assets/food-bread.svg";
import snack from "../assets/food-snack.svg";
import check from "../assets/check-mark.svg";

import circlesImg from "../assets/meal-img.svg";
import carbsImg from "../assets/carbs-img.svg";
import protienImg from "../assets/protien-img.svg";

const PLACEHOLDER_CIRCLES = circlesImg;
const PLACEHOLDER_PROTEIN  = protienImg;
const PLACEHOLDER_CARBS    = carbsImg;

export default function GoodEatingPage({ onNext }) {
  const [selected, setSelected]       = useState(null);
  const [visited, setVisited]         = useState(new Set()); // כל שנלחץ — מקבל ✓
  const [activeIndex, setActiveIndex] = useState(0);         // רק לאנימציית pulse בסדר
  const [flipped, setFlipped]         = useState(false);
  const [closing, setClosing]         = useState(false);

  const startY = useRef(null);

  const foods = [
    { id: 1, img: meal,   top: "15%", left: "50%", type: "meal"    },
    { id: 5, img: snack,  top: "30%", left: "-5%", type: "snack"   },
    { id: 2, img: meat,   top: "40%", left: "40%", type: "protein" },
    { id: 4, img: bread,  top: "65%", left: "4%",  type: "carbs"   },
    { id: 3, img: orange, top: "70%", left: "50%", type: "fruits"  },
  ];

  const allDone = visited.size >= foods.length;

  const handleClick = (index, item) => {
    setSelected(item);
    setFlipped(false);
    setClosing(false);

    // תמיד מוסיף ✓ ללא קשר לסדר
    setVisited((prev) => {
      const next = new Set(prev);
      next.add(index);

      // קדם את ה-pulse: מצא את האינדקס הבא שעוד לא ביקרו בו
      setActiveIndex((prevActive) => {
        let candidate = prevActive;
        // אם לחצו על הפריט שה-pulse עליו — קדם
        if (index === prevActive) {
          candidate = prevActive + 1;
        }
        // דלג על כל מה שכבר ביקרו בו (כולל מה שרק עכשיו נוסף)
        while (candidate < foods.length && next.has(candidate)) {
          candidate++;
        }
        return candidate;
      });

      return next;
    });
  };

  const closeSheet = () => {
    setClosing(true);
    setTimeout(() => {
      setSelected(null);
      setFlipped(false);
      setClosing(false);
    }, 300);
  };

  // Touch
  const onTouchStart = (e) => { startY.current = e.touches[0].clientY; };
  const onTouchEnd = (e) => {
    if (startY.current === null) return;
    const delta = e.changedTouches[0].clientY - startY.current;
    startY.current = null;
    if (delta > 60) closeSheet();
  };

  // Mouse
  const onMouseDown = (e) => {
    startY.current = e.clientY;
    const onMouseUp = (ev) => {
      window.removeEventListener("mouseup", onMouseUp);
      if (startY.current === null) return;
      const delta = ev.clientY - startY.current;
      startY.current = null;
      if (delta > 60) closeSheet();
    };
    window.addEventListener("mouseup", onMouseUp);
  };

  const renderContent = (type) => {
    switch (type) {
      case "meal":
        return (
          <div className="sheet-content" dir="rtl">
            <img src={meal} className="sheet-food-img" alt="" />
            <div className="sheet-red-bar">לא מדלגות על ארוחות</div>
            <p className="sheet-text" style={{    top: "58vh"}}>הגוף שלך עובד קשה — הוא צריך אספקה של אנרגיה</p>
            {PLACEHOLDER_CIRCLES
              ? <img src={PLACEHOLDER_CIRCLES} className="sheet-extra-img" alt="" />
              : <div className="placeholder-img">[ תמונת עיגולים ]</div>}
          </div>
        );
      case "snack":
        return (
          <div className="sheet-content" dir="rtl">
            <img src={snack} className="sheet-food-img" alt="" />
            <div className="sheet-red-bar">לא מחליפות ארוחה בחטיפים</div>
            <p className="sheet-text">חטיף הוא לא תחליף לארוחה.
               הגוף שלך צריך ארוחה מלאה ומגוונת כדי לקבל את כל רכיבי התזונה ולתפקד לאורך זמן.</p>
          </div>
        );
      case "protein":
        return (
          <div className="sheet-content" dir="rtl">
            <img src={meat} className="sheet-food-img" alt="" />
            <div className="sheet-red-bar">משלבות חלבון בכל ארוחה</div>
            {!flipped ? (
              <>
                <p className="sheet-text">חלבון חיוני לבניית השריר ולהתאוששות</p>
                <button className="sheet-btn" onClick={() => setFlipped(true)}>המשך ←</button>
              </>
            ) : (
              <>
                <p className="sheet-text" style={{ top: "55%" }}>נסי לשלב מקור חלבון בכל ארוחה</p>
                {PLACEHOLDER_PROTEIN
                  ? <img src={PLACEHOLDER_PROTEIN} style={{ left: "50%", bottom: "17vh", transform: "translate(-50%)" }} className="sheet-extra-img" alt="" />
                  : <div className="placeholder-img">[ תמונת חלבון ]</div>}
                <button className="sheet-btn sheet-btn-left" onClick={() => setFlipped(false)}>→ חזור</button>
              </>
            )}
          </div>
        );
      case "carbs":
        return (
          <div className="sheet-content" dir="rtl">
            <img src={bread} className="sheet-food-img" alt="" />
            <div className="sheet-red-bar">לא מוותרות על פחמימות</div>
            {!flipped ? (
              <>
                <p className="sheet-text">פחמימות הן מקור האנרגיה המרכזי שלך לאימונים ולפעילות</p>
                <button className="sheet-btn" onClick={() => setFlipped(true)}>המשך ←</button>
              </>
            ) : (
              <>
                {PLACEHOLDER_CARBS
                  ? <img src={PLACEHOLDER_CARBS} className="sheet-extra-img" style={{     width: "30vh",left: "50%", transform: "translate(-50%)", bottom: "14vh" }} alt="" />
                  : <div className="placeholder-img">[ תמונת פחמימות ]</div>}
                <button className="sheet-btn sheet-btn-left" onClick={() => setFlipped(false)}>→ חזור</button>
              </>
            )}
          </div>
        );
      case "fruits":
        return (
          <div className="sheet-content" dir="rtl">
            <img src={orange} className="sheet-food-img" alt="" />
            <div className="sheet-red-bar">מקפידות לאכול פירות וירקות טריים</div>
            <p className="sheet-text">פירות וירקות מאפשרים התאוששות מהירה יותר אחרי פעילות והחלמה טובה יותר של הגוף מפציעות</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="goodEating-container">
      <div className="helpUpPartWork"></div>
      <span className="up-title">דגשים לאכילה נכונה</span>
      <span className="bad-subtitle">לחצו בשביל לגלות</span>
      <img src={upPart} className="upPartWork" />

      {foods.map((item, index) => {
        const isDone    = visited.has(index);
        // pulse רק על האינדקס הבא בתור שעוד לא ביקרו בו
        const isPulsing = index === activeIndex && !isDone;
        return (
          <div
            key={item.id}
            className="food-wrapper"
            style={{ position: "absolute", top: item.top, left: item.left }}
            onClick={() => handleClick(index, item)}
          >
            <img src={item.img} className={`food ${isPulsing ? "pulse" : ""}`} />
            {isDone && <img src={check} className="check-icon" />}
          </div>
        );
      })}

      {allDone && !selected && (
        <button
          onClick={onNext}
          style={{
            position: "fixed",
            bottom: "5%",
            left: "27%",
            transform: "translateX(-50%)",
            zIndex: 9999,
            padding: "16px 40px",
            fontSize: "20px",
            fontWeight: "bold",
            background: "#E3F4FF",
            color: "#4890C6",
            border: "none",
            borderRadius: "50px",
            boxShadow: "0 5px 15px rgba(0,0,0,0.3)",
            direction: "rtl",
            touchAction: "manipulation",
            fontFamily: "'Rubik', sans-serif",
          }}
        >
          המשך
        </button>
      )}

      {selected && (
        <div className="overlay">
          <div className={`bottom-sheet ${closing ? "slide-down" : ""}`}>
            <div
              className="drag-handle-wrapper"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              onMouseDown={onMouseDown}
            >
              <div className="drag-handle" />
              <span className="drag-hint">גררו למטה לסגירה</span>
            </div>
            {renderContent(selected.type)}
          </div>
        </div>
      )}
    </div>
  );
}