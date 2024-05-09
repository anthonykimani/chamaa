"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Home, Menu, WalletCards } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import NavLinks from "./nav-links";
import { ToggleApps } from "./app-toggle";
import { useConnect } from "wagmi";
import { useRouter } from "next/router";
import { InjectedConnector } from "wagmi/connectors/injected";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const Header = () => {
  const [hideConnectBtn, setHideConnectBtn] = useState(false);
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  // const router = useRouter();

  useEffect(() => {
    if (window.ethereum && window.ethereum.isMiniPay) {
      setHideConnectBtn(true);
      connect();
    }
  }, [connect]);

  return (
    <div>
      <header className="flex h-14 justify-between  items-center gap-4 border-b bg-neutral-bg px-4 md:justify-end lg:h-[60px] lg:px-6">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="flex flex-col">
            <nav className="grid gap-2 text-lg font-medium">
              <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <span className="sr-only">Hifadhi</span>
              </Link>

              <NavLinks />
            </nav>
          </SheetContent>
        </Sheet>

        {/* <ToggleApps /> */}
        {/* <Button className="rounded-full" variant="primary">
          Connect Wallet
        </Button> */}

        <div className="absolute inset-y-0 right-0 flex items-center sm:static sm:inset-auto sm:ml-6 sm:pr-0">
          {!hideConnectBtn && (
            <ConnectButton
              showBalance={{
                smallScreen: false,
                largeScreen: true,
              }}
              accountStatus={{
                smallScreen: "avatar",
                largeScreen: "address",
              }}
              chainStatus={{
                smallScreen: "none",
                largeScreen: "full",
              }}
            />
          )}
        </div>
      </header>
    </div>
  );
};

export default Header;

declare global {
  interface Window {
    ethereum: any;
  }
}
