import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Collection from "@/components/Collection";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <About />
      <Collection />
      <Footer />
    </main>
  );
}
