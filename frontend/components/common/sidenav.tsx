import { Home, WalletCards } from "lucide-react";
import Link from "next/link";
import React from "react";
import { Badge } from "@/components/ui/badge";
import NavLinks from "./nav-links";

const SideNav = () => {
  return (
    <div className="hidden border-r bg-neutral-bg md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="">Hifadhi</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            <NavLinks />
          </nav>
        </div>
      </div>
    </div>
  );
};

export default SideNav;
