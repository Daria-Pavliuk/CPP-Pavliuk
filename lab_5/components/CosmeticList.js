import { FlatList, StyleSheet, Text, View } from "react-native";
// Обов'язково імпортуємо адаптований елемент списку
import CosmeticItem from "./CosmeticItem";

export default function CosmeticList({ cosmetics, onToggle, onDelete }) {
    return (
        <View style={styles.card}>
            <Text style={styles.sectionTitle}>Каталог товарів</Text>

            {/* Перевірка на порожній масив[cite: 6] */}
            {cosmetics.length === 0 ? (
                <Text style={styles.emptyText}>Товарів поки немає. Додайте перший!</Text>
            ) : (
                <>
                    <Text style={styles.hint}>
                        Торкніться товару, щоб змінити статус наявності.
                    </Text>
                    <FlatList
                        data={cosmetics} // Передаємо масив товарів[cite: 6]
                        keyExtractor={(item) => item.id} // Унікальний ключ[cite: 6]
                        keyboardShouldPersistTaps="handled" // Взаємодія при відкритій клавіатурі[cite: 6]
                        renderItem={({ item }) => (
                            // Повертаємо власний компонент CosmeticItem[cite: 6]
                            <CosmeticItem item={item} onToggle={onToggle} onDelete={onDelete} />
                        )}
                        showsVerticalScrollIndicator={false} // Приховуємо системну смугу прокрутки (за бажанням)
                    />
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        flex: 1, // Займає весь вільний простір під формою[cite: 6]
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 16,
        shadowColor: "#000000",
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#0f172a",
        marginBottom: 12,
    },
    hint: {
        fontSize: 14,
        color: "#64748b",
        marginBottom: 12,
    },
    emptyText: {
        color: "#64748b",
        fontSize: 16,
        textAlign: "center",
        padding: 10,
        fontStyle: "italic",
    },
});