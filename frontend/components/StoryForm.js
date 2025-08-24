import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native"
import { generateStory, generateImg } from "../api/ai"
import React, { useState } from "react"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import Dropdown from "./Dropdown"
import nicaragua from "../helpers/nicaragua"

function StoryForm({
  title,
  setTitle,
  description,
  setDescription,
  handleButton,
  city,
  setCity,
  type,
  setType,
  imgUri,
  setImgUri,
}) {
  const [withAgent, setWithAgent] = useState(false)
  const [agentSuggestion, setAgentSuggestion] = useState({
    title: "",
    description: "",
  })
  const [waitResponse, setWaitReponse] = useState(false)
  const [hovering, setHovering] = useState(false)

  const askAICompletion = async () => {
    setWaitReponse(true)
    if (!waitResponse) {
      try {
        const res = await generateStory(description)
        setAgentSuggestion((prev) => ({ ...prev, ...res }))
      } catch (error) {
        console.log(error)
      } finally {
        setWaitReponse(false)
      }
    }
  }
  const fetchImage = async () => {
    try {
      const res = await generateImg(description)
      if (res.image) {
        // Convert base64 into data URI
        setImgUri(`data:image/png;base64,${res.image}`)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const renderAgentRes = () => {
    return (
      <View>
        {withAgent && !waitResponse && (
          <View>
            <Text style={styles.opaque}>{agentSuggestion.description}</Text>
            <Pressable
              style={styles.accept}
              onPress={() => {
                setDescription(agentSuggestion.description)
                setWithAgent(false)
              }}
            >
              <Text style={{ color: "#FFFFFF" }}>Aceptar</Text>
            </Pressable>
            <Pressable
              style={styles.reject}
              onPress={() => setWithAgent(false)}
            >
              <Text style={{ color: "#FFFFFF" }}>Descartar</Text>
            </Pressable>
          </View>
        )}
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View>
        <Text style={styles.header}>Titulo</Text>
        <TextInput
          style={styles.input}
          placeholder="Titulo de la historia"
          value={title}
          onChangeText={setTitle}
        />
        <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
          <Text style={styles.header}>Description</Text>
          <Pressable
            onPress={() => {
              setWithAgent(true)
              askAICompletion()
            }}
          >
            <FontAwesome
              name="magic"
              size={24}
              color="#F5275B"
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
            />
          </Pressable>
          <Text style={{ color: "#F5275B" }}>
            Generar con IA a base de la Descripcion
          </Text>
        </View>
        {!waitResponse
          ? renderAgentRes()
          : withAgent && (
              <View>
                <Text style={styles.opaque}>Agent is thinking</Text>
              </View>
            )}
        <TextInput
          multiline
          numberOfLines={4}
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
        />
        <Text style={styles.header}>Ciudad</Text>
        <Dropdown options={Object.keys(nicaragua)} onSelect={setCity} />
        <Text style={styles.header}>Tipo</Text>
        <Dropdown
          options={["Leyenda", "Relato", "Historia"]}
          onSelect={setType}
        />
        <Text style={styles.header}>Imagen (opcional)</Text>
        {imgUri != "" ? 
          <Image
            source={{ uri: imgUri }}
            style={{ width: 300, height: 300, marginTop: 20 }}
            resizeMode="contain"
          />
        : <Pressable
          style={styles.dropZone}
          onPress={() => {
            console.log("here")
          }}
        >
          <Text style={styles.dropZoneText}>
            Toca aquí para subir una imagen
          </Text>
          <Pressable
            onPress={fetchImage}
          >
            <View
              style={{ flexDirection: "row", gap: 4, justifyContent: "center" }}
            >
              <FontAwesome
                name="magic"
                size={24}
                color="#F5275B"
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
              />
              <Text style={styles.aiText}>Generar con IA</Text>
            </View>
          </Pressable>
        </Pressable>}
        <Pressable style={styles.button} color="#F5275B" onPress={handleButton}>
          <Text style={styles.buttonTxt}>Listo!</Text>
        </Pressable>
      </View>
    </ScrollView>
  )
}

export default StoryForm

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#F0F0F0",
    borderRadius: 4,
    padding: 2,
    marginBlock: "1rem",
    placeholderTextColor: "#757178",
  },
  aiText: {
    userSelect: "none",
    color: "#CF0030",
    fontStyle: "italic",
  },
  opaque: {
    color: "#757178",
    fontStyle: "italic",
  },
  accept: {
    color: "#FFFFFF",
    backgroundColor: "#3fdf84ff",
    marginBlock: 2,
    padding: 2,
    width: 40,
    fontWeight: "bold",
    borderRadius: 2,
  },
  reject: {
    backgroundColor: "#CF0030",
    color: "#FFFFFF",
    fontWeight: "bold",
    padding: 2,
    marginBlock: 2,
    width: 40,
    borderRadius: 2,
  },
  container: {
    maxWidth: 500,
    width: "100%",
  },
  header: {
    fontSize: 24,
    fontWeight: 700,
  },
  button: {
    maxWidth: 120,
    width: 120,
    backgroundColor: "#FF2653",
    borderRadius: 5,
    padding: 5,
    alignSelf: "flex-end",
  },
  buttonTxt: {
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
  dropZone: {
    borderWidth: 2,
    borderColor: "#ccc",
    borderStyle: "dashed",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  dropZoneText: {
    color: "#757178",
    fontStyle: "italic",
  },
})
