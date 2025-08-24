import React, { useState, useRef, useEffect } from "react"
import { View, Text, Pressable, Animated, StyleSheet } from "react-native"

export default function Dropdown({ options = [], onSelect }) {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const animation = useRef(new Animated.Value(0)).current

  // Animate dropdown height
  useEffect(() => {
    Animated.timing(animation, {
      toValue: open ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start()
  }, [open])

  const heightInterpolate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 150], // each option 40px tall
  })

  const handleSelect = (option) => {
    setSelected(option)
    onSelect && onSelect(option)
    setOpen(false)
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.button} onPress={() => setOpen(!open)}>
        <Text>{selected ? selected : "Select an option"}</Text>
      </Pressable>

      <Animated.ScrollView
        style={[styles.dropdown, { height: heightInterpolate }]}
      >
        {options.map((option, index) => (
          <Pressable
            key={index}
            style={styles.option}
            onPress={() => handleSelect(option)}
          >
            <Text>{option}</Text>
          </Pressable>
        ))}
      </Animated.ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { width: 200 },
  button: {
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  dropdown: {
    overflow: "hidden",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginTop: 4,
    position: "absolute",
    width: "100%",
    height: "5rem",
    zIndex: 10,
  },
  option: {
    height: 40,
    justifyContent: "center",
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
  },
})
