import { useState } from "react";
import { Alert, Platform, StatusBar, StyleSheet, View } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";

// Імпортуємо ваші власні компоненти
import Header from "./components/Header";
import CosmeticForm from "./components/CosmeticForm";
import CosmeticList from "./components/CosmeticList";

function Store() {
  const insets = useSafeAreaInsets();
  const [cosmetics, setCosmetics] = useState([]); // Стан для масиву товарів

  // Повертає true, якщо товар додано, і false, якщо поля порожні
  function addCosmetic(name, price) {
    const trimmedName = name.trim();
    const trimmedPrice = price.trim();

    if (trimmedName === "" || trimmedPrice === "") {
      Alert.alert("Помилка", "Будь ласка, заповніть всі поля.");
      return false;
    }

    const newCosmetic = {
      id: Date.now().toString(),
      name: trimmedName,
      price: trimmedPrice,
      inStock: true, // За замовчуванням товар у наявності
    };

    setCosmetics((currentCosmetics) => [newCosmetic, ...currentCosmetics]);
    Alert.alert("Успіх", "Засіб успішно додано до каталогу.");
    return true;
  }

  // Змінює статус наявності товару
  function toggleCosmetic(id) {
    setCosmetics((currentCosmetics) =>
        currentCosmetics.map((item) =>
            item.id === id ? { ...item, inStock: !item.inStock } : item
        )
    );
  }

  // Видаляє товар зі списку
  function deleteCosmetic(id) {
    setCosmetics((currentCosmetics) => currentCosmetics.filter((item) => item.id !== id));
    Alert.alert("Видалення", "Засіб видалено з магазину.");
  }

  // Обчислює кількість товарів у наявності
  const inStockCount = cosmetics.filter((item) => item.inStock).length;

  // Відступ зверху: безпечна зона пристрою, але не менше 50 на iOS,
  // щоб заголовок не потрапляв під смугу стану (час, Wi-Fi, батарея)
  const topPadding = Math.max(insets.top, Platform.OS === "ios" ? 50 : 0);

  return (
      <View style={[styles.screen, { paddingTop: topPadding }]}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.container}>
          <Header total={cosmetics.length} inStock={inStockCount} />
          {/* Передаємо функції-обробники та стан у дочірні компоненти */}
          <CosmeticForm onAdd={addCosmetic} />
          <CosmeticList
              cosmetics={cosmetics}
              onToggle={toggleCosmetic}
              onDelete={deleteCosmetic}
          />
        </View>
      </View>
  );
}

export default function App() {
  return (
      <SafeAreaProvider>
        <Store />
      </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fdf4ff", // Світло-рожевий фон для тематики косметики
  },
  container: {
    flex: 1,
    padding: 20,
  },
});