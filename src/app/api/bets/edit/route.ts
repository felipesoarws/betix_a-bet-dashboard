import { NextResponse } from "next/server";
import { db } from "@/db";
import { betsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(req: Request) {
  try {
    const data = await req.json();
    const { id, event, category, betValue, odd, result, createdAt, profit } =
      data;

    if (!id) {
      return NextResponse.json(
        { error: "a ID da aposta é obrigatória." },
        { status: 400 }
      );
    }

    await db
      .update(betsTable)
      .set({
        event,
        category,
        betValue,
        odd,
        result,
        createdAt: new Date(createdAt),
        profit,
      })
      .where(eq(betsTable.id, id));

    return NextResponse.json({ message: "A aposta foi atualizada." });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro em atualizar aposta." },
      { status: 500 }
    );
  }
}
