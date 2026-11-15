import { useEffect, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { ArrowUpRight, House, Menu, X } from "lucide-react";

const navigation = [
  ["/", "Início"],
  ["/sobre", "Sobre"],
  ["/integrantes", "Equipe"],
  ["/faq", "FAQ"],
  ["/contato", "Contato"],
];
export function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
    const names: Record<string, string> = {
      "/": "Consumo consciente",
      "/sobre": "Sobre",
      "/integrantes": "Integrantes",
      "/faq": "Perguntas frequentes",
      "/contato": "Contato",
      "/residencias": "Residências",
      "/simulador": "Simulador",
    };
    document.title = `EcoLar | ${names[location.pathname] || "Sua residência"}`;
    document.getElementById("main-content")?.focus({ preventScroll: true });
  }, [location.pathname]);
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-lg bg-leaf p-3 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Pular para o conteúdo
      </a>
      <div className="bg-forest px-4 py-2 text-center text-xs tracking-wide text-white/90">
        Projeto acadêmico FIAP · Use somente dados fictícios nesta versão
      </div>
      <header className="border-b border-forest/10 bg-paper">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 text-2xl font-bold tracking-tight"
          >
            <span className="rounded-xl bg-forest p-2 text-leaf">
              <House size={23} aria-hidden="true" />
            </span>
            EcoLar<span className="text-forest/50">.</span>
          </Link>
          <nav
            aria-label="Navegação principal"
            className="hidden items-center gap-6 lg:flex"
          >
            {navigation.map(([to, label]) => (
              <NavLink
                key={to}
                to={to}
                end
                className={({ isActive }) =>
                  `py-2 text-sm ${isActive ? "font-semibold text-forest underline underline-offset-8" : "text-slate-600 hover:text-forest"}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <Link className="btn hidden lg:inline-flex" to="/residencias">
            Minhas residências
            <ArrowUpRight size={17} aria-hidden="true" />
          </Link>
          <button
            className="btn-secondary lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
          {open && (
            <nav
              id="mobile-nav"
              aria-label="Navegação no celular"
              onKeyDown={(event) => {
                if (event.key === "Escape") setOpen(false);
              }}
              className="flex w-full flex-col gap-1 border-t border-forest/10 pt-3 lg:hidden"
            >
              {[
                ...navigation,
                ["/residencias", "Minhas residências"],
                ["/simulador", "Simulador"],
              ].map(([to, label]) => (
                <NavLink
                  key={to}
                  to={to}
                  end
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm hover:bg-leaf/40"
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          )}
        </div>
      </header>
      <main
        id="main-content"
        tabIndex={-1}
        className="mx-auto w-full max-w-7xl flex-1 px-5 py-9 outline-none sm:px-8 sm:py-12"
      >
        <Outlet />
      </main>
      <footer className="mt-10 border-t border-forest/10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-5 py-8 text-sm sm:px-8 md:flex-row">
          <div>
            <Link to="/" className="text-xl font-bold">
              EcoLar.
            </Link>
            <p className="mt-2 text-slate-600">
              Informação para consumir com consciência.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            <Link className="text-link" to="/simulador">
              Simulador
            </Link>
            <Link className="text-link" to="/integrantes">
              Integrantes
            </Link>
            <Link className="text-link" to="/contato">
              Fale com a equipe
            </Link>
          </div>
        </div>
        <div className="px-5 pb-6 text-center text-xs text-slate-500">
          Global Solution 2026/2 · CitizenTech · Estimativas não substituem sua
          fatura.
        </div>
      </footer>
    </div>
  );
}
