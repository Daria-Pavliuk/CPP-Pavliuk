import React from 'react';
import { StyleSheet, Text, View } from "react-native";

export default function Header({ total, inStock }) {
    return (
        <View>
            <Text style={styles.title}>GlowBeauty</Text>
            <Text style={styles.stats}>
                Усього товарів: {total} · В наявності: {inStock}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#be185d", // або "#1d4ed8", як у прикладі
        textAlign: "center",
        marginBottom: 8,
    },
    stats: {
        fontSize: 16,
        color: "#475569",
        textAlign: "center",
        marginBottom: 20,
    },
});