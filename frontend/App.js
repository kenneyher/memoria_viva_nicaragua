import {
  StyleSheet,
  FlatList,
  TextInput,
  View,
  Text,
  Button,
  ScrollView,
} from "react-native"
import { useState } from "react"
import StoryForm from "./components/StoryForm"
import StoryItem from "./components/StoryItem"

export default function App() {
  const [keyword, setKeyword] = useState("")
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

  const filterStories = (titleSearch) => {
    return stories.filter((story) =>
      story.title.toLowerCase().includes(titleSearch.toLowerCase())
    )
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
            <TextInput
              placeholder="Search by keyword"
              value={keyword}
              onChangeText={setKeyword}
            />
            <ScrollView>
              <FlatList
                data={filterStories(keyword) || []}
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
                ListEmptyComponent={() => (
                  <Text style={{ textAlign: "center", padding: 20 }}>
                    No stories found.
                  </Text>
                )}
              />
              <Button
                title="+"
                color="#FFC74F"
                onPress={() => setIsCreatingStory(true)}
              />
            </ScrollView>
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
    margin: "1rem",
  },
})
