"use client";

import { Header } from "@/components/ui/common/header";
import { useEffect, useState } from "react";
import { BetSchema } from "../components/bets-stats";
import { authClient } from "@/lib/auth-client";
import { DailyProfitChart } from "../components/daily-profit-chart";
import { DashboardResults } from "@/components/ui/common/dashboard-results";
import { Eye, EyeClosed } from "lucide-react";

const ResultsByCategory = () => {
  const [isResultsHidden, setIsResultsHidden] = useState<boolean>(() => {
    const localSave = localStorage.getItem("hideResults") || false;
    return localSave === "true";
  });
  const [bets, setBets] = useState<BetSchema[]>([]);

  const fetchBets = async () => {
    const session = await authClient.getSession();
    const userId = session?.data?.user?.id;
    if (!userId) return;

    const res = await fetch(`/api/bets/user/${userId}`);
    const data = await res.json();
    setBets(data);
  };

  // agrupar bets por categoria
  const groupByCategory = (bets: BetSchema[]) => {
    if (!Array.isArray(bets)) return {};

    if (bets.length > 0) {
      return bets.reduce(
        (acc, bet) => {
          const { category } = bet;

          if (!acc[category]) {
            acc[category] = [];
          }

          acc[category].push(bet);
          return acc;
        },
        {} as Record<string, BetSchema[]>,
      );
    }
  };

  const groupedBets = groupByCategory(bets);

  useEffect(() => {
    const localSave = localStorage.getItem("hideResults");

    setIsResultsHidden(localSave === "true");
    fetchBets();
  }, []);
  return (
    <div className="flex min-h-screen flex-col bg-[var(--gray)] text-[var(--light-white)]">
      <Header backIcon={true} path="dashboard" />
      <div>
        <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 md:p-6 lg:max-w-[85vw]">
          <div className="mt-8 flex items-center justify-start gap-4">
            <h1 className="text-left text-3xl font-extrabold tracking-tight md:text-4xl lg:text-3xl">
              Seu dashboardd
            </h1>
            <div>
              {isResultsHidden ? (
                <div
                  className="cursor-pointer rounded-full bg-[var(--light-white)]/20 p-[.5rem]"
                  onClick={() => setIsResultsHidden(false)}
                >
                  <EyeClosed color="var(--gray)" />
                </div>
              ) : (
                <div
                  className="cursor-pointer rounded-full bg-[var(--light-white)]/80 p-[.5rem]"
                  onClick={() => setIsResultsHidden(true)}
                >
                  <Eye color="var(--gray)" />
                </div>
              )}
            </div>
          </div>
          {!groupedBets ? (
            <>carregando</>
          ) : (
            <>
              {Object.keys(groupedBets).map((category) => (
                <div key={category}>
                  <h1 className="mt-8 text-2xl font-bold tracking-tight md:text-3xl lg:text-[1.3vw]">
                    Evolução ({category})
                  </h1>
                  <DashboardResults
                    bets={groupedBets[category]}
                    hideResults={isResultsHidden}
                  />
                  <div className="mt-4 rounded-[.8rem] border border-white/10 p-2 lg:p-4">
                    {bets.length < 1 ? (
                      <div className="flex h-[30vh] items-center justify-center text-center">
                        <h1 className="mt-8 text-2xl font-bold tracking-tight md:text-3xl lg:text-[1.3vw]">
                          Ainda sem apostas registradas.
                          <span className="block">
                            Registre para visualizar seus resultados.
                          </span>
                        </h1>
                      </div>
                    ) : (
                      <DailyProfitChart
                        bets={groupedBets[category]}
                        hideResults={isResultsHidden}
                      />
                    )}
                  </div>
                </div>
              ))}
            </>
          )}
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

export default ResultsByCategory;
