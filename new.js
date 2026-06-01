import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Alert,
  Animated,
} from "react-native";

const PRODUCTS = [
  {
    id: 1,
    name: "Dark Truffle",
    emoji: "🍫",
    desc: "Rich 72% cacao",
    price: 4.99,
    cat: "Dark",
  },
  {
    id: 2,
    name: "Milk Delight",
    emoji: "🟤",
    desc: "Creamy & smooth",
    price: 3.99,
    cat: "Milk",
  },
  {
    id: 3,
    name: "White Dream",
    emoji: "🤍",
    desc: "Vanilla & honey",
    price: 3.49,
    cat: "White",
  },
  {
    id: 4,
    name: "Hazelnut Bar",
    emoji: "🌰",
    desc: "Crunchy filling",
    price: 5.49,
    cat: "Dark",
  },
  {
    id: 5,
    name: "Caramel Swirl",
    emoji: "🍯",
    desc: "Salted caramel",
    price: 4.49,
    cat: "Milk",
  },
  {
    id: 6,
    name: "Mint Crisp",
    emoji: "🟢",
    desc: "Cool peppermint",
    price: 3.99,
    cat: "Dark",
  },
];

const CATEGORIES = ["All", "Dark", "Milk", "White"];

export default function ChocolateHeaven() {
  const [cart, setCart] = useState({}); // { productId: qty }
  const [activeFilter, setActiveFilter] = useState("All");
  const [view, setView] = useState("shop"); // "shop" | "cart"

  // ── helpers ──────────────────────────────────────────────
  const cartTotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = PRODUCTS.find((x) => x.id === Number(id));
    return sum + (p ? p.price * qty : 0);
  }, 0);

  const cartCount = Object.values(cart).reduce((s, q) => s + q, 0);

  const cartItems = Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => ({
      ...PRODUCTS.find((x) => x.id === Number(id)),
      qty,
    }));

  const filtered =
    activeFilter === "All"
      ? PRODUCTS
      : PRODUCTS.filter((p) => p.cat === activeFilter);

  // ── actions ───────────────────────────────────────────────
  const addToCart = (id) =>
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));

  const changeQty = (id, delta) =>
    setCart((prev) => {
      const next = (prev[id] || 0) + delta;
      if (next <= 0) {
        const { [id]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [id]: next };
    });

  const checkout = () => {
    Alert.alert("Order Placed! 🎉", "Your chocolates are on their way!", [
      {
        text: "Yay!",
        onPress: () => {
          setCart({});
          setView("shop");
        },
      },
    ]);
  };

  // ── sub-components ────────────────────────────────────────
  const ProductCard = ({ item }) => {
    const qty = cart[item.id] || 0;
    return (
      <View style={styles.card}>
        {qty > 0 && (
          <View style={styles.qtyBadge}>
            <Text style={styles.qtyBadgeText}>{qty}</Text>
          </View>
        )}
        <Text style={styles.cardEmoji}>{item.emoji}</Text>
        <Text style={styles.cardName}>{item.name}</Text>
        <Text style={styles.cardDesc}>{item.desc}</Text>
        <View style={styles.cardFooter}>
          <Text style={styles.cardPrice}>${item.price.toFixed(2)}</Text>
          <TouchableOpacity
            style={styles.addBtn}
            onPress={() => addToCart(item.id)}
          >
            <Text style={styles.addBtnText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const CartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Text style={styles.ciEmoji}>{item.emoji}</Text>
      <Text style={styles.ciName}>{item.name}</Text>
      <View style={styles.qtyCtrl}>
        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => changeQty(item.id, -1)}
        >
          <Text style={styles.qtyBtnText}>−</Text>
        </TouchableOpacity>
        <Text style={styles.qtyNum}>{item.qty}</Text>
        <TouchableOpacity
          style={styles.qtyBtn}
          onPress={() => changeQty(item.id, 1)}
        >
          <Text style={styles.qtyBtnText}>+</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.ciPrice}>${(item.price * item.qty).toFixed(2)}</Text>
    </View>
  );

  // ── render ────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>🍫 Chocolate Heaven</Text>
        <TouchableOpacity
          style={styles.cartBtn}
          onPress={() => setView(view === "cart" ? "shop" : "cart")}
        >
          <Text style={styles.cartBtnText}>
            🛍 {cartCount > 0 ? `Cart (${cartCount})` : "Cart"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── SHOP VIEW ── */}
      {view === "shop" && (
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Category filters */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filterRow}
          >
            {CATEGORIES.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.filterBtn,
                  activeFilter === cat && styles.filterBtnActive,
                ]}
                onPress={() => setActiveFilter(cat)}
              >
                <Text
                  style={[
                    styles.filterText,
                    activeFilter === cat && styles.filterTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <Text style={styles.sectionLabel}>Featured</Text>

          {/* Product grid */}
          <View style={styles.grid}>
            {filtered.map((item) => (
              <ProductCard key={item.id} item={item} />
            ))}
          </View>
        </ScrollView>
      )}

      {/* ── CART VIEW ── */}
      {view === "cart" && (
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ padding: 16 }}
        >
          <Text style={styles.sectionLabel}>Your Cart</Text>

          {cartItems.length === 0 ? (
            <View style={styles.emptyCart}>
              <Text style={styles.emptyCartEmoji}>🛍</Text>
              <Text style={styles.emptyCartText}>Your cart is empty</Text>
            </View>
          ) : (
            <View style={styles.cartPanel}>
              {cartItems.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}

              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalAmount}>${cartTotal.toFixed(2)}</Text>
              </View>

              <TouchableOpacity style={styles.checkoutBtn} onPress={checkout}>
                <Text style={styles.checkoutText}>Checkout</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => setView("shop")}
          >
            <Text style={styles.backBtnText}>← Keep Shopping</Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

// ── styles ────────────────────────────────────────────────────
const BROWN = "#4E342E";
const BROWN_LIGHT = "#EFEBE9";
const RED_BADGE = "#E24B4A";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F5" },

  // header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: "#D7CCC8",
  },
  headerTitle: { fontSize: 20, fontWeight: "600", color: BROWN },
  cartBtn: {
    backgroundColor: BROWN,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },
  cartBtnText: { color: BROWN_LIGHT, fontWeight: "600", fontSize: 13 },

  // filters
  filterRow: { paddingHorizontal: 16, paddingVertical: 12 },
  filterBtn: {
    backgroundColor: "#EDE0DA",
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 7,
    marginRight: 8,
  },
  filterBtnActive: { backgroundColor: BROWN },
  filterText: { fontSize: 13, color: BROWN, fontWeight: "500" },
  filterTextActive: { color: BROWN_LIGHT },

  // section label
  sectionLabel: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1,
    color: "#8D6E63",
    textTransform: "uppercase",
    paddingHorizontal: 16,
    marginBottom: 12,
  },

  // product grid
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 10,
    paddingBottom: 32,
  },
  card: {
    width: "47%",
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: "#D7CCC8",
    padding: 14,
    margin: "1.5%",
    position: "relative",
  },
  qtyBadge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: RED_BADGE,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyBadgeText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  cardEmoji: { fontSize: 32, marginBottom: 8 },
  cardName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#3E2723",
    marginBottom: 3,
  },
  cardDesc: {
    fontSize: 12,
    color: "#795548",
    marginBottom: 10,
    lineHeight: 17,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardPrice: { fontSize: 15, fontWeight: "600", color: BROWN },
  addBtn: {
    backgroundColor: BROWN,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnText: { color: "#fff", fontSize: 20, lineHeight: 28 },

  // cart panel
  cartPanel: {
    backgroundColor: "#fff",
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: "#D7CCC8",
    padding: 16,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderBottomColor: "#EDE0DA",
  },
  ciEmoji: { fontSize: 22, marginRight: 10 },
  ciName: { flex: 1, fontSize: 14, fontWeight: "500", color: "#3E2723" },
  qtyCtrl: { flexDirection: "row", alignItems: "center", gap: 8 },
  qtyBtn: {
    backgroundColor: "#EDE0DA",
    borderRadius: 6,
    width: 26,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyBtnText: { fontSize: 16, color: BROWN, fontWeight: "600" },
  qtyNum: {
    fontSize: 14,
    fontWeight: "600",
    minWidth: 18,
    textAlign: "center",
    color: "#3E2723",
  },
  ciPrice: { fontSize: 13, fontWeight: "600", color: BROWN, marginLeft: 10 },

  // totals / checkout
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 0.5,
    borderTopColor: "#D7CCC8",
  },
  totalLabel: { fontSize: 14, color: "#795548" },
  totalAmount: { fontSize: 20, fontWeight: "700", color: "#3E2723" },
  checkoutBtn: {
    backgroundColor: BROWN,
    borderRadius: 12,
    padding: 14,
    alignItems: "center",
    marginTop: 14,
  },
  checkoutText: { color: BROWN_LIGHT, fontSize: 15, fontWeight: "700" },

  // empty / back
  emptyCart: { alignItems: "center", paddingVertical: 48 },
  emptyCartEmoji: { fontSize: 44, marginBottom: 12 },
  emptyCartText: { fontSize: 15, color: "#8D6E63" },
  backBtn: { marginTop: 16, paddingVertical: 8 },
  backBtnText: { fontSize: 14, color: "#8D6E63" },
});
