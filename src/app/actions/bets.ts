"use server";

import { treeifyError, z } from "zod";
import { authClient as auth } from "@/lib/auth-client";
import { db } from "@/db";
import { betsTable } from "@/db/schema";
import { revalidatePath } from "next/cache";

const allowedCategories = ["Futebol", "Basquete", "eSports", "Outro"];

// zod
const BetSchema = z.object({
  event: z.string().min(3, { message: "O nome do evento é obrigatório." }),
  category: z.enum(allowedCategories, {
    message: "Selecione uma categoria válida.",
  }),
  betValue: z.coerce
    .number()
    .positive({ message: "O valor da aposta deve ser positivo." }),
  odd: z.coerce.number().gt(1, { message: "A odd deve ser maior que 1." }),
});

type CreateBetFormState = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function createBetAction(
  prevState: CreateBetFormState,
  formData: FormData
): Promise<CreateBetFormState> {
  const session = await auth.getSession();

  if (!session?.data?.user?.id) {
    return { success: false, message: "Não autorizado." };
  }

  const userId = session.data.user.id;

  const validatedFields = BetSchema.safeParse(
    Object.fromEntries(formData.entries())
  );

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Dados inválidos.",
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { event, category, betValue, odd } = validatedFields.data;

  try {
    await db.insert(betsTable).values({
      userId,
      event,
      category,
      betValue: String(betValue),
      odd: String(odd),
    });
  } catch (err) {
    console.error("Erro ao registrar aposta:", err);
    return {
      success: false,
      message: "Erro no servidor ao tentar registrar a aposta.",
    };
  }

  revalidatePath("/dashboard");
  return { success: true, message: "Aposta registrada com sucesso." };
}
