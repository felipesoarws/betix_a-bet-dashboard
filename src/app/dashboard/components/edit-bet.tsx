"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BET_CATEGORIES, BET_RESULTS } from "@/lib/constants";
import { toast } from "sonner";
import { BetSchema } from "./bets-stats";
import { Card } from "@/components/ui/card";
import { DialogDescription } from "@radix-ui/react-dialog";

const editBetSchema = z.object({
  event: z.string().min(2, "Informe o evento."),
  market: z.string().min(2, "Informe o mercado."),
  category: z.enum(BET_CATEGORIES, {
    message: "Selecione uma categoria.",
  }),
  betValue: z
    .number({ error: "Informe um valor válido para a aposta." })
    .gt(0, "O valor precisa ser maior que 0."),
  odd: z
    .number({ error: "Informe um valor válido para a aposta." })
    .gt(1, "A odd precisa ser maior que 1."),
  result: z.enum(BET_RESULTS, { message: "Selecione uma categoria." }),
  createdAt: z.date("Informe uma data"),
});

type EditBetFormValues = z.infer<typeof editBetSchema>;

interface EditBetProps {
  bet: BetSchema | null;
  onSave: () => void;
  onClose: () => void;
}

export function EditBet({ bet, onSave, onClose }: EditBetProps) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  const form = useForm<EditBetFormValues>({
    resolver: zodResolver(editBetSchema),
    defaultValues: bet
      ? {
          event: bet.event,
          market: bet.market,
          category: bet.category,
          result: bet.result,
          betValue: bet.betValue,
          odd: bet.odd,
          createdAt: new Date(bet.createdAt),
        }
      : undefined,
  });

  useEffect(() => {
    if (bet) {
      form.reset({
        event: bet.event,
        market: bet.market,
        category: bet.category,
        result: bet.result,
        betValue: bet.betValue,
        odd: bet.odd,
        createdAt: new Date(bet.createdAt),
      });
      setDate(new Date(bet.createdAt));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bet]);

  const onSubmit = async (values: EditBetFormValues) => {
    let profit = 0;
    if (values.result === "Ganha") {
      profit = values.betValue * (values.odd - 1);
    } else if (values.result === "Perdida") {
      profit = -values.betValue;
    } else if (values.result === "Anulada") {
      profit = 0;
    }

    try {
      await fetch("/api/bets/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: bet?.id,
          ...values,
          profit,
          createdAt: date ?? values.createdAt,
        }),
      });

      toast.success("Aposta atualizada com sucesso!");
      onSave();
      onClose();
    } catch (err) {
      console.error("Erro ao atualizar a aposta:", err);
      toast.error("Erro ao atualizar a aposta.");
    }
  };

  if (!bet) return null;

  const onDelete = async (bet: BetSchema) => {
    try {
      await fetch("/api/bets/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...bet,
        }),
      });

      toast.success("Aposta atualizada com sucesso!");
      onSave();
      onClose();
    } catch (err) {
      console.error("Erro ao atualizar a aposta:", err);
      toast.error("Erro ao atualizar a aposta.");
    }
  };

  return (
    <>
      <Card className="border-none bg-transparent">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 mt-4"
          >
            <FormField
              control={form.control}
              name="event"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[var(--main-text)]">
                    Evento
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="text-[var(--main-text)]  text-[.9rem] px-3 py-5 rounded-[.8rem] border border-white/10 placeholder:text-white/30"
                      placeholder="São Paulo x Corinthians"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="pl-2 text-[.85rem] text-[red]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="market"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[var(--main-text)]">
                    Mercado
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="text-[.9rem] text-[var(--main-text)] px-3 py-5 rounded-[.8rem] border border-white/10 placeholder:text-white/30"
                      placeholder="+1.5 Gols"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="pl-2 text-[.85rem] text-[red]" />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-between gap-5">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-[var(--main-text)]">
                      Categoria
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl className="w-full">
                        <SelectTrigger className="text-[var(--main-text)] text-[.9rem] px-3 py-5 rounded-[.8rem] border border-white/10 placeholder:text-white/30">
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-[.8rem] bg-[var(--main-text)] text-[var(--background)]">
                        {BET_CATEGORIES.map((category) => (
                          <SelectItem
                            key={category}
                            value={category}
                            className="bg-[var(--main-text)] hover:bg-white/90"
                          >
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="pl-2 text-[.85rem] text-[red]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="result"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-[var(--main-text)]">
                      Resultado
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl className="w-full">
                        <SelectTrigger className="text-[var(--main-text)] text-[.9rem] px-3 py-5 rounded-[.8rem] border border-white/10 placeholder:text-white/30">
                          <SelectValue placeholder=" Selecione um resultado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-[.8rem] bg-[var(--main-text)] text-[var(--background)]">
                        {BET_RESULTS.map((result) => (
                          <SelectItem
                            key={result}
                            value={result}
                            className="text-[var(--main-text)] bg-[var(--main-text)] hover:bg-white/90"
                          >
                            {result}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="pl-2 text-[.85rem] text-[red]" />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="createdAt"
              render={() => (
                <FormItem className="w-full">
                  <FormLabel className="text-[var(--main-text)]">
                    Data da aposta
                  </FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button className="text-[var(--main-text)] bg-transparent w-full text-[.9rem] px-3 py-5 rounded-[.8rem] border border-white/10 text-left">
                        {date ? date.toLocaleDateString() : "Selecionar data"}{" "}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="center"
                      className="w-auto overflow-hidden m-2 p-2 rounded-[.8rem] bg-[var(--main-text)] text-[var(--background)]"
                    >
                      <Calendar
                        mode="single"
                        selected={date}
                        captionLayout="dropdown"
                        onSelect={(date) => {
                          if (date) setDate(date);
                          setOpen(false);
                        }}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage className="pl-2 text-[.85rem] text-[red]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="betValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[var(--main-text)]">
                    Valor da aposta
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      value={field.value ?? "0"}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      className="text-[var(--main-text)] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 text-[.9rem] px-3 py-5 rounded-[.8rem] border border-white/10 placeholder:text-white/30"
                    />
                  </FormControl>
                  <FormMessage className="pl-2 text-[.85rem] text-[red]" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="odd"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[var(--main-text)]">Odd</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      className="text-[var(--main-text)] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 text-[.9rem] px-3 py-5 rounded-[.8rem] border border-white/10 placeholder:text-white/30"
                    />
                  </FormControl>
                  <FormMessage className="pl-2 text-[.85rem] text-[red]" />
                </FormItem>
              )}
            />

            <div className="flex gap-5 lg:gap-[1vw]">
              <Button
                type="submit"
                className="flex-2 ursor-pointer rounded-[.8rem] px-6 py-2.5 font-bold bg-[var(--main-text)] text-[var(--background)] duration-[.3s] ease-in-out transition-all hover:scale-105 hover:bg-[var(--main-text)] hover:text-[var(--background)] mt-4"
              >
                Salvar
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    className="flex-1 cursor-pointer rounded-[.8rem] px-6 py-2.5 font-bold bg-[red] text-[var(--main-text)] duration-[.3s] ease-in-out transition-all hover:scale-105  hover:bg-[red] mt-4"
                  >
                    Deletar
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[480px] bg-black/80 border-white/10 text-white backdrop-blur-md rounded-[.8rem] lg:w-[20vw]">
                  <DialogHeader>
                    <DialogTitle className="text-xl lg:text-[2vw] text-[red]">
                      &#x26A0;
                    </DialogTitle>
                  </DialogHeader>
                  <DialogDescription>
                    Você tem certeza que deseja apagar essa aposta?
                  </DialogDescription>
                  <Button
                    type="button"
                    className="flex-1 cursor-pointer rounded-[.8rem] px-6 py-2.5 font-bold bg-[red] text-[var(--main-text)] duration-[.3s] ease-in-out transition-all hover:scale-105  hover:bg-[red] mt-4"
                    onClick={() => onDelete(bet)}
                  >
                    Sim
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
          </form>
        </Form>
      </Card>
    </>
  );
}
