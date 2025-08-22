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
import { BET_RESULTS } from "@/lib/constants";
import { getUserCategoriesAction } from "@/app/actions/categories.actions";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ChevronDownIcon, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { useEffect, useState } from "react";

type BetResult = "Pendente" | "Ganha" | "Perdida" | "Anulada";
type CategoryResult = string;

type CreateBetInput = {
  userId: string;
  event: string;
  market: string;
  category: CategoryResult;
  betValue: number;
  odd: number;
  unit: number;
  result: BetResult;
  createdAt: Date;
};

const addBetSchema = z.object({
  event: z
    .string()
    .min(2, "Informe o evento.")
    .max(32, "Diminua o nome do evento."),
  market: z
    .string()
    .min(2, "Informe o mercado.")
    .max(41, "Diminua o nome do mercado."),
  category: z.string().min(1, "Selecione uma categoria."),
  betValue: z
    .number({ error: "Informe um valor válido para a aposta." })
    .gt(0, "O valor precisa ser maior que 0."),
  unit: z
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
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(undefined);

  const [categories, setCategories] = useState<string[]>([]);
  const [, setIsLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const defaultCategories = ["Futebol", "Basquete", "eSports"];
      const result = await getUserCategoriesAction();

      if (result.success && result.categories) {
        const userCategories = result.categories.map((c) => c.name);
        const allCategories = [
          ...new Set([...defaultCategories, ...userCategories]),
        ];
        setCategories(allCategories.sort());
      } else {
        setCategories(defaultCategories.sort());
      }
      setIsLoadingCategories(false);
    };

    fetchCategories();
  }, []);

  const form = useForm<AddBetFormValues>({
    resolver: zodResolver(addBetSchema),
    defaultValues: {
      event: "",
      market: "",
      category: undefined,
      betValue: 0,
      odd: 0,
      unit: 0,
      result: "Pendente",
      createdAt: new Date(),
    },
  });

  const onSubmit = async (values: AddBetFormValues) => {
    setLoading(true);
    const session = await authClient.getSession();
    const userId = session?.data?.user?.id;

    if (!userId) {
      toast.error("Você precisa estar logado para registrar uma aposta.");
      return;
    }

    const selectedDate = date ?? new Date();

    const numericValues: CreateBetInput & { createdAt: Date } = {
      userId,
      event: values.event,
      market: values.market,
      category: values.category as CategoryResult,
      betValue: values.betValue,
      odd: values.odd,
      unit: values.unit,
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
                        className="rounded-[.8rem] border border-white/10 px-3 py-5 text-[.9rem] placeholder:text-white/30"
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
                        className="rounded-[.8rem] border border-white/10 px-3 py-5 text-[.9rem] placeholder:text-white/30"
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
                          <SelectTrigger className="rounded-[.8rem] border border-white/10 px-3 py-5 text-[.9rem] placeholder:text-white/30">
                            <SelectValue placeholder="Categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-[.8rem] bg-[var(--light-white)] text-[var(--gray)]">
                          {categories.map((category) => (
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
                      <FormLabel>Resultado</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl className="w-full">
                          <SelectTrigger className="rounded-[.8rem] border border-white/10 px-3 py-5 text-[.9rem] placeholder:text-white/30">
                            <SelectValue placeholder="Selecione uma categoria" />
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
                          className="w-full rounded-[.8rem] border border-white/10 bg-transparent px-3 py-5 text-left text-[.9rem]"
                        >
                          {date ? date.toLocaleDateString() : "Selecionar data"}
                          <ChevronDownIcon />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="m-2 w-auto overflow-hidden rounded-[.8rem] bg-[var(--light-white)] p-2 text-[var(--gray)]"
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

              <div className="flex items-start justify-between gap-5">
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
                          className="rounded-[.8rem] border border-white/10 px-3 py-5 text-[.9rem] placeholder:text-white/30 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
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
                      <FormLabel>Unidade(s)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="1 / 1.5 / 2"
                          className="rounded-[.8rem] border border-white/10 px-3 py-5 text-[.9rem] placeholder:text-white/30 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
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
                          className="rounded-[.8rem] border border-white/10 px-3 py-5 text-[.9rem] placeholder:text-white/30 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage className="pl-2 text-[.85rem] text-[red]" />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter className="mt-5">
              <Button
                disabled={loading}
                type="submit"
                className="w-full cursor-pointer rounded-[.8rem] bg-[var(--light-white)] px-6 py-2.5 font-bold text-[var(--gray)] transition-all duration-[.3s] ease-in-out hover:scale-105 hover:bg-[var(--light-white)] hover:text-[var(--gray)]"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Registrando...
                  </div>
                ) : (
                  "Registrar Aposta"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </>
  );
}
