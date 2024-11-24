import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Folder from "./pages/Folder";

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/folder">Folder</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="folder" element={<Folder />} />
      </Routes>
    </div>
  );
}

export default App;
