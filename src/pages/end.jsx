import { useEffect, useState } from "react";
import "../css/style.css";
import logo from "../assets/logo.svg";
import background from "../assets/background-final.svg";

export default function end({ onNext }) {

 
 

  return (
    <div className={`firstPage-container`} style={{ backgroundImage: `url(${background})` }}>

          <span className="first-title final-title">
            סיימתם את הלומדה!
          </span>

          <button className="start-button" style={{bottom: "7%"}} onClick={onNext}>
            לחזור על החומר
          </button>
        
    </div>
  );
}