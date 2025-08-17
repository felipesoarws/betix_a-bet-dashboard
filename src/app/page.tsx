"use client";

import { Header } from "@/components/ui/common/header";
import FlowingBackground from "@/components/ui/common/flowing-background";
import { BarChart, Wallet, ShieldCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

const Home = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEnter = async () => {
    setLoading(true);

    router.push("/dashboard");
  };
  return (
    <div className="relative isolate min-h-screen bg-black text-[var(--main-text)]">
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
                className="cursor-pointer rounded-full bg-[var(--main-text)] px-6 py-2.5 font-bold text-[var(--background)] transition-all duration-[.3s] ease-in-out hover:scale-105 hover:bg-[var(--main-text)] hover:text-[var(--background)]"
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
            <div className="rounded-2xl border border-white/10 bg-black/20 p-8 backdrop-blur-md">
              <div className="mb-6 flex items-center justify-between">
                <p className="font-bold">Desempenho: Premier League</p>
                <p className="text-sm text-white/60">Últimos 30 dias</p>
              </div>
              <div className="flex h-48 w-full items-end justify-around gap-2 rounded-lg bg-white/5 px-4">
                <div
                  className="w-full rounded-t-md bg-[rgb(var(--accent-purple))]"
                  style={{ height: "40%" }}
                ></div>
                <div
                  className="w-full rounded-t-md bg-[rgb(var(--accent-purple))]"
                  style={{ height: "65%" }}
                ></div>
                <div
                  className="w-full rounded-t-md bg-red-500/80"
                  style={{ height: "25%" }}
                ></div>
                <div
                  className="w-full rounded-t-md bg-[rgb(var(--accent-purple))]"
                  style={{ height: "80%" }}
                ></div>
                <div
                  className="w-full rounded-t-md bg-red-500/80"
                  style={{ height: "35%" }}
                ></div>
                <div
                  className="w-full rounded-t-md bg-[rgb(var(--accent-purple))]"
                  style={{ height: "55%" }}
                ></div>
              </div>
            </div>
          </section>
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
