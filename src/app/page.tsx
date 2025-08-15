import { Header } from "@/components/ui/common/header";
import FlowingBackground from "@/components/ui/common/flowing-background";
import { BarChart, Wallet, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Home = () => {
  return (
    <div className="relative isolate min-h-screen bg-black text-[var(--main-text)]">
      <Header />
      <div className="absolute top-0 w-full h-[70vh] lg:h-[100vh]">
        <FlowingBackground />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen">
        <main className="container flex flex-col px-2 lg:px-[8vw]">
          <section className="flex flex-col items-center justify-center text-center flex-grow py-20">
            <div className="mb-6">
              <span className="inline-block px-4 py-1 text-sm rounded-full border border-white/10 bg-black/20 backdrop-blur-sm">
                Comece agora!
              </span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-10 lg:leading-[3.5vw]">
              Descubra exatamente onde <br /> você ganha e perde dinheiro.
            </h1>

            <div className="mt-10 flex flex-wrap justify-center items-center gap-4">
              <Button
                asChild
                className="cursor-pointer rounded-full px-6 py-2.5 font-bold bg-[var(--main-text)] text-[var(--background)] duration-[.3s] ease-in-out transition-all hover:scale-105 hover:bg-[var(--main-text)] hover:text-[var(--background)]"
              >
                <Link href={"/dashboard"}>Entrar</Link>
              </Button>
              <Button
                asChild
                className="cursor-pointer px-6 py-2.5 font-bold bg-white/5 border border-white/10 text-white/80  rounded-full  duration-[.3s] ease-in-out transition-all hover:scale-105 hover:bg-white/10"
              >
                <Link href="#features">Ver Funcionalidades</Link>
              </Button>
            </div>
          </section>

          <section id="features" className="py-24">
            <div className="grid md:grid-cols-3 gap-12 text-center">
              <div>
                <BarChart
                  className="h-10 w-10 text-[rgb(var(--accent-purple))] mx-auto mb-4"
                  strokeWidth={1.5}
                />
                <h3 className="font-bold text-xl mb-2">
                  Entenda seus Resultados
                </h3>
                <p className="text-white/60">
                  Gráficos de lucro, ROI e desempenho para você saber o que
                  realmente funciona.
                </p>
              </div>
              <div>
                <Wallet
                  className="h-10 w-10 text-[rgb(var(--accent-purple))] mx-auto mb-4"
                  strokeWidth={1.5}
                />
                <h3 className="font-bold text-xl mb-2">
                  Gestão de Banca Simples
                </h3>
                <p className="text-white/60">
                  Registre suas entradas e acompanhe a evolução do seu saldo sem
                  planilhas complicadas.
                </p>
              </div>
              <div>
                <ShieldCheck
                  className="h-10 w-10 text-[rgb(var(--accent-purple))] mx-auto mb-4"
                  strokeWidth={1.5}
                />
                <h3 className="font-bold text-xl mb-2">
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
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold">
                Visualize a Clareza
              </h2>
              <p className="text-white/60 mt-2 max-w-2xl mx-auto">
                Sua jornada para o lucro começa com uma visão organizada dos
                seus dados.
              </p>
            </div>
            <div className="p-8 rounded-2xl border border-white/10 bg-black/20 backdrop-blur-md">
              <div className="flex justify-between items-center mb-6">
                <p className="font-bold">Desempenho: Premier League</p>
                <p className="text-sm text-white/60">Últimos 30 dias</p>
              </div>
              <div className="w-full h-48 bg-white/5 rounded-lg flex items-end justify-around px-4 gap-2">
                {/* Barras do gráfico simuladas */}
                <div
                  className="w-full bg-[rgb(var(--accent-purple))] rounded-t-md"
                  style={{ height: "40%" }}
                ></div>
                <div
                  className="w-full bg-[rgb(var(--accent-purple))] rounded-t-md"
                  style={{ height: "65%" }}
                ></div>
                <div
                  className="w-full bg-red-500/80 rounded-t-md"
                  style={{ height: "25%" }}
                ></div>
                <div
                  className="w-full bg-[rgb(var(--accent-purple))] rounded-t-md"
                  style={{ height: "80%" }}
                ></div>
                <div
                  className="w-full bg-red-500/80 rounded-t-md"
                  style={{ height: "35%" }}
                ></div>
                <div
                  className="w-full bg-[rgb(var(--accent-purple))] rounded-t-md"
                  style={{ height: "55%" }}
                ></div>
              </div>
            </div>
          </section>
        </main>

        <footer className="text-center py-8 border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <p className="text-white/60 text-sm">
            © {new Date().getFullYear()} Betlytics. Aposte com responsabilidade.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Home;
