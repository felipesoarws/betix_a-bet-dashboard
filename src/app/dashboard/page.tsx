"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/ui/common/header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddBetForm } from "./components/add-bet-form";
import { BetsStats } from "./components/bets-stats";
import { PlusCircle } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { BetSchema } from "./components/bets-stats";

const Dashboard = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bets, setBets] = useState<BetSchema[]>([]);

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

  return (
    <div className="flex min-h-screen flex-col bg-[var(--gray)] text-[var(--light-white)]">
      <Header />
      <div className="w-full flex-grow">
        <main className="mx-auto flex w-full max-w-7xl flex-grow flex-col p-4 md:p-6 lg:max-w-[80vw]">
          <div className="w-full rounded-[.8rem] border border-white/10 bg-[var(--gray-darker)] px-4 py-6 lg:p-6">
            <div className="flex flex-col items-center gap-4 lg:flex-row lg:justify-between">
              <h1 className="text-center text-3xl font-extrabold tracking-tight md:text-4xl lg:text-5xl">
                Seu dashboard
              </h1>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full max-w-xs cursor-pointer rounded-[.8rem] bg-[var(--light-white)] text-[var(--gray)] hover:bg-white/90 lg:w-auto lg:px-6">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nova Aposta
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-[.8rem] border-white/10 bg-black/80 text-white backdrop-blur-md sm:max-w-[480px]">
                  <DialogHeader>
                    <DialogTitle className="text-xl">Nova Aposta</DialogTitle>
                  </DialogHeader>
                  <div>
                    <AddBetForm
                      onBetAdded={() => {
                        fetchBets();
                        setIsDialogOpen(false);
                      }}
                      setIsDialogOpen={setIsDialogOpen}
                    />
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <BetsStats bets={bets} fetchBets={fetchBets} />
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
