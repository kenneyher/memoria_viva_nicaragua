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

const generateImg = async (prompt) => {
  try {
    const res = await apiClient.post("/ai/generate-img", {prompt})
    return res.data
  } catch (error) {
    console.error("AI error generation image:", error)
    throw error
  }
}

const textToSpeech = async (prompt) => {
  try {
    const res = await apiClient.post("/ai/generate-tts", {prompt})
    console.log(res.data)
    //return res.data.audio_base64;
  } catch (error) {
    console.error(error)
  }
}

export { generateStory, generateImg }
