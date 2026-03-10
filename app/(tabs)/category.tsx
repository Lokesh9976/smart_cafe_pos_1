import { BlurView } from "expo-blur";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View
} from "react-native";

import { clearCart } from "../cartStore";
import { getHeldOrders, HeldOrder } from "../heldOrdersStore";
import { setOrderContext } from "../orderContextStore";
import { getTables } from "../tableStatusStore";

// Type definitions
type TableItem = {
  id: string;
  label: string;
};

// Data Generation
const DINE_IN_TABLES: TableItem[] = [
  ...Array.from({ length: 35 }, (_, i) => ({
    id: `${i + 1}`,
    label: `${i + 1}`,
  })),
  { id: "36", label: "18-A" },
  { id: "37", label: "19-A" },
  { id: "38", label: "20-A" },
  { id: "39", label: "21-A" },
  { id: "40", label: "22-A" },
];

const TAKEAWAY_TABLES: TableItem[] = [
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `T${i + 1}`,
    label: `T${i + 1}`,
  })),
  ...Array.from({ length: 20 }, (_, i) => ({
    id: `D${i + 1}`,
    label: `D${i + 1}`,
  })),
];

const SECTIONS = ["SECTION_1", "SECTION_2", "SECTION_3", "TAKEAWAY"];

export default function Category() {
  const { width } = useWindowDimensions();
  const router = useRouter();

  const { section: urlSection } = useLocalSearchParams<{ section?: string }>();
  
  const [activeTab, setActiveTab] = useState<string>("SECTION_1");
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    if (urlSection && SECTIONS.includes(urlSection)) {
      setActiveTab(urlSection);
    }
  }, [urlSection]);

  // Force re-render for timers
  useEffect(() => {
    const timer = setInterval(() => {
      forceUpdate((v) => v + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Responsive Grid Calculations
  // Phone: 3-4, Tablet: 5-6, POS Terminal: 8-12
  const numColumns = width > 1200 ? 10 : width > 800 ? 8 : width > 600 ? 5 : 3;

  const GAP = 12;
  const SCREEN_PADDING = 20;
  const itemSize =
    (width - SCREEN_PADDING * 2 - GAP * (numColumns - 1)) / numColumns;

  // Responsive Fonts
  const numberFont = Math.max(14, Math.min(18, itemSize * 0.22));
  const smallFont = Math.max(12, Math.min(16, itemSize * 0.2));

  // Determine current active table list
  const currentTables =
    activeTab === "TAKEAWAY" ? TAKEAWAY_TABLES : DINE_IN_TABLES;

  const renderItem = ({ item }: { item: TableItem }) => {
    const tables = getTables();

    // Check if table or takeaway number is occupied
    const tableData = tables.find(
      (t) => t.section === activeTab && t.tableNo === item.label
    );

    let borderColor = "rgba(255,255,255,0.2)";
    let bgColor = "rgba(255,255,255,0.05)";
    let tableNoColor = "#ffffff";
    let timeText = "";
    let orderText = "";

    if (tableData) {
      const minutes = Math.floor((Date.now() - tableData.startTime) / 60000);

      // Card Background and Number Colors mapping elapsed time
      if (minutes >= 30) {
        bgColor = "rgba(220, 38, 38, 0.3)";
        tableNoColor = "#fca5a5";
        borderColor = "rgba(248, 113, 113, 0.8)";
      } else if (minutes >= 15) {
        bgColor = "rgba(217, 119, 6, 0.3)";
        tableNoColor = "#fcd34d";
        borderColor = "rgba(251, 191, 36, 0.8)";
      } else {
        bgColor = "rgba(22, 163, 74, 0.3)";
        tableNoColor = "#86efac";
        borderColor = "rgba(74, 222, 128, 0.8)";
      }

      const time = new Date(tableData.startTime);
      const hours = time.getHours().toString().padStart(2, "0");
      const mins = time.getMinutes().toString().padStart(2, "0");

      timeText = `${hours}:${mins}`;
      orderText = `#${tableData.orderId}`;
    } else {
      const heldOrders = getHeldOrders();
      const isHeld = heldOrders.some((h: HeldOrder) => {
        if (activeTab === "TAKEAWAY") {
          return h.context?.orderType === "TAKEAWAY" && h.context.takeawayNo === item.label;
        }
        return (
          h.context?.orderType === "DINE_IN" &&
          h.context.section === activeTab &&
          h.context.tableNo === item.label
        );
      });

      if (isHeld) {
        bgColor = "rgba(202, 138, 4, 0.3)"; // Dark yellow / Gold
        tableNoColor = "#fde047";
        borderColor = "rgba(234, 179, 8, 0.8)";
        timeText = "Held";
      }
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
          if (activeTab === "TAKEAWAY") {
            setOrderContext({
              orderType: "TAKEAWAY",
              takeawayNo: item.label,
            });
          } else {
            setOrderContext({
              orderType: "DINE_IN",
              section: activeTab,
              tableNo: item.label,
            });
          }
          clearCart();
          router.push("/menu/thai_kitchen");
        }}
      >
        <BlurView intensity={40} tint="dark" style={styles.glassInner}>
          <View style={styles.tableContent}>
            <Text
              style={[
                styles.tableNumber,
                { fontSize: numberFont, color: tableNoColor },
              ]}
              numberOfLines={1}
            >
              {item.label}
            </Text>

            {tableData && (
              <>
                <Text style={[styles.timeText, { fontSize: smallFont }]}>
                  {timeText}
                </Text>

                <Text style={[styles.orderText, { fontSize: smallFont }]}>
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

      {/* HORIZONTAL NAVIGATION BAR */}
      <BlurView intensity={40} tint="dark" style={styles.topNavContainer}>
        <View style={styles.tabsWrapper}>
          {SECTIONS.map((section) => {
            const isActive = activeTab === section;
            let displayName = section.replace("_", " ");
            
            // Abbreviate "SECTION" to "S" and "TAKEAWAY" to "T/A" on narrow mobile views
            if (width < 600) {
              if (section.startsWith("SECTION_")) {
                displayName = section.replace("SECTION_", "S-");
              } else if (section === "TAKEAWAY") {
                displayName = "T/A";
              }
            }

            return (
              <TouchableOpacity
                key={section}
                onPress={() => setActiveTab(section)}
                style={[styles.tabBtn, isActive && styles.activeTabBtn, width < 600 && styles.tabBtnNarrow]}
              >
                <Text
                  style={[
                    styles.tabText,
                    isActive && styles.activeTabText,
                    width < 600 && styles.tabTextNarrow,
                  ]}
                >
                  {displayName}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={styles.navRightGroup}>
          <TouchableOpacity
            style={styles.headerActionBtn}
            onPress={() => router.push("/TimeEntry")}
          >
            <Text style={styles.headerActionText}>Time Entry</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.headerActionBtn, styles.logoutBtn]}
            onPress={() => router.replace("/")}
          >
            <Text style={styles.headerActionText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </BlurView>

      {/* TABLE GRID */}
      <FlatList
        data={currentTables}
        key={numColumns} // Force re-render grid on split change
        numColumns={numColumns}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        columnWrapperStyle={{ gap: GAP }}
        contentContainerStyle={{
          gap: GAP,
          padding: SCREEN_PADDING,
          paddingBottom: 40,
        }}
        showsVerticalScrollIndicator={false}
      />
    </ImageBackground>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },

  /* TOP NAVIGATION */
  topNavContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: width < 600 ? 10 : 20,
    paddingVertical: width < 600 ? 8 : 12,
    zIndex: 10,
    overflow: "hidden",
  },

  tabsWrapper: {
    flexDirection: "row",
    gap: width < 600 ? 6 : 12,
    flexWrap: "wrap",
    flex: 1,
  },

  tabBtn: {
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
  },

  activeTabBtn: {
    backgroundColor: "rgba(215, 255, 154, 0.2)",
    borderColor: "#d7ff9a",
  },

  tabText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  
  tabBtnNarrow: {
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  
  tabTextNarrow: {
    fontSize: 14,
  },

  activeTabText: {
    color: "#d7ff9a",
    fontWeight: "900",
  },

  navRightGroup: {
    flexDirection: "row",
    gap: width < 600 ? 6 : 12,
    marginLeft: width < 600 ? 10 : 20,
  },

  headerActionBtn: {
    paddingHorizontal: width < 600 ? 10 : 16,
    paddingVertical: width < 600 ? 8 : 12,
    borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.15)",
  },

  logoutBtn: {
    backgroundColor: "rgba(239, 68, 68, 0.3)",
    borderColor: "rgba(239, 68, 68, 0.6)",
    borderWidth: 1,
  },

  headerActionText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 14,
  },

  /* GRID CARDS */
  tableBox: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1.5,
  },

  glassInner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
  },

  tableContent: {
    alignItems: "center",
  },

  tableNumber: {
    fontWeight: "800",
    marginBottom: 4,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    textAlign: "center",
  },

  timeText: {
    color: "#fff",
    fontWeight: "700",
    marginBottom: 2,
    opacity: 0.9,
  },

  orderText: {
    color: "#d7ff9a",
    fontWeight: "800",
    opacity: 0.9,
  },
});
