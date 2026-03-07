import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import React from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

export default function Category() {
  const { width, height } = useWindowDimensions();
  const router = useRouter();

  const isLandscape = width > height;

  const MAX_WIDTH = 520;
  const containerWidth = Math.min(width - 40, MAX_WIDTH);

  const GAP = 14;
  const boxWidth = (containerWidth - GAP) / 2;
  const boxHeight = isLandscape ? boxWidth * 0.8 : boxWidth;

  const categories = ["Section 1", "Section 2", "Section 3", "Take Away"];

  const handlePress = (item: string) => {
    if (item === "Section 1") router.push("/sections/section1");
    if (item === "Section 2") router.push("/sections/section2");
    if (item === "Section 3") router.push("/sections/section3");
    if (item === "Take Away") router.push("/sections/takeaway");
  };

  const handleLogout = () => {
    router.replace("/");
  };

  const handleTimeEntry = () => {
    router.push("/TimeEntry");
  };

  return (
    <ImageBackground
      source={require("../../assets/images/003.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      {/* 🔵 Time Entry Button */}
      <TouchableOpacity style={styles.timeEntryBtn} onPress={handleTimeEntry}>
        <BlurView intensity={40} tint="dark" style={styles.glassBtnInner}>
          <Text style={styles.buttonText}>Time Entry</Text>
        </BlurView>
      </TouchableOpacity>

      {/* 🔴 Logout Button */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <BlurView intensity={40} tint="dark" style={styles.glassBtnInner}>
          <Text style={styles.buttonText}>Logout</Text>
        </BlurView>
      </TouchableOpacity>

      {/* Content */}
      <View style={styles.contentWrapper}>
        {/* Title */}
        <BlurView intensity={50} tint="dark" style={styles.glassTitle}>
          <Text style={styles.titleText}>Choose Your Category</Text>
        </BlurView>

        <View style={[styles.gridContainer, { width: containerWidth }]}>
          {categories.map((item) => (
            <TouchableOpacity
              key={item}
              style={[styles.box, { width: boxWidth, height: boxHeight }]}
              activeOpacity={0.85}
              onPress={() => handlePress(item)}
            >
              <BlurView intensity={55} tint="dark" style={styles.glassBoxInner}>
                <Text style={styles.boxText}>{item}</Text>
              </BlurView>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },

  contentWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.25)",
  },

  /* Title Glass */
  glassTitle: {
    marginBottom: 20,
    borderRadius: 14,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
  },

  titleText: {
    fontSize: 22,
    color: "#e5ff9a",
    fontWeight: "800",
    paddingHorizontal: 16,
    paddingVertical: 10,
    textAlign: "center",
  },

  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  /* Category Box */
 box: {
  borderRadius: 20,
  overflow: "hidden",
  marginBottom: 14,
  borderWidth: 1,
  borderColor: "rgba(255,255,255,0.35)",
  backgroundColor: "rgba(255,255,255,0.05)", // transparent glass
},

  glassBoxInner: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

    boxText: {
      color: "#ffffff",
      fontSize: 24,
      fontWeight: "900",
      letterSpacing: 0.6,
    },

  /* Logout Button */
  logoutBtn: {
    position: "absolute",
    top: 50,
    right: 20,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    zIndex: 10,
  },

  /* Time Entry Button */
  timeEntryBtn: {
    position: "absolute",
    top: 50,
    right: 120,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.3)",
    zIndex: 10,
  },

  glassBtnInner: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },

  buttonText: {
    color: "#ffffff",
    fontWeight: "800",
    fontSize: 14,
  },
});

