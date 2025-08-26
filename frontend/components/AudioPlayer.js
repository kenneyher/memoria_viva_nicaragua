import { View, Pressable, Text, StyleSheet } from "react-native"
import React, { useEffect, useState } from "react"
import { useAudioPlayer } from "expo-audio"
import FontAwesome from "@expo/vector-icons/FontAwesome"

export function AudioPlayer({ uri }) {
  const player = useAudioPlayer({ uri })
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      if (player.playing) {
        setProgress(player.currentTime)
        setDuration(player.duration || 0)
      }
    }, 200)

    return () => {
      clearInterval(interval)
      setProgress(0)
      player.seekTo(0)
    }
  }, [player])

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0")
    return `${m}:${s}`
  }

  // Simple custom slider
  const progressPercent = duration ? (progress / duration) * 100 : 0

  return (
    <View style={styles.player}>
      <View style={styles.controls}>
        <Pressable
          style={styles.btn}
          onPress={() => (player.playing ? player.pause() : player.play())}
        >
          <Text style={styles.btnText}>
            {player.playing ? "Pause" : "Play"}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.btn, styles.stopBtn]}
          onPress={() => {
            player.pause()
            player.seekTo(0)
            setProgress(0)
          }}
        >
          <Text style={styles.btnText}>Stop</Text>
        </Pressable>
      </View>

      <View style={styles.progressContainer}>
        <Text style={styles.time}>{formatTime(progress)}</Text>
        <View style={styles.sliderTrack}>
          <View style={[styles.sliderFill, { width: `${progressPercent}%` }]} />
        </View>
        <Text style={styles.time}>{formatTime(duration)}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  player: {
    width: "100%",
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F6F5FA",
  },
  controls: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 10,
  },
  btn: {
    backgroundColor: "#4F90FF",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  stopBtn: { backgroundColor: "#FF4F4F" },
  btnText: { color: "white", fontWeight: "bold" },
  progressContainer: { flexDirection: "row", alignItems: "center" },
  time: { width: 40, textAlign: "center", fontSize: 12, color: "#333" },
  sliderTrack: {
    flex: 1,
    height: 6,
    backgroundColor: "#ddd",
    borderRadius: 3,
    marginHorizontal: 8,
  },
  sliderFill: { height: 6, backgroundColor: "#4F90FF", borderRadius: 3 },
})
