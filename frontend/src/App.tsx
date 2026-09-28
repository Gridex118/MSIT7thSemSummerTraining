import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import Hero from "./components/Hero";

function App() {
  return (
    <div className="font-jetbrains-mono relative flex min-h-screen flex-col bg-blue-500 dark:bg-black">
      <Navbar />
      <Hero />
      <Footer />
    </div>
  );
}

export default App;
