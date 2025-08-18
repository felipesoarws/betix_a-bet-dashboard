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
import { Edit, Loader2 } from "lucide-react";

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
import { Input } from "@/components/ui/input";

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

  const [isShowingAllBets, setIsShowingAllBets] = useState<boolean>(false);

  // filtros no geral e no grafico
  const [monthTotalFilter, setMonthTotalFilter] = useState<string>("all");
  const [yearTotalFilter, setYearTotalFilter] = useState<string>("all");

  // filtros na tabela
  const [resultFilter, setResultFilter] = useState<BetResult | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryResult | "all">(
    "all",
  );
  const [eventFilter, setEventFilter] = useState<string>("all");

  // criação de listas de anos e meses registrados nas bets
  const yearsAvailable = Array.from(
    new Set(bets.map((bet) => new Date(bet.createdAt).getFullYear())),
  ).sort((a, b) => b - a);

  const monthsAvailable = Array.from(
    new Set(
      bets
        .filter((bet) =>
          yearTotalFilter === "all"
            ? true
            : new Date(bet.createdAt).getFullYear() === Number(yearTotalFilter),
        )
        .map((bet) => new Date(bet.createdAt).getMonth()),
    ),
  ).sort((a, b) => a - b);

  const filteredBetsByMonthYear = bets.filter((bet) => {
    const date = new Date(bet.createdAt);
    const matchYear =
      yearTotalFilter === "all" ||
      date.getFullYear() === Number(yearTotalFilter);
    const matchMonth =
      monthTotalFilter === "all" ||
      date.getMonth() === Number(monthTotalFilter);
    return matchYear && matchMonth;
  });

  const filteredBets = bets.filter((bet) => {
    const matchEvent =
      eventFilter === "all" ||
      bet.event.toLocaleLowerCase().includes(eventFilter);
    const matchResult = resultFilter === "all" || bet.result === resultFilter;
    const matchCategory =
      categoryFilter === "all" || bet.category === categoryFilter;
    return matchResult && matchCategory && matchEvent;
  });

  // total de bets
  const betsTotal = filteredBetsByMonthYear.length;

  // bets ganhas + some das bets ganhas
  const wins = filteredBetsByMonthYear.filter((bet) => bet.result === "Ganha");
  const winsSum = Number(
    wins.reduce((sum, b) => sum + Number(b.profit), 0).toFixed(2),
  );

  // bets perdidas + some das bets perdidas
  const loses = filteredBetsByMonthYear.filter(
    (bet) => bet.result === "Perdida",
  );
  const losesSum = Number(
    loses.reduce((sum, b) => sum + Number(b.profit), 0).toFixed(2),
  );

  // lucro total
  const totalProfit = (winsSum + losesSum).toFixed(2);

  // total apostado
  const gambledTotal = Number(
    filteredBetsByMonthYear
      .reduce((sum, b) => sum + Number(b.betValue), 0)
      .toFixed(2),
  ).toLocaleString("pt-BR");

  const filteredBetsByMonthYearButPendent = filteredBetsByMonthYear.filter(
    (bet) => bet.result !== "Pendente",
  );

  // porcentagem de vitória
  const percentVictory = (
    filteredBetsByMonthYear.length > 0
      ? (wins.length / filteredBetsByMonthYearButPendent.length) * 100
      : 0
  ).toFixed(0);

  return (
    <div>
      {!session ? (
        <>
          <div className="flex h-[30vh] items-center justify-center text-center">
            <h1 className="mt-8 text-2xl font-bold tracking-tight md:text-3xl lg:text-[1.5vw]">
              Registre para cadastrar e visualizar seus resultados.
            </h1>
          </div>
        </>
      ) : (
        <>
          <div className="flex flex-col">
            <div className="mt-4 flex flex-wrap items-center justify-start gap-2">
              <div className="flex gap-4 lg:gap-[1vw]">
                <Select
                  onValueChange={(value: string) =>
                    setYearTotalFilter(value as string | "all")
                  }
                >
                  <SelectTrigger className="cursor-pointer rounded-[.8rem] border border-white/10 px-3 py-5 text-[.9rem] placeholder:text-white/30">
                    <SelectValue placeholder="Ano" />
                  </SelectTrigger>
                  <SelectContent className="rounded-[.8rem] bg-[var(--light-white)] text-[var(--gray)]">
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
                    setMonthTotalFilter(value as string | "all")
                  }
                >
                  <SelectTrigger className="cursor-pointer rounded-[.8rem] border border-white/10 px-3 py-5 text-[.9rem] placeholder:text-white/30">
                    <SelectValue placeholder="Mês" />
                  </SelectTrigger>
                  <SelectContent className="rounded-[.8rem] bg-[var(--light-white)] text-[var(--gray)]">
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

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="flex w-full flex-col items-start justify-center rounded-[.8rem] border border-white/10 bg-[var(--gray-darker)] p-4">
                <h2 className="font-regular mb-2 text-base tracking-tight lg:text-[1.1vw]">
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
              <div className="flex w-full flex-col items-start justify-center rounded-[.8rem] border border-white/10 bg-[var(--gray-darker)] p-4">
                <h2 className="font-regular mb-2 text-base tracking-tight lg:text-[1.1vw]">
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
              <div className="flex w-full flex-col items-start justify-center rounded-[.8rem] border border-white/10 bg-[var(--gray-darker)] p-4">
                <h2 className="font-regular mb-2 text-base tracking-tight lg:text-[1.1vw]">
                  Lucro / prejuízo total
                </h2>
                {totalProfit == "0.00" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    {Number(totalProfit) > 0 ? (
                      <h2 className="text-2xl font-bold tracking-tight text-[#00ff00] lg:text-[1.5vw]">
                        R$ {Number(totalProfit).toLocaleString("pt-BR")}
                      </h2>
                    ) : (
                      <h2 className="text-2xl font-bold tracking-tight text-[#ff0000] lg:text-[1.5vw]">
                        R$ {Number(totalProfit).toLocaleString("pt-BR")}
                      </h2>
                    )}
                  </>
                )}
              </div>
              <div className="flex w-full flex-col items-start justify-center rounded-[.8rem] border border-white/10 bg-[var(--gray-darker)] p-4">
                <h2 className="font-regular mb-2 text-base tracking-tight lg:text-[1.1vw]">
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
            <h1 className="mt-8 text-2xl font-bold tracking-tight md:text-3xl lg:text-[1.3vw]">
              Evolução
            </h1>

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
                <DailyProfitChart bets={filteredBetsByMonthYear} />
              )}
            </div>
          </div>

          <div className="mt-8">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-[1.3vw]">
              Apostas recentes
            </h1>
            <div className="mt-4 flex flex-wrap items-center justify-start gap-2">
              <div className="flex gap-4 lg:gap-[1vw]">
                <Select
                  onValueChange={(value: string) =>
                    setResultFilter(value as BetResult | "all")
                  }
                >
                  <SelectTrigger className="rounded-[.8rem] border border-white/10 px-3 py-5 text-[.9rem] placeholder:text-white/30">
                    <SelectValue placeholder="Resultado" />
                  </SelectTrigger>
                  <SelectContent className="rounded-[.8rem] bg-[var(--light-white)] text-[var(--gray)]">
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
                  <SelectTrigger className="rounded-[.8rem] border border-white/10 px-3 py-5 text-[.9rem] placeholder:text-white/30">
                    <SelectValue placeholder="Categoria" />
                  </SelectTrigger>
                  <SelectContent className="rounded-[.8rem] bg-[var(--light-white)] text-[var(--gray)]">
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

                <Input
                  type="text"
                  className="rounded-[.8rem] border border-white/10 px-3 py-5 text-[.9rem] placeholder:text-white/30"
                  placeholder="Filtrar por evento"
                  onChange={(e) => setEventFilter(e.target.value)}
                  value={eventFilter === "all" ? "" : eventFilter}
                />
              </div>
            </div>
            <div className="mt-4 hidden rounded-[.8rem] border border-white/10 p-2 lg:block lg:p-[1vw]">
              {bets.length < 1 ? (
                <div className="flex h-[15vh] items-center justify-center text-center">
                  <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-[1.3vw]">
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
                      <TableHead className="pb-2 text-[.95rem] font-bold lg:text-[.95vw]">
                        Evento
                      </TableHead>
                      <TableHead className="pb-2 text-left text-[.95rem] font-bold lg:text-[.95vw]">
                        Mercado
                      </TableHead>
                      <TableHead className="pb-2 text-center text-[.95rem] font-bold lg:text-[.95vw]">
                        Categoria
                      </TableHead>
                      <TableHead className="pb-2 text-center text-[.95rem] font-bold lg:text-[.95vw]">
                        Valor da aposta
                      </TableHead>
                      <TableHead className="pb-2 text-center text-[.95rem] font-bold lg:text-[.95vw]">
                        Odd
                      </TableHead>
                      <TableHead className="pb-2 text-center text-[.95rem] font-bold lg:text-[.95vw]">
                        Resultado
                      </TableHead>
                      <TableHead className="pb-2 text-center text-[.95rem] font-bold lg:text-[.95vw]">
                        Lucro
                      </TableHead>
                      <TableHead className="pb-2 text-center text-[.95rem] font-bold lg:text-[.95vw]">
                        Data
                      </TableHead>
                      <TableHead className="pb-2 text-right text-[.95rem] font-bold lg:text-[.95vw]">
                        Editar
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {filteredBets
                        .slice(0, isShowingAllBets ? bets.length : 5)
                        .map((bet) => (
                          <motion.tr
                            key={bet.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-b border-white/15"
                          >
                            <TableCell>{bet.event}</TableCell>
                            <TableCell className="text-left text-[.8rem] text-[white]/50">
                              {bet.market}
                            </TableCell>
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
                              <TableCell className="text-center text-[var(--light-white)]">
                                R$ {String(bet.profit).replace(".", ",")}
                              </TableCell>
                            )}

                            <TableCell className="text-center">
                              {new Date(bet.createdAt).toLocaleDateString(
                                "pt-BR",
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
            <div className="mt-4 space-y-4 lg:hidden">
              <AnimatePresence>
                {filteredBets
                  .slice(0, isShowingAllBets ? bets.length : 5)
                  .map((bet) => (
                    <motion.div
                      key={bet.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="rounded-[.8rem] border border-white/10 p-4"
                    >
                      <div className="mb-2 flex items-start justify-between">
                        <span className="pr-2 text-base font-bold">
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
                              className="scale-100 cursor-pointer border-none transition-all duration-[.3s] ease-in-out hover:scale-115"
                            >
                              <Edit size={25} />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="rounded-[.8vw] bg-[var(--gray)]">
                            <DialogHeader>
                              <DialogTitle className="text-[var(--light-white)]">
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
                      <p className="mb-4 text-sm text-white/70">{bet.market}</p>

                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 border-t border-white/10 pt-4 text-sm">
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
                                  : "text-[var(--light-white)]"
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
                            {new Date(bet.createdAt).toLocaleDateString(
                              "pt-BR",
                            )}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </AnimatePresence>
            </div>
            <div className="py-2 text-right">
              {isShowingAllBets ? (
                <Button
                  className="cursor-pointer underline underline-offset-4 transition-all duration-[.3s] ease-in-out hover:text-[var(--accent-purple)]"
                  onClick={() => setIsShowingAllBets(false)}
                >
                  Desver todas as apostas
                </Button>
              ) : (
                <Button
                  className="cursor-pointer underline underline-offset-4 transition-all duration-[.3s] ease-in-out hover:text-[var(--accent-purple)]"
                  onClick={() => setIsShowingAllBets(true)}
                >
                  Ver todas as apostas
                </Button>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
