"use client";

import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/ui/common/dashboard-header";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddBetForm } from "./components/add-bet-form";
import { BetsStats } from "./components/bets-stats";
import { Eye, EyeClosed, PlusCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { BetSchema } from "./components/bets-stats";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { UNIT_VALUES } from "@/lib/constants";

const Dashboard = () => {
  const [isResultsHidden, setIsResultsHidden] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [bets, setBets] = useState<BetSchema[]>([]);
  const [userUnit, setUserUnit] = useState<string>("");

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
  }, []);

  useEffect(() => {
    const localUserUnitSave = localStorage.getItem("userUnit");
    if (localUserUnitSave) {
      setUserUnit(localUserUnitSave);
    }

    const localSave = localStorage.getItem("hideResults");
    if (localSave) {
      setIsResultsHidden(localSave === "true");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("hideResults", String(isResultsHidden));
  }, [isResultsHidden]);

  useEffect(() => {
    localStorage.setItem("userUnit", String(userUnit));
  }, [userUnit]);

  const checkIfHasUserLogged = async () => {
    const session = await authClient.getSession();
    const userId = session?.data?.user?.id;

    if (userId) return setIsDialogOpen(true);

    if (!userId)
      toast.message("Erro! ⚠", {
        description: "Não é possível registrar uma aposta sem estar logado.",
        action: {
          label: "Confirmar",
          onClick: () => console.log("Confirmar"),
        },
      });

    return setIsDialogOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[var(--gray)] text-[var(--light-white)]">
      <DashboardHeader path="dashboard" backIcon={false} homeIcon={true} />
      <div className="w-full flex-grow">
        <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col p-4 md:p-6 lg:max-w-[85vw]">
          <div className="relative w-full rounded-[.8rem] border border-white/10 bg-[var(--gray-darker)] px-4 py-6 lg:p-6">
            <div className="flex flex-col items-center gap-4 lg:flex-row lg:justify-between">
              <div className="flex items-center justify-between gap-4">
                <h1 className="text-center text-3xl font-extrabold tracking-tight md:text-4xl lg:text-3xl">
                  Seu dashboard
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

              <div className="flex items-center justify-center gap-4">
                <div
                  className={`${isResultsHidden ? "hidden blur-[.5rem]" : ""}`}
                >
                  <Input
                    type="number"
                    step="0.25"
                    className="[&::-webkit-outer-spin-button]:appearance-none`} border border-white/10 px-3 py-5 text-[.9rem] placeholder:text-white/30 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0"
                    placeholder="Digite seu valor da unidade"
                    onChange={(e) => setUserUnit(e.target.value)}
                    value={userUnit}
                  />
                </div>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      className="w-full max-w-xs cursor-pointer rounded-[.8rem] bg-[var(--light-white)] text-[var(--gray)] hover:bg-white/90 lg:w-auto lg:px-6"
                      onClick={() => checkIfHasUserLogged()}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Nova Aposta
                    </Button>
                  </DialogTrigger>
                  <DialogContent
                    className={`${userUnit && Number(userUnit) > 0 ? "lg:max-w-[40vw]" : ""} rounded-[.8rem] border-white/10 bg-black/80 text-white backdrop-blur-md sm:max-w-[500px]`}
                  >
                    <DialogHeader>
                      <DialogTitle className="text-xl">Nova Aposta</DialogTitle>
                    </DialogHeader>
                    <div className="flex items-start justify-center">
                      <AddBetForm
                        onBetAdded={() => {
                          fetchBets();
                          setIsDialogOpen(false);
                        }}
                        setIsDialogOpen={setIsDialogOpen}
                      />
                      <Card
                        className={`${userUnit && Number(userUnit) > 0 ? "" : "hidden"} mt-4 rounded-[.8rem] border-white/10 bg-[#171717] lg:w-[15vw]`}
                      >
                        <CardContent className="flex flex-col gap-4">
                          <div className="flex flex-col items-start justify-center gap-[1.15rem]">
                            {UNIT_VALUES.map((un, index) => (
                              <div
                                className="flex items-center gap-2"
                                key={index}
                              >
                                <p className="font-regular text-[.9rem] select-none">
                                  {un.value}:
                                </p>
                                <span className="font-bold">
                                  {(Number(userUnit) * un.multiplier).toFixed(
                                    2,
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <Toaster />
            <BetsStats
              bets={bets}
              fetchBets={fetchBets}
              hideResults={isResultsHidden}
            />
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

export default Dashboard;
