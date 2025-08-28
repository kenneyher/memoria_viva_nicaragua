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
import { addStory } from "../api/db"
import React, { useState } from "react"
import FontAwesome from "@expo/vector-icons/FontAwesome"
import Dropdown from "./Dropdown"
import nicaragua from "../helpers/nicaragua"
import LoadingIndicator from "./Loading"
import {colors} from "../helpers/palettes" 

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
  role,
  setRole,
  setIsCreatingStory,
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
        if (res.img) {
          // Convert base64 into data URI
          setImgUri(`data:image/webp;base64,${res.img}`)
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
          position: "absolute",
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
              width: 28,
              borderRadius: 10,
              height: 28,
              backgroundColor: "#F5275B",
              alignSelf: "flex-end",
            }}
          ></View>
        </View>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, width: "100%", alignItems: "center" }}>
      <ScrollView style={styles.container}>
        <View>
          <Text style={styles.header}>Titulo</Text>
          <TextInput
            style={styles.input}
            placeholder="Titulo de la historia"
            placeholderTextColor={colors.fgSecondary}
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
              <FontAwesome name="magic" size={24} color={colors.primary} />
              <Text style={{ color: colors.primary }}>
                Generar con IA a base de la Descripcion
              </Text>
            </Pressable>
          </View>
          <TextInput
            multiline
            numberOfLines={4}
            style={styles.input}
            placeholder="Description"
            placeholderTextColor={colors.fgSecondary}
            value={description}
            onChangeText={setDescription}
          />
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View>
              <Text style={styles.header}>Ciudad</Text>
              <Dropdown options={Object.keys(nicaragua)} onSelect={setCity} />
            </View>
            <View>
              <Text style={styles.header}>Tipo</Text>
              <Dropdown
                options={["Leyenda", "Relato", "Historia"]}
                onSelect={setType}
              />
            </View>
            <View>
              <Text style={styles.header}>Rol</Text>
              <Dropdown
                options={[
                  "Estudiante",
                  "Educador",
                  "Ciudadano",
                  "Experto",
                  "Otros",
                ]}
                onSelect={setRole}
              />
            </View>
          </View>
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
                // Hook up native picker here if desired
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
                  <FontAwesome name="magic" size={24} color={colors.primary} />
                  <Text style={styles.aiText}>Generar con IA</Text>
                </View>
              </Pressable>
            </Pressable>
          )}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              gap: 8,
              justifyContent: "flex-end",
            }}
          >
            <Pressable
              style={styles.button}
              onPress={() => {
                setIsCreatingStory(false)
              }}
            >
              <Text style={styles.buttonTxt}>Descartar</Text>
            </Pressable>
            <Pressable
              style={styles.button}
              onPress={async () => {
                if (
                  title.trim() &&
                  description.trim() &&
                  role.trim() &&
                  city.trim() &&
                  type.trim()
                ) {
                  // Delegate submission to parent handler
                  await handleButton()
                }
              }}
            >
              <Text style={styles.buttonTxt}>Listo!</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      <Agent />
    </View>
  )
}

export default StoryForm

const styles = StyleSheet.create({
  input: {
    backgroundColor: colors.bgSecondary,
    borderRadius: 4,
    padding: 2,
    marginBlock: "1rem",
  },
  aiText: {
    userSelect: "none",
    color: colors.primary,
    fontStyle: "italic",
  },
  opaque: {
    color: colors.fgSecondary,
    fontStyle: "italic",
  },
  accept: {
    color: colors.bg,
    backgroundColor: colors.secondary,
    marginBlock: 2,
    padding: 2,
    width: 100,
    fontWeight: "bold",
    borderRadius: 2,
  },
  reject: {
    backgroundColor: colors.accent,
    color: colors.bg,
    fontWeight: "bold",
    padding: 2,
    marginBlock: 2,
    width: 100,
    borderRadius: 2,
  },
  container: {
    maxWidth: 700,
    width: "100%",
    backgroundColor: colors.bg,
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    color: colors.fg,
  },
  button: {
    maxWidth: 120,
    width: 120,
    backgroundColor: colors.accent,
    borderRadius: 5,
    padding: 5,
    marginBlock: 10,
    alignSelf: "flex-end",
  },
  buttonTxt: {
    fontWeight: "bold",
    color: colors.bg,
    textAlign: "center",
  },
  dropZone: {
    borderWidth: 2,
    borderColor: colors.borders,
    borderStyle: "dashed",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },
  dropZoneText: {
    color: colors.fgSecondary,
    fontStyle: "italic",
  },
})
