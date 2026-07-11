import type { EarningTransaction, EarningsData } from "@/types/creator";

const defaultEarnings: EarningsData = {
  totalEarned: 487.25,
  thisMonth: 142.5,
  transactions: [
    {
      id: "1",
      date: "2025-06-28T14:32:00Z",
      type: "ad_fee",
      dealAmount: 50.0,
      yourCut: 7.5,
      status: "paid",
    },
    {
      id: "2",
      date: "2025-06-25T09:15:00Z",
      type: "escrow_deal",
      dealAmount: 500.0,
      yourCut: 75.0,
      status: "paid",
    },
    {
      id: "3",
      date: "2025-06-20T18:45:00Z",
      type: "ad_fee",
      dealAmount: 25.0,
      yourCut: 3.75,
      status: "pending",
    },
    {
      id: "4",
      date: "2025-06-15T11:00:00Z",
      type: "escrow_deal",
      dealAmount: 1200.0,
      yourCut: 180.0,
      status: "paid",
    },
    {
      id: "5",
      date: "2025-06-10T16:20:00Z",
      type: "ad_fee",
      dealAmount: 75.0,
      yourCut: 11.25,
      status: "paid",
    },
  ],
};

const demoEarningPool: Omit<EarningTransaction, "id" | "date">[] = [
  { type: "ad_fee", dealAmount: 40, yourCut: 6.0, status: "paid" },
  { type: "escrow_deal", dealAmount: 850, yourCut: 127.5, status: "paid" },
  { type: "ad_fee", dealAmount: 60, yourCut: 9.0, status: "pending" },
  { type: "escrow_deal", dealAmount: 320, yourCut: 48.0, status: "paid" },
];

type EarningsGlobal = typeof globalThis & {
  __creatorEarningsState?: EarningsData;
  __creatorDemoEarningIndex?: number;
};

const earningsGlobal = globalThis as EarningsGlobal;

if (!earningsGlobal.__creatorEarningsState) {
  earningsGlobal.__creatorEarningsState = structuredClone(defaultEarnings);
}

let earningsState = earningsGlobal.__creatorEarningsState;

function commitEarningsState(next: EarningsData) {
  earningsState = next;
  earningsGlobal.__creatorEarningsState = next;
}

export function getEarningsState(): EarningsData {
  return structuredClone(earningsState);
}

export function addEarningTransaction(
  transaction: EarningTransaction
): EarningTransaction {
  const nextTotal = earningsState.totalEarned + transaction.yourCut;
  const nextMonth =
    earningsState.thisMonth +
    (transaction.status === "paid" ? transaction.yourCut : 0);

  commitEarningsState({
    totalEarned: nextTotal,
    thisMonth: nextMonth,
    transactions: [transaction, ...earningsState.transactions],
  });

  return transaction;
}

export function createDemoEarning(): EarningTransaction {
  const index = earningsGlobal.__creatorDemoEarningIndex ?? 0;
  const template = demoEarningPool[index % demoEarningPool.length];
  earningsGlobal.__creatorDemoEarningIndex = index + 1;

  const transaction: EarningTransaction = {
    id: `earning-demo-${Date.now()}`,
    date: new Date().toISOString(),
    ...template,
  };

  return addEarningTransaction(transaction);
}
