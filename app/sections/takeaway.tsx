import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import React from "react";
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

type TableItem = {
  id: string;
  label: string;
};

const TABLES: TableItem[] = [
  { id: "1", label: "T1" },
  { id: "2", label: "T2" },
  { id: "3", label: "T3" },
  { id: "4", label: "T4" },
  { id: "5", label: "T5" },
  { id: "6", label: "T6" },
  { id: "7", label: "T7" },
  { id: "8", label: "T8" },
  { id: "9", label: "T9" },
  { id: "10", label: "T10" },

  { id: "11", label: "T11" },
  { id: "12", label: "T12" },
  { id: "13", label: "T13" },
  { id: "14", label: "T14" },
  { id: "15", label: "T15" },
  { id: "16", label: "T16" },
  { id: "17", label: "T17" },
  { id: "18", label: "T18" },
  { id: "19", label: "T19" },
  { id: "20", label: "T20" },

  { id: "21", label: "D1" },
  { id: "22", label: "D2" },
  { id: "23", label: "D3" },
  { id: "24", label: "D4" },
  { id: "25", label: "D5" },
  { id: "26", label: "D6" },
  { id: "27", label: "D7" },
  { id: "28", label: "D8" },
  { id: "29", label: "D9" },
  { id: "30", label: "D10" },

  { id: "31", label: "D11" },
  { id: "32", label: "D12" },
  { id: "33", label: "D13" },
  { id: "34", label: "D14" },
  { id: "35", label: "D15" },
  { id: "36", label: "D16" },
  { id: "37", label: "D17" },
  { id: "38", label: "D18" },
  { id: "39", label: "D19" },
  { id: "40", label: "D20" },
];

export default function Takeaway() {

  const { width, height } = useWindowDimensions();
  const router = useRouter();

  const isLandscape = width > height;
  const numColumns = isLandscape ? 10 : 5;

  const GAP = 10;
  const SCREEN_PADDING = 20;

  const itemSize =
    (width - SCREEN_PADDING * 2 - GAP * (numColumns - 1)) / numColumns;

  const numberFont = Math.max(18, Math.min(24, itemSize * 0.32));

  const renderItem = ({ item }: { item: TableItem }) => {

    return (
      <TouchableOpacity
        style={[
          styles.tableBox,
          {
            width: itemSize,
            height: itemSize,
          },
        ]}
        activeOpacity={0.85}
        onPress={() => {

          setOrderContext({
            orderType: "TAKEAWAY",
            takeawayNo: item.label,
          });

          router.replace("/menu/thai_kitchen");

        }}
      >

        <BlurView intensity={70} tint="dark" style={styles.glassInner}>

          <Text
            style={[
              styles.tableNumber,
              { fontSize: numberFont }
            ]}
          >
            {item.label}
          </Text>

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

        <Text style={styles.headerTitle}>TAKEAWAY</Text>

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
  },

  tableNumber: {
    fontWeight: "900",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
});