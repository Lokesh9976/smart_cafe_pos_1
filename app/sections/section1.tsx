import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { setOrderContext } from "../orderContextStore";
import { getTables } from "../tableStatusStore";

type TableItem = {
  id: string;
  label: string;
  status?: "busy" | "active" | "free";
  time?: string;
  order?: string;
  amount?: string;
};

const TABLES: TableItem[] = [
  { id: "1", label: "1",},
  { id: "2", label: "2" }, 
  { id: "3", label: "3" },
  { id: "4", label: "4" },
  { id: "5", label: "5" },
  { id: "6", label: "6" },
  { id: "7", label: "7" },
  { id: "8", label: "8" },
  { id: "9", label: "9" },
  { id: "10", label: "10" },
  { id: "11", label: "11" },
  { id: "12", label: "12" },
  { id: "13", label: "13" },
  { id: "14", label: "14" },
  { id: "15", label: "15" },
  { id: "16", label: "16" },
  { id: "17", label: "17" },
  { id: "18", label: "18" },
  { id: "19", label: "19" },
  { id: "20", label: "20" },
  { id: "21", label: "21" },
  { id: "22", label: "22" },
  { id: "23", label: "23" },
  { id: "24", label: "24" },
  { id: "25", label: "25" },
  { id: "26", label: "26" },
  { id: "27", label: "27" },
  { id: "28", label: "28" },
  { id: "29", label: "29" },
  { id: "30", label: "30" },
  { id: "31", label: "31" },
  { id: "32", label: "32" },
  { id: "33", label: "33" },
  { id: "34", label: "34" },
  { id: "35", label: "35" },
  { id: "36", label: "18-A" },
  { id: "37", label: "19-A" },
  { id: "38", label: "20-A" },
  { id: "39", label: "21-A" },
  { id: "40", label: "22-A" },
];

export default function Section1() {
  const [, forceUpdate] = useState(0);

useEffect(() => {
  const timer = setInterval(() => {
    forceUpdate(v => v + 1);
  }, 1000);

  return () => clearInterval(timer);
}, []);

  const { width, height } = useWindowDimensions();
  const router = useRouter();

  const isLandscape = width > height;
  const numColumns = isLandscape ? 10 : 5;

  const GAP = 10;
  const SCREEN_PADDING = 20;

  const itemSize =
    (width - SCREEN_PADDING * 2 - GAP * (numColumns - 1)) / numColumns;

  const numberFont = Math.max(18, Math.min(24, itemSize * 0.32));
  const smallFont = Math.max(10, Math.min(13, itemSize * 0.2));

  const renderItem = ({ item }: { item: TableItem }) => {
    const tables = getTables();

const tableData = tables.find(
  t => t.section === "SECTION_1" && t.tableNo === item.label
);

let borderColor = "rgba(255, 255, 255, 0.43)";
let textColor = "#ffffff";
let bgColor = "rgba(255,255,255,0.08)";
let timeText = "";
let orderText = "";

if (tableData) {

  const minutes =
    Math.floor((Date.now() - tableData.startTime) / 60000);

  if (minutes >= 30) {

  // 🔴 LATE ORDER
  borderColor = "#ffffff";
  bgColor = "rgba(246,8,8,0.85)";
  textColor = "#ffffff";

} else if (minutes >= 15) {

  // 🟠 WARNING
  borderColor = "#ffffff";
  bgColor = "rgba(255,165,0,0.85)";
  textColor = "#ffffff";

} else {

  // 🟢 NORMAL HOLD
  borderColor = "#ffffff";
  bgColor = "rgba(65,225,16,0.85)";
  textColor = "#ffffff";

}
  const time = new Date(tableData.startTime);

  const hours = time.getHours().toString().padStart(2,"0");
  const mins = time.getMinutes().toString().padStart(2,"0");

  timeText = `${hours}:${mins}`;
  orderText = `#${tableData.orderId}`;

}

    const isActive = item.status === "active";

    return (
      <TouchableOpacity
        style={[
          styles.tableBox,
          {
           width: itemSize,
            height: itemSize,
            borderColor: borderColor,
            backgroundColor: bgColor,
          },
        ]}
        activeOpacity={0.85}
        onPress={() => {
          setOrderContext({
            orderType: "DINE_IN",
            section: "SECTION_1",
            tableNo: item.label,
          });

          router.push("/menu/thai_kitchen");
        }}
      >
        <BlurView
          intensity={isActive ? 45 : 35}
          tint="dark"
          style={styles.glassInner}
        >
          {item.status || tableData ? (
            <View style={styles.tableContent}>
              <Text
                style={[
                  styles.tableNumber,
                  {
                    fontSize: numberFont,
                    color: textColor,
                  },
                ]}
              >
                {item.label}
              </Text>

              {tableData && (
               <>
                    <Text style={[styles.smallText, { fontSize: smallFont }]}>
                      {timeText}
                    </Text>

                    <Text style={[styles.smallText, { fontSize: smallFont }]}>
                      {orderText}
                    </Text>
                  </>
                )}
              {item.order && (
                <Text style={[styles.smallText, { fontSize: smallFont }]}>
                  {item.order}
                </Text>
              )}
              {item.amount && (
                <Text style={[styles.smallText, { fontSize: smallFont }]}>
                  {item.amount}
                </Text>
              )}
            </View>
          ) : (
            <Text
              style={[
                styles.tableNumber,
                { fontSize: numberFont, color: "#ffffff" },
              ]}
            >
              {item.label}
            </Text>
          )}
        </BlurView>
      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground
      source={require("../../assets/images/002.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <View style={styles.topBar}>
        <View style={{ width: 60 }} />

        <Text style={styles.headerTitle}>SECTION 1</Text>

        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>
      </View>

      <FlatList
        data={TABLES}
        key={numColumns}
        numColumns={numColumns}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        columnWrapperStyle={{ gap: GAP }}
        contentContainerStyle={{
          gap: GAP,
          padding: SCREEN_PADDING,
          paddingBottom: 30,
        }}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },

  /* ===== Top Bar ===== */

  topBar: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    backgroundColor: "rgba(0,0,0,0.7)",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.08)",
  },

  backBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.12)",
  },

  backText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },

  headerTitle: {
    color: "#d7ff9a",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: 0.6,
  },

  /* ===== Table Card ===== */

  tableBox: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1.4,
    borderColor: "rgba(255,255,255,0.25)",

    backgroundColor: "rgba(255,255,255,0.07)",

    shadowColor: "#000",
    shadowOpacity: 0.45,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },

    elevation: 8,
  },

  glassInner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 6,
  },

  tableContent: {
    alignItems: "center",
    justifyContent: "center",
  },

  tableNumber: {
    fontWeight: "900",
    marginBottom: 4,
    letterSpacing: 0.5,

    textShadowColor: "rgba(0,0,0,0.7)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
  },

  smallText: {
    lineHeight: 15,
    fontWeight: "600",
    color: "#f0f0f0",
    opacity: 0.95,
  },
});