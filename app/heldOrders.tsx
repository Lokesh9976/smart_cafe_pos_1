import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";

import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

import { addToCartGlobal, clearCart } from "./cartStore";
import { getHeldOrders, removeHeldOrder } from "./heldOrdersStore";

const getHeldTime = (time: number) => {
  const diff = Date.now() - time;

  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  if (minutes > 0) {
    return `Held ${minutes} min ago`;
  }

  return `Held ${seconds} sec ago`;
};

export default function HeldOrdersScreen() {
  const router = useRouter();
  const [orders, setOrders] = useState(
    [...getHeldOrders()].sort((a, b) => a.time - b.time),
  );

  const refresh = () => {
    const sorted = [...getHeldOrders()].sort((a, b) => a.time - b.time);
    setOrders(sorted);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      refresh();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <Text style={styles.title}>Held Orders</Text>

        <View style={{ width: 60 }} />
      </View>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={{ color: "#fff" }}>No Held Orders</Text>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.header}>Order #{item.orderId}</Text>

            {item.context.orderType === "DINE_IN" && (
              <Text style={styles.subHeader}>
                {item.context.section} | Table {item.context.tableNo}
              </Text>
            )}

            {item.context.orderType === "TAKEAWAY" && (
              <Text style={styles.subHeader}>
                Takeaway {item.context.takeawayNo}
              </Text>
            )}

            <Text style={styles.time}>{getHeldTime(item.time)}</Text>

            {item.cart.map((food, i) => (
              <View key={i} style={{ marginTop: 6 }}>
                <Text style={styles.item}>
                  {food.name} x{food.qty}
                </Text>

                {food.spicy && (
                  <Text style={styles.mod}>Spicy: {food.spicy}</Text>
                )}
                {food.oil && <Text style={styles.mod}>Oil: {food.oil}</Text>}
                {food.salt && <Text style={styles.mod}>Salt: {food.salt}</Text>}
                {food.sugar && (
                  <Text style={styles.mod}>Sugar: {food.sugar}</Text>
                )}
                {food.note && <Text style={styles.mod}>Note: {food.note}</Text>}
              </View>
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
  subHeader: {
    color: "#9ef01a",
    marginBottom: 8,
    fontWeight: "bold",
  },

  mod: {
    color: "#aaa",
    fontSize: 12,
    marginLeft: 10,
  },
  time: {
    color: "#facc15",
    fontSize: 12,
    marginBottom: 6,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  backBtn: {
    backgroundColor: "#333",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },

  backText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
