import React, { useState } from "react"
import { View, ScrollView, FlatList, Button, StyleSheet } from "react-native"
import StoryForm from "../components/StoryForm"
import StoryItem from "../components/StoryItem"
import { colors } from "../helpers/palettes"

const Stories = () => {
  const [title, setTitle] = useState("")
  const [city, setCity] = useState("")
  const [type, setType] = useState("")
  const [imgUri, setImgUri] = useState("")
  const [role, setRole] = useState("")
  const [description, setDescription] = useState("")
  const [isCreatingStory, setIsCreatingStory] = useState(false)
  // stories is going to look like { title: string, description: string }
  const [stories, setStories] = useState([
    {
      title: "La Llorona",
      description: "Llora por sus hijos :c",
      city: "Chinandega",
      type: "Leyenda",
      imgUri: "",
      role: "Estudiante"
    },
  ])

  const submitInfo = () => {
    /**
     * ...stories = cada uno de los elementos en stories
     * {title: str, description: str}, {title: str, description: str}, ...
     */
    setStories([
      ...stories,
      {
        title,
        description,
        city,
        type,
        imgUri,
        role,
      },
    ])
    setTitle("")
    setDescription("")
    setCity("")
    setType("")
    setRole("")
    setImgUri("")
    setIsCreatingStory(false)
  }

  return (
    <View style={{ backgroundColor: colors.bg, flex: 1 }}>
      {
        // Equivalent Python is result if condition else other-result
        isCreatingStory ? (
          <StoryForm
            title={title}
            setTitle={setTitle}
            city={city}
            setCity={setCity}
            description={description}
            setDescription={setDescription}
            handleButton={submitInfo}
            type={type}
            setType={setType}
            imgUri={imgUri}
            setImgUri={setImgUri}
            role={role}
            setRole={setRole}
            setIsCreatingStory={setIsCreatingStory}
          />
        ) : (
          <View style={{ backgroundColor: colors.bg, flex: 1,  alignItems: "center"  }}>
            <View style={[styles.container, { flex: 1,}]}>
              <FlatList
                data={stories}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <StoryItem
                    title={item.title}
                    content={item.description}
                    city={item.city}
                    type={item.type}
                    imgUri={item.imgUri}
                    role={item.role}
                  />
                )}
              />
              <Button
                title="+"
                color={colors.accent}
                onPress={() => setIsCreatingStory(true)}
              />
            </View>
          </View>
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 16,
    width: 600,
    maxWidth: 600,
  },
})

export default Stories
