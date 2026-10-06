import bcrypt from "bcryptjs";
// Імпортуємо масив косметики та функцію генерації її ID з data.js
import { users, cosmetics, getNextUserId, getNextCosmeticId } from "./data.js";
import { createToken } from "./auth.js";

export const resolvers = {
    Query: {
        // Список усіх користувачів
        users() {
            return users;
        },

        // Поточний авторизований користувач
        me(parent, args, context) {
            return context.user;
        },

        // Отримання списку всієї косметики
        cosmetics() {
            return cosmetics;
        },
    },

    Mutation: {
        // Мутація для реєстрації
        async register(parent, args) {
            const { name, email, password } = args;
            const existingUser = users.find((user) => user.email === email);
            if (existingUser) {
                throw new Error("Користувач з таким email вже існує.");
            }

            // Хешуємо пароль
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = {
                id: getNextUserId(),
                name,
                email,
                password: hashedPassword,
            };
            // Зберігаємо користувача в масив
            users.push(newUser);

            // Повертаємо токен та дані користувача
            return { token: createToken(newUser), user: newUser };
        },

        // Мутація для входу
        async login(parent, args) {
            const { email, password } = args;
            const user = users.find((item) => item.email === email);
            if (!user) {
                throw new Error("Користувача з таким email не знайдено.");
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error("Неправильний пароль.");
            }

            return { token: createToken(user), user };
        },

        // Захищена мутація: створення косметики
        createCosmetic(parent, args, context) {
            if (!context.user) {
                throw new Error("Потрібна авторизація.");
            }

            // Створюємо новий запис про косметику
            const cosmetic = {
                id: getNextCosmeticId(),
                name: args.name,
                brand: args.brand,
                price: args.price,
                // Пов'язуємо товар з користувачем, який його створив (дістаємо з context)
                author: context.user,
            };

            // Додаємо в масив
            cosmetics.push(cosmetic);
            return cosmetic;
        },

        // Захищена мутація: видалення косметики
        deleteCosmetic(parent, args, context) {
            if (!context.user) {
                throw new Error("Потрібна авторизація.");
            }

            const index = cosmetics.findIndex((item) => item.id === args.id);
            if (index === -1) return false; // Якщо не знайдено, повертаємо false

            cosmetics.splice(index, 1);
            return true; // Успішно видалено
        },
    },
};