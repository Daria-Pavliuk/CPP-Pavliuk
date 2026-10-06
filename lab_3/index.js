import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { typeDefs } from "./schema.js";
import { resolvers } from "./resolvers.js";
import { getUserFromAuthHeader } from "./auth.js";

//  Створюємо екземпляр Apollo Server, передаючи йому нашу схему та резолвери
const server = new ApolloServer({ typeDefs, resolvers });

//  Запускаємо сервер на порту 4001
const { url } = await startStandaloneServer(server, {
    listen: { port: 4001 },

    //  Формуємо context для КОЖНОГО GraphQL-запиту.
    // Завдяки цьому в resolvers.js ми можемо читати `context.user`
    context: async ({ req }) => {
        const authHeader = req.headers.authorization || "";
        const user = getUserFromAuthHeader(authHeader);

        // Повертаємо об'єкт з поточним користувачем (якщо токен валідний) або null
        return { user };
    },
});

//  Виводимо повідомлення про успішний запуск
console.log(`GraphQL API запущено за адресою: ${url}`);