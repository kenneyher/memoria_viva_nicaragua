import apiClient from ".";

const addStory = async (storyInfo) => {
  try {
    const res = await apiClient.post("/db/add-story", storyInfo)
    return res.data
  } catch (error) {
    console.error("AI error generating story:", error)
    throw error
  }
}

export { addStory }
