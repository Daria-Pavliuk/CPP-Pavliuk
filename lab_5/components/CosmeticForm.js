import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function CosmeticForm({ onAdd }) {
    // Створюємо два локальних стани для двох полів[cite: 8]
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");

    function handleAdd() {
        // Передаємо обидва значення у функцію додавання
        const added = onAdd(name, price);

        // Якщо товар успішно додано, очищаємо обидва поля[cite: 6]
        if (added) {
            setName("");
            setPrice("");
        }
    }

    return (
        <View style={styles.card}>
            <Text style={styles.sectionTitle}>Додати засіб</Text>

            {/* Поле для назви товару */}
            <TextInput
                style={styles.input}
                placeholder="Назва засобу (напр. Туш для вій)"
                value={name}
                onChangeText={setName} // Оновлює стан назви[cite: 6]
                returnKeyType="next"
            />

            {/* Поле для ціни */}
            <TextInput
                style={styles.input}
                placeholder="Ціна (грн)"
                value={price}
                onChangeText={setPrice} // Оновлює стан ціни[cite: 6]
                keyboardType="numeric" // Цифрова клавіатура для суми[cite: 8]
                onSubmitEditing={handleAdd} // Викликає додавання по натисканню Done[cite: 6]
                returnKeyType="done"
            />

            <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
                <Text style={styles.addButtonText}>Додати до каталогу</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4, // Тінь для Android[cite: 6]
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#0f172a",
        marginBottom: 12,
    },
    input: {
        borderWidth: 1,
        borderColor: "#cbd5e1",
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
        marginBottom: 12,
        backgroundColor: "#f8fafc",
    },
    addButton: {
        backgroundColor: "#be185d", // Змінено на бордово-рожевий колір під тематику косметики
        padding: 14,
        borderRadius: 10,
        alignItems: "center", // Вирівнювання тексту по центру[cite: 6]
    },
    addButtonText: {
        color: "#ffffff",
        fontSize: 16,
        fontWeight: "bold", // Білий жирний текст[cite: 6]
    },
});