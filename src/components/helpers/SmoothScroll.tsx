import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  useEffect(() => {
    if (isAdmin) return;

    const lenis = new Lenis({
      lerp: 0.15,
      wheelMultiplier: 1.2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, [isAdmin]);

  return <>{children}</>;
}
