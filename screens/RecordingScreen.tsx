import { StackScreenProps } from '@react-navigation/stack';
import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from 'react-native-paper';
import { Audio } from 'expo-av';

import { RootStackParamList } from '../types';

export default function NotFoundScreen({navigation,route}){
    const [sound, setSound] = React.useState();
    const {uri} = route.params;

    async function playSound() {
        console.log('Loading Sound');
        console.log(uri);
        const { sound } = await Audio.Sound.createAsync(
            {uri:uri}
        );
        setSound(sound);
    
        console.log('Playing Sound');
        await sound.playAsync(); }
    
      React.useEffect(() => {
        return sound
          ? () => {
              console.log('Unloading Sound');
              sound.unloadAsync(); }
          : undefined;
      }, [sound]);



  return (
    <View style={styles.container}>
     <Button mode="contained" onPress={playSound}>Play</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
