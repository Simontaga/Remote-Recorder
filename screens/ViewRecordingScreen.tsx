import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackScreenProps } from '@react-navigation/stack';
import * as React from 'react';
import { useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Button } from 'react-native-paper';

import { RootStackParamList } from '../types';

export default function ViewRecordingScreen({route,navigation}) 
{
    const { uris} = route.params;
    console.log(uris);
    const [uriList,setUriList] = React.useState([]);
    async function getLinks()
    {
      let soundUris = await AsyncStorage.getItem("@uris");

      setUriList(JSON.parse(soundUris));

    }
    useEffect(() => {
      getLinks();
    },[])

  return (
    <View style={styles.container}>
        {uris.map((uri,index) =>
        {
            return(
            <View style={styles.recording} key={index}>
                <Text>{index}</Text>
                <Button mode="contained" onPress={() => navigation.navigate('RecordingScreen',{uri:uri})}>Go to recording</Button>
            </View>
            )
        }
        )}
    </View>
  );
}

const styles = StyleSheet.create({
    recording:{
        flexDirection:'row'
    },
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
