import { BlurView } from "expo-blur";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function TimeEntry() {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [staffName, setStaffName] = useState("");
  const [active, setActive] = useState<"user" | "pass" | "staff">("user");

  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const date = time.toLocaleDateString("en-GB");
  const clock = time.toLocaleTimeString("en-GB");

  const keypad = [
    "1",
    "2",
    "3",
    "Bksp",
    "4",
    "5",
    "6",
    "Space",
    "7",
    "8",
    "9",
    "Clear",
    "0",
    "00",
    ".",
    "Ent",
  ];

  const getValue = () => {
    if (active === "user") return userId;
    if (active === "pass") return password;
    return staffName;
  };

  const setValue = (val: string) => {
    if (active === "user") setUserId(val);
    if (active === "pass") setPassword(val);
    if (active === "staff") setStaffName(val);
  };

  const handleKeyPress = (key: string) => {
    let value = getValue();

    if (key === "Bksp") return setValue(value.slice(0, -1));
    if (key === "Clear") return setValue("");
    if (key === "Space") return setValue(value + " ");
    if (key === "Ent") {
      console.log({ userId, password, staffName });
      return;
    }

    setValue(value + key);
  };

  return (
    <ImageBackground
      source={require("../assets/images/11.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {/* HEADER */}
        <BlurView intensity={40} tint="dark" style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.back}>Back</Text>
          </TouchableOpacity>

          <Text style={styles.title}>
            SMART <Text style={{ color: "#e38b29" }}>Café</Text>
          </Text>

          <Text style={styles.time}>
            {date} {clock}
          </Text>
        </BlurView>

        {/* CONTENT */}
        <View style={styles.content}>
          {/* LOGIN */}
          <BlurView intensity={40} tint="dark" style={styles.form}>
            <Text style={styles.label}>User ID</Text>
            <TextInput
              style={styles.input}
              value={userId}
              onChangeText={setUserId}
              onFocus={() => setActive("user")}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              onFocus={() => setActive("pass")}
            />

            <Text style={styles.label}>Staff Name</Text>
            <TextInput
              style={styles.input}
              value={staffName}
              onChangeText={setStaffName}
              onFocus={() => setActive("staff")}
            />

            <View style={styles.buttons}>
              <TouchableOpacity style={styles.inBtn}>
                <Text style={styles.btnText}>IN</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.outBtn}>
                <Text style={styles.btnText}>OUT</Text>
              </TouchableOpacity>
            </View>
          </BlurView>

          {/* KEYPAD */}
          <BlurView intensity={40} tint="dark" style={styles.keypad}>
            {keypad.map((k) => (
              <TouchableOpacity
                key={k}
                style={styles.key}
                onPress={() => handleKeyPress(k)}
              >
                <Text style={styles.keyText}>{k}</Text>
              </TouchableOpacity>
            ))}
          </BlurView>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  overlay: {
    flex: 1,
    padding: 16,
    backgroundColor: "rgba(0,0,0,0.25)",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 14,
    marginBottom: 16,
  },

  back: {
    color: "#fff",
    fontWeight: "700",
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#fff",
  },

  time: {
    color: "#fff",
    fontWeight: "600",
  },

  content: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 30,
  },

  form: {
    width: 320,
    padding: 18,
    borderRadius: 16,
  },

  label: {
    color: "#fff",
    marginBottom: 4,
    marginTop: 8,
  },

  input: {
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 8,
    padding: 8,
    color: "#fff",
  },

  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },

  inBtn: {
    backgroundColor: "#6ccf9f",
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },

  outBtn: {
    backgroundColor: "#e58f8f",
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },

  btnText: {
    fontWeight: "800",
  },

  keypad: {
    width: 260,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 16,
  },

  key: {
    width: "23%",
    height: 45,
    borderRadius: 8,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },

  keyText: {
    color: "#fff",
    fontWeight: "700",
  },
});
