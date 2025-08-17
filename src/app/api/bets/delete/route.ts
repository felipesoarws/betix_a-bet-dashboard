import { NextResponse } from "next/server";
import { db } from "@/db";
import { betsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(req: Request) {
  try {
    const data = await req.json();

    const { id } = data;

    if (!id) {
      return NextResponse.json(
        { error: "Bet ID is required" },
        { status: 400 }
      );
    }

    await db.delete(betsTable).where(eq(betsTable.id, id));

    return NextResponse.json({ message: "Aposta deletada com sucesso." });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Erro em deletar aposta." },
      { status: 500 }
    );
  }
}
