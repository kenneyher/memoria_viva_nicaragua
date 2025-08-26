import { StyleSheet, FlatList, View, Button, ScrollView } from "react-native"
import { useState } from "react"
import StoryForm from "./components/StoryForm"
import StoryItem from "./components/StoryItem"

export default function App() {
  const [title, setTitle] = useState("")
  const [city, setCity] = useState("")
  const [type, setType] = useState("")
  const [imgUri, setImgUri] = useState("")
  const [role, setRole] = useState("")
  const [description, setDescription] = useState("")
  const [isCreatingStory, setIsCreatingStory] = useState(false)
  // stories is going to look like { title: string, description: string }
  const [stories, setStories] = useState([])

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
    <View style={styles.container}>
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
          <View>
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
              color="#FFC74F"
              onPress={() => setIsCreatingStory(true)}
            />
          </View>
        )
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    margin: 2,
  },
})
