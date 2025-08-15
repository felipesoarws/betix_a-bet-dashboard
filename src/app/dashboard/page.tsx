import { Header } from "@/components/ui/common/header";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AddBetForm } from "./components/add-bet.form";
import { PlusCircle } from "lucide-react";

const Dashboard = async () => {
  return (
    <div className="relative isolate min-h-screen bg-[var(--background)] text-[var(--main-text)]">
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />

        <main className="container p-6 flex flex-col flex-grow">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="rounded-[.8rem] bg-[var(--main-text)] text-[var(--background)] hover:bg-white/90">
                <PlusCircle className="mr-2 h-4 w-4" />
                Nova Aposta
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px] bg-black/80 border-white/10 text-white backdrop-blur-md rounded-[.8rem]">
              <DialogHeader>
                <DialogTitle className="text-xl">Nova Aposta</DialogTitle>
              </DialogHeader>
              <div>
                <AddBetForm />
              </div>
            </DialogContent>
          </Dialog>
        </main>

        <footer className="text-center py-4 border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <p className="text-white/60 text-sm">
            © {new Date().getFullYear()} Betlytics.{" "}
            <span className="block">Aposte com responsabilidade.</span>
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Dashboard;
