import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { getHeldOrders, removeHeldOrder } from "./heldOrdersStore";
import { clearCart, addToCartGlobal } from "./cartStore";

export default function HeldOrdersScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState(getHeldOrders());

  const refresh = () => setOrders([...getHeldOrders()]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Held Orders</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={{ color: "#fff" }}>No Held Orders</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.header}>
              {item.context.orderType === "DINE_IN"
                ? `Table ${item.context.tableNo}`
                : `Takeaway ${item.context.takeawayNo}`}
            </Text>

            {item.cart.map((food, i) => (
              <Text key={i} style={styles.item}>
                {food.name} x{food.qty}
              </Text>
            ))}

            <Pressable
              style={styles.openBtn}
              onPress={() => {
                clearCart();

                item.cart.forEach((food) => {
                  for (let i = 0; i < food.qty; i++) {
                    addToCartGlobal(food);
                  }
                });

                removeHeldOrder(item.id);
                refresh();
                router.push("/cart");
              }}
            >
              <Text style={styles.btnText}>Open Order</Text>
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    padding: 20,
  },

  title: {
    color: "#9ef01a",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "#111",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },

  header: {
    color: "#fff",
    fontWeight: "bold",
    marginBottom: 8,
  },

  item: {
    color: "#ccc",
  },

  openBtn: {
    marginTop: 10,
    backgroundColor: "#22c55e",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },

  btnText: {
    color: "#000",
    fontWeight: "bold",
  },
});