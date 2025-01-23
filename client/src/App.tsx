import { Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/auth-context";
import Auth from "./pages/auth/auth";
import LandingPage from "./pages/landing-page";
import FolderLayout from "./pages/folder-layout";
import PrivateLayout from "./pages/private/private-layout";
import PrivateFolder from "./pages/private/private-folder";
import PrivateSubFolder from "./pages/private/private-sub-folder";
import PublicLayout from "./pages/public/public-layout";
import PublicFolder from "./pages/public/public-folder";
import PublicSubFolder from "./pages/public/public-sub-folder";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />

        <Route element={<PrivateLayout />}>
          <Route path="/folders" element={<FolderLayout />}>
            <Route index element={<PrivateFolder />} />
            <Route path=":folderId" element={<PrivateSubFolder />} />
          </Route>
        </Route>

        <Route element={<PublicLayout />}>
          <Route path="/share/:folderSlug/" element={<FolderLayout />}>
            <Route index element={<PublicFolder />} />
            <Route path=":folderId" element={<PublicSubFolder />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
