import apiClient from ".";

const addStory = async (storyInfo) => {
  try {
    const res = await apiClient.post("/db/add-story", { ...storyInfo })
    return res.data
  } catch (error) {
    console.error("Error adding the story:", error)
    throw error
  }
}

const getAllStories = async () => {
  try {
    const res = await apiClient.get("/db/stories")
    return res.data
  } catch (error) {
    console.error("Error getting stories:", error)
    throw error
  }
}

export { addStory, getAllStories }
