import { View, Text, StyleSheet, Button } from "react-native"
import React, { useState } from "react"

export default function App() {
  let [text, setText] = useState<string>("Hello world!")

  const changeText = () => {
    setText("Goodbye, world :(")
  }

  return (
    <View>
      <Text style={styles.header}>{text}</Text>
      <Button
        onPress={changeText}
        title="Push me"
        color="#9527F5"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  header: {
    fontSize: 80,
    color: "#9527F5",
    fontWeight: 900
  }
})
