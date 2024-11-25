import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Folder from "./pages/folder";
import Auth from "./pages/auth/auth";
import Layout from "./pages/layout";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/folders" element={<Folder />} />
          <Route path="/folders/:folderId" element={<p>Folder</p>} />
          <Route path="/folders/:folderId/:fileId" element={<p>File</p>} />
        </Route>

        <Route path="/auth" element={<Auth />} />
      </Routes>
    </>
  );
}

export default App;
