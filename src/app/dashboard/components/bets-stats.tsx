"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit, Loader2, X } from "lucide-react";

import { BET_CATEGORIES, BET_RESULTS, MONTH_NAMES } from "@/lib/constants";
import { DailyProfitChart } from "./daily-profit-chart";
import { EditBet } from "./edit-bet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";

type BetResult = "Pendente" | "Ganha" | "Perdida" | "Anulada";
type CategoryResult = "Futebol" | "Basquete" | "eSports" | "Outro";

export type BetSchema = {
  userId: string;
  event: string;
  market: string;
  category: CategoryResult;
  profit: number;
  betValue: number;
  odd: number;
  result: BetResult;
  createdAt: string;
  id: string;
};

export function BetsStats({
  fetchBets,
  bets,
}: {
  bets: BetSchema[];
  fetchBets: () => void;
}) {
  const { data: session } = authClient.useSession();

  const [editingBet, setEditingBet] = useState<BetSchema | null>(null);

  // filtros por clique no grafico
  const [monthFilter, setMonthFilter] = useState<string>("all");
  const [yearFilter, setYearFilter] = useState<string>("all");

  // criação de listas de anos e meses registrados nas bets
  const yearsAvailable = Array.from(
    new Set(bets.map((bet) => new Date(bet.createdAt).getFullYear()))
  ).sort((a, b) => b - a);

  const monthsAvailable = Array.from(
    new Set(
      bets
        .filter((bet) =>
          yearFilter === "all"
            ? true
            : new Date(bet.createdAt).getFullYear() === Number(yearFilter)
        )
        .map((bet) => new Date(bet.createdAt).getMonth())
    )
  ).sort((a, b) => a - b);

  const filteredBetsByMonthYear = bets.filter((bet) => {
    const date = new Date(bet.createdAt);
    const matchYear =
      yearFilter === "all" || date.getFullYear() === Number(yearFilter);
    const matchMonth =
      monthFilter === "all" || date.getMonth() === Number(monthFilter);
    return matchYear && matchMonth;
  });

  // filtros por clique na tabela
  const [resultFilter, setResultFilter] = useState<BetResult | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryResult | "all">(
    "all"
  );

  const filteredBets = bets.filter((bet) => {
    const matchResult = resultFilter === "all" || bet.result === resultFilter;
    const matchCategory =
      categoryFilter === "all" || bet.category === categoryFilter;
    return matchResult && matchCategory;
  });

  // total de bets
  const betsTotal = filteredBetsByMonthYear.length;

  // bets ganhas + some das bets ganhas
  const wins = filteredBetsByMonthYear.filter((bet) => bet.result === "Ganha");
  const winsSum = Number(
    wins.reduce((sum, b) => sum + Number(b.profit), 0).toFixed(2)
  );

  // bets perdidas + some das bets perdidas
  const loses = filteredBetsByMonthYear.filter(
    (bet) => bet.result === "Perdida"
  );
  const losesSum = Number(
    loses.reduce((sum, b) => sum + Number(b.profit), 0).toFixed(2)
  );

  // lucro total
  const totalProfit = (winsSum + losesSum).toFixed(2);

  // total apostado
  const gambledTotal = Number(
    filteredBetsByMonthYear
      .reduce((sum, b) => sum + Number(b.betValue), 0)
      .toFixed(2)
  ).toLocaleString("pt-BR");

  // porcentagem de vitória
  const percentVictory = (
    filteredBetsByMonthYear.length > 0
      ? (wins.length / filteredBetsByMonthYear.length) * 100
      : 0
  ).toFixed(0);

  return (
    <div>
      {!session ? (
        <>
          <div className="h-[30vh] flex items-center justify-center text-center">
            <h1 className="mt-8 text-2xl md:text-3xl font-bold tracking-tight lg:text-[1.5vw]">
              Registre para cadastrar e visualizar seus resultados.
            </h1>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col">
            <div className="flex flex-wrap gap-2 mt-4 items-center justify-start">
              <div className="flex gap-4 lg:gap-[1vw]">
                {(monthFilter !== "all" || yearFilter !== "all") && (
                  <Button
                    className="cursor-pointer px-3 py-5 rounded-[.8rem] border border-white/10 hover:bg-[var(--background)]"
                    onClick={() => {
                      setMonthFilter("all");
                      setYearFilter("all");
                    }}
                  >
                    <X />
                  </Button>
                )}
                <Select
                  onValueChange={(value: string) =>
                    setYearFilter(value as string | "all")
                  }
                >
                  <SelectTrigger className="cursor-pointer text-[.9rem] px-3 py-5 rounded-[.8rem] border border-white/10 placeholder:text-white/30">
                    <SelectValue placeholder="Ano" />
                  </SelectTrigger>
                  <SelectContent className="rounded-[.8rem] bg-[var(--main-text)] text-[var(--background)]">
                    <SelectGroup>
                      <SelectLabel className="text-[black]/80">Ano</SelectLabel>

                      <SelectItem value="all">Todos</SelectItem>
                      {yearsAvailable.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Select
                  onValueChange={(value: string) =>
                    setMonthFilter(value as string | "all")
                  }
                >
                  <SelectTrigger className="cursor-pointer text-[.9rem] px-3 py-5 rounded-[.8rem] border border-white/10 placeholder:text-white/30">
                    <SelectValue placeholder="Mês" />
                  </SelectTrigger>
                  <SelectContent className="rounded-[.8rem] bg-[var(--main-text)] text-[var(--background)]">
                    <SelectGroup>
                      <SelectLabel className="text-[black]/80">Mês</SelectLabel>

                      <SelectItem value="all">Todos</SelectItem>
                      {monthsAvailable.map((month) => (
                        <SelectItem key={month} value={month.toString()}>
                          {MONTH_NAMES[month]}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <div className="w-full flex flex-col items-start justify-center p-4 bg-[var(--background-darker)] border border-white/10 rounded-[.8rem]">
                <h2 className="mb-2 text-base font-regular tracking-tight lg:text-[1.1vw]">
                  Total de apostas
                </h2>
                <h2 className="text-2xl font-bold tracking-tight lg:text-[1.5vw]">
                  {betsTotal == 0 ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>{betsTotal}</>
                  )}
                </h2>
              </div>
              <div className="w-full flex flex-col items-start justify-center p-4 bg-[var(--background-darker)] border border-white/10 rounded-[.8rem]">
                <h2 className="mb-2 text-base font-regular tracking-tight lg:text-[1.1vw]">
                  Total apostado
                </h2>
                <h2 className="text-2xl font-bold tracking-tight lg:text-[1.5vw]">
                  {gambledTotal == "0" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>R$ {gambledTotal}</>
                  )}
                </h2>
              </div>
              <div className="w-full flex flex-col items-start justify-center p-4 bg-[var(--background-darker)] border border-white/10 rounded-[.8rem]">
                <h2 className="mb-2 text-base font-regular tracking-tight lg:text-[1.1vw]">
                  Lucro / prejuízo total
                </h2>
                {totalProfit == "0.00" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {Number(totalProfit) > 0 ? (
                      <h2 className="text-[#00ff00] text-2xl font-bold tracking-tight lg:text-[1.5vw]">
                        R$ {Number(totalProfit).toLocaleString("pt-BR")}
                      </h2>
                    ) : (
                      <h2 className="text-[#ff0000] text-2xl font-bold tracking-tight lg:text-[1.5vw]">
                        R$ {Number(totalProfit).toLocaleString("pt-BR")}
                      </h2>
                    )}
                  </>
                )}
              </div>
              <div className="w-full flex flex-col items-start justify-center p-4 bg-[var(--background-darker)] border border-white/10 rounded-[.8rem]">
                <h2 className="mb-2 text-base font-regular tracking-tight lg:text-[1.1vw]">
                  % de vitórias
                </h2>
                <h2 className="text-2xl font-bold tracking-tight lg:text-[1.5vw]">
                  {percentVictory == "0" ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>{percentVictory}%</>
                  )}
                </h2>
              </div>
            </div>
          </div>

          <div className="hidden lg:block">
            <h1 className="mt-8 text-2xl md:text-3xl font-bold tracking-tight lg:text-[1.3vw]">
              Evolução
            </h1>

            <div className="border border-white/10 rounded-[.8rem] p-2 mt-4 lg:p-4">
              {bets.length < 1 ? (
                <div className="h-[30vh] flex items-center justify-center text-center">
                  <h1 className="mt-8 text-2xl md:text-3xl font-bold tracking-tight lg:text-[1.3vw]">
                    Ainda sem apostas registradas.
                    <span className="block">
                      Registre para visualizar seus resultados.
                    </span>
                  </h1>
                </div>
              ) : (
                <DailyProfitChart bets={filteredBetsByMonthYear} />
              )}
            </div>
          </div>

          <div className="mt-8">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight lg:text-[1.3vw]">
              Apostas recentes
            </h1>
            <div className="flex flex-wrap gap-2 mt-4 items-center justify-start">
              <div className="flex gap-4 lg:gap-[1vw]">
                {(resultFilter !== "all" || categoryFilter !== "all") && (
                  <Button
                    className="cursor-pointer px-3 py-5 rounded-[.8rem] border border-white/10 hover:bg-[var(--background)]"
                    onClick={() => {
                      setCategoryFilter("all");
                      setResultFilter("all");
                    }}
                  >
                    <X />
                  </Button>
                )}
                <Select
                  onValueChange={(value: string) =>
                    setResultFilter(value as BetResult | "all")
                  }
                >
                  <SelectTrigger className="text-[.9rem] px-3 py-5 rounded-[.8rem] border border-white/10 placeholder:text-white/30">
                    <SelectValue placeholder="Resultado" />
                  </SelectTrigger>
                  <SelectContent className="rounded-[.8rem] bg-[var(--main-text)] text-[var(--background)]">
                    <SelectGroup>
                      <SelectLabel className="text-[black]/80">
                        Resultado
                      </SelectLabel>

                      <SelectItem value="all">Todas</SelectItem>
                      <>
                        {BET_RESULTS.map((result, id) => (
                          <SelectItem key={id} value={result}>
                            {result}
                          </SelectItem>
                        ))}
                      </>
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Select
                  onValueChange={(value: string) =>
                    setCategoryFilter(value as CategoryResult | "all")
                  }
                >
                  <SelectTrigger className="text-[.9rem] px-3 py-5 rounded-[.8rem] border border-white/10 placeholder:text-white/30">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent className="rounded-[.8rem] bg-[var(--main-text)] text-[var(--background)]">
                    <SelectGroup>
                      <SelectLabel className="text-[black]/80">
                        Categoria
                      </SelectLabel>
                      <SelectItem value="all">Todas</SelectItem>
                      <>
                        {BET_CATEGORIES.map((category, id) => (
                          <SelectItem key={id} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="border border-white/10 rounded-[.8rem] p-2 lg:p-[1vw] hidden lg:block mt-4">
              {bets.length < 1 ? (
                <div className="h-[15vh] flex items-center justify-center text-center">
                  <h1 className="text-2xl md:text-3xl font-bold tracking-tight lg:text-[1.3vw]">
                    Ainda sem apostas registradas.
                    <span className="block">
                      Registre para visualizar seus resultados.
                    </span>
                  </h1>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-white/15">
                      <TableHead className="text-[.95rem] pb-2 font-bold lg:text-[.95vw]">
                        Evento
                      </TableHead>
                      <TableHead className="text-[.95rem] pb-2 font-bold lg:text-[.95vw] text-center">
                        Categoria
                      </TableHead>
                      <TableHead className="text-[.95rem] pb-2 font-bold lg:text-[.95vw] text-center ">
                        Valor da aposta
                      </TableHead>
                      <TableHead className="text-[.95rem] pb-2 font-bold lg:text-[.95vw] text-center">
                        Odd
                      </TableHead>
                      <TableHead className="text-[.95rem] pb-2 font-bold lg:text-[.95vw] text-center">
                        Resultado
                      </TableHead>
                      <TableHead className="text-[.95rem] pb-2 font-bold lg:text-[.95vw] text-center">
                        Lucro
                      </TableHead>
                      <TableHead className="text-[.95rem] pb-2 font-bold lg:text-[.95vw] text-center">
                        Data
                      </TableHead>
                      <TableHead className="text-[.95rem] pb-2 font-bold lg:text-[.95vw] text-right">
                        Editar
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {filteredBets.slice(0, 10).map((bet) => (
                        <motion.tr
                          key={bet.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-b border-white/15"
                        >
                          <TableCell>{bet.event}</TableCell>
                          <TableCell className="text-center">
                            {bet.category}
                          </TableCell>
                          <TableCell className="text-center">
                            R$ {String(bet.betValue).replace(".", ",")}
                          </TableCell>
                          <TableCell className="text-center">
                            {String(bet.odd).replace(".", ",")}
                          </TableCell>
                          {bet.result === "Pendente" && (
                            <TableCell className="text-center">
                              {bet.result}
                            </TableCell>
                          )}
                          {bet.result === "Ganha" && (
                            <TableCell className="text-center text-[#00ff00]">
                              {bet.result}
                            </TableCell>
                          )}
                          {bet.result === "Perdida" && (
                            <TableCell className="text-center text-[#ff0000]">
                              {bet.result}
                            </TableCell>
                          )}
                          {bet.result === "Anulada" && (
                            <TableCell className="text-center">
                              {bet.result}
                            </TableCell>
                          )}

                          {bet.profit && String(bet.profit).includes("-") && (
                            <TableCell className="text-center text-[#ff0000]">
                              R$ {String(bet.profit).replace(".", ",")}
                            </TableCell>
                          )}
                          {bet.profit > 0 && (
                            <TableCell className="text-center text-[#00ff00]">
                              R$ {String(bet.profit).replace(".", ",")}
                            </TableCell>
                          )}
                          {bet.profit == 0 && (
                            <TableCell className="text-center text-[var(--main-text)]">
                              R$ {String(bet.profit).replace(".", ",")}
                            </TableCell>
                          )}

                          <TableCell className="text-center">
                            {new Date(bet.createdAt).toLocaleDateString(
                              "pt-BR"
                            )}
                          </TableCell>

                          <TableCell className="flex items-center justify-end">
                            <Dialog
                              open={editingBet?.id === bet.id}
                              onOpenChange={(isOpen) =>
                                !isOpen && setEditingBet(null)
                              }
                            >
                              <DialogTrigger asChild>
                                <Button
                                  onClick={() => setEditingBet(bet)}
                                  className="..."
                                >
                                  <Edit size={25} />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Editar Aposta</DialogTitle>
                                </DialogHeader>
                                <div>
                                  <EditBet
                                    bet={editingBet}
                                    onSave={fetchBets}
                                    onClose={() => setEditingBet(null)}
                                  />
                                </div>
                              </DialogContent>
                            </Dialog>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              )}
            </div>

            <div className="space-y-4 mt-4 lg:hidden">
              <AnimatePresence>
                {filteredBets.slice(0, 10).map((bet) => (
                  <motion.div
                    key={bet.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="p-4 border border-white/10 rounded-[.8rem]"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-base pr-2">
                        {bet.event}
                      </span>
                      <Dialog
                        open={editingBet?.id === bet.id}
                        onOpenChange={(isOpen) =>
                          !isOpen && setEditingBet(null)
                        }
                      >
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => setEditingBet(bet)}
                            className="border-none cursor-pointer transition-all duration-[.3s] ease-in-out scale-100 hover:scale-115"
                          >
                            <Edit size={25} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle className="text-[var(--main-text)]">
                              Editar Aposta
                            </DialogTitle>
                          </DialogHeader>
                          <div>
                            <EditBet
                              bet={editingBet}
                              onSave={fetchBets}
                              onClose={() => setEditingBet(null)}
                            />
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                    <p className="text-sm text-white/70 mb-4">{bet.market}</p>

                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm border-t border-white/10 pt-4">
                      <div>
                        <p className="text-white/60">Resultado</p>
                        <p
                          className={`font-semibold ${
                            bet.result === "Ganha"
                              ? "text-[#00ff00]"
                              : bet.result === "Perdida"
                              ? "text-[#ff0000]"
                              : ""
                          }`}
                        >
                          {bet.result}
                        </p>
                      </div>
                      <div>
                        <p className="text-white/60">Lucro</p>
                        <p
                          className={`font-semibold ${
                            bet.profit > 0
                              ? "text-[#00ff00]"
                              : bet.profit < 0
                              ? "text-[#ff0000]"
                              : "text-[var(--main-text)]"
                          }`}
                        >
                          R$ {String(bet.profit).replace(".", ",")}
                        </p>
                      </div>
                      <div>
                        <p className="text-white/60">Valor</p>
                        <p>R$ {String(bet.betValue).replace(".", ",")}</p>
                      </div>
                      <div>
                        <p className="text-white/60">Odd</p>
                        <p>{String(bet.odd).replace(".", ",")}</p>
                      </div>
                      <div>
                        <p className="text-white/60">Categoria</p>
                        <p>{bet.category}</p>
                      </div>
                      <div>
                        <p className="text-white/60">Data</p>
                        <p>
                          {new Date(bet.createdAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
