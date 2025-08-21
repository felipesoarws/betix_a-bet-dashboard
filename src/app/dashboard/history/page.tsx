"use client";
import { Header } from "@/components/ui/common/header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import { BetSchema } from "../components/bets-stats";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BET_CATEGORIES, BET_RESULTS } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { AnimatePresence, motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Edit, Eye, EyeClosed } from "lucide-react";
import { EditBet } from "../components/edit-bet";

type BetResult = "Pendente" | "Ganha" | "Perdida" | "Anulada";
type CategoryResult = "Futebol" | "Basquete" | "eSports" | "Outro";

const BetHistory = () => {
  const [isResultsHidden, setIsResultsHidden] = useState<boolean>(() => {
    const localSave = localStorage.getItem("hideResults") || false;
    return localSave === "true";
  });

  const [bets, setBets] = useState<BetSchema[]>([]);
  const [editingBet, setEditingBet] = useState<BetSchema | null>(null);

  // filtros na tabela
  const [resultFilter, setResultFilter] = useState<BetResult | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryResult | "all">(
    "all",
  );
  const [eventFilter, setEventFilter] = useState<string>("all");

  const fetchBets = async () => {
    const session = await authClient.getSession();
    const userId = session?.data?.user?.id;
    if (!userId) return;

    const res = await fetch(`/api/bets/user/${userId}`);
    const data = await res.json();
    setBets(data);
  };

  useEffect(() => {
    fetchBets();
    const localSave = localStorage.getItem("hideResults");
    setIsResultsHidden(localSave === "true");
  }, []);

  const filteredBets = bets
    .filter((bet) => {
      const matchEvent =
        eventFilter === "all" ||
        bet.event.toLocaleLowerCase().includes(eventFilter);
      const matchResult = resultFilter === "all" || bet.result === resultFilter;
      const matchCategory =
        categoryFilter === "all" || bet.category === categoryFilter;
      return matchResult && matchCategory && matchEvent;
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <div className="flex min-h-screen flex-col bg-[var(--gray)] text-[var(--light-white)]">
      <div className="w-full flex-grow">
        <Header path="dashboard" backIcon={true} />
        <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col p-4 md:p-6 lg:max-w-[85vw]">
          <div className="w-full rounded-[.8rem] bg-[var(--gray-darker)] py-6 lg:py-6">
            <div className="flex items-center justify-start gap-4">
              <h1 className="text-center text-3xl font-extrabold tracking-tight md:text-4xl lg:text-3xl">
                Histórico
              </h1>
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
          <div className="z-10 mt-8">
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl lg:text-[1.3vw]">
              Apostas recentes
            </h1>
            <div className="mt-4 flex flex-wrap items-center justify-start gap-2">
              <div className="flex flex-wrap gap-4 lg:flex-nowrap lg:gap-[1vw]">
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
                      <TableHead className="pb-2 text-[.85rem] font-bold lg:text-[.75vw]">
                        Evento
                      </TableHead>
                      <TableHead className="pb-2 text-left text-[.85rem] font-bold lg:text-[.75vw]">
                        Mercado
                      </TableHead>
                      <TableHead className="pb-2 text-center text-[.85rem] font-bold lg:text-[.75vw]">
                        Categoria
                      </TableHead>
                      <TableHead className="pb-2 text-center text-[.85rem] font-bold lg:text-[.75vw]">
                        Valor da aposta
                      </TableHead>
                      <TableHead className="pb-2 text-center text-[.85rem] font-bold lg:text-[.75vw]">
                        Unidade(s)
                      </TableHead>
                      <TableHead className="pb-2 text-center text-[.85rem] font-bold lg:text-[.75vw]">
                        Odd
                      </TableHead>
                      <TableHead className="pb-2 text-center text-[.85rem] font-bold lg:text-[.75vw]">
                        Resultado
                      </TableHead>
                      <TableHead className="pb-2 text-center text-[.85rem] font-bold lg:text-[.75vw]">
                        Lucro
                      </TableHead>
                      <TableHead className="pb-2 text-center text-[.85rem] font-bold lg:text-[.75vw]">
                        Data
                      </TableHead>
                      <TableHead className="pb-2 text-right text-[.85rem] font-bold lg:text-[.75vw]">
                        Editar
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <AnimatePresence>
                      {filteredBets.map((bet) => (
                        <motion.tr
                          key={bet.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-b border-white/15"
                        >
                          <TableCell className="text-[.85rem] lg:text-[.75vw]">
                            {bet.event}
                          </TableCell>
                          <TableCell className="text-left text-[.75rem] text-wrap text-[white]/50 lg:text-[.75vw]">
                            {bet.market}
                          </TableCell>
                          <TableCell className="text-center text-[.85rem] lg:text-[.75vw]">
                            {bet.category}
                          </TableCell>
                          <TableCell
                            className={
                              isResultsHidden
                                ? "text-center text-[.85rem] blur-[.5rem] select-none lg:text-[.75vw]"
                                : "text-center text-[.85rem] lg:text-[.75vw]"
                            }
                          >
                            R$ {String(bet.betValue).replace(".", ",")}
                          </TableCell>
                          <TableCell
                            className={
                              isResultsHidden
                                ? "text-center text-[.85rem] blur-[.5rem] select-none lg:text-[.75vw]"
                                : "text-center text-[.85rem] lg:text-[.75vw]"
                            }
                          >
                            {String(bet.unit).replace(".", ",")}
                          </TableCell>
                          <TableCell
                            className={
                              isResultsHidden
                                ? "text-center text-[.85rem] blur-[.5rem] select-none lg:text-[.75vw]"
                                : "text-center text-[.85rem] lg:text-[.75vw]"
                            }
                          >
                            {String(bet.odd).replace(".", ",")}
                          </TableCell>

                          {bet.result === "Pendente" && (
                            <TableCell className="text-center text-[.85rem] lg:text-[.75vw]">
                              {bet.result}
                            </TableCell>
                          )}
                          {bet.result === "Ganha" && (
                            <TableCell className="text-center text-[.85rem] text-[#00ff00] lg:text-[.75vw]">
                              {bet.result}
                            </TableCell>
                          )}
                          {bet.result === "Perdida" && (
                            <TableCell className="text-center text-[.85rem] text-[#ff0000] lg:text-[.75vw]">
                              {bet.result}
                            </TableCell>
                          )}
                          {bet.result === "Anulada" && (
                            <TableCell className="text-center text-[.85rem] lg:text-[.75vw]">
                              {bet.result}
                            </TableCell>
                          )}

                          {bet.profit && String(bet.profit).includes("-") && (
                            <TableCell
                              className={
                                isResultsHidden
                                  ? "text-center text-[.85rem] text-[#ff0000] blur-[.5rem] select-none lg:text-[.75vw]"
                                  : "text-center text-[.85rem] text-[#ff0000] lg:text-[.75vw]"
                              }
                            >
                              R$ {String(bet.profit).replace(".", ",")}
                            </TableCell>
                          )}
                          {bet.profit > 0 && (
                            <TableCell
                              className={
                                isResultsHidden
                                  ? "text-center text-[.85rem] text-[#00ff00] blur-[.5rem] select-none lg:text-[.75vw]"
                                  : "text-center text-[.85rem] text-[#00ff00] lg:text-[.75vw]"
                              }
                            >
                              R$ {String(bet.profit).replace(".", ",")}
                            </TableCell>
                          )}
                          {bet.profit == 0 && (
                            <TableCell
                              className={
                                isResultsHidden
                                  ? "text-center text-[.85rem] text-[var(--light-white)] blur-[.5rem] select-none lg:text-[.75vw]"
                                  : "text-center text-[.85rem] text-[var(--light-white)] lg:text-[.75vw]"
                              }
                            >
                              R$ {String(bet.profit).replace(".", ",")}
                            </TableCell>
                          )}

                          <TableCell className="text-center text-[.85rem] lg:text-[.75vw]">
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
                              <DialogContent className="rounded-[.8rem] border-white/10 bg-black/80 text-white backdrop-blur-md sm:max-w-[550px]">
                                <DialogHeader>
                                  <DialogTitle className="text-[.85rem] text-[var(--light-white)] lg:text-[.75vw]">
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
                          </TableCell>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </TableBody>
                </Table>
              )}
            </div>
            <div className="mt-4 space-y-4 md:hidden">
              <AnimatePresence>
                {filteredBets.map((bet) => (
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
                        <DialogContent className="rounded-[.8rem] border-white/10 bg-black/80 text-white backdrop-blur-md sm:max-w-[550px]">
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
                          {new Date(bet.createdAt).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </main>
      </div>
      <footer className="w-full border-t border-white/10 bg-black/20 py-8 text-center backdrop-blur-sm">
        <p className="text-sm text-white/60">
          © {new Date().getFullYear()} Betix.
          <span className="block">Aposte com responsabilidade.</span>
        </p>
      </footer>
    </div>
  );
};

export default BetHistory;
