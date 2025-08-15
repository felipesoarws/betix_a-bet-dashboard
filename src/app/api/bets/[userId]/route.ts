import { NextResponse } from "next/server";
import { getBetsByUserId } from "@/db/queries/getBetsByUserId";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const { userId } = await params;
  const bets = await getBetsByUserId(userId);
  return NextResponse.json(bets);
}
