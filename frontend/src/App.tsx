import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";

function App() {
  return (
    <div className="font-jetbrains-mono relative flex min-h-screen flex-col bg-blue-500 dark:bg-black">
      <Navbar />
      <div className="bg-blue-500 py-24 text-center text-xl font-semibold text-white dark:bg-black">
        Hello World
      </div>
      <Footer />
    </div>
  );
}

export default App;
