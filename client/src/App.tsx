import { Routes, Route } from "react-router-dom";
import Auth from "./pages/auth/auth";
import LandingPage from "./pages/landing-page";
import PrivateLayout from "./pages/private/private-layout";
import PrivateFolder from "./pages/private/private-folder";
import PrivateSubFolder from "./pages/private/private-sub-folder";
import PublicLayout from "./pages/public/public-layout";
import PublicFolder from "./pages/public/public-folder";
import PublicSubFolder from "./pages/public/public-sub-folder";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<Auth />} />

      <Route path="/folders" element={<PrivateLayout />}>
        <Route index element={<PrivateFolder />} />
        <Route path=":folderId" element={<PrivateSubFolder />} />
      </Route>

      <Route path="/share/:folderSlug/" element={<PublicLayout />}>
        <Route index element={<PublicFolder />} />
        <Route path=":folderId" element={<PublicSubFolder />} />
      </Route>
    </Routes>
  );
}

export default App;
