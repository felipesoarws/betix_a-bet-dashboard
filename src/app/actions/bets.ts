"use server";

import { db } from "@/db";
import { betsTable } from "@/db/schema";
import { revalidatePath } from "next/cache";

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

export async function createBetAction(values: CreateBetInput) {
  const betValueNum = Number(values.betValue);
  const oddNum = Number(values.odd);

  if (isNaN(betValueNum) || isNaN(oddNum)) {
    return {
      success: false,
      error: "Valor da aposta ou odd inválidos.",
    };
  }

  // calcula o lucro
  let profit: number | null = null;
  switch (values.result) {
    case "Ganha":
      profit = oddNum * betValueNum - betValueNum;
      break;
    case "Perdida":
      profit = -betValueNum;
      break;
    case "Anulada":
      profit = 0;
      break;
    default:
      profit = null;
  }

  try {
    await db.insert(betsTable).values({
      userId: values.userId,
      event: values.event,
      category: values.category,
      betValue: betValueNum.toString(),
      odd: oddNum.toString(),
      result: values.result,
      profit: profit !== null ? profit.toString() : null,
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
