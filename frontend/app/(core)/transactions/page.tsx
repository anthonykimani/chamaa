import Link from "next/link";

export default function Transactions() {
  return (
    <main>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Transactions</h1>
      </div>
      <div
        className="flex flex-1 items-center justify-center rounded-lg shadow-sm"
        x-chunk="dashboard-02-chunk-1"
      >
        <div className="flex flex-col items-center gap-1 text-center"></div>
      </div>
    </main>
  );
}
