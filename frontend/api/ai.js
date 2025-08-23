import apiClient from ".";

const generateStory = async (prompt) => {
  try {
    const res = await apiClient.post("/ai/generate-story", { prompt })
    return res.data
  } catch (error) {
    console.error("AI error generating story:", error)
    throw error
  }
}

export { generateStory }