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
import LoadingIndicator from "./Loading"

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
  const [imgAgentActive, setImgAgentActive] = useState(false)

  const askAICompletion = async () => {
    setWaitReponse(true)
    if (!waitResponse && !imgAgentActive) {
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
    setImgAgentActive(true)
    setWaitReponse(true)
    if (!waitResponse && !imgAgentActive) {
      try {
        const res = await generateImg(description)
        if (res.image) {
          // Convert base64 into data URI
          setImgUri(`data:image/png;base64,${res.image}`)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setWaitReponse(false)
      }
    }
  }

  function Agent() {
    return (
      <View
        style={{
          position: "fixed",
          bottom: 5,
          right: 5,
          zIndex: 100,
        }}
      >
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
            gap: 8,
          }}
        >
          {withAgent ? (
            !waitResponse ? (
              <View
                style={{
                  maxWidth: 400,
                  maxHeight: 200,
                  borderRadius: 8,
                  borderBottomRightRadius: 0,
                  backgroundColor: "#F5275B",
                  padding: 8,
                  fontSize: 10,
                }}
              >
                <ScrollView
                  style={{
                    maxWidth: 400,
                    maxHeight: 200,
                    padding: 8,
                    fontSize: 10,
                  }}
                >
                  <Text style={{ color: "white", maxHeight: 250 }}>
                    {agentSuggestion.description}
                  </Text>
                </ScrollView>
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    gap: 8,
                  }}
                >
                  <Pressable
                    style={styles.accept}
                    onPress={() => {
                      setDescription(agentSuggestion.description)
                      setWithAgent(false)
                    }}
                  >
                    <Text style={styles.buttonTxt}>Aceptar</Text>
                  </Pressable>
                  <Pressable
                    style={styles.reject}
                    onPress={() => {
                      setWithAgent(false)
                    }}
                  >
                    <Text style={styles.buttonTxt}>Descartar</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <View
                style={{
                  maxWidth: 400,
                  maxHeight: 200,
                  borderRadius: 8,
                  borderBottomRightRadius: 0,
                  backgroundColor: "#F5275B",
                  padding: 8,
                  fontSize: 10,
                }}
              >
                <LoadingIndicator />
              </View>
            )
          ) : (
            <View />
          )}
          <View
            style={{
              width: 25,
              borderRadius: "100%",
              height: 25,
              backgroundColor: "#F5275B",
              alignSelf: "flex-end",
            }}
          ></View>
        </View>
      </View>
    )
  }

  return (
    <View>
      <Agent />
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
              <Text style={{ color: "#F5275B" }}>
                Generar con IA a base de la Descripcion
              </Text>
            </Pressable>
          </View>
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
          {imgUri != "" ? (
            <Image
              source={{ uri: imgUri }}
              style={{ width: 300, height: 300, marginTop: 20 }}
              resizeMode="contain"
            />
          ) : (
            <Pressable
              style={styles.dropZone}
              onPress={() => {
                console.log("here")
              }}
            >
              <Text style={styles.dropZoneText}>
                Toca aquí para subir una imagen
              </Text>
              <Pressable onPress={fetchImage}>
                <View
                  style={{
                    flexDirection: "row",
                    gap: 4,
                    justifyContent: "center",
                  }}
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
            </Pressable>
          )}
          <Pressable
            style={styles.button}
            color="#F5275B"
            onPress={handleButton}
          >
            <Text style={styles.buttonTxt}>Listo!</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
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
    width: 100,
    fontWeight: "bold",
    borderRadius: 2,
  },
  reject: {
    backgroundColor: "#CF0030",
    color: "#FFFFFF",
    fontWeight: "bold",
    padding: 2,
    marginBlock: 2,
    width: 100,
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
