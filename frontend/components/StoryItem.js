import { View, Text, StyleSheet } from "react-native"

function StoryItem({ title, content }) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text>{content}</Text>
    </View>
  )
}

export default StoryItem

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    backgroundColor: "#F6F5FA",
    borderLeftWidth: "1em",
    paddingLeft: "0.5em",
    borderLeftColor: "#FFC74F",
    marginBlock: "1em"
  },
  title: {
    fontWeight: "bold",
    color: "#4F90FF",
    fontSize: "1.2em"
  }
})
