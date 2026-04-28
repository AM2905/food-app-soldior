import { useEffect, useState } from "react";
import "../css/style.css";
import logo from "../assets/logo.svg";

export default function FirstPage({ onNext, onReset }) {

  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const finished = localStorage.getItem("finished");
    if (finished === "true") {
      setIsFinished(true);
    }
  }, []);

  const handleStart = () => {
    onNext();
  };

  const handleReset = () => {
    localStorage.removeItem("finished"); // איפוס סיום
    if (onReset) onReset();
    else window.location.reload();
  };

  return (
    <div className={`firstPage-container ${isFinished ? "final-screen" : ""}`}>

      <img src={logo} className="logo" style={{zIndex:"20"}} alt="" />

      {!isFinished ? (
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

          <button
            className="start-button"
            style={{bottom: "7%"}}
            onClick={handleReset}
          >
            לחזור על החומר
          </button>
        </>
      )}

    </div>
  );
}