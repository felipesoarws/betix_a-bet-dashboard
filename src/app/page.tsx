"use client";

import { Header } from "@/components/ui/common/header";
import FlowingBackground from "@/components/ui/common/flowing-background";
import { BarChart, Wallet, ShieldCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { DailyProfitChart } from "./dashboard/components/daily-profit-chart";
import { SEED_BETS } from "@/lib/constants";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEnter = async () => {
    setLoading(true);

    router.push("/dashboard");
  };

  return (
    <div className="relative isolate min-h-screen bg-black text-[var(--light-white)]">
      <Header />
      <div className="absolute top-0 h-[70vh] w-full lg:h-[100vh]">
        <FlowingBackground />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center">
        <main className="container flex flex-col px-2 lg:px-[8vw]">
          <section className="flex flex-grow flex-col items-center justify-center py-20 text-center">
            <div className="mb-6">
              <span className="inline-block rounded-full border border-white/10 bg-black/20 px-4 py-1 text-sm backdrop-blur-sm">
                Comece agora!
              </span>
            </div>

            <h1 className="text-4xl leading-10 font-extrabold tracking-tight md:text-6xl lg:leading-[3.5vw]">
              Descubra exatamente onde <br /> você ganha e perde dinheiro.
            </h1>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button
                onClick={handleEnter}
                disabled={loading}
                className="cursor-pointer rounded-full bg-[var(--light-white)] px-6 py-2.5 font-bold text-[var(--gray)] transition-all duration-[.3s] ease-in-out hover:scale-105 hover:bg-[var(--light-white)] hover:text-[var(--gray)]"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Entrando...
                  </div>
                ) : (
                  "Entrar"
                )}
              </Button>
              <Button
                asChild
                className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-6 py-2.5 font-bold text-white/80 transition-all duration-[.3s] ease-in-out hover:scale-105 hover:bg-white/10"
              >
                <Link href="#features">Ver Funcionalidades</Link>
              </Button>
            </div>
          </section>

          <section id="features" className="py-24">
            <div className="grid gap-12 text-center md:grid-cols-3">
              <div>
                <BarChart
                  className="mx-auto mb-4 h-10 w-10 text-[rgb(var(--accent-purple))]"
                  strokeWidth={1.5}
                />
                <h3 className="mb-2 text-xl font-bold">
                  Entenda seus Resultados
                </h3>
                <p className="text-white/60">
                  Gráficos de lucro, ROI e desempenho para você saber o que
                  realmente funciona.
                </p>
              </div>
              <div>
                <Wallet
                  className="mx-auto mb-4 h-10 w-10 text-[rgb(var(--accent-purple))]"
                  strokeWidth={1.5}
                />
                <h3 className="mb-2 text-xl font-bold">
                  Gestão de Banca Simples
                </h3>
                <p className="text-white/60">
                  Registre suas entradas e acompanhe a evolução do seu saldo sem
                  planilhas complicadas.
                </p>
              </div>
              <div>
                <ShieldCheck
                  className="mx-auto mb-4 h-10 w-10 text-[rgb(var(--accent-purple))]"
                  strokeWidth={1.5}
                />
                <h3 className="mb-2 text-xl font-bold">
                  Seus Dados, Suas Regras
                </h3>
                <p className="text-white/60">
                  Ninguém tem acesso às suas estratégias. Seus registros são
                  100% privados e seguros.
                </p>
              </div>
            </div>
          </section>

          <section className="py-24">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold md:text-4xl">
                Visualize a Clareza
              </h2>
              <p className="mx-auto mt-2 max-w-2xl text-white/60">
                Sua jornada para o lucro começa com uma visão organizada dos
                seus dados.
              </p>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex w-full flex-col items-start justify-center rounded-[.8rem] border border-white/10 bg-[var(--gray-darker)] p-4">
                <h2 className="font-regular mb-2 text-base tracking-tight lg:text-[1.1vw]">
                  Total de apostas
                </h2>
                <h2 className="text-2xl font-bold tracking-tight lg:text-[1.5vw]">
                  {SEED_BETS.length}
                </h2>
              </div>
            </div>
            <div className="mt-4 rounded-[.8rem] border border-white/10 p-2 lg:p-4">
              <DailyProfitChart bets={SEED_BETS} />
            </div>
          </section>

          <section></section>
        </main>

        <footer className="w-full border-t border-white/10 bg-black/20 py-8 text-center backdrop-blur-sm">
          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} Betix.
            <span className="block">Aposte com responsabilidade.</span>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
