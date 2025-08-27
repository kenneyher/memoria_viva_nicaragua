import React, { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  Animated,
  FlatList,
  StyleSheet,
  Modal,
  Pressable,
  Platform,
  UIManager,
  findNodeHandle,
} from "react-native"
import palettes, { colors } from "../helpers/palettes"

const Dropdown = ({ options, placeholder = "Select an option", onSelect }) => {
  const [open, setOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [coords, setCoords] = useState({ x: 0, y: 0, width: 0, height: 0 })

  const buttonRef = useRef(null)
  const animation = useRef(new Animated.Value(0)).current

  const toggleDropdown = () => {
    if (!open) {
      if (Platform.OS === "web") {
        // On web, use getBoundingClientRect
        const rect = buttonRef.current.getBoundingClientRect()
        setCoords({
          x: rect.left,
          y: rect.bottom,
          width: rect.width,
          height: rect.height,
        })
        setOpen(true)
      } else {
        // On native, use measure
        UIManager.measure(
          findNodeHandle(buttonRef.current),
          (x, y, width, height, pageX, pageY) => {
            setCoords({ x: pageX, y: pageY, width, height })
            setOpen(true)
          }
        )
      }
    } else {
      setOpen(false)
    }
  }

  const handleSelect = (item) => {
    setSelected(item)
    onSelect(item)
    setOpen(false)
  }

  useEffect(() => {
    Animated.timing(animation, {
      toValue: open ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start()
  }, [open])

  const dropdownHeight = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.min(options.length * 50, 200)],
  })

  return (
    <View style={styles.container}>
      <Pressable ref={buttonRef} style={styles.button} onPress={toggleDropdown}>
        <Text style={styles.buttonText}>
          {selected ? selected : placeholder}
        </Text>
      </Pressable>

      <Modal visible={open} transparent animationType="none">
        <Pressable style={styles.modalOverlay} onPress={() => setOpen(false)}>
          <Animated.View
            style={[
              styles.dropdown,
              {
                top: coords.y,
                left: coords.x,
                width: coords.width,
                height: dropdownHeight,
                position: "absolute",
              },
            ]}
          >
            <FlatList
              data={options}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.option}
                  onPress={() => handleSelect(item)}
                >
                  <Text style={styles.optionText}>{item}</Text>
                </Pressable>
              )}
            />
          </Animated.View>
        </Pressable>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { 
    margin: 20 
  },
  button: {
    padding: 12,
    backgroundColor: colors.bgSecondary,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.borders,
    minWidth: 160,
    width: 160,
  },
  buttonText: { 
    fontSize: 16, 
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "transparent",
  },
  dropdown: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.borders,
    borderRadius: 6,
    overflow: "hidden",
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.fgSecondary,
  },
  optionText: { fontSize: 14 },
})

export default Dropdown
