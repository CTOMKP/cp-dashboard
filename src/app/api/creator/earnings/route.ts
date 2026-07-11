import { NextResponse } from "next/server";
import { getEarningsState } from "@/lib/mock-earnings-store";

export async function GET() {
  return NextResponse.json(getEarningsState());
}
