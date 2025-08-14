import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FlowingBackground from "@/components/ui/common/flowing-background";
import SignInForm from "./components/sign-in-form";
import SignUpForm from "./components/sign-up-form";
import { Header } from "@/components/ui/common/header";

const Authentication = async () => {
  return (
    <div className="relative isolate min-h-screen bg-black text-[var(--main-text)]">
      <div className="absolute top-0 w-full h-[70vh] lg:h-[90vh]">
        <FlowingBackground />
      </div>

      <div className="relative z-10 flex flex-col ">
        <Header />

        <main className="container flex flex-col items-center justify-center px-2 lg:px-[8vw]">
          <div className="flex w-full flex-col gap-6 p-5 lg:w-[30vw]">
            <Tabs defaultValue="sign-in">
              <TabsList className="space-x-[.5rem]">
                <TabsTrigger
                  value="sign-in"
                  className="cursor-pointer p-4 bg-[var(--accent-purple)] text-[var(--main-text)] rounded-[.8rem] border border-white/10  duration-[.3s] ease-in-out transition-all hover:bg-[#885aed]/50"
                >
                  Entrar
                </TabsTrigger>
                <TabsTrigger
                  value="sign-up"
                  className="cursor-pointer p-4 bg-[var(--accent-purple)] text-[var(--main-text)] rounded-[.8rem] border border-white/10  duration-[.3s] ease-in-out transition-all hover:bg-[#885aed]/50"
                >
                  Criar conta
                </TabsTrigger>
              </TabsList>
              <TabsContent value="sign-in" className="w-full">
                <SignInForm />
              </TabsContent>
              <TabsContent value="sign-up" className="w-full">
                <SignUpForm />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Authentication;
