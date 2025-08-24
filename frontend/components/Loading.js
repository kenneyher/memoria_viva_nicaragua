import React, { useState, useEffect } from 'react'
import { Animated, View, Text, StyleSheet } from 'react-native'

const LoadingIndicator = () => {
  const dot1 = useState(new Animated.Value(0))[0]
  const dot2 = useState(new Animated.Value(0))[0]
  const dot3 = useState(new Animated.Value(0))[0]

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(dot1, {
          toValue: 3,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(dot1, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(dot2, {
          toValue: 3,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(dot2, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(dot3, {
          toValue: 3,
          duration: 200,
          useNativeDriver: false,
        }),
        Animated.timing(dot3, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]),
    ).start()
  }, [])

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.dot, { transform: [{ translateY: dot1 }] }]}>
        <Text style={styles.dotText}>.</Text>
      </Animated.View>
      <Animated.View style={[styles.dot, { transform: [{ translateY: dot2 }] }]}>
        <Text style={styles.dotText}>.</Text>
      </Animated.View>
      <Animated.View style={[styles.dot, { transform: [{ translateY: dot3 }] }]}>
        <Text style={styles.dotText}>.</Text>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 2,
  },
  dot: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotText: {
    fontSize: 24,
    color: 'white',
  },
})

export default LoadingIndicator