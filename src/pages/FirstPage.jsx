import { useEffect, useState } from "react";
import "../css/style.css";
import logo from "../assets/logo.svg";

export default function FirstPage({ onNext ,onFirstPage}) {

 

  return (
    <div className={`firstPage-container`}>

      <img src={logo} className="logo" style={{zIndex:"20"}} alt="" />

      
        <>
          <span className="first-title">לומדת תזונת לוחמות</span>

          <button className="start-button" onClick={onFirstPage}>
            אני מוכנה
          </button>
        </>
    
    </div>
  );
}