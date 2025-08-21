"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { authClient } from "@/lib/auth-client";
import {
  ChartColumnStacked,
  DollarSign,
  LayoutDashboard,
  LogInIcon,
  LogOutIcon,
  User2,
  UserCircle,
} from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../avatar";

export function DashSidedarMenu() {
  const { data: session } = authClient.useSession();

  return (
    <div className="bg-[var(--gray)]">
      {session?.user ? (
        <>
          <Sidebar className="rounded-[.8rem] border-[white]/20 bg-[#171717] text-right lg:mt-21">
            <SidebarHeader className="rounded-t-[.8rem] bg-[#171717] pt-6 text-[var(--light-white)]">
              <div className="flex items-center justify-end gap-6">
                <div>
                  <h3 className="text-[1.3rem] font-bold">
                    {session.user.name}
                  </h3>
                  <h4 className="font-regular text-[.8rem] italic">
                    {session.user.email}
                  </h4>
                </div>
                <div>
                  <Avatar className="border border-white/10 bg-black/20 p-7 backdrop-blur-md">
                    <AvatarImage
                      src={session?.user?.image as string | undefined}
                    />
                    <AvatarFallback className="text-[1.5rem]">
                      {session?.user?.name?.split(" ")[0]?.[0]}
                      {session?.user?.name?.split(" ")[1]?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </SidebarHeader>
            <SidebarContent className="bg-[#171717] pt-4 text-[var(--light-white)]">
              <SidebarGroup className="flex flex-col items-end justify-center">
                <SidebarGroupLabel className="text-right text-[.85rem] text-[var(--light-white)]/70">
                  Páginas
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className="flex flex-col items-end justify-center">
                    <SidebarMenuItem>
                      <SidebarMenuButton className="flex rounded-[.8rem] p-4 py-5 text-[.9rem] font-medium transition-all duration-[.3s] ease-in-out hover:bg-[var(--gray)] hover:text-[var(--light-white)]">
                        <Link
                          href="/dashboard"
                          className="flex items-center justify-between gap-3"
                        >
                          Dashboard
                          <LayoutDashboard
                            color="rgb(250, 250, 250)"
                            size={15}
                          />
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton className="flex rounded-[.8rem] p-5 pr-4 text-[.9rem] font-medium transition-all duration-[.3s] ease-in-out hover:bg-[var(--gray)] hover:text-[var(--light-white)]">
                        <Link
                          href="/dashboard/categories"
                          className="flex items-center justify-between gap-3"
                        >
                          Resultados por categoria
                          <ChartColumnStacked
                            color="rgb(250, 250, 250)"
                            size={15}
                          />
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton className="flex rounded-[.8rem] p-4 py-5 text-[.9rem] font-medium transition-all duration-[.3s] ease-in-out hover:bg-[var(--gray)] hover:text-[var(--light-white)]">
                        <Link
                          href="/dashboard/history"
                          className="flex items-center justify-between gap-3"
                        >
                          Histórico de apostas
                          <DollarSign color="rgb(250, 250, 250)" size={15} />
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
              <SidebarGroup className="flex flex-col items-end justify-center">
                <SidebarGroupLabel className="text-right text-[.85rem] text-[var(--light-white)]/70">
                  Conta
                </SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu className="flex flex-col items-end justify-center">
                    <SidebarMenuItem>
                      <SidebarMenuButton className="flex rounded-[.8rem] p-4 py-5 text-[.9rem] font-medium transition-all duration-[.3s] ease-in-out hover:bg-[var(--gray)] hover:text-[var(--light-white)]">
                        <Link
                          href="/myaccount"
                          className="flex items-center justify-between gap-3"
                        >
                          Meu perfil
                          <UserCircle color="rgb(250, 250, 250)" size={16} />
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton className="flex rounded-[.8rem] p-4 py-5 text-[.9rem] font-medium transition-all duration-[.3s] ease-in-out hover:bg-[var(--gray)] hover:text-[var(--light-white)]">
                        <Link
                          href="/authentication"
                          className="flex items-center justify-between gap-3"
                        >
                          Criar conta
                          <User2 color="rgb(250, 250, 250)" size={15} />
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        className="flex rounded-[.8rem] p-4 py-5 text-[.9rem] font-medium transition-all duration-[.3s] ease-in-out hover:bg-[var(--gray)] hover:text-[var(--light-white)]"
                        onClick={() => authClient.signOut()}
                      >
                        <Link
                          href="/"
                          className="flex items-center justify-between gap-3"
                        >
                          Sair
                          <LogOutIcon color="rgb(250, 250, 250)" size={15} />
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>
        </>
      ) : (
        <Sidebar className="rounded-[.8rem] border-[white]/20 bg-[#171717] px-4 text-right lg:mt-21">
          <SidebarHeader className="bg-[#171717] pt-6 text-[var(--light-white)]">
            <div className="flex items-center justify-end gap-6">
              <div>
                <h3 className="text-[1.3rem] font-bold">Olá.</h3>
                <h4 className="font-regular pl-15 text-[.8rem] italic">
                  Para ter mais detalhes, se registre ou logue.
                </h4>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent className="bg-[#171717] pt-4 text-[var(--light-white)]">
            <SidebarGroup className="flex flex-col items-end justify-center">
              <SidebarGroupLabel className="text-right text-[.85rem] text-[var(--light-white)]/70">
                Conta
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="flex flex-col items-end justify-center gap-3">
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      className="flex rounded-[.8rem] p-4 py-5 text-[1.1rem] font-medium transition-all duration-[.3s] ease-in-out hover:bg-[var(--gray)] hover:text-[var(--light-white)]"
                    >
                      <Link
                        href="/authentication"
                        className="flex items-center justify-between gap-4"
                      >
                        Entrar / Registrar
                        <LogInIcon color="rgb(250, 250, 250)" size={15} />
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      )}
    </div>
  );
}
