import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { Loading } from "./components/ui";
import Home from "./pages/Home";
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const About = lazy(() => import("./pages/About"));
const Team = lazy(() => import("./pages/Team"));
const Faq = lazy(() => import("./pages/Faq"));
const Contact = lazy(() => import("./pages/Contact"));
const Residences = lazy(() => import("./pages/Residences"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const ConsumptionEditor = lazy(() => import("./pages/ConsumptionEditor"));
const Goals = lazy(() => import("./pages/Goals"));
const Simulator = lazy(() => import("./pages/Simulator"));
const NotFound = lazy(() => import("./pages/NotFound"));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense
        fallback={
          <main className="mx-auto max-w-4xl p-8">
            <Loading />
          </main>
        }
      >
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="como-funciona" element={<HowItWorks />} />
            <Route path="sobre" element={<About />} />
            <Route path="integrantes" element={<Team />} />
            <Route path="faq" element={<Faq />} />
            <Route path="contato" element={<Contact />} />
            <Route path="residencias" element={<Residences />} />
            <Route path="residencias/:id" element={<Dashboard />} />
            <Route
              path="residencias/:id/consumos/novo"
              element={<ConsumptionEditor />}
            />
            <Route
              path="residencias/:id/consumos/:consumoId/editar"
              element={<ConsumptionEditor />}
            />
            <Route path="residencias/:id/metas" element={<Goals />} />
            <Route path="simulador" element={<Simulator />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
