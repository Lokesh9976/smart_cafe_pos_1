import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";

import {
  Dimensions,
  FlatList,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import {
  addToCartGlobal,
  clearCart,
  getCart,
  removeFromCartGlobal,
  subscribeCart,
} from "./cartStore";

import { holdOrder } from "./heldOrdersStore";
import { getNextOrderId } from "./orderIdStore";
import { setTableActive, setTableHold } from "./tableStatusStore";

import {
  addItemsToActiveOrder,
  createActiveOrder,
  findActiveOrder,
  markItemsSent,
} from "./activeOrdersStore";

import { getOrderContext } from "./orderContextStore";

export default function CartScreen() {
  const router = useRouter();
  const orderContext = getOrderContext();

  const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

  const [cart, setCart] = useState(getCart());

  useEffect(() => {
    const unsub = subscribeCart(() => {
      setCart([...getCart()]);
    });

    return unsub;
  }, []);

  const activeOrder = orderContext ? findActiveOrder(orderContext) : undefined;

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      return sum + (item.price || 0) * item.qty;
    }, 0);
  }, [cart]);

  if (!orderContext) {
    router.replace("/(tabs)/category");
    return null;
  }

  /* ================= SEND ORDER ================= */

  const sendOrder = () => {
    const cartItems = getCart();
    const context = orderContext;

    if (!context || cartItems.length === 0) return;

    let order = findActiveOrder(context);

    if (!order) {
      const orderId = getNextOrderId();
      createActiveOrder(orderId, context, cartItems);
      order = findActiveOrder(context);
    } else {
      addItemsToActiveOrder(order, cartItems);
    }

    markItemsSent(order!);

    /* mark table active */

    if (context.orderType === "DINE_IN") {
      setTableActive(context.section!, context.tableNo!, order!.orderId);
    }

    clearCart();

    router.replace("/(tabs)/category");
  };

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require("../assets/images/11.jpg")}
        style={{ width: SCREEN_W, height: SCREEN_H }}
        resizeMode="cover"
      >
        <View style={styles.overlay}>
          {/* TOP BAR */}

          <View style={styles.topBar}>
            <Pressable
              style={styles.holdListBtn}
              onPress={() => router.push("/heldOrders")}
            >
              <Text style={styles.holdText}>Held Orders</Text>
            </Pressable>

            <View style={styles.topRightGroup}>
              <Pressable style={styles.back} onPress={() => router.back()}>
                <Text style={styles.topBtnText}>Back</Text>
              </Pressable>

              <Pressable style={styles.clear} onPress={() => clearCart()}>
                <Text style={styles.topBtnText}>Clear Cart</Text>
              </Pressable>
            </View>
          </View>

          {/* ORDER HEADER */}

          {orderContext.orderType === "DINE_IN" && (
            <Text style={styles.contextText}>
              DINE-IN | {orderContext.section} | Table {orderContext.tableNo}
            </Text>
          )}

          {orderContext.orderType === "TAKEAWAY" && (
            <Text style={styles.contextText}>
              TAKEAWAY | Order {orderContext.takeawayNo}
            </Text>
          )}

          <Text style={styles.title}>YOUR CART</Text>

          {/* CART ITEMS */}

          <FlatList
            data={cart}
            keyExtractor={(i, index) => i.id + index}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={
              <Text style={styles.emptyText}>Cart Empty</Text>
            }
            renderItem={({ item }) => {
              const orderItem = activeOrder?.items.find(
                (i) =>
                  i.id === item.id &&
                  i.spicy === item.spicy &&
                  i.oil === item.oil &&
                  i.salt === item.salt &&
                  i.sugar === item.sugar &&
                  i.note === item.note,
              );

              return (
                <View style={styles.row}>
                  <View style={styles.itemInfo}>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <Text style={styles.name}>{item.name}</Text>

                      {orderItem?.status === "SENT" && (
                        <Text style={styles.sentBadge}> ✓ SENT</Text>
                      )}

                      {!orderItem && (
                        <Text style={styles.newBadge}> ● NEW</Text>
                      )}
                    </View>

                    <Text style={styles.qty}>Qty: {item.qty}</Text>

                    <Text style={styles.price}>
                      SGD {(item.price || 0).toFixed(2)}
                    </Text>
                  </View>

                  <View style={styles.actionRow}>
                    <Pressable
                      style={styles.plus}
                      onPress={() => addToCartGlobal(item)}
                    >
                      <Text style={styles.btnText}>+</Text>
                    </Pressable>

                    <Pressable
                      style={styles.minus}
                      onPress={() => removeFromCartGlobal(item.id)}
                    >
                      <Text style={styles.btnText}>−</Text>
                    </Pressable>
                  </View>
                </View>
              );
            }}
          />

          <View style={styles.divider} />

          {/* SUBTOTAL */}

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>SGD {subtotal.toFixed(2)}</Text>
          </View>

          <View style={styles.divider} />

          {/* ACTION BUTTONS */}

          <View style={styles.bottomButtons}>
            <Pressable
              style={styles.holdBtn}
              onPress={() => {
                const orderId = getNextOrderId();

                holdOrder(orderId, cart, orderContext);

                if (orderContext.orderType === "DINE_IN") {
                  setTableHold(
                    orderContext.section!,
                    orderContext.tableNo!,
                    orderId,
                  );
                }

                clearCart();

                router.replace("/(tabs)/category");
              }}
            >
              <Text style={styles.holdText}>Hold Order</Text>
            </Pressable>

            <Pressable style={styles.sendBtn} onPress={sendOrder}>
              <Text style={styles.sendText}>Send Order</Text>
            </Pressable>

            <Pressable
              style={styles.billBtn}
              onPress={() => router.push("/summary")}
            >
              <Text style={styles.billText}>Proceed to Bill</Text>
            </Pressable>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 20,
  },

  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  topRightGroup: {
    flexDirection: "row",
    gap: 10,
  },

  back: {
    backgroundColor: "rgba(255,255,255,0.3)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },

  clear: {
    backgroundColor: "#ef4444",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },

  topBtnText: {
    color: "#fff",
    fontWeight: "700",
  },

  holdListBtn: {
    backgroundColor: "#f59e0b",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },

  holdText: {
    color: "#000",
    fontWeight: "900",
  },

  contextText: {
    color: "#9ef01a",
    marginTop: 10,
    fontWeight: "800",
  },

  title: {
    color: "#9ef01a",
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 15,
  },

  emptyText: {
    color: "#fff",
    textAlign: "center",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.9)",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
  },

  itemInfo: {
    flex: 1,
  },

  name: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },

  qty: {
    color: "#9ef01a",
    marginTop: 5,
  },

  price: {
    color: "#fff",
    marginTop: 4,
    fontWeight: "900",
  },

  actionRow: {
    flexDirection: "row",
    gap: 10,
  },

  plus: {
    backgroundColor: "#22c55e",
    width: 45,
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  minus: {
    backgroundColor: "#ef4444",
    width: 45,
    height: 45,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.2)",
    marginVertical: 15,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  summaryLabel: {
    color: "#fff",
    fontWeight: "700",
  },

  summaryValue: {
    color: "#9ef01a",
    fontWeight: "900",
  },

  bottomButtons: {
    flexDirection: "row",
    gap: 12,
  },

  holdBtn: {
    flex: 1,
    backgroundColor: "#f59e0b",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  sendBtn: {
    flex: 1,
    backgroundColor: "#22c55e",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  billBtn: {
    flex: 1,
    backgroundColor: "#3b82f6",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  sendText: {
    color: "#052b12",
    fontWeight: "900",
  },

  billText: {
    color: "#fff",
    fontWeight: "900",
  },

  sentBadge: {
    color: "#22c55e",
    marginLeft: 8,
    fontWeight: "bold",
  },

  newBadge: {
    color: "#facc15",
    marginLeft: 8,
    fontWeight: "bold",
  },
});
