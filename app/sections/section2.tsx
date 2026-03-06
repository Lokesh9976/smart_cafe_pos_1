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
};

const TABLES: TableItem[] = [
  { id: "1", label: "36" },
  { id: "2", label: "37" },
  { id: "3", label: "38" },
  { id: "4", label: "39" },
  { id: "5", label: "40" },
  { id: "6", label: "41" },
  { id: "7", label: "42" },
  { id: "8", label: "43" },
  { id: "9", label: "44" },
  { id: "10", label: "45" },
  { id: "11", label: "PU1" },
  { id: "12", label: "PU2" },
  { id: "13", label: "PU3" },
  { id: "14", label: "PU4" },
  { id: "15", label: "PU5" },
  { id: "16", label: "PU6" },
  { id: "17", label: "PU7" },
  { id: "18", label: "PU8" },
  { id: "19", label: "PU9" },
  { id: "20", label: "PU10" },
];

export default function Section2() {

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
      t => t.section === "SECTION_2" && t.tableNo === item.label
    );

    let borderColor = "rgba(255,255,255,0.4)";
    let textColor = "#ffffff";
    let bgColor = "rgba(255,255,255,0.05)";
    let timeText = "";
    let orderText = "";

    if (tableData) {

      const minutes =
        Math.floor((Date.now() - tableData.startTime) / 60000);

      if (minutes >= 30) {

        borderColor = "rgba(255,255,255,0.7)";
        bgColor = "rgba(255,0,0,0.25)";
        textColor = "#ffffff";

      } else if (minutes >= 15) {

        borderColor = "rgba(255,255,255,0.7)";
        bgColor = "rgba(255,165,0,0.25)";
        textColor = "#ffffff";

      } else {

        borderColor = "rgba(255,255,255,0.7)";
        bgColor = "rgba(0,255,0,0.25)";
        textColor = "#ffffff";
      }

      const time = new Date(tableData.startTime);

      const hours = time.getHours().toString().padStart(2,"0");
      const mins = time.getMinutes().toString().padStart(2,"0");

      timeText = `${hours}:${mins}`;
      orderText = `#${tableData.orderId}`;
    }

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
            section: "SECTION_2",
            tableNo: item.label,
          });

          router.replace("/menu/thai_kitchen");
        }}
      >

        <BlurView intensity={70} tint="dark" style={styles.glassInner}>

          <View style={styles.tableContent}>

            <Text
              style={[
                styles.tableNumber,
                { fontSize: numberFont, color: textColor }
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

          </View>

        </BlurView>

      </TouchableOpacity>
    );
  };

  return (
    <ImageBackground
      source={require("../../assets/images/11.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <View style={styles.topBar}>
        <View style={{ width: 60 }} />

        <Text style={styles.headerTitle}>SECTION 2</Text>

        <Pressable
          onPress={() => router.push("/(tabs)/category")}
          style={styles.backBtn}
        >
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
    backgroundColor: "rgba(5,5,8,0.75)",
  },

  topBar: {
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    backgroundColor: "rgba(10,10,15,0.95)",

    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,215,0,0.25)",

    shadowColor: "#000",
    shadowOpacity: 0.6,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },

  backBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,

    backgroundColor: "rgba(255,215,0,0.15)",
    borderWidth: 1,
    borderColor: "rgba(255,215,0,0.5)",
  },

  backText: {
    color: "#FFD700",
    fontWeight: "800",
    fontSize: 14,
  },

  headerTitle: {
    color: "#FFD700",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: 1.5,

    textShadowColor: "rgba(255,215,0,0.6)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },

  tableBox: {
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "rgba(255,215,0,0.35)",

    backgroundColor: "rgba(20,20,30,0.6)",

    shadowColor: "#FFD700",
    shadowOpacity: 0.3,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 8 },

    elevation: 10,
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
  },

  smallText: {
    lineHeight: 15,
    fontWeight: "600",
    color: "#f0f0f0",
    opacity: 0.95,
  },
});