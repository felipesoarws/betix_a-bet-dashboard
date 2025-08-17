"use client";

import { Bar, BarChart, Cell, XAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BetSchema } from "./bets-stats";

const chartConfig = {
  profit: {
    label: "Lucro por dia",
    color: "#00ff00",
  },
} satisfies ChartConfig;

export function DailyProfitChart({ bets }: { bets: BetSchema[] }) {
  const chartData = (bets: BetSchema[]) => {
    const profitsByDay = bets.reduce<Record<string, number>>((acc, bet) => {
      const day = new Date(bet.createdAt).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
      });
      acc[day] = (acc[day] || 0) + Number(bet.profit);
      return acc;
    }, {});

    return Object.entries(profitsByDay)
      .map(([day, profit]) => ({ day, profit }))
      .sort((a, b) => {
        const dateA = new Date(a.day.split("/").reverse().join("-")).getTime();
        const dateB = new Date(b.day.split("/").reverse().join("-")).getTime();
        return dateA - dateB;
      });
  };

  const data = chartData(bets);

  return (
    <ChartContainer
      config={chartConfig}
      className="min-h-[250px] w-full lg:h-[200px]"
    >
      <BarChart accessibilityLayer data={data}>
        <XAxis
          dataKey="day"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          tick={{ fontSize: 12, fill: "red" }}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent className="rounded-[.8rem] border-white/10 p-2" />
          }
        />
        <Bar dataKey="profit" radius={5}>
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.profit < 0 ? "red" : "#00ff00"}
            />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
