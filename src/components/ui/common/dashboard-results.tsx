import { Info, Loader2 } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../hover-card";
import { BetSchema } from "@/app/dashboard/components/bets-stats";

export const DashboardResults = ({
  bets,
  hideResults,
}: {
  bets: BetSchema[];
  hideResults: boolean;
}) => {
  // total de bets
  const betsTotal = bets.length;

  // bets ganhas + some das bets ganhas
  const wins = bets.filter((bet) => bet.result === "Ganha");
  const winsSum = Number(
    wins.reduce((sum, b) => sum + Number(b.profit), 0).toFixed(2),
  );

  // bets perdidas + some das bets perdidas
  const loses = bets.filter((bet) => bet.result === "Perdida");
  const losesSum = Number(
    loses.reduce((sum, b) => sum + Number(b.profit), 0).toFixed(2),
  );

  // lucro total
  const totalProfit = (winsSum + losesSum).toFixed(2);

  // total apostado
  const gambledTotal = Number(
    bets.reduce((sum, b) => sum + Number(b.betValue), 0).toFixed(2),
  ).toLocaleString("pt-BR");

  const filteredBetsByMonthYearButPendent = bets.filter(
    (bet) => bet.result !== "Pendente",
  );

  // porcentagem de vitória
  const percentVictory =
    bets.length > 0
      ? (wins.length / filteredBetsByMonthYearButPendent.length) * 100
      : undefined;

  // odd geral média
  const averageOddAll =
    filteredBetsByMonthYearButPendent.length > 0
      ? filteredBetsByMonthYearButPendent.reduce(
          (sum, b) => sum + Number(b.odd),
          0,
        ) / filteredBetsByMonthYearButPendent.length
      : 0;

  // odd de ganhos média
  const averageOddWins =
    wins.length > 0
      ? wins.reduce((sum, b) => sum + Number(b.odd), 0) / wins.length
      : 0;

  // odd de percas média
  const averageOddLoses =
    loses.length > 0
      ? loses.reduce((sum, b) => sum + Number(b.odd), 0) / loses.length
      : 0;

  // soma das unidades ganhas e perdidas
  const totalUnits = bets
    .reduce((sum, bet) => {
      const unitValue = Number(bet.unit);

      if (bet.result === "Ganha") {
        return sum + unitValue;
      }

      if (bet.result === "Perdida") {
        return sum - unitValue;
      }

      return sum;
    }, 0)
    .toFixed(2);

  return (
    <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="flex w-full flex-col items-start justify-center rounded-[.8rem] border border-white/10 bg-[var(--gray-darker)] p-4">
        <h2 className="font-regular mb-2 text-base tracking-tight lg:text-[1vw]">
          Total de apostas
        </h2>
        <h2 className="text-2xl font-bold tracking-tight lg:text-[1.5vw]">
          <div className={hideResults ? "blur-[.5rem] select-none" : ""}>
            {betsTotal == undefined ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>{Number(betsTotal)}</>
            )}
          </div>
        </h2>
      </div>
      <div className="flex w-full flex-col items-start justify-center rounded-[.8rem] border border-white/10 bg-[var(--gray-darker)] p-4">
        <h2 className="font-regular mb-2 text-base tracking-tight lg:text-[1vw]">
          Total apostado
        </h2>

        <h2 className="text-2xl font-bold tracking-tight lg:text-[1.5vw]">
          <div className={hideResults ? "blur-[.5rem] select-none" : ""}>
            {gambledTotal == undefined ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>R$ {Number(gambledTotal.replace(",", ".")).toFixed(2)}</>
            )}
          </div>
        </h2>
      </div>
      <div className="flex w-full flex-col items-start justify-center rounded-[.8rem] border border-white/10 bg-[var(--gray-darker)] p-4">
        <h2 className="font-regular mb-2 text-base tracking-tight lg:text-[1vw]">
          Lucro / prejuízo total (R$)
        </h2>
        <div className={hideResults ? "blur-[.5rem] select-none" : ""}>
          {totalProfit == undefined ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              {Number(totalProfit) > 0 && (
                <h2 className="text-2xl font-bold tracking-tight text-[#00ff00] lg:text-[1.5vw]">
                  R$ {Number(totalProfit).toFixed(2)}
                </h2>
              )}
              {Number(totalProfit) < 0 && (
                <h2 className="text-2xl font-bold tracking-tight text-[#ff0000] lg:text-[1.5vw]">
                  R$ {Number(totalProfit).toFixed(2)}
                </h2>
              )}
              {Number(totalProfit) == 0 && (
                <h2 className="text-2xl font-bold tracking-tight text-[var(--light-white)] lg:text-[1.5vw]">
                  R$ {Number(totalProfit).toFixed(2)}
                </h2>
              )}
            </>
          )}
        </div>
      </div>
      <div className="flex w-full flex-col items-start justify-center rounded-[.8rem] border border-white/10 bg-[var(--gray-darker)] p-4">
        <h2 className="font-regular mb-2 text-base tracking-tight lg:text-[1vw]">
          Lucro / prejuízo total (un.)
        </h2>
        <div className={hideResults ? "blur-[.5rem] select-none" : ""}>
          {totalUnits == undefined ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              {Number(totalUnits) > 0 && (
                <h2 className="text-2xl font-bold tracking-tight text-[#00ff00] lg:text-[1.5vw]">
                  +{Number(totalUnits).toLocaleString("pt-BR")}un
                </h2>
              )}
              {Number(totalUnits) < 0 && (
                <h2 className="text-2xl font-bold tracking-tight text-[#ff0000] lg:text-[1.5vw]">
                  {Number(totalUnits).toLocaleString("pt-BR")}un
                </h2>
              )}
              {Number(totalUnits) == 0 && (
                <h2 className="text-2xl font-bold tracking-tight text-[var(--light-white)] lg:text-[1.5vw]">
                  {Number(totalUnits).toLocaleString("pt-BR")}un
                </h2>
              )}
            </>
          )}
        </div>
      </div>
      <div className="flex w-full flex-col items-start justify-center rounded-[.8rem] border border-white/10 bg-[var(--gray-darker)] p-4">
        <h2 className="font-regular mb-2 text-base tracking-tight lg:text-[1vw]">
          % de vitórias
        </h2>
        <h2 className="text-2xl font-bold tracking-tight lg:text-[1.5vw]">
          <div className={hideResults ? "blur-[.5rem] select-none" : ""}>
            {percentVictory == undefined ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>{Number(percentVictory).toFixed(0)}%</>
            )}
          </div>
        </h2>
      </div>
      <div className="flex w-full flex-col items-start justify-center rounded-[.8rem] border border-white/10 bg-[var(--gray-darker)] p-4">
        <div className="flex w-full items-start justify-between">
          <h2 className="font-regular mb-2 text-base tracking-tight lg:text-[1vw]">
            Odd média (geral)
          </h2>
          <HoverCard>
            <HoverCardTrigger>
              <Info className="h-4 w-4" color="gray" />
            </HoverCardTrigger>
            <HoverCardContent className="w-80 bg-[var(--light-white)] text-[var(--gray)]">
              <div className="flex justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm">
                    Indica o seu perfil de risco. Odds mais altas podem
                    significar mais risco e maior retorno potencial.
                  </p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
        <h2 className="text-2xl font-bold tracking-tight lg:text-[1.5vw]">
          <div className={hideResults ? "blur-[.5rem] select-none" : ""}>
            {averageOddAll == undefined ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>{Number(averageOddAll).toFixed(2)}</>
            )}
          </div>
        </h2>
      </div>
      <div className="flex w-full flex-col items-start justify-center rounded-[.8rem] border border-white/10 bg-[var(--gray-darker)] p-4">
        <div className="flex w-full items-start justify-between">
          <h2 className="font-regular mb-2 text-base tracking-tight lg:text-[1vw]">
            Odd média (ganhos)
          </h2>
          <HoverCard>
            <HoverCardTrigger>
              <Info className="h-4 w-4" color="gray" />
            </HoverCardTrigger>
            <HoverCardContent className="w-80 bg-[var(--light-white)] text-[var(--gray)]">
              <div className="flex justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm">
                    Mostra a qualidade dos seus acertos. Odds de ganho muito
                    baixas podem não ser suficientes para cobrir as perdas.
                  </p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
        <h2 className="text-2xl font-bold tracking-tight lg:text-[1.5vw]">
          <div className={hideResults ? "blur-[.5rem] select-none" : ""}>
            {averageOddWins == undefined ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>{Number(averageOddWins).toFixed(2)}</>
            )}
          </div>
        </h2>
      </div>
      <div className="flex w-full flex-col items-start justify-center rounded-[.8rem] border border-white/10 bg-[var(--gray-darker)] p-4">
        <div className="flex w-full items-start justify-between">
          <h2 className="font-regular mb-2 text-base tracking-tight lg:text-[1vw]">
            Odd média (perdas)
          </h2>
          <HoverCard>
            <HoverCardTrigger>
              <Info className="h-4 w-4" color="gray" />
            </HoverCardTrigger>
            <HoverCardContent className="w-80 bg-[var(--light-white)] text-[var(--gray)]">
              <div className="flex justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-sm">
                    Use para comparar com a odd de ganhos. Perder com odds
                    baixas é um sinal de alerta, indicando que apostas seguras
                    estão falhando.
                  </p>
                </div>
              </div>
            </HoverCardContent>
          </HoverCard>
        </div>
        <h2 className="text-2xl font-bold tracking-tight lg:text-[1.5vw]">
          <div className={hideResults ? "blur-[.5rem] select-none" : ""}>
            {averageOddLoses == undefined ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>{Number(averageOddLoses).toFixed(2)}</>
            )}
          </div>
        </h2>
      </div>
    </div>
  );
};
