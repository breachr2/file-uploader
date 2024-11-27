import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Folder from "./pages/folder";
import Auth from "./pages/auth/auth";
import Layout from "./pages/layout";
import { AuthProvider } from "./context/auth-context";
import PublicFolder from "./pages/public-folder";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" index element={<p>Welcome</p>} />
        <Route element={<Layout />}>
          <Route path="/folders" element={<Home />}>
            <Route path="/folders" element={<PublicFolder />}/>
            <Route path="/folders/:folderId" element={<Folder />} />
          </Route>
          <Route path="/folders/:folderId/:fileId" element={<p>File</p>} />
        </Route>
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
