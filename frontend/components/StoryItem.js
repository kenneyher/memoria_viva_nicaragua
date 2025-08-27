import { View, Text, StyleSheet, Image } from "react-native";
import {colors} from "../helpers/palettes"

function StoryItem({ 
  title, 
  content,
  city,
  type,
  imgUri,
  role
}) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.txt}>{content}</Text>
      <Text>{city}</Text>
      <Text>{type}</Text>
      <Text>{role}</Text>
      <Image
        source={{ uri: imgUri }}
        style={{ width: 300, height: 300, marginTop: 20 }}
        resizeMode="contain"
      />
    </View>
  )
}

export default StoryItem

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    backgroundColor: colors.bgSecondary,
    borderLeftWidth: 10,
    paddingLeft: 5,
    borderLeftColor: colors.secondary,
    marginBlock: 10
  },
  title: {
    fontWeight: "bold",
    color: colors.primary,
    fontSize: 12
  },
  txt: {
    color: colors.fg,
  },
})
