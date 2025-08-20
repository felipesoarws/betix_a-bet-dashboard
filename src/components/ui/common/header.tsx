"use client";
import { SidebarTrigger } from "@/components/ui/sidebar";

import { authClient } from "@/lib/auth-client";
import { Undo2 } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";

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
              <div className="flex items-center justify-end gap-3">
                {/*     <div>
                  <Avatar className="border border-white/10 bg-black/20 p-5 backdrop-blur-md">
                    <AvatarImage
                      src={session?.user?.image as string | undefined}
                    />
                    <AvatarFallback className="text-[1.2rem]">
                      {session?.user?.name?.split(" ")[0]?.[0]}
                      {session?.user?.name?.split(" ")[1]?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <div className="leading-5">
                  <h3 className="text-[1.3rem] font-bold">
                    {session.user.name}
                  </h3>
                  <h4 className="font-regular text-[.8rem] italic">
                    {session.user.email}
                  </h4>
                </div> */}
              </div>
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
