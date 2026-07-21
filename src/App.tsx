import { lazy, Suspense } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Lookbook } from "./components/Lookbook";
import { Brands } from "./components/Brands";
import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { useLenis } from "./hooks/useLenis";

const AtmosphereCanvas = lazy(() =>
  import("./components/AtmosphereCanvas").then((m) => ({ default: m.AtmosphereCanvas })),
);

export default function App() {
  useLenis();

  return (
    <>
      <div className="grain" aria-hidden />
      <Suspense fallback={null}>
        <AtmosphereCanvas />
      </Suspense>
      <Navbar />
      <main className="scroll-root">
        <Hero />
        <Lookbook />
        <Brands />
        <About />
        <Contact />
      </main>
    </>
  );
}
