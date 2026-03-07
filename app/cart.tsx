import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { holdOrder } from "./heldOrdersStore";
import { setTableHold } from "./tableStatusStore";
import { getNextOrderId } from "./orderIdStore";

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
} from "./cartStore";

import { getOrderContext } from "./orderContextStore";

export default function CartScreen() {
  const router = useRouter();
  const orderContext = getOrderContext();

  const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get("window");

  const [cart, setCart] = useState(getCart());
  const refreshCart = () => setCart([...getCart()]);

  const subtotal = useMemo(() => {
    return cart.reduce((sum, item) => {
      return sum + (item.price || 0) * item.qty;
    }, 0);
  }, [cart]);

  if (!orderContext) {
    router.replace("/(tabs)/category");
    return null;
  }

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

            {/* LEFT SIDE */}
            <Pressable
              style={styles.holdListBtn}
              onPress={() => router.push("/heldOrders" as any)}
            >
              <Text style={styles.holdText}>Held Orders</Text>
            </Pressable>

            {/* RIGHT SIDE */}
            <View style={styles.topRightGroup}>
              <Pressable style={styles.back} onPress={() => router.back()}>
                <Text style={styles.topBtnText}>Back</Text>
              </Pressable>

              <Pressable
                style={styles.clear}
                onPress={() => {
                  clearCart();
                  refreshCart();
                }}
              >
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
            renderItem={({ item }) => (
              <View style={styles.row}>

                <View style={styles.itemInfo}>
                  <Text style={styles.name}>{item.name}</Text>

                  <Text style={styles.qty}>Qty: {item.qty}</Text>

                  <Text style={styles.price}>
                    SGD {(item.price || 0).toFixed(2)}
                  </Text>
                </View>

                <View style={styles.actionRow}>
                  <Pressable
                    style={styles.plus}
                    onPress={() => {
                      addToCartGlobal(item);
                      refreshCart();
                    }}
                  >
                    <Text style={styles.btnText}>+</Text>
                  </Pressable>

                  <Pressable
                    style={styles.minus}
                    onPress={() => {
                      removeFromCartGlobal(item.id);
                      refreshCart();
                    }}
                  >
                    <Text style={styles.btnText}>−</Text>
                  </Pressable>
                </View>

              </View>
            )}
          />

          <View style={styles.divider} />

          {/* SUBTOTAL */}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>
              SGD {subtotal.toFixed(2)}
            </Text>
          </View>

          <View style={styles.divider} />

          {/* HOLD + PROCEED */}
          <View style={styles.bottomButtons}>

            <Pressable
              style={styles.holdBtn}
              onPress={() => {

                const orderId = getNextOrderId();

                holdOrder(cart, orderContext);

                if (orderContext.orderType === "DINE_IN") {
                  setTableHold(
                    orderContext.section!,
                    orderContext.tableNo!,
                    orderId
                  );
                }

                clearCart();
                router.replace("/(tabs)/category");
              }}
            >
              <Text style={styles.holdText}>Hold Order</Text>
            </Pressable>

            <Pressable
              style={styles.proceedBtn}
              onPress={() => router.push("/summary" as any)}
            >
              <Text style={styles.proceedText}>Proceed</Text>
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
    marginBottom: 10,
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

  contextText: {
    color: "#9ef01a",
    marginBottom: 8,
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
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(0,0,0,0.9)",
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 12,
    borderRadius: 14,
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
    marginTop: 6,
    fontWeight: "bold",
  },

  price: {
    color: "#fff",
    fontWeight: "900",
    marginTop: 4,
  },

  actionRow: {
    flexDirection: "row",
    gap: 12,
  },

  plus: {
    backgroundColor: "#22c55e",
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  minus: {
    backgroundColor: "#ef4444",
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  btnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
  },

  holdListBtn: {
    backgroundColor: "#f59e0b",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },

  holdBtn: {
    flex: 1,
    backgroundColor: "#f59e0b",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  holdText: {
    color: "#000",
    fontWeight: "900",
    fontSize: 16,
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
    fontSize: 16,
    fontWeight: "700",
  },

  summaryValue: {
    color: "#9ef01a",
    fontSize: 18,
    fontWeight: "900",
  },

  bottomButtons: {
    flexDirection: "row",
    gap: 12,
  },

  proceedBtn: {
    flex: 1,
    backgroundColor: "#22c55e",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },

  proceedText: {
    color: "#052b12",
    fontWeight: "900",
    fontSize: 16,
  },

});