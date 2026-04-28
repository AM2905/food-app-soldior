import { useEffect, useState } from "react";
import "../css/style.css";
import logo from "../assets/logo.svg";

export default function FirstPage({ onNext, onReset }) {

  const [isReturning, setIsReturning] = useState(false);

  useEffect(() => {
    const visited = localStorage.getItem("visited");
    if (visited === "true") {
      setIsReturning(true);
    }
  }, []);

  const handleStart = () => {
    localStorage.setItem("visited", "true");
    onNext();
  };

  const handleReset = () => {
    localStorage.removeItem("visited"); // איפוס
    if (onReset) onReset(); // אופציונלי אם יש לך ניהול מסכים
    else window.location.reload(); // fallback
  };

  return (
    <div className={`firstPage-container ${isReturning ? "final-screen" : ""}`}>

      <img src={logo} className="logo" alt="" />

      {!isReturning ? (
        <>
          <span className="first-title">לומדת תזונת לוחמות</span>

          <button className="start-button" onClick={handleStart}>
            אני מוכנה
          </button>
        </>
      ) : (
        <>
          <span className="first-title final-title">
            סיימתם את הלומדה!
          </span>

          <button className="start-button" style={{bottom: "7%"}} onClick={handleReset}>
            לחזור על החומר
          </button>
        </>
      )}

    </div>
  );
}