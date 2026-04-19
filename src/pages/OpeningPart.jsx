import { useState, useRef, useEffect } from "react";
import "../css/style.css";
import videoFile from "../assets/video.mp4";
import thirdBg from "../assets/after-video.svg";
import finalBg from "../assets/ant-talks-background.svg";
import talkingBubble from "../assets/talking-bubble.svg";

export default function OpeningPart({ onNext }) {
  const [started, setStarted] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [showNextScreen, setShowNextScreen] = useState(false);
  const [showFinalScreen, setShowFinalScreen] = useState(false);
  const [buttonClicked, setButtonClicked] = useState(false);
  const [debugLog, setDebugLog] = useState("");

  const videoRef = useRef(null);
  const videoEndedRef = useRef(false);
  const fallbackTimerRef = useRef(null);

  const log = (msg) => {
    console.log(msg);
    setDebugLog(prev => prev + "\n" + msg);
  };

  useEffect(() => {
    const img = new Image();
    img.src = thirdBg;
  }, []);

  const triggerVideoEnd = () => {
    if (videoEndedRef.current) return;
    videoEndedRef.current = true;
    log("✅ triggerVideoEnd called");
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    const v = videoRef.current;
    if (v) v.pause();
    setVideoEnded(true);
  };

  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.currentTime >= 46) {
      log("⏱ timeUpdate hit 46s");
      triggerVideoEnd();
    }
  };

  const handleVideoEnded = () => {
    log("🎬 onEnded fired");
    triggerVideoEnd();
  };

  const handleLoadedMetadata = () => {
    const v = videoRef.current;
    log(`📐 duration: ${v?.duration}`);
  };

  const handleStart = async () => {
    setStarted(true);
    const video = videoRef.current;
    if (!video) { log("❌ no videoRef"); return; }
    log("▶️ handleStart");

    try {
      await video.play();
      log("▶️ play() ok");

      const targetTime = Math.min(46, video.duration || 46);
      const msUntilTarget = (targetTime - (video.currentTime || 0)) * 1000;
      log(`⏳ timer: ${Math.round(msUntilTarget / 1000)}s`);

      fallbackTimerRef.current = setTimeout(() => {
        log("⏰ setTimeout fired");
        triggerVideoEnd();
      }, msUntilTarget + 500);

    } catch (e) {
      log("❌ play failed: " + e);
    }
  };

  const handleContinue = () => setShowNextScreen(true);
  const handleFinalContinue = () => setShowFinalScreen(true);
  const handleButtonClick = () => {
    if (buttonClicked) onNext();
    else setButtonClicked(true);
  };

  return (
    <div className="oppeningPart-container">

      <video
        ref={videoRef}
        src={videoFile}
        playsInline
        muted
        preload="auto"
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleVideoEnded}
        onLoadedMetadata={handleLoadedMetadata}
        style={{
          opacity: started && !showNextScreen ? 1 : 0,
          transition: "opacity 0.4s ease",
          position: "absolute",
          width: "100%",
          height: "100%",
          objectFit: "cover"
        }}
      />

      <div className="background-image" style={{
        backgroundImage: `url(${thirdBg})`,
        opacity: showNextScreen && !showFinalScreen ? 1 : 0,
        transition: "opacity 0.4s ease",
        position: "absolute", width: "100%", height: "100%"
      }} />

      <div className="background-image" style={{
        backgroundImage: `url(${finalBg})`,
        opacity: showFinalScreen ? 1 : 0,
        transition: "opacity 0.4s ease",
        position: "absolute", width: "100%", height: "100%"
      }} />

      {/* START */}
      {!started && (
        <button className="start-button" onClick={handleStart}>
          התחל סרטון
        </button>
      )}

      {/* 🔍 DEBUG LOG */}
      {started && !videoEnded && (
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          background: "rgba(0,0,0,0.75)", color: "lime",
          fontSize: "12px", padding: "8px", zIndex: 999,
          whiteSpace: "pre-wrap", maxHeight: "35%", overflowY: "auto",
          direction: "ltr"
        }}>
          {debugLog || "waiting..."}
        </div>
      )}

      {/* 🚨 SKIP BUTTON - always visible while video plays */}
      {started && !videoEnded && (
        <button
          onClick={() => { log("🚨 skip tapped"); triggerVideoEnd(); }}
          style={{
            position: "absolute", bottom: "8%", right: "5%",
            zIndex: 999, background: "rgba(200,0,0,0.8)",
            color: "white", border: "none", borderRadius: "10px",
            padding: "10px 16px", fontSize: "15px"
          }}
        >
          דלג ←
        </button>
      )}

      {/* AFTER VIDEO BUTTON */}
      {videoEnded && !showNextScreen && (
        <button onClick={handleContinue} className="next-button" style={{ left: "33%" }}>
          המשך
        </button>
      )}

      {/* SECOND SCREEN BUTTON */}
      {showNextScreen && !showFinalScreen && (
        <button onClick={handleFinalContinue} className="next-button" style={{
          left: "50%", width: "100%", height: "24%",
          bottom: "-7%", paddingBottom: "9%", fontSize: "140%"
        }}>
          בואו תראו מה קרה לה...
        </button>
      )}

      {/* FINAL SCREEN */}
      {showFinalScreen && (
        <>
          <div style={{
            position: "absolute", top: "12%", width: "100%",
            textAlign: "center", fontWeight: "bold",
            color: "#5791EF", fontSize: "140%", zIndex: "2"
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