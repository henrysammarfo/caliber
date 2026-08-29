import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { supabase } from "@/integrations/supabase/client";
import { track } from "@/lib/analytics";

const NAV = [
  { label: "Protocol", to: "/protocol" },
  { label: "Miner", to: "/miner" },
  { label: "Grader", to: "/grader" },
  { label: "Roadmap", to: "/roadmap" },
  { label: "Pricing", to: "/pricing" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(!!data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, session) => setSignedIn(!!session));
    return () => data.subscription.unsubscribe();
  }, []);

  const toggleMenu = (next: boolean) => {
    setOpen(next);
    void track(next ? "menu_open" : "menu_close", { label: "site_header" });
  };

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const mq = window.matchMedia("(min-width: 901px)");
    const onChange = () => mq.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    mq.addEventListener("change", onChange);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      mq.removeEventListener("change", onChange);
    };
  }, [open]);

  return (
    <>
      <div
        onClick={() => toggleMenu(false)}
        aria-hidden="true"
        className={`fixed inset-0 z-40 bg-[rgba(8,8,8,0.42)] transition-opacity duration-300 lg:hidden ${
          open ? "visible opacity-100 backdrop-blur-2xl" : "invisible opacity-0"
        }`}
      />
      <header className="relative z-50 grid grid-cols-[1fr_auto_auto] items-center gap-2 px-5 pt-[22px] pb-[10px] lg:grid-cols-[1fr_auto_1fr] lg:px-10">
        <Logo className="appear appear--scale z-[80] justify-self-start [--d:0.08s]" />

        <nav
          id="site-nav"
          aria-label="Primary"
          className={`justify-self-center ${
            open
              ? "fixed inset-0 z-45 flex flex-col items-center justify-center gap-3 px-[22px] pt-24 pb-8"
              : "hidden lg:flex"
          } items-center gap-2 lg:static lg:z-auto lg:flex lg:flex-row lg:p-0`}
        >
          {NAV.map((item, i) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => {
                void track("cta_click", { label: `nav:${item.label}` });
                setOpen(false);
              }}
              className={`pill appear ${i % 2 === 0 ? "appear--scale" : "appear--soft"} ${
                open ? "h-14 w-full text-[19px]" : ""
              }`}
              style={{ ["--d" as string]: `${0.16 + i * 0.12}s` }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          to={signedIn ? "/dashboard" : "/auth"}
          onClick={() => void track("cta_click", { label: signedIn ? "open_console" : "sign_in" })}
          className="btn-base btn-solid appear appear--scale z-[80] hidden justify-self-end [--d:0.34s] lg:inline-flex"
        >
          {signedIn ? "Open Console" : "Sign in"}
        </Link>

        <button
          type="button"
          aria-controls="site-nav"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => toggleMenu(!open)}
          className="appear appear--scale z-[80] grid h-[42px] w-[42px] justify-self-end rounded-md border border-hair bg-[rgba(8,8,8,0.55)] transition-colors hover:border-white/30 hover:bg-white/5 [--d:0.34s] lg:hidden"
        >
          <span className="grid justify-items-center gap-[5px] self-center">
            <span
              className={`block h-[1.5px] w-4 rounded-[1px] bg-white transition-transform duration-200 ${open ? "translate-y-[6.5px] rotate-45" : ""}`}
            />
            <span
              className={`block h-[1.5px] w-4 rounded-[1px] bg-white transition-opacity duration-200 ${open ? "opacity-0" : ""}`}
            />
            <span
              className={`block h-[1.5px] w-4 rounded-[1px] bg-white transition-transform duration-200 ${open ? "-translate-y-[6.5px] -rotate-45" : ""}`}
            />
          </span>
        </button>
      </header>
    </>
  );
}
