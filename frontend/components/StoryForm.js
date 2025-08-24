import {
  View,
  Text,
  Button,
  TextInput,
  Pressable,
  StyleSheet,
  Image
} from "react-native"
import { generateStory, generateImg } from "../api/ai"
import React, { useState, useRef } from "react"
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
  setImgUri
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
        setImgUri(`data:image/png;base64,${res.image}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const renderAgentRes = () => {
    return (
      <>
        {withAgent && !waitResponse && (
          <>
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
          </>
        )}
      </>
    )
  }

  return (
    <View style={styles.container}>
      <View style={{ width: "100%" }}>
        <Text style={styles.header}>Titulo</Text>
        <TextInput
          style={styles.input}
          placeholder="Titulo de la historia"
          value={title}
          onChangeText={setTitle}
        />
        <View
          style={{ flexDirection: "row", gap: "0.25rem", alignItems: "center" }}
        >
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
          {hovering && (
            <Text style={{ color: "#F5275B" }}>
              Generar con IA a base de la Descripcion
            </Text>
          )}
        </View>
        {!waitResponse
          ? renderAgentRes()
          : withAgent && (
              <Text style={styles.opaque}>Agent is thinking</Text>
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
        <Dropdown 
          options={Object.keys(nicaragua)}
          onSelect={setCity}
        />
        <Text style={styles.header}>Tipo</Text>
        <Dropdown 
          options={["Leyenda","Relato","Historia"]} 
          onSelect={setType}
        />
        {imgUri && (
        <Image
          source={{ uri: imgUri }}
          style={{ width: 300, height: 300, marginTop: 20 }}
          resizeMode="contain"
        />
      )}
        <Pressable style={styles.button} color="#F5275B" onPress={fetchImage}>
          <Text style={styles.buttonTxt}>Generar Imagen</Text>
        </Pressable>
        <Pressable style={styles.button} color="#F5275B" onPress={handleButton}>
          <Text style={styles.buttonTxt}>Listo!</Text>
        </Pressable>
      </View>
    </View>
  )
}

export default StoryForm

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#F0F0F0",
    borderRadius: "0.1rem",
    padding: "0.2rem",
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
    marginBlock: "0.2em",
    padding: "0.15em",
    width: "5em",
    fontWeight: "bold",
    borderRadius: "0.2em",
  },
  reject: {
    backgroundColor: "#CF0030",
    color: "#FFFFFF",
    fontWeight: "bold",
    padding: "0.15em",
    marginBlock: "0.2em",
    width: "5em",
    borderRadius: "0.2em",
  },
  container: {
    maxWidth: "40rem",
    width: "100%",
  },
  header: {
    fontSize: "1.5rem",
    fontWeight: 700,
  },
  button: {
    maxWidth: "10%",
    width: "10%",
    backgroundColor: "#FF2653",
    borderRadius: "0.5rem",
    padding: "0.5rem",
    alignSelf: "flex-end"
  },
  buttonTxt: {
    fontWeight: "bold",
    color: "white",
    textAlign: "center",
  },
})
