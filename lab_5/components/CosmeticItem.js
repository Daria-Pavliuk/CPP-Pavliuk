import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function CosmeticItem({ item, onToggle, onDelete }) {
    return (
        // Масив стилів: якщо товару немає в наявності, застосовується стиль itemOutStock
        <View style={[styles.item, !item.inStock && styles.itemOutStock]}>
            <TouchableOpacity
                style={styles.textArea}
                onPress={() => onToggle(item.id)} // Зміна статусу наявності[cite: 6]
            >
                <Text style={[styles.text, !item.inStock && styles.textOutStock]}>
                    {item.name}
                </Text>
                <Text style={[styles.priceText, !item.inStock && styles.textOutStock]}>
                    {item.price} грн
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => onDelete(item.id)} // Видалення товару[cite: 6]
            >
                <Text style={styles.deleteButtonText}>Видалити</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    item: {
        flexDirection: "row", // Елементи розташовуються в рядок[cite: 6]
        alignItems: "center",
        gap: 12,
        backgroundColor: "#fce7f3", // Світло-рожевий фон для товарів у наявності
        padding: 12,
        borderRadius: 10,
        marginBottom: 10,
    },
    itemOutStock: {
        backgroundColor: "#e2e8f0", // Сірий фон для товарів не в наявності (замість зеленого)[cite: 6]
    },
    textArea: {
        flex: 1, // Текстова частина займає весь вільний простір рядка[cite: 6]
    },
    text: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#0f172a",
    },
    priceText: {
        fontSize: 14,
        color: "#475569",
        marginTop: 4,
    },
    textOutStock: {
        color: "#64748b",
        textDecorationLine: "line-through", // Закреслення тексту[cite: 6]
    },
    deleteButton: {
        backgroundColor: "#ef4444",
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 8,
    },
    deleteButtonText: {
        color: "#ffffff",
        fontWeight: "bold",
    },
});