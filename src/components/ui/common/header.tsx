"use client";
import { LogOutIcon, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";

export const Header = () => {
  const { data: session } = authClient.useSession();

  return (
    <div>
      <header className="z-50 sticky top-0 right-0 w-full">
        <div className="w-full px-3 py-5 flex justify-between items-center border-b border-b-white/10 bg-black/20 backdrop-blur-md lg:px-[2vw]">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-[var(--main-text)]" />
            <span className="font-bold text-base text-[var(--main-text)]">
              Betlytics
            </span>
          </Link>

          <nav className="flex items-center gap-4">
            {session?.user ? (
              <>
                <div className="flex justify-between gap-8">
                  <div className="hidden lg:flex items-center gap-3">
                    <Avatar className="border border-white/10 bg-black/20 backdrop-blur-md p-2">
                      <AvatarImage
                        src={session?.user?.image as string | undefined}
                      />
                      <AvatarFallback>
                        {session?.user?.name?.split(" ")[0][0]}
                        {session?.user?.name?.split(" ")[1][0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="leading-4">
                      <h3 className="font-semibold text-[1rem]">
                        {session?.user?.name}
                      </h3>
                      <span className="text-[var(--main-text)] block text-[.8rem]">
                        {session?.user?.email}
                      </span>
                    </div>
                  </div>

                  <Button
                    asChild
                    onClick={() => authClient.signOut()}
                    className="cursor-pointer duration-[.3s] ease-in-out transition-all scale-125 hover:scale-140"
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
                  className="flex items-center justify-between gap-4 "
                >
                  <h2 className="text-[var(--main-text)] font-semibold">
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
