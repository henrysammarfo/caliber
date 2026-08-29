import { useEffect } from "react";

export function Grain() {
  return <div className="grain" aria-hidden="true" />;
}

/** Adds .is-in once entrance animations finish, with a rAF fallback. */
export function useAppear() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".appear"));
    els.forEach((el) =>
      el.addEventListener("animationend", () => el.classList.add("is-in"), { once: true }),
    );
    let raf2 = 0;
    const raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        els.forEach((el) => {
          const running = el
            .getAnimations?.()
            .some((a) => a.playState === "running" || a.playState === "finished");
          if (!running) el.classList.add("is-in");
        });
      });
    });
    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, []);
}
