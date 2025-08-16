"use client";

import { Bar, BarChart, Cell, XAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { BetSchema } from "./bets-stats";

// Config correta para ChartContainer
const chartConfig = {
  profit: {
    label: "Lucro por dia ",
    color: "#00ff00",
  },
} satisfies ChartConfig;

export function DailyProfitChart({ bets }: { bets: BetSchema[] }) {
  const chartData = (bets: BetSchema[]) => {
    const profitsByDay = bets.reduce<Record<string, number>>((acc, bet) => {
      const day = new Date(bet.createdAt).toLocaleDateString("pt-BR");
      acc[day] = (acc[day] || 0) + Number(bet.profit);
      return acc;
    }, {});

    return Object.entries(profitsByDay)
      .map(([day, profit]) => ({ day, profit }))
      .sort(
        (a, b) =>
          new Date(a.day.split("/").reverse().join("-")).getTime() - // transforma dd/mm/yyyy em yyyy-mm-dd
          new Date(b.day.split("/").reverse().join("-")).getTime()
      );
  };

  const data = chartData(bets);

  return (
    <ChartContainer
      config={chartConfig}
      className="min-h-[200px] w-full lg:max-h-[40vh] "
    >
      <BarChart accessibilityLayer data={data}>
        <XAxis
          dataKey="day"
          tickLine={false}
          tickMargin={0}
          axisLine={false}
          tickFormatter={(value) => value}
          className="font-bold"
        />
        <ChartTooltip
          content={
            <ChartTooltipContent className="border-white/10 p-2 rounded-[.5rem]" />
          }
        />
        <ChartLegend
          content={
            <ChartLegendContent className="text-[.9rem] pt-5 rounded-[.8rem] border-t border-white/10" />
          }
        />
        <Bar dataKey="profit" radius={4} fill="#00ff00">
          {data.map((entry, index) => (
            <Cell key={index} fill={entry.profit < 0 ? "#ff0000" : "#00ff00"} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
