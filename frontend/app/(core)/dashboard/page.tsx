import { DemoReportAnIssue } from "@/components/pools/new-card";
import PoolList from "@/components/pools/pool-list";
import Link from "next/link";

export default function Dashboard() {
  return (
    <main>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Pools</h1>
      </div>
      <div
        className="flex flex-1 items-center justify-center"
        x-chunk="dashboard-02-chunk-1"
      >
        <div className="flex flex-col items-center text-sm ">
          <PoolList/>
          {/* <DemoReportAnIssue/> */}
        </div>
      </div>
    </main>
  );
}
