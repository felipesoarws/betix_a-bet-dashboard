"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { categoriesTable } from "@/db/schema";

async function toHeaders(): Promise<Headers> {
  const readonlyHeaders = await headers();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return new Headers(readonlyHeaders as any);
}

export async function getUserCategoriesAction() {
  const session = await auth.api.getSession({
    headers: await toHeaders(),
  });

  if (!session?.user) {
    return {
      error: "Usuário não autenticado.",
      categories: [] as { id: string; name: string }[],
    };
  }

  try {
    const userCategories = await db
      .select({
        id: categoriesTable.id,
        name: categoriesTable.name,
      })
      .from(categoriesTable)
      .where(eq(categoriesTable.userId, session.user.id))
      .orderBy(categoriesTable.name);

    return { success: true, categories: userCategories };
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    return {
      error: "Erro ao buscar categorias.",
      categories: [] as { id: string; name: string }[],
    };
  }
}

export async function createCategoryAction(name: string) {
  const session = await auth.api.getSession({
    headers: await toHeaders(),
  });

  if (!session?.user) {
    return { error: "Usuário não autenticado." };
  }

  try {
    const [newCategory] = await db
      .insert(categoriesTable)
      .values({
        name,
        userId: session.user.id,
      })
      .returning({
        id: categoriesTable.id,
        name: categoriesTable.name,
      });

    return { success: true, category: newCategory };
  } catch (error) {
    console.error("Erro ao criar categoria:", error);
    return { error: "Erro ao criar categoria." };
  }
}

export async function deleteCategoryAction(categoryId: string) {
  const session = await auth.api.getSession({
    headers: await toHeaders(),
  });

  if (!session?.user) {
    return { error: "Usuário não autenticado." };
  }

  try {
    await db
      .delete(categoriesTable)
      .where(
        and(
          eq(categoriesTable.id, categoryId),
          eq(categoriesTable.userId, session.user.id),
        ),
      );

    return { success: true };
  } catch (error) {
    console.error("Erro ao deletar categoria:", error);
    return { error: "Erro ao deletar categoria." };
  }
}
