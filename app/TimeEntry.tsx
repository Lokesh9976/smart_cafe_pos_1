import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const TimeEntryScreen = () => {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [staffName, setStaffName] = useState("");
  const [activeField, setActiveField] = useState<"user" | "pass" | "staff">(
    "user",
  );

  const [currentTime, setCurrentTime] = useState(new Date());

  // live clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const date = currentTime.toLocaleDateString("en-GB");
  const time = currentTime.toLocaleTimeString("en-GB");

  const getValue = () => {
    if (activeField === "user") return userId;
    if (activeField === "pass") return password;
    return staffName;
  };

  const setValue = (value: string) => {
    if (activeField === "user") setUserId(value);
    if (activeField === "pass") setPassword(value);
    if (activeField === "staff") setStaffName(value);
  };

  const handleKeyPress = (key: string) => {
    let current = getValue();

    if (key === "Bksp") {
      setValue(current.slice(0, -1));
      return;
    }

    if (key === "Clear") {
      setValue("");
      return;
    }

    if (key === "Space") {
      setValue(current + " ");
      return;
    }

    if (key === "Ent") {
      console.log("Login Data", {
        userId,
        password,
        staffName,
      });
      return;
    }

    setValue(current + key);
  };

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

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          SMART <Text style={{ color: "#e38b29" }}>Café</Text>
        </Text>

        <Text style={styles.time}>
          {date} {time}
        </Text>
      </View>

      {/* Inputs */}
      <View style={styles.inputContainer}>
        <Text>User ID</Text>
        <TextInput
          style={[styles.input, activeField === "user" && styles.activeInput]}
          value={userId}
          onFocus={() => setActiveField("user")}
        />

        <Text>Password</Text>
        <TextInput
          style={[styles.input, activeField === "pass" && styles.activeInput]}
          value={password}
          secureTextEntry
          onFocus={() => setActiveField("pass")}
        />

        <Text>Staff Name</Text>
        <TextInput
          style={[styles.input, activeField === "staff" && styles.activeInput]}
          value={staffName}
          onFocus={() => setActiveField("staff")}
        />
      </View>

      {/* IN OUT Buttons */}
      <View style={styles.inOutContainer}>
        <TouchableOpacity style={styles.inButton}>
          <Text style={styles.inOutText}>IN</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.outButton}>
          <Text style={styles.inOutText}>OUT</Text>
        </TouchableOpacity>
      </View>

      {/* Keypad */}
      <View style={styles.keypad}>
        {keypad.map((key) => (
          <TouchableOpacity
            key={key}
            style={styles.key}
            onPress={() => handleKeyPress(key)}
          >
            <Text style={styles.keyText}>{key}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
};

export default TimeEntryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f0e6",
    padding: 20,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  title: {
    fontSize: 30,
    fontWeight: "bold",
  },

  time: {
    fontSize: 16,
    fontWeight: "600",
  },

  inputContainer: {
    marginBottom: 20,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    marginBottom: 12,
    backgroundColor: "#fff",
  },

  activeInput: {
    borderColor: "#ff9800",
    borderWidth: 2,
  },

  inOutContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 20,
  },

  inButton: {
    backgroundColor: "#d8f3dc",
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },

  outButton: {
    backgroundColor: "#ffd6d6",
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
  },

  inOutText: {
    fontSize: 22,
    fontWeight: "bold",
  },

  keypad: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  key: {
    width: "22%",
    backgroundColor: "#4a4a4a",
    margin: 6,
    padding: 20,
    alignItems: "center",
    borderRadius: 8,
  },

  keyText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
