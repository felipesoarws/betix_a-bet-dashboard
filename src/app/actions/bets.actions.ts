"use server";

import { db } from "@/db";
import { betsTable } from "@/db/schema";
import { revalidatePath } from "next/cache";

type BetResult = "Pendente" | "Ganha" | "Perdida" | "Anulada";
type CategoryResult = "Futebol" | "Basquete" | "eSports" | "Outro";

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

export async function createBetAction(values: CreateBetInput) {
  if (isNaN(values.betValue) || isNaN(values.odd)) {
    return {
      success: false,
      error: "Valor da aposta ou odd inválidos.",
    };
  }

  let profit: number | null = null;
  switch (values.result) {
    case "Ganha":
      profit = values.odd * values.betValue - values.betValue;
      break;
    case "Perdida":
      profit = -values.betValue;
      break;
    case "Anulada":
      profit = 0;
      break;
    default:
      profit = 0;
  }

  try {
    await db.insert(betsTable).values({
      userId: values.userId,
      event: values.event,
      market: values.market,
      category: values.category,
      betValue: values.betValue.toString(),
      odd: values.odd.toString(),
      unit: values.unit.toString(),
      result: values.result.toString(),
      profit: profit !== null ? profit.toString() : null,
      createdAt: values.createdAt,
    });

    revalidatePath("/dashboard");

    return {
      success: true,
      message: "Aposta criada com sucesso!",
    };
  } catch (error) {
    console.error("Erro ao inserir aposta:", error);
    return {
      success: false,
      error: "Erro ao registrar aposta. Tente novamente.",
    };
  }
}
