import { Suspense } from "react";
import DonutsGame from "./components/Game/DonutsGame";
import "@fontsource/inter";
import "./index.css";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-2xl font-bold text-amber-800">Loading Donuts Game...</div>
        </div>
      }>
        <DonutsGame />
      </Suspense>
    </div>
  );
}

export default App;
