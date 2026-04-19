import { useState, useRef, useEffect } from "react";
import "../css/style.css";
import videoFile from "../assets/video.mp4";
import thirdBg from "../assets/after-video.svg";
import finalBg from "../assets/ant-talks-background.svg"; // 👈 NEW BACKGROUND
import talkingBubble from "../assets/talking-bubble.svg"; 

export default function OpeningPart({ onNext }) {
  const [started, setStarted] = useState(false);
  const [videoEnded, setVideoEnded] = useState(false);
  const [showNextScreen, setShowNextScreen] = useState(false);
  const [showFinalScreen, setShowFinalScreen] = useState(false); // ⭐ NEW
  const [buttonClicked, setButtonClicked] = useState(false); // ⭐ NEW - כפתור נלחץ

  const videoRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.src = thirdBg;
  }, []);

  const handleStart = async () => {
    setStarted(true);

    const video = videoRef.current;
    if (!video) return;

    try {
      await video.play();

      intervalRef.current = setInterval(() => {
        const v = videoRef.current;
        if (!v) return;

        if (v.currentTime >= 46) {
          v.pause();
          v.currentTime = 46;

          clearInterval(intervalRef.current);
          intervalRef.current = null;

          setVideoEnded(true);
        }
      }, 100);
    } catch (e) {
      console.log("play failed", e);
    }
  };

  const handleContinue = () => {
    setShowNextScreen(true);
  };

  // ⭐ HANDLER (second button click)
  const handleFinalContinue = () => {
    setShowFinalScreen(true);
  };

  // ⭐ NEW HANDLER - לחיצה על כפתור במסך הסופי
  const handleButtonClick = () => {
    if (buttonClicked) {
      onNext(); // לדף הבא
    } else {
      setButtonClicked(true); // שינוי הכפתור
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

      {/* 🔥 FIRST BUTTON */}
      {videoEnded && !showNextScreen && (
        <button
          onClick={handleContinue}
          className="next-button"
           style={{
              left: "33%"}}
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
    fontSize: "140%"}}
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
              color: "white",
              fontSize: "140%",
              fontWeight: "bold",
              color:"#5791EF",
              zIndex:"2"
          
            }}
          >
                        {buttonClicked ? "תוכלו לעזור לי ללמוד איך לאכול טוב, בשביל שיהיה לי כוח לסחוב את האוכל לקן?" : " לאחרונה אני מרגישה עייפות וכאבים, אולי בגלל שאני לא אוכלת נכון.."}

          
          </div>
                  <img style={{width:"93%",top:"4%"}} src={talkingBubble} className="logo" />
            
          {/* ⭐ כפתור שמשתנה לאחר לחיצה */}
          <button
            onClick={handleButtonClick}
            className="special-button"
          >
            {buttonClicked ? "המשך לדף הבא" : "לחצו בשביל להמשיך"}
          </button>
        </>
      )}

    </div>
  );
}