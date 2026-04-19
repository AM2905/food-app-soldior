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

  const videoRef = useRef(null);
  const videoEndedRef = useRef(false);
  const fallbackTimerRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.src = thirdBg;
  }, []);

  const triggerVideoEnd = () => {
    if (videoEndedRef.current) return;
    videoEndedRef.current = true;

    // clear fallback timer if it exists
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }

    const v = videoRef.current;
    if (v) v.pause();
    setVideoEnded(true);
  };

  // ✅ Primary: fires as video plays
  const handleTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.currentTime >= 46) {
      triggerVideoEnd();
    }
  };

  // ✅ Fallback 1: video ends naturally
  const handleVideoEnded = () => {
    triggerVideoEnd();
  };

  // ✅ Fallback 2: video metadata loaded — we know exact duration, set a precise timer
  const handleLoadedMetadata = () => {
    const v = videoRef.current;
    if (!v) return;

    const targetTime = Math.min(46, v.duration);
    const msUntilEnd = (targetTime / v.playbackRate) * 1000;

    // We'll start the timer when play begins (see handleStart)
    videoRef.current._targetMs = msUntilEnd;
  };

  const handleStart = async () => {
    setStarted(true);
    const video = videoRef.current;
    if (!video) return;

    try {
      await video.play();

      // ✅ Fallback 3: setTimeout based on video duration (Safari-safe)
      const targetTime = Math.min(46, video.duration || 46);
      const msUntilTarget = (targetTime - (video.currentTime || 0)) * 1000;

      fallbackTimerRef.current = setTimeout(() => {
        triggerVideoEnd();
      }, msUntilTarget + 500); // +500ms buffer

    } catch (e) {
      console.log("play failed", e);
    }
  };

  const handleContinue = () => {
    setShowNextScreen(true);
  };

  const handleFinalContinue = () => {
    setShowFinalScreen(true);
  };

  const handleButtonClick = () => {
    if (buttonClicked) {
      onNext();
    } else {
      setButtonClicked(true);
    }
  };

  return (
    <div className="oppeningPart-container">

      {/* 🎬 VIDEO */}
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

      {/* 🖼️ SCREEN 1 BACKGROUND */}
      <div
        className="background-image"
        style={{
          backgroundImage: `url(${thirdBg})`,
          opacity: showNextScreen && !showFinalScreen ? 1 : 0,
          transition: "opacity 0.4s ease",
          position: "absolute",
          width: "100%",
          height: "100%"
        }}
      />

      {/* 🖼️ FINAL BACKGROUND */}
      <div
        className="background-image"
        style={{
          backgroundImage: `url(${finalBg})`,
          opacity: showFinalScreen ? 1 : 0,
          transition: "opacity 0.4s ease",
          position: "absolute",
          width: "100%",
          height: "100%"
        }}
      />

      {/* ▶️ START */}
      {!started && (
        <button className="start-button" onClick={handleStart}>
          התחל סרטון
        </button>
      )}

      {/* 🔥 FIRST BUTTON - after video */}
      {videoEnded && !showNextScreen && (
        <button
          onClick={handleContinue}
          className="next-button"
          style={{ left: "33%" }}
        >
          המשך
        </button>
      )}

      {/* ⭐ SECOND SCREEN BUTTON */}
      {showNextScreen && !showFinalScreen && (
        <button
          onClick={handleFinalContinue}
          className="next-button"
          style={{
            left: "50%",
            width: "100%",
            height: "24%",
            bottom: "-7%",
            paddingBottom: "9%",
            fontSize: "140%"
          }}
        >
          בואו תראו מה קרה לה...
        </button>
      )}

      {/* 📝 FINAL SCREEN CONTENT */}
      {showFinalScreen && (
        <>
          <div
            style={{
              position: "absolute",
              top: "12%",
              width: "100%",
              textAlign: "center",
              fontWeight: "bold",
              color: "#5791EF",
              fontSize: "140%",
              zIndex: "2"
            }}
          >
                        {buttonClicked ? "תוכלו לעזור לי ללמוד איך לאכול טוב, בשביל שיהיה לי כוח לסחוב את האוכל לקן?" : "  לאחרונה אני מרגישה עייפות וכאבים, אולי בגלל שאני לא אוכלת נכון.."}

          
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