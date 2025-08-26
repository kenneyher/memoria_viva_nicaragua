import React, { useState, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Platform,
} from "react-native"
import { useAudioPlayer } from "expo-audio"
import { textToSpeech } from "../api/ai"
import * as FileSystem from "expo-file-system"
import { AudioPlayer } from "./AudioPlayer"
import FontAwesome from "@expo/vector-icons/FontAwesome"

function StoryItem({ title, content, city, type, imgUri, role }) {
  const [audioUri, setAudioUri] = useState("")
  const player = useAudioPlayer({ uri: audioUri })

  async function base64ToUri(base64) {
    if (Platform.OS === "web") {
      const cleanBase64 = base64.split(",").pop().replace(/\s/g, "")

      const byteCharacters = atob(cleanBase64)
      const byteNumbers = new Array(byteCharacters.length)
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i)
      }
      const byteArray = new Uint8Array(byteNumbers)
      const blob = new Blob([byteArray], { type: "audio/mp3" })
      return URL.createObjectURL(blob) // something like blob:http://...
    } else {
      // Mobile path
      const fileUri = FileSystem.cacheDirectory + "tts.mp3"
      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      })
      return fileUri // file:///...
    }
  }

  const generateAudio = async () => {
    try {
      if (!audioUri) {
        const data = await textToSpeech(content)
        if (data.audio) {
          const uri = await base64ToUri(data.audio)
          setAudioUri(uri)
        }
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handlePlay = async () => {
    if (audioUri) {
      player.seekTo(0)
      player.play()
    }
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      <Text>{content}</Text>
      <Text>{city}</Text>
      <Text>{type}</Text>
      <Text>{role}</Text>
      <Image
        source={{ uri: imgUri }}
        style={{ width: 300, height: 300, marginTop: 20 }}
        resizeMode="contain"
      />
      {audioUri == "" && (
        <Pressable style={styles.audioBtn} onPress={generateAudio}>
          <FontAwesome name="magic" size={14} color="#F5275B" />
          <Text style={styles.buttonTxt}>IA: Generar Audio</Text>
        </Pressable>
      )}
      {audioUri != "" && (
        <View>
          <AudioPlayer uri={audioUri} />
        </View>
      )}
    </View>
  )
}

export default StoryItem

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    backgroundColor: "#F6F5FA",
    borderLeftWidth: 8,
    paddingLeft: 4,
    borderLeftColor: "#FFC74F",
    marginBlock: 2,
  },
  title: {
    fontWeight: "bold",
    color: "#4F90FF",
    fontSize: 12,
  },
  audioBtn: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: 150,
    marginBlock: 8,
  },
  buttonTxt: {
    color: "red",
    fontStyle: "italic",
  },
})
