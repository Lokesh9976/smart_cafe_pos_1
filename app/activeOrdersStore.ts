import { CartItem, addToCartGlobal, clearCart } from "./cartStore";
import { OrderContext } from "./orderContextStore";

/* ================= TYPES ================= */

export type OrderItem = CartItem & {
  status: "NEW" | "SENT";
};

export type ActiveOrder = {
  orderId: string;
  context: OrderContext;
  items: OrderItem[];
  createdAt: number;
};

/* ================= STORE ================= */

let activeOrders: ActiveOrder[] = [];

/* ================= GET ALL ================= */

export const getActiveOrders = () => activeOrders;

/* ================= FIND ORDER ================= */

export const findActiveOrder = (context: OrderContext) => {
  return activeOrders.find((o) => {
    if (context.orderType === "DINE_IN") {
      return (
        o.context.orderType === "DINE_IN" &&
        o.context.section === context.section &&
        o.context.tableNo === context.tableNo
      );
    }

    if (context.orderType === "TAKEAWAY") {
      return (
        o.context.orderType === "TAKEAWAY" &&
        o.context.takeawayNo === context.takeawayNo
      );
    }

    return false;
  });
};

/* ================= CREATE ORDER ================= */

export const createActiveOrder = (
  orderId: string,
  context: OrderContext,
  cart: CartItem[],
) => {
  const items: OrderItem[] = cart.map((i) => ({
    ...JSON.parse(JSON.stringify(i)),
    status: "NEW",
  }));

  const order: ActiveOrder = {
    orderId,
    context,
    items,
    createdAt: Date.now(),
  };

  activeOrders.push(order);
};

/* ================= ADD ITEMS ================= */

export const addItemsToActiveOrder = (
  order: ActiveOrder,
  items: CartItem[],
) => {
  items.forEach((item) => {
    const existing = order.items.find(
      (i) =>
        i.id === item.id &&
        i.spicy === item.spicy &&
        i.oil === item.oil &&
        i.salt === item.salt &&
        i.sugar === item.sugar &&
        i.note === item.note &&
        i.status === "NEW",
    );

    if (!existing) {
      order.items.push({
        ...item,
        status: "NEW",
      });
    }
  });
};

/* ================= MARK SENT ================= */

export const markItemsSent = (order: ActiveOrder) => {
  order.items.forEach((i) => {
    if (i.status === "NEW") {
      i.status = "SENT";
    }
  });
};

/* ================= CLOSE ORDER ================= */

export const closeActiveOrder = (orderId: string) => {
  activeOrders = activeOrders.filter((o) => o.orderId !== orderId);
};

/* ================= LOAD ORDER TO CART ================= */

export const loadActiveOrderToCart = (orderId: string) => {
  const order = activeOrders.find((o) => o.orderId === orderId);

  if (!order) return;

  clearCart();

  order.items.forEach((item) => {
    for (let i = 0; i < item.qty; i++) {
      addToCartGlobal({
        id: item.id,
        name: item.name,
        price: item.price,
        spicy: item.spicy,
        oil: item.oil,
        salt: item.salt,
        sugar: item.sugar,
        note: item.note,
      });
    }
  });
};
