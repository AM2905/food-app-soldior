
import "../css/style.css";
import logo from "../assets/logo.svg";
export default function FirstPage() {
  return (
          <div className="firstPage-container">
<img src={logo} className="logo" />
      <span className="first-title">לומדת תזונת לוחמות</span>
      <button className="start-button">
        אני מוכנה
      </button>
    </div>
  );
}
