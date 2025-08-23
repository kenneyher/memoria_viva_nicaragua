import {
  View,
  Text,
  Button,
  TextInput,
  Pressable,
  StyleSheet,
  Animated,
} from "react-native"
import { generateStory } from "../api/ai"
import React, { useState, useRef } from "react"
import FontAwesome from "@expo/vector-icons/FontAwesome"

function StoryForm({
  title,
  setTitle,
  description,
  setDescription,
  handleButton,
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
      <View>
        <Text>Titulo</Text>
        <TextInput
          style={styles.input}
          placeholder="Titulo de la historia"
          value={title}
          onChangeText={setTitle}
        />
        <View style={{ flexDirection: "row", gap: "0.25rem" }}>
          <Text>Description</Text>
          <Pressable
            onPress={() => {
              setWithAgent(true)
              askAICompletion()
            }}
          >
            <FontAwesome
              name="magic"
              size={16}
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
              <Text style={styles.opaque}>{"Agent is thinking..."}</Text>
            )}
        <TextInput
          multiline
          numberOfLines={4}
          style={styles.input}
          placeholder="Description"
          value={description}
          onChangeText={setDescription}
        />
        <Button color="#F5275B" title="Listo!" onPress={handleButton} />
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
    margin: "0.2rem",
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
    borderRadius: "0.2em"
  },
  reject: {
    backgroundColor: "#CF0030",
    color: "#FFFFFF",
    fontWeight: "bold",
    padding: "0.15em",
    marginBlock: "0.2em",
    width: "5em",
    borderRadius: "0.2em"
  },
  container: {
  }
})
