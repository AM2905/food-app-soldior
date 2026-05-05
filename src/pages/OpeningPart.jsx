import { useState, useRef, useEffect } from "react";
import "../css/style.css";
import videoFile from "../assets/video.mp4";
import thirdBg from "../assets/after-video.svg";
import finalBg from "../assets/ant-talks-background.svg";
import talkingBubble from "../assets/talking-bubble.svg";

const VIDEO_STOP_TIME = 36; // שניות

export default function OpeningPart({ onNext }) {
  const [started, setStarted]               = useState(false);
  const [isPaused, setIsPaused]             = useState(false);
  const [videoEnded, setVideoEnded]         = useState(false);
  const [showNextScreen, setShowNextScreen] = useState(false);
  const [showFinalScreen, setShowFinalScreen] = useState(false);
  const [buttonClicked, setButtonClicked]   = useState(false);
  const [progress, setProgress]             = useState(0);
  const [remaining, setRemaining]           = useState(VIDEO_STOP_TIME);

  const videoRef         = useRef(null);
  const videoEndedRef    = useRef(false);
  const fallbackTimerRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.src = thirdBg;
  }, []);

  const triggerVideoEnd = () => {
    if (videoEndedRef.current) return;
    videoEndedRef.current = true;
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    const v = videoRef.current;
    if (v) v.pause();
    setProgress(100);
    setRemaining(0);
    setVideoEnded(true);
  };

  // הפעלת הטיימר הנותר לפי הזמן שנשאר בסרטון
  const scheduleTimer = (remainingMs) => {
    if (fallbackTimerRef.current) clearTimeout(fallbackTimerRef.current);
    fallbackTimerRef.current = setTimeout(() => {
      triggerVideoEnd();
    }, remainingMs + 300);
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v || videoEndedRef.current) return;
    const pct = Math.min((v.currentTime / VIDEO_STOP_TIME) * 100, 100);
    const rem = Math.max(0, VIDEO_STOP_TIME - v.currentTime);
    setProgress(pct);
    setRemaining(rem);
    // הכפתור יופיע רק אם הסרטון הגיע ל-36 שניות בזמן ריצה
    if (v.currentTime >= VIDEO_STOP_TIME) triggerVideoEnd();
  };

  const handleVideoEnded = () => triggerVideoEnd();

  const handleStart = async () => {
    setStarted(true);
    const video = videoRef.current;
    if (!video) return;
    try {
      await video.play();
      setIsPaused(false);
      // טיימר גיבוי לפי הזמן שנותר
      const msLeft = (VIDEO_STOP_TIME - (video.currentTime || 0)) * 1000;
      scheduleTimer(msLeft);
    } catch (e) {
      console.error(e);
    }
  };

  // לחיצה על הסרטון — עצור/המשך
  const handleVideoTap = () => {
    const v = videoRef.current;
    if (!v || videoEndedRef.current) return;

    if (v.paused) {
      // ממשיכים — מתזמנים טיימר לפי הזמן שנותר
      v.play();
      setIsPaused(false);
      const msLeft = (VIDEO_STOP_TIME - v.currentTime) * 1000;
      scheduleTimer(msLeft);
    } else {
      // עוצרים — מבטלים את הטיימר כדי שלא יירה בזמן ההשהיה
      v.pause();
      setIsPaused(true);
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }
    }
  };

  const handleContinue      = () => setShowNextScreen(true);
  const handleFinalContinue = () => setShowFinalScreen(true);
  const handleButtonClick   = () => {
    if (buttonClicked) onNext();
    else setButtonClicked(true);
  };

  const fmt = (sec) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="oppeningPart-container">

      <video
        ref={videoRef}
        src={videoFile}
        playsInline
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnded}
        style={{
          opacity: started && !showNextScreen ? 1 : 0,
          transition: "opacity 0.4s ease",
          position: "absolute",
          width: "100%", height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      />

      {/* אזור לחיצה לעצור/להמשיך */}
      {started && !videoEnded && !showNextScreen && (
        <div className="op-video-tap-area" onClick={handleVideoTap}>
          {isPaused && (
            <div className="op-pause-indicator">▶</div>
          )}
        </div>
      )}

      <div className="background-image" style={{
        backgroundImage: `url(${thirdBg})`,
        opacity: showNextScreen && !showFinalScreen ? 1 : 0,
        transition: "opacity 0.4s ease",
        position: "absolute", width: "100%", height: "100%", zIndex: 0,
      }} />

      <div className="background-image" style={{
        backgroundImage: `url(${finalBg})`,
        opacity: showFinalScreen ? 1 : 0,
        transition: "opacity 0.4s ease",
        position: "absolute", width: "100%", height: "100%", zIndex: 0,
      }} />

      {/* START */}
      {!started && (
        <button className="start-button" onClick={handleStart}>
          התחל סרטון
        </button>
      )}

      {/* PROGRESS BAR + שניות יורדות מימין */}
      {started && !videoEnded && !showNextScreen && (
        <div className="op-progress-container">
          <div className="op-progress-track">
            <div
              className="op-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="op-progress-time op-time-left">
            {fmt(remaining)}
          </span>
        </div>
      )}

      {/* SKIP BUTTON */}
     

      {/* AFTER VIDEO */}
      {videoEnded && !showNextScreen && (
        <button
          onClick={handleContinue}
          style={{
            position: "fixed",
            bottom: "10%",
            left: "50%",
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

      {/* SECOND SCREEN */}
      {showNextScreen && !showFinalScreen && (
        <button
          onClick={handleFinalContinue}
          className="next-button"
          style={{
            height: "14%",
            bottom: "5%",
            fontSize: "140%",
            maxWidth: "390px",
            whiteSpace: "nowrap",
          }}
        >
          בואו תראו מה קרה לה...
        </button>
      )}

      {/* FINAL SCREEN */}
      {showFinalScreen && (
        <>
          <div style={{
            position: "absolute", top: "12%", width: "82%",
            textAlign: "center", fontWeight: "bold",
            color: "#5791EF", fontSize: "140%", zIndex: 2, direction: "rtl",
          }}>
            {buttonClicked
              ? "תוכלו לעזור לי ללמוד איך לאכול טוב, בשביל שיהיה לי כוח לסחוב את האוכל לקן?"
              : "לאחרונה אני מרגישה עייפות וכאבים, אולי בגלל שאני לא אוכלת נכון.."}
          </div>
          <img style={{ width: "93%", top: "4%" }} src={talkingBubble} className="logo" />
          <button onClick={handleButtonClick} className="special-button">
            {buttonClicked ? "כן ברור שנעזור!" : "לחצו בשביל להמשיך"}
          </button>
        </>
      )}

    </div>
  );
}