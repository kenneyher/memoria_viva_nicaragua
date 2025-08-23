import {
  StyleSheet,
  Text,
  FlatList,
  View,
  TextInput,
  Button,
} from "react-native"
import { useState } from "react"
import StoryForm from "./components/StoryForm"
import StoryItem from "./components/StoryItem"

export default function App() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isCreatingStory, setIsCreatingStory] = useState(false)
  // stories is going to look like { title: string, description: string }
  const [stories, setStories] = useState([
    {
      title: "La Llorona",
      description: "Llora por sus hijos :c",
    },
  ])

  const submitInfo = () => {
    /**
     * ...stories = cada uno de los elementos en stories
     * {title: str, description: str}, {title: str, description: str}, ...
     */
    setStories([...stories, { title, description }])
    setTitle('')
    setDescription('')
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
            description={description}
            setDescription={setDescription}
            handleButton={submitInfo}
          />
        ) : (
          <View>
            <FlatList
              data={stories}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <StoryItem title={item.title} content={item.description} />
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
    margin: "1rem",
  },
})
