import { View, Text, Button, TextInput, StyleSheet } from "react-native"
import { useState } from "react"

function StoryForm({
  title,
  setTitle,
  description,
  setDescription,
  handleButton,
}) {
  return (
    <View>
      <Text>Titulo</Text>
      <TextInput
        style={styles.input}
        placeholder="Titulo de la historia"
        value={title}
        onChangeText={setTitle}
      />
      <Text>Description</Text>
      <TextInput
        multiline
        numberOfLines={4}
        maxLength={40}
        style={styles.input}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
      />
      <Button color="#CF0030" title="Listo!" onPress={handleButton} />
    </View>
  )
}

export default StoryForm

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#F0F0F0",
    borderRadius: "0.1rem",
    padding: "0.2rem",
    margin: "0.2rem",
    placeholderTextColor: "#757178"
  },
})
