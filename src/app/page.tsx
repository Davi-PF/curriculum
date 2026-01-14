import Header from "../components/Header";
import Hero from "../components/Hero";
import About from "../components/About";
import Experience from "../components/Experience/Experience";
import Skills from "../components/Skills/Skills";
import Contact from "../components/Contact/Contact";
import Footer from "../components/Footer";
import Formation from "../components/Formation";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-500 via-stone-900 to-emerald-600 animate-gradient">
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div
          className="bg-stone-200/20 backdrop-blur-md p-4 sm:p-6 rounded-lg shadow-sm relative"
        >
          <Hero />
          <About />
          <Experience />
          <Skills />
          <Formation />
          <Contact />
        </div>
      </main>

      <Footer />
    </div>
  );
}
