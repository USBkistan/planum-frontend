import { useNavigate } from "react-router";
import "./index.css";

export function App() {
    let navigate = useNavigate();

    return (
        <div className="app">
            <button onClick={() => navigate("/login")}>To login page</button>
        </div>
    );
}

export default App;
