import { useEffect, useState } from "react";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  matchPath,
} from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calculator,
  ChartNoAxesColumnIncreasing,
  House,
  LayoutDashboard,
  Leaf,
  Menu,
  Plus,
  Target,
  X,
} from "lucide-react";

const navigation = [
  ["/", "Início"],
  ["/sobre", "Sobre"],
  ["/faq", "FAQ"],
  ["/integrantes", "Integrantes"],
  ["/contato", "Contato"],
];

function Brand() {
  return (
    <Link
      to="/"
      aria-label="EcoLar, início"
      className="inline-flex items-center gap-2 text-[27px] font-bold tracking-tight"
    >
      <span className="relative text-forest">
        <House size={35} strokeWidth={1.6} aria-hidden="true" />
        <Leaf
          size={17}
          className="absolute bottom-0 right-0 fill-[#a7c67d] text-forest"
          aria-hidden="true"
        />
      </span>
      EcoLar
    </Link>
  );
}

export function Layout() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const app =
    location.pathname === "/residencias" ||
    location.pathname.startsWith("/residencias/");
  const id = matchPath("/residencias/:id/*", location.pathname)?.params.id;
  const base = id ? `/residencias/${id}` : "/residencias";
  useEffect(() => {
    const names: Record<string, string> = {
      "/": "Consumo consciente",
      "/sobre": "Sobre",
      "/integrantes": "Integrantes",
      "/faq": "Perguntas frequentes",
      "/contato": "Contato",
      "/residencias": "Minhas residências",
      "/simulador": "Simulador",
      "/como-funciona": "Como funciona",
    };
    document.title = `EcoLar | ${names[location.pathname] || "Sua residência"}`;
    if (!location.hash) {
      window.scrollTo(0, 0);
      document.getElementById("main-content")?.focus({ preventScroll: true });
    } else {
      document
        .getElementById(location.hash.slice(1))
        ?.scrollIntoView({ block: "start" });
    }
  }, [location.pathname, location.hash]);
  const appLinks = id
    ? [
        { to: base, label: "Painel", Icon: LayoutDashboard },
        { to: `${base}/consumos/novo`, label: "Registrar consumo", Icon: Plus },
        { to: `${base}/metas`, label: "Metas", Icon: Target },
      ]
    : [
        { to: "/residencias", label: "Minhas residências", Icon: House },
        { to: "/simulador", label: "Simulador", Icon: Calculator },
        { to: "/como-funciona", label: "Como funciona", Icon: BookOpen },
      ];
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex min-h-12 items-center gap-3 rounded-xl px-4 py-3 text-sm ${isActive ? "bg-mint font-semibold text-forest" : "text-slate-600 hover:bg-mint/60"}`;
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only z-50 rounded-lg bg-leaf p-3 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Pular para o conteúdo
      </a>
      <div className="border-b border-forest/10 bg-mint px-4 py-2 text-center text-[11px] text-forest">
        Projeto acadêmico FIAP · Use somente dados fictícios nesta versão
      </div>
      <header
        className={`border-b border-forest/10 bg-paper ${app ? "lg:hidden" : ""}`}
      >
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-5 sm:px-8">
          <Brand />
          <nav
            aria-label="Navegação principal"
            className="hidden items-center gap-7 lg:flex"
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
            Acessar painel <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <button
            className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-forest hover:bg-mint lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Fechar menu" : "Abrir menu"}
          >
            {open ? <X size={25} /> : <Menu size={25} />}
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
                ["/como-funciona", "Como funciona"],
                ["/simulador", "Simulador"],
              ].map(([to, label]) => (
                <NavLink
                  key={to}
                  to={to}
                  end
                  onClick={() => setOpen(false)}
                  className={navClass}
                >
                  {label}
                </NavLink>
              ))}
            </nav>
          )}
        </div>
      </header>
      <div
        className={
          app
            ? "mx-auto grid w-full max-w-[1600px] flex-1 lg:grid-cols-[230px_minmax(0,1fr)]"
            : "contents"
        }
      >
        {app && (
          <aside className="hidden border-r border-forest/10 bg-white/60 px-5 py-8 lg:block">
            <div className="sticky top-8">
              <Brand />
              <p className="mb-3 mt-10 px-4 text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                Seu espaço
              </p>
              <nav aria-label="Navegação do painel" className="space-y-2">
                {appLinks.map(({ to, label, Icon }) => (
                  <NavLink key={to} to={to} end className={navClass}>
                    <Icon size={20} strokeWidth={1.7} aria-hidden="true" />
                    {label}
                  </NavLink>
                ))}
                {id && (
                  <>
                    <Link
                      className={navClass({ isActive: false })}
                      to={`${base}#historico`}
                    >
                      <ChartNoAxesColumnIncreasing
                        size={20}
                        aria-hidden="true"
                      />
                      Histórico
                    </Link>
                    <Link
                      className={navClass({ isActive: false })}
                      to="/residencias"
                    >
                      <House size={20} aria-hidden="true" />
                      Trocar residência
                    </Link>
                  </>
                )}
              </nav>
              <div className="mt-10 space-y-2 border-t border-forest/10 pt-6">
                <Link
                  to="/como-funciona"
                  className="flex min-h-11 items-center gap-3 px-4 text-sm text-slate-600"
                >
                  <BookOpen size={18} aria-hidden="true" />
                  Preciso de ajuda
                </Link>
                <Link
                  to="/"
                  className="flex min-h-11 items-center gap-3 px-4 text-sm text-slate-600"
                >
                  <ArrowLeft size={18} aria-hidden="true" />
                  Voltar ao site
                </Link>
              </div>
            </div>
          </aside>
        )}
        <main
          id="main-content"
          tabIndex={-1}
          className={`mx-auto w-full min-w-0 flex-1 px-5 py-8 outline-none sm:px-8 sm:py-10 ${app ? "max-w-7xl pb-28 lg:px-10 lg:pb-10" : "max-w-7xl"}`}
        >
          <Outlet />
        </main>
      </div>
      {app && id && (
        <nav
          aria-label="Atalhos do painel no celular"
          className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-3 border-t border-forest/15 bg-paper/95 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur lg:hidden"
        >
          {appLinks.map(({ to, label, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-[11px] ${isActive ? "bg-mint font-bold text-forest" : "text-slate-600"}`
              }
            >
              <Icon size={21} aria-hidden="true" />
              {label === "Registrar consumo" ? "Registrar" : label}
            </NavLink>
          ))}
        </nav>
      )}
      <footer
        className={`border-t border-forest/10 ${app && id ? "pb-20 lg:pb-0" : ""}`}
      >
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-5 px-5 py-7 text-sm sm:px-8 md:flex-row md:items-center">
          <Brand />
          <div className="flex flex-wrap gap-x-5 gap-y-1">
            <Link className="text-link" to="/como-funciona">
              Como funciona
            </Link>
            <Link className="text-link" to="/simulador">
              Simulador
            </Link>
            <Link className="text-link" to="/contato">
              Contato
            </Link>
          </div>
          <p className="flex items-center gap-2 text-xs text-slate-500">
            <Leaf size={17} className="text-forest" aria-hidden="true" />
            Energia consciente para o seu lar.
          </p>
        </div>
        <p className="px-5 pb-6 text-center text-[11px] text-slate-500">
          Global Solution 2026/2 · CitizenTech · Estimativas não substituem sua
          fatura.
        </p>
      </footer>
    </div>
  );
}
