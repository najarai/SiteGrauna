import { lazy, Suspense, useCallback, useState } from "react";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Lookbook } from "./components/Lookbook";
import { Brands } from "./components/Brands";
import { About } from "./components/About";
import { Contact } from "./components/Contact";
import { Intro } from "./components/Intro";
import { useLenis } from "./hooks/useLenis";

const AtmosphereCanvas = lazy(() =>
  import("./components/AtmosphereCanvas").then((m) => ({ default: m.AtmosphereCanvas })),
);

export default function App() {
  const [entered, setEntered] = useState(false);
  const onIntroComplete = useCallback(() => setEntered(true), []);
  useLenis();

  return (
    <>
      <div className="grain" aria-hidden />
      <Intro onComplete={onIntroComplete} />
      {/* WebGL only after intro — avoids competing with intro frames */}
      {entered && (
        <Suspense fallback={null}>
          <AtmosphereCanvas />
        </Suspense>
      )}
      <Navbar ready={entered} />
      <main className="scroll-root">
        <Hero ready={entered} />
        <Lookbook />
        <Brands />
        <About />
        <Contact />
      </main>
    </>
  );
}
