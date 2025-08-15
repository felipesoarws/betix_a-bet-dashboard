"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit } from "lucide-react";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function BetsStatus({ bets }: { bets: any[] }) {
  console.log(bets);

  // total de bets
  const betsTotal = bets.length;

  // bets ganhas + some das bets ganhas
  const wins = bets.filter((bet) => bet.result === "Ganha");
  const winsSum = Number(
    wins.reduce((sum, b) => sum + Number(b.profit), 0).toFixed(2)
  );

  // bets perdidas + some das bets perdidas
  const loses = bets.filter((bet) => bet.result === "Perdida");
  const losesSum = Number(
    loses.reduce((sum, b) => sum + Number(b.profit), 0).toFixed(2)
  );

  // lucro total
  const totalProfit = (winsSum + losesSum).toFixed(2);

  // total apostado
  const gambledTotal = bets
    .reduce((sum, b) => sum + Number(b.betValue), 0)
    .toFixed(2)
    .replace(".", ",");

  // porcentagem de vitória
  const percentVictory = (
    bets.length > 0 ? (wins.length / bets.length) * 100 : 0
  ).toFixed(0);

  return (
    <div className="">
      <div className="flex items-center justify-center gap-4 mt-6 lg:gap-[1.8vw]">
        <div className="w-full flex flex-col items-start justify-center mx-5 px-4 py-6 sm:max-w-[480px] bg-[var(--background-darker)] border border-white/10 rounded-[.8rem] lg:px-[1.2vw] lg:py-[1.5vw] lg:w-[20vw] lg:mx-0">
          <h2 className="mb-4 text-xl md:text-6xl font-regular tracking-tight lg:text-[1.1vw]">
            Total de apostas
          </h2>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight lg:text-[1.5vw]">
            {betsTotal}
          </h2>
        </div>
        <div className="w-full flex flex-col items-start justify-center mx-5 px-4 py-6 sm:max-w-[480px] bg-[var(--background-darker)] border border-white/10 rounded-[.8rem] lg:px-[1.2vw] lg:py-[1.5vw] lg:w-[20vw] lg:mx-0">
          <h2 className="mb-4 text-xl md:text-6xl font-regular tracking-tight lg:text-[1.1vw]">
            Total apostado
          </h2>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight lg:text-[1.5vw]">
            R$ {gambledTotal}
          </h2>
        </div>
        <div className="w-full flex flex-col items-start justify-center mx-5 px-4 py-6 sm:max-w-[480px] bg-[var(--background-darker)] border border-white/10 rounded-[.8rem] lg:px-[1.2vw] lg:py-[1.5vw] lg:w-[20vw] lg:mx-0">
          <h2 className="mb-4 text-xl md:text-6xl font-regular tracking-tight lg:text-[1.1vw]">
            Lucro / prejuízo total
          </h2>
          {Number(totalProfit) > 0 ? (
            <h2 className="text-[#00ff00] text-4xl md:text-6xl font-bold tracking-tight lg:text-[1.5vw]">
              R$ {totalProfit.replace(".", ",")}
            </h2>
          ) : (
            <h2 className="text-[#ff0000] text-4xl md:text-6xl font-bold tracking-tight lg:text-[1.5vw]">
              R$ {totalProfit.replace(".", ",")}
            </h2>
          )}
        </div>
        <div className="w-full flex flex-col items-start justify-center mx-5 px-4 py-6 sm:max-w-[480px] bg-[var(--background-darker)] border border-white/10 rounded-[.8rem] lg:px-[1.2vw] lg:py-[1.5vw] lg:w-[20vw] lg:mx-0">
          <h2 className="mb-4 text-xl md:text-6xl font-regular tracking-tight lg:text-[1.1vw]">
            % de vitórias
          </h2>
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight lg:text-[1.5vw]">
            {percentVictory}%
          </h2>
        </div>
      </div>

      <h1 className="mt-4 text-2xl md:text-6xl font-bold tracking-tight lg:text-[1.3vw] lg:mt-[2.5vw]">
        Apostas recentes
      </h1>
      <div className="border border-white/10 rounded-[.8rem] lg:p-[1.2vw] hidden lg:flex lg:mt-[1vw]">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-white/15">
              <TableHead className="text-[.95rem] pb-2 font-bold lg:text-[.95vw]">
                Evento
              </TableHead>
              <TableHead className="text-[.95rem] pb-2 font-bold lg:text-[.95vw] text-center">
                Categoria
              </TableHead>
              <TableHead className="text-[.95rem] pb-2 font-bold lg:text-[.95vw] text-center ">
                Valor da aposta
              </TableHead>
              <TableHead className="text-[.95rem] pb-2 font-bold lg:text-[.95vw] text-center">
                Odd
              </TableHead>
              <TableHead className="text-[.95rem] pb-2 font-bold lg:text-[.95vw] text-center">
                Resultado
              </TableHead>
              <TableHead className="text-[.95rem] pb-2 font-bold lg:text-[.95vw] text-center">
                Lucro
              </TableHead>
              <TableHead className="text-[.95rem] pb-2 font-bold lg:text-[.95vw] text-center">
                Data
              </TableHead>
              <TableHead className="text-[.95rem] pb-2 font-bold lg:text-[.95vw] text-right">
                Editar
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bets.slice(0, 10).map((bet, idx) => (
              <TableRow key={idx} className="border-b border-white/15">
                <TableCell>{bet.event}</TableCell>
                <TableCell className="text-center">{bet.category}</TableCell>
                <TableCell className="text-center">{bet.betValue}</TableCell>
                <TableCell className="text-center">{bet.odd}</TableCell>
                {bet.result === "Pendente" && (
                  <>
                    <TableCell className="text-center">{bet.result}</TableCell>
                  </>
                )}
                {bet.result === "Ganha" && (
                  <>
                    <TableCell className="text-center text-[#00ff00]">
                      {bet.result}
                    </TableCell>
                  </>
                )}
                {bet.result === "Perdida" && (
                  <>
                    <TableCell className="text-center text-[#ff0000]">
                      {bet.result}
                    </TableCell>
                  </>
                )}
                {bet.result === "Anulada" && (
                  <>
                    <TableCell className="text-center">{bet.result}</TableCell>
                  </>
                )}

                {bet.profit && bet.profit.includes("-") && (
                  <>
                    <TableCell className="text-center text-[#ff0000]">
                      {bet.profit.replace(".", ",")}
                    </TableCell>
                  </>
                )}

                {bet.profit > 0 && (
                  <>
                    <TableCell className="text-center text-[#00ff00]">
                      {bet.profit.replace(".", ",")}
                    </TableCell>
                  </>
                )}

                {bet.profit == 0 && (
                  <>
                    <TableCell className="text-center text-[var(--main-text)]">
                      {bet.profit.replace(".", ",")}
                    </TableCell>
                  </>
                )}

                <TableCell className="text-center">
                  {new Date(bet.createdAt).toLocaleDateString("pt-BR")}
                </TableCell>

                <TableCell className="flex items-center justify-end">
                  <Button className="cursor-pointer transition-all duration-[.3s] ease-in-out scale-100 hover:scale-115">
                    <Edit size={25} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
