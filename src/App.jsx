import React, { useState } from "react";
import "./css/App.css";
import FirstPage from "./pages/FirstPage.jsx";
import OpeningPart from "./pages/OpeningPart.jsx";

const pages = [FirstPage, OpeningPart];

function App() {
  const [pageIndex, setPageIndex] = useState(0);

  const CurrentPage = pages[pageIndex];
  const goNext = () => setPageIndex(pageIndex + 1);

  return (
    <>
      <div className="app">
        <CurrentPage onNext={goNext} />
      </div>
    </>
  );
}

export default App;