import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  Pressable 
} from "react-native";
import { useAudioPlayer } from "expo-audio";
import * as FileSystem from "expo-file-system";
import { textToSpeech } from "../api/ai";

function StoryItem({ 
  title, 
  content,
  city,
  type,
  imgUri,
  role
}) {

  const [audioUri, setAudioUri] = useState(null);
  const player = useAudioPlayer(audioUri);

  const handlePlay = async () => {
    try {
      if (audioUri) {
        
      }
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
      <Pressable 
        style={styles.audioBtn}
        //onPress={s}  
      >
        <Text>Play</Text>
      </Pressable>
    </View>
  )
}

export default StoryItem

const styles = StyleSheet.create({
  card: {
    flexDirection: "column",
    backgroundColor: "#F6F5FA",
    borderLeftWidth: "1em",
    paddingLeft: "0.5em",
    borderLeftColor: "#FFC74F",
    marginBlock: "1em"
  },
  title: {
    fontWeight: "bold",
    color: "#4F90FF",
    fontSize: "1.2em"
  },
  audioBtn: {
    backgroundColor: "#4F90FF"
  }
})
