import Header from "../components/Header";
import Hero from "../components/Hero";
import About from "../components/About";
import Experience from "../components/Experience";
import Skills from "../components/Skills/Skills";
import Contact from "../components/Contact";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <Hero />
        <About />
        <Experience />
        <Skills />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}
