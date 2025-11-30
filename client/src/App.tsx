import { Outlet } from "react-router";

import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="px-5 md:px-20 mt-20">
        <Outlet />
      </div>
    </div>
  );
}

export default App;
