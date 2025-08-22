"use client";

import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { Button } from "../button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2, Undo2 } from "lucide-react";
export const HomepageHeader = ({
  backIcon,
  path,
}: {
  backIcon: boolean;
  path: string;
}) => {
  const { data: session } = authClient.useSession();

  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEnter = async () => {
    setLoading(true);

    router.push("/dashboard");
  };

  const handleAccount = async () => {
    setLoading(true);

    router.push("/authentication");
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-100 bg-black/20 backdrop-blur-md transition-all duration-300 ease-in-out">
      <div
        className={` ${backIcon ? "justify-between" : "justify-end"} flex w-full flex-row items-center border-b border-b-white/10 px-3 py-5 backdrop-blur-md lg:px-[2vw]`}
      >
        {backIcon ? (
          <Link
            href={"/"}
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
              <Button
                onClick={handleEnter}
                disabled={loading}
                className="cursor-pointer rounded-full bg-[var(--light-white)] px-4 text-[.85rem] font-bold text-[var(--gray)] transition-all duration-[.3s] ease-in-out hover:scale-105 hover:bg-[var(--light-white)] hover:text-[var(--gray)]"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Acessando...
                  </div>
                ) : (
                  "Acessar dashboard"
                )}
              </Button>
            </div>
          ) : (
            <div>
              {path === "sign-in-out" ? (
                <></>
              ) : (
                <Button
                  onClick={handleAccount}
                  disabled={loading}
                  className="cursor-pointer rounded-full bg-[var(--light-white)] px-4 text-[.85rem] font-bold text-[var(--gray)] transition-all duration-[.3s] ease-in-out hover:scale-105 hover:bg-[var(--light-white)] hover:text-[var(--gray)]"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Entrando...
                    </div>
                  ) : (
                    "Entrar / Criar conta"
                  )}
                </Button>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};
