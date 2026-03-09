export type CartItem = {
  id: string;
  name: string;
  price?: number;
  qty: number;

  spicy?: string;
  oil?: string;
  salt?: string;
  sugar?: string;
  note?: string;
};

let cart: CartItem[] = [];

/* listeners */
let listeners: (() => void)[] = [];

const notify = () => {
  listeners.forEach((l) => l());
};

export const subscribeCart = (listener: () => void) => {
  listeners.push(listener);

  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
};

/* GET CART */

export const getCart = (): CartItem[] => cart;

/* ADD ITEM */

export const addToCartGlobal = (item: Omit<CartItem, "qty">) => {
  const existing = cart.find(
    (p) =>
      p.id === item.id &&
      p.spicy === item.spicy &&
      p.oil === item.oil &&
      p.salt === item.salt &&
      p.sugar === item.sugar &&
      p.note === item.note,
  );

  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ ...item, qty: 1 });
  }

  notify();
};

/* REMOVE ITEM */

export const removeFromCartGlobal = (id: string) => {
  const item = cart.find((p) => p.id === id);

  if (!item) return;

  if (item.qty > 1) item.qty -= 1;
  else cart = cart.filter((p) => p !== item);

  notify();
};

/* CLEAR CART */

export const clearCart = () => {
  cart = [];
  notify();
};
