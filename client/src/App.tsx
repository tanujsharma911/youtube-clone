import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router";

import SidebarPanel from "./components/SidePanel";

function App() {
  return (
    <div>
      <SidebarProvider>
        <SidebarPanel />
        <main className="p-5">
          <Outlet />
        </main>
      </SidebarProvider>
    </div>
  );
}

export default App;
