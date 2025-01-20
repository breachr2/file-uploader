import { Routes, Route } from "react-router-dom";
import FolderLayout from "./pages/folder-layout";
import RootFolder from "./pages/root-folder";
import SubFolder from "./pages/sub-folder";
import Auth from "./pages/auth/auth";
import Layout from "./pages/layout";
import { AuthProvider } from "./context/auth-context";
import PublicFolder from "./pages/public-folder";
import LandingPage from "./pages/landing-page";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />

        <Route path="/auth" element={<Auth />} />

        <Route element={<Layout />}>
          <Route path="/folders" element={<FolderLayout />}>
            <Route index element={<RootFolder />} />
            <Route path=":folderId" element={<SubFolder />} />
          </Route>
        </Route>

        <Route element={<PublicFolder />}>
          <Route path="/share/:folderSlug/" element={<FolderLayout />}>
            <Route path=":folderId" element={<p>Hello</p>} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
