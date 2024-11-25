import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Folder from "./pages/Folder";
import AppSidebar from "./components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "./components/ui/sidebar";

function App() {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <SidebarTrigger />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/folders" element={<Folder />} />
          <Route path="/folders/:folderId" element={<p>Folder</p>}  />
          <Route path="/folders/:folderId/:fileId"  />
        </Routes>
      </SidebarProvider>
    </div>
  );
}

export default App;
