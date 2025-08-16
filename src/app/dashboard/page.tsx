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
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

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
    toast("Bem-vindo!");
    fetchBets();
  }, []);

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-[var(--background)] text-[var(--main-text)]">
      <Header />
      <div className="flex-grow relative z-10 flex flex-col items-center justify-center">
        <main className="container p-6 flex flex-col flex-grow">
          <div className="x-4 py-6 bg-[var(--background-darker)] border border-white/10 rounded-[.8rem] lg:w-[70vw] lg:p-[2vw] lg:rounded-[1.2vw]">
            <div className="flex flex-col items-center justify-center  lg:flex-row lg:justify-between">
              <h1 className="mb-4 text-2xl md:text-6xl font-extrabold tracking-tight lg:text-[2vw] lg:mb-0">
                Seu dashboard
              </h1>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="w-[80%] rounded-[.8rem] bg-[var(--main-text)] text-[var(--background)] hover:bg-white/90 lg:w-[15vw]">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Nova Aposta
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[480px] bg-black/80 border-white/10 text-white backdrop-blur-md rounded-[.8rem]">
                  <DialogHeader>
                    <DialogTitle className="text-xl">Nova Aposta</DialogTitle>
                  </DialogHeader>
                  <div>
                    <AddBetForm
                      onBetAdded={fetchBets}
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
      <footer className="w-full text-center py-4 border-t border-white/10 bg-black/20 backdrop-blur-sm">
        <p className="text-white/60 text-sm">
          © {new Date().getFullYear()} Betlytics.{" "}
          <span className="block">Aposte com responsabilidade.</span>
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
