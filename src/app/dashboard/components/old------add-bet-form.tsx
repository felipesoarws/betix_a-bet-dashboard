"use client";

import * as z from "zod";
import { BET_CATEGORIES } from "@/lib/constants";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createBetAction } from "@/app/actions/bets";
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
import { useTransition } from "react";

// Schema com "result"
const betFormSchema = z.object({
  event: z.string().min(3, { message: "O nome do evento é obrigatório." }),
  category: z.enum(BET_CATEGORIES, {
    message: "Selecione uma categoria válida.",
  }),
  betValue: z
    .string()
    .min(1, { message: "O valor é obrigatório." })
    .refine((val) => !isNaN(Number(val)), {
      message: "Digite um número válido.",
    }),
  odd: z
    .string()
    .min(1, { message: "A odd é obrigatória." })
    .refine((val) => !isNaN(Number(val)), {
      message: "Digite um número válido.",
    }),
  result: z.enum(["Pendente", "Ganha", "Perdida", "Anulada"]),
});

type FormValues = z.infer<typeof betFormSchema>;

export function AddBetForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<FormValues>({
    resolver: zodResolver(betFormSchema),
    defaultValues: {
      event: "",
      category: undefined,
      betValue: "",
      odd: "",
      result: "Pendente",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    startTransition(async () => {
      const formData = new FormData();

      formData.append("event", values.event);
      formData.append("category", values.category);
      formData.append("betValue", String(Number(values.betValue)));
      formData.append("odd", String(Number(values.odd)));
      formData.append("result", values.result);

      const result = await createBetAction(
        { success: false, message: "", errors: {} },
        formData
      );

      toast.success(result.message);
      form.reset();
    });
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
                  <Select onValueChange={field.onChange}>
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
                      className="text-[.9rem] px-3 py-5 rounded-[.8rem] border border-white/10 placeholder:text-white/30"
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
                      className="text-[.9rem] px-3 py-5 rounded-[.8rem] border border-white/10 placeholder:text-white/30"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="pl-2 text-[.85rem] text-[red]" />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="mt-5">
            <Button
              disabled={isPending}
              type="submit"
              className="cursor-pointer rounded-[.8rem] px-6 py-2.5 font-bold bg-[var(--main-text)] text-[var(--background)] duration-[.3s] ease-in-out transition-all hover:scale-105 hover:bg-[var(--main-text)] hover:text-[var(--background)]"
            >
              {isPending ? "Registrando..." : "Registrar Aposta"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
