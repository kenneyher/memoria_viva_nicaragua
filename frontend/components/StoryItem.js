import { View, Text, StyleSheet, Image, Pressable } from "react-native"
import { colors } from "../helpers/palettes"

function StoryItem({ title, content, city, type, imgUri, role }) {
  return (
    <View style={styles.card}>
      <View style={styles.infoContainer}>
        <View style={[styles.txt, styles.down]}>
          <Text style={styles.title}>{title}</Text>
          <Text style={{color: colors.fgSecondary}}>noobmaster69 - {role}</Text>
          <Text style={styles.txt} numberOfLines={3} ellipsizeMode="tail">{content}</Text>
          <Pressable style={styles.button}>
            <Text style={styles.buttonTxt}>Ver mas?</Text>
          </Pressable>
        </View>
        {imgUri != "" && (
              <Image
                source={{ uri: imgUri }}
                style={[styles.img, { width: '30%', height: 200, marginTop: 20 }]}
                resizeMode="cover"
              />
        )}
      </View>
      <View style={styles.sideBySide}>
        <Text style={{color: colors.fgSecondary}}>{city}</Text>
        <Text style={{color: colors.fgSecondary}}>{type}</Text>
      </View>

    </View>
  )
}

export default StoryItem

const styles = StyleSheet.create({
  card: {
    flex: 1,
    flexDirection: "column",
    boxShadow: `5px 5px 10px ${colors.bgSecondary}`,
    borderColor: colors.bgSecondary,
    borderWidth: 2,
    borderStyle: "solid",
    marginBlock: 10,
    marginInline: 5,
    padding: 10,
    borderRadius: 12,
    gap: 8
  },
  down: {
    flexDirection: "column",
    gap: 2,
    width: "70%",
    minWidth: "70%",
    paddingRight: 10,
  },
  sideBySide: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-end",
    gap: 10
  },
  title: {
    fontWeight: "bold",
    color: colors.primary,
    fontSize: 24,
  },
  txt: {
    color: colors.fg,
    textAlign: 'justify',
  },
  buttonTxt: {
    fontWeight: "bold",
    color: colors.primary,
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  img: {
    borderRadius: 6,
    overflow: "hidden",
  }
})
