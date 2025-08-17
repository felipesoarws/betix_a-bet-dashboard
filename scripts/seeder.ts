import { db } from "@/db";
import { betsTable, user } from "@/db/schema";
import { faker } from "@faker-js/faker";

async function main() {
  const users = await db.select().from(user);

  if (!users.length) {
    console.log("Nenhum usuário encontrado. Cadastre usuários primeiro.");
    return;
  }

  const BET_CATEGORIES = ["Futebol", "Basquete", "eSports", "Outro"];
  const BET_RESULTS = ["Pendente", "Ganha", "Perdida", "Anulada"];

  const bets = Array.from({ length: 900 }).map(() => {
    const randomUser = faker.helpers.arrayElement(users);
    const result = faker.helpers.arrayElement(BET_RESULTS);

    // 💡 3. Lógica de valor da aposta simplificada para uma única linha.
    const betValue = parseFloat(
      faker.finance.amount({ min: 5, max: 200, dec: 2 })
    );

    // 💡 2. Geração de odds mais realista, garantindo que seja sempre maior que 1.
    const odd = faker.number.float({ min: 1.1, max: 15, fractionDigits: 1 });

    // 💡 4. Geração de datas precisamente nos últimos 90 dias.
    const createdAt = faker.date.recent({ days: 90 });

    // Lógica de cálculo do lucro (mantida, pois está correta)
    let profit: number;
    switch (result) {
      case "Ganha":
        profit = betValue * odd - betValue;
        break;
      case "Perdida":
        profit = -betValue;
        break;
      case "Anulada":
      case "Pendente":
      default:
        profit = 0;
        break;
    }

    return {
      userId: randomUser.id,
      event: `${faker.company.name()} vs ${faker.company.name()}`,
      market: faker.helpers.arrayElement([
        "+1.5 Gols",
        "Handicap -1",
        "Total Pontos > 100",
        "Mais/Menos 2.5",
      ]),
      category: faker.helpers.arrayElement(BET_CATEGORIES),
      betValue: betValue.toFixed(2), // Usar toFixed(2) para garantir 2 casas decimais
      odd: odd.toFixed(2),
      result,
      profit: profit.toFixed(2),
      createdAt,
    };
  });

  // 💡 1. Inserção em lote: todas as 100 apostas em uma única chamada ao banco.
  console.log("Inserindo 100 apostas no banco de dados...");
  await db.insert(betsTable).values(bets);

  console.log("✅ Seed finalizado: 100 apostas criadas com sucesso!");
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Erro ao executar o seed:", err);
    process.exit(1);
  });
