"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { authClient } from "@/lib/auth-client";
import { Undo2 } from "lucide-react";
import Link from "next/link";

export const Header = ({
  path,
  backIcon,
}: {
  path: string;
  backIcon: boolean;
}) => {
  const { data: session } = authClient.useSession();

  return (
    <div className="w-full pb-15">
      <header className="fixed top-0 z-50 w-full">
        <div className="flex w-full flex-row items-center justify-between border-b border-b-white/10 bg-black/20 px-3 py-5 backdrop-blur-md lg:px-[2vw]">
          {backIcon ? (
            <Link
              href={"/dashboard"}
              className="rounded-[.6rem] p-1 transition-all duration-[.3s] ease-in-out hover:scale-115"
            >
              <Undo2 className="cursor-pointer" size={20} />
            </Link>
          ) : (
            <></>
          )}
          <nav className="flex items-center gap-4">
            {session?.user ? (
              <div className="flex items-center justify-end gap-3"></div>
            ) : (
              <div>
                <Link
                  href="/authentication"
                  className="flex items-center justify-between gap-4"
                >
                  <h2 className="font-semibold text-[var(--light-white)] lg:text-[.8vw]">
                    Entrar / Criar conta
                  </h2>
                </Link>
              </div>
            )}
          </nav>

          {path === "dashboard" ? (
            <SidebarTrigger className="cursor-pointer" />
          ) : (
            <></>
          )}
        </div>
      </header>
    </div>
  );
};
