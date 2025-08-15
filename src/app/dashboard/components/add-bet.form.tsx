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
import { createBetAction } from "@/app/actions/bets";
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

type BetResult = "Pendente" | "Ganha" | "Perdida" | "Anulada";
type CategoryResult = "Futebol" | "Basquete" | "eSports" | "Outro";

type CreateBetInput = {
  userId: string;
  event: string;
  category: CategoryResult;
  betValue: string;
  odd: string;
  result: BetResult;
};

const addBetSchema = z.object({
  event: z.string().min(2, "Informe o evento"),
  category: z.enum(BET_CATEGORIES, {
    message: "Selecione uma categoria",
  }),
  betValue: z.string().min(1, "Informe o valor da aposta"),
  odd: z.string().min(1, "Informe a odd"),
  result: z.enum(BET_RESULTS, { message: "Selecione uma categoria" }),
});

type AddBetFormValues = z.infer<typeof addBetSchema>;

export function AddBetForm() {
  const form = useForm<AddBetFormValues>({
    resolver: zodResolver(addBetSchema),
    defaultValues: {
      event: "",
      category: "Outro",
      betValue: "",
      odd: "",
      result: "Pendente",
    },
  });

  const onSubmit = async (values: AddBetFormValues) => {
    const session = await authClient.getSession();
    const userId = session?.data?.user?.id;

    console.log(userId);

    if (!userId) {
      toast.error("Você precisa estar logado para registrar uma aposta.");
      return;
    }

    const numericValues: CreateBetInput = {
      userId,
      event: values.event,
      category: values.category as CategoryResult,
      betValue: values.betValue,
      odd: values.odd,
      result: values.result as BetResult,
    };

    const res = await createBetAction(numericValues);

    if (res?.success) {
      toast.success("Aposta registrada com sucesso!");
      form.reset();
    } else {
      toast.error(res?.error || "Erro ao registrar a aposta.");
    }
  };

  return (
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
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
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
                      {...field}
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
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="pl-2 text-[.85rem] text-[red]" />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="result"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resultado</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
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
  );
}
