import { 
  StyleSheet, 
  Text, 
  View,
  TextInput, 
  Button,
} from 'react-native';
import { useState } from 'react';

export default function App() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  
  const submitInfo = () => {
    console.log(title);
    console.log(description);
  }

  return (
    <View style={styles.container}>
      
      <View>
        <Text>Titulo</Text>
        <TextInput 
          style={styles.input}
          placeholder='Titulo de la historia'
          value={title}
          onChangeText={setTitle}
        />
        <Text>Description</Text>
        <TextInput
          multiline
          numberOfLines={4}
          maxLength={40}
          style={styles.input}
          placeholder='Description'
          value={description}
          onChangeText={setDescription}
        />
        <Button 
          color='#CF0030'
          title='Listo!'
          onPress={submitInfo} 
        />
      </View>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    margin: '1rem',
  },
  input: {
    backgroundColor: '#F0F0F0',
    borderRadius: '0.1rem',
    padding: '0.2rem',
    margin: '0.2rem'
  }
});
