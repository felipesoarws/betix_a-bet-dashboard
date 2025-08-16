"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBetAction } from "@/app/actions/bets.actions";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as z from "zod";
import { BET_CATEGORIES, BET_RESULTS } from "@/lib/constants";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useState } from "react";

type BetResult = "Pendente" | "Ganha" | "Perdida" | "Anulada";
type CategoryResult = "Futebol" | "Basquete" | "eSports" | "Outro";

type CreateBetInput = {
  userId: string;
  event: string;
  market: string;
  category: CategoryResult;
  betValue: number;
  odd: number;
  result: BetResult;
  createdAt: Date;
};

const addBetSchema = z.object({
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

type AddBetFormValues = z.infer<typeof addBetSchema>;

export function AddBetForm({
  onBetAdded,
  setIsDialogOpen,
}: {
  onBetAdded?: () => void;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  console.log(date);

  const form = useForm<AddBetFormValues>({
    resolver: zodResolver(addBetSchema),
    defaultValues: {
      event: "",
      market: "",
      category: "Outro",
      betValue: 0,
      odd: 0,
      result: "Pendente",
      createdAt: new Date(),
    },
  });

  const onSubmit = async (values: AddBetFormValues) => {
    const session = await authClient.getSession();
    const userId = session?.data?.user?.id;

    if (!userId) {
      toast.error("Você precisa estar logado para registrar uma aposta.");
      return;
    }

    const selectedDate = date ?? new Date();

    console.log(date);

    const numericValues: CreateBetInput & { createdAt: Date } = {
      userId,
      event: values.event,
      market: values.market,
      category: values.category as CategoryResult,
      betValue: values.betValue,
      odd: values.odd,
      result: values.result as BetResult,
      createdAt: selectedDate,
    };

    const res = await createBetAction(numericValues);

    if (res?.success) {
      toast.success("Aposta registrada com sucesso!");
      onBetAdded?.();
      form.reset();
      setIsDialogOpen(false);
    } else {
      toast.error(res?.error || "Erro ao registrar a aposta.");
    }
  };

  return (
    <>
      <Card className="border-none bg-transparent">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="flex flex-col gap-4">
              <FormField
                control={form.control}
                name="event"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Evento</FormLabel>
                    <FormControl>
                      <Input
                        className="text-[.9rem] px-3 py-5 rounded-[.8rem] border border-white/10 placeholder:text-white/30"
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
                    <FormLabel>Mercado</FormLabel>
                    <FormControl>
                      <Input
                        className="text-[.9rem] px-3 py-5 rounded-[.8rem] border border-white/10 placeholder:text-white/30"
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
                      <FormLabel>Categoria</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger className="text-[.9rem] px-3 py-5 rounded-[.8rem] border border-white/10 placeholder:text-white/30">
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
                      <FormLabel>Resultado</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger className="text-[.9rem] px-3 py-5 rounded-[.8rem] border border-white/10 placeholder:text-white/30">
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-[.8rem] bg-[var(--main-text)] text-[var(--background)]">
                          {BET_RESULTS.map((category) => (
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="createdAt"
                render={() => (
                  <FormItem className="w-full">
                    <FormLabel>Data da aposta</FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          id="date"
                          className="bg-transparent w-full text-[.9rem] px-3 py-5 rounded-[.8rem] border border-white/10 text-left"
                        >
                          {date ? date.toLocaleDateString() : "Selecionar data"}
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden m-2 p-2 rounded-[.8rem] bg-[var(--main-text)] text-[var(--background)]"
                        align="center"
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="betValue"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Valor (R$)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="10.00"
                        className="[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 text-[.9rem] px-3 py-5 rounded-[.8rem] border border-white/10 placeholder:text-white/30 "
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
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
                    <FormLabel>Odd</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="1.85"
                        className="[&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 text-[.9rem] px-3 py-5 rounded-[.8rem] border border-white/10 placeholder:text-white/30"
                        value={field.value ?? ""}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage className="pl-2 text-[.85rem] text-[red]" />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter className="mt-5">
              <Button
                type="submit"
                className="w-full cursor-pointer rounded-[.8rem] px-6 py-2.5 font-bold bg-[var(--main-text)] text-[var(--background)] duration-[.3s] ease-in-out transition-all hover:scale-105 hover:bg-[var(--main-text)] hover:text-[var(--background)]"
              >
                Registrar Aposta
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </>
  );
}
