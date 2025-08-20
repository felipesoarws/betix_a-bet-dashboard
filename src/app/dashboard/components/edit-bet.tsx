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
import { ChevronDownIcon, Loader2, Save, Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { BET_CATEGORIES, BET_RESULTS } from "@/lib/constants";
import { toast } from "sonner";
import { BetSchema } from "./bets-stats";
import { Card } from "@/components/ui/card";
import { DialogDescription } from "@radix-ui/react-dialog";

const editBetSchema = z.object({
  event: z
    .string()
    .min(2, "Informe o evento.")
    .max(32, "Diminua o nome do evento."),
  market: z
    .string()
    .min(2, "Informe o mercado.")
    .max(41, "Diminua o nome do mercado."),
  category: z.enum(BET_CATEGORIES, {
    message: "Selecione uma categoria.",
  }),
  betValue: z
    .number({ error: "Informe um valor válido para a aposta." })
    .gt(0, "O valor precisa ser maior que 0."),
  odd: z
    .number({ error: "Informe um valor válido para a aposta." })
    .gt(1, "A odd precisa ser maior que 1."),
  unit: z
    .number({ error: "Informe um valor válido para a aposta." })
    .gt(0, "O valor precisa ser maior que 0."),
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
  const [loading, setLoading] = useState<boolean>(false);
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
          betValue: parseFloat(String(bet.betValue)),
          odd: parseFloat(String(bet.odd)),
          unit: parseFloat(String(bet.unit)),
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
        betValue: parseFloat(String(bet.betValue)),
        odd: parseFloat(String(bet.odd)),
        unit: parseFloat(String(bet.unit)),
        createdAt: new Date(bet.createdAt),
      });
      setDate(new Date(bet.createdAt));
    }
  }, [bet, form]);

  const onSubmit = async (values: EditBetFormValues) => {
    setLoading(true);
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
      <Card className="border-none">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mt-4 flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="event"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-[var(--light-white)]">
                    Evento
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-[.8rem] border border-white/10 px-3 py-5 text-[.9rem] text-[var(--light-white)] placeholder:text-white/30"
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
                  <FormLabel className="text-[var(--light-white)]">
                    Mercado
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="rounded-[.8rem] border border-white/10 px-3 py-5 text-[.9rem] text-[var(--light-white)] placeholder:text-white/30"
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
                    <FormLabel className="text-[var(--light-white)]">
                      Categoria
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl className="w-full">
                        <SelectTrigger className="rounded-[.8rem] border border-white/10 px-3 py-5 text-[.9rem] text-[var(--light-white)] placeholder:text-white/30">
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-[.8rem] bg-[var(--light-white)] text-[var(--gray)]">
                        {BET_CATEGORIES.map((category) => (
                          <SelectItem
                            key={category}
                            value={category}
                            className="bg-[var(--light-white)] hover:bg-white/90"
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
                    <FormLabel className="text-[var(--light-white)]">
                      Resultado
                    </FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl className="w-full">
                        <SelectTrigger className="rounded-[.8rem] border border-white/10 px-3 py-5 text-[.9rem] text-[var(--light-white)] placeholder:text-white/30">
                          <SelectValue placeholder=" Selecione um resultado" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-[.8rem] bg-[var(--light-white)] text-[var(--gray)]">
                        {BET_RESULTS.map((result) => (
                          <SelectItem
                            key={result}
                            value={result}
                            className="bg-[var(--light-white)] hover:bg-white/90"
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
                  <FormLabel className="text-[var(--light-white)]">
                    Data da aposta
                  </FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button className="w-full rounded-[.8rem] border border-white/10 bg-transparent px-3 py-5 text-left text-[.9rem] text-[var(--light-white)]">
                        {date ? date.toLocaleDateString() : "Selecionar data"}{" "}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="center"
                      className="m-2 w-auto overflow-hidden rounded-[.8rem] bg-[var(--light-white)] p-2 text-[var(--gray)]"
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

            <div className="flex items-start justify-between gap-5">
              <FormField
                control={form.control}
                name="betValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[var(--light-white)]">
                      Valor da aposta
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        className="rounded-[.8rem] border border-white/10 px-3 py-5 text-[.9rem] text-[var(--light-white)] placeholder:text-white/30 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                      />
                    </FormControl>
                    <FormMessage className="pl-2 text-[.85rem] text-[red]" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[var(--light-white)]">
                      Unidade(s)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        className="rounded-[.8rem] border border-white/10 px-3 py-5 text-[.9rem] text-[var(--light-white)] placeholder:text-white/30 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
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
                    <FormLabel className="text-[var(--light-white)]">
                      Odd
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        className="rounded-[.8rem] border border-white/10 px-3 py-5 text-[.9rem] text-[var(--light-white)] placeholder:text-white/30 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                      />
                    </FormControl>
                    <FormMessage className="pl-2 text-[.85rem] text-[red]" />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-5 lg:gap-[1vw]">
              <Button
                type="submit"
                className="ursor-pointer mt-4 flex-2 rounded-[.8rem] bg-[var(--light-white)] px-6 py-2.5 font-bold text-[var(--gray)] transition-all duration-[.3s] ease-in-out hover:scale-105 hover:bg-[var(--light-white)] hover:text-[var(--gray)]"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Salvando...
                  </div>
                ) : (
                  <>
                    <Save />
                    Salvar
                  </>
                )}
              </Button>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    type="button"
                    className="mt-4 flex-1 cursor-pointer rounded-[.8rem] bg-[red] px-6 py-2.5 font-bold text-[var(--light-white)] transition-all duration-[.3s] ease-in-out hover:scale-105 hover:bg-[red]"
                  >
                    <Trash />
                    Deletar
                  </Button>
                </DialogTrigger>
                <DialogContent className="rounded-[.8rem] border-white/10 bg-black/80 text-white backdrop-blur-md sm:max-w-[480px] lg:w-[20vw]">
                  <DialogHeader>
                    <DialogTitle className="text-xl text-[red] lg:text-[2vw]">
                      &#x26A0;
                    </DialogTitle>
                  </DialogHeader>
                  <DialogDescription>
                    Você tem certeza que deseja apagar essa aposta?
                  </DialogDescription>
                  <Button
                    type="button"
                    className="mt-4 flex-1 cursor-pointer rounded-[.8rem] bg-[red] px-6 py-2.5 font-bold text-[var(--light-white)] transition-all duration-[.3s] ease-in-out hover:scale-105 hover:bg-[red]"
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
