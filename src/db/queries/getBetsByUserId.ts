import { db } from "@/db";
import { betsTable } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getBetsByUserId(userId: string) {
  const bets = await db
    .select()
    .from(betsTable)
    .where(eq(betsTable.userId, userId));

  return bets;
}
