"use client";
import { CircleDollarSign, LogOutIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";

export const Header = () => {
  const { data: session } = authClient.useSession();

  return (
    <div className="w-full">
      <header className="sticky top-0 right-0 z-50 w-full">
        <div className="flex w-full items-center justify-between border-b border-b-white/10 bg-black/20 px-3 py-5 backdrop-blur-md lg:px-[2vw]">
          <Link href="/" className="flex items-center gap-2">
            <CircleDollarSign className="h-5 w-5 text-[var(--light-white)]" />
            <span className="text-base font-bold text-[var(--light-white)]">
              Betix
            </span>
          </Link>

          <nav className="flex items-center gap-4">
            {session?.user ? (
              <>
                <div className="flex justify-between gap-8">
                  <div className="hidden items-center gap-3 lg:flex">
                    <Avatar className="border border-white/10 bg-black/20 p-2 backdrop-blur-md">
                      <AvatarImage
                        src={session?.user?.image as string | undefined}
                      />
                      <AvatarFallback>
                        {session?.user?.name?.split(" ")[0]?.[0]}
                        {session?.user?.name?.split(" ")[1]?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="leading-4">
                      <h3 className="text-[1rem] font-semibold">
                        {session?.user?.name}
                      </h3>
                      <span className="block text-[.8rem] text-[var(--light-white)]">
                        {session?.user?.email}
                      </span>
                    </div>
                  </div>

                  <Button
                    asChild
                    onClick={() => authClient.signOut()}
                    className="scale-125 cursor-pointer transition-all duration-[.3s] ease-in-out hover:scale-140"
                  >
                    <Link href="/">
                      <LogOutIcon color="rgb(250, 250, 250)" />
                    </Link>
                  </Button>
                </div>
              </>
            ) : (
              <div>
                <Link
                  href="/authentication"
                  className="flex items-center justify-between gap-4"
                >
                  <h2 className="font-semibold text-[var(--light-white)]">
                    Entrar
                  </h2>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>
    </div>
  );
};
