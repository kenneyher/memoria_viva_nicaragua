import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  Button,
  StyleSheet,
} from "react-native"
import StoryForm from "../components/StoryForm"
import StoryItem from "../components/StoryItem"
import { colors } from "../helpers/palettes"
import { addStory, getStories } from "../api/db"

const Stories = () => {
  const [title, setTitle] = useState("")
  const [city, setCity] = useState("")
  const [type, setType] = useState("")
  const [imgUri, setImgUri] = useState("")
  const [role, setRole] = useState("")
  const [description, setDescription] = useState("")
  const [isCreatingStory, setIsCreatingStory] = useState(false)
  // stories is going to look like { title: string, description: string }
  const [stories, setStories] = useState([])
  const [loading, setLoading] = useState([])
  const [error, setError] = useState([])

  // Load stories when component mounts
  useEffect(() => {
    loadStories()
  }, [])

  const loadStories = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await getStories()
      if (response.status === "success") {
        setStories(response.stories)
      } else {
        setError("Failed to load stories")
      }
    } catch (err) {
      console.error("Error loading stories:", err)
      setError("Error loading stories from database")
    } finally {
      setLoading(false)
    }
  }

  const submitInfo = async () => {
    try {
      // Create story object matching backend schema
      const storyData = {
        title: title,
        content: description, // backend expects 'content', not 'description'
        author: role, // backend expects 'author', not 'role'
        media_url: imgUri,
        type: type,
      }

      // Submit to backend
      const response = await addStory(storyData)

      if (response.status === "success") {
        // Reload stories to show the new one
        await loadStories()

        // Clear form
        setTitle("")
        setDescription("")
        setCity("")
        setType("")
        setRole("")
        setImgUri("")
        setIsCreatingStory(false)
      }
    } catch (err) {
      console.error("Error creating story:", err)
      setError("Failed to create story")
    }
  }

  const renderStoryItem = ({ item }) => (
    <StoryItem
      title={item.title}
      content={item.content} // backend returns 'content'
      city={item.city || "Unknown"} // city might not be in backend schema
      type={item.type}
      imgUri={item.media_url} // backend returns 'media_url'
      role={item.author} // backend returns 'author'
    />
  )

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
        <Text style={styles.loadingText}>Loading stories...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title="Retry" onPress={loadStories} color={colors.accent} />
        </View>
      )}

      {isCreatingStory ? (
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
        <View style={styles.storiesContainer}>
          {stories.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No stories yet</Text>
              <Text style={styles.emptySubtext}>Create the first story!</Text>
            </View>
          ) : (
            <FlatList
              data={stories}
              keyExtractor={(item) =>
                item.id?.toString() || Math.random().toString()
              }
              renderItem={renderStoryItem}
              showsVerticalScrollIndicator={false}
            />
          )}

          <View style={styles.buttonContainer}>
            <Button
              title="+ Add Story"
              color={colors.accent}
              onPress={() => setIsCreatingStory(true)}
            />
            <Button
              title="🔄 Refresh"
              color={colors.accent}
              onPress={loadStories}
            />
          </View>
        </View>
      )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.bg,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text,
  },
  errorContainer: {
    backgroundColor: "#ffebee",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: "center",
  },
  errorText: {
    color: "#c62828",
    marginBottom: 12,
    textAlign: "center",
  },
  storiesContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    color: colors.text,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary || colors.text,
    opacity: 0.7,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 16,
    gap: 16,
  },
})
export default Stories
