import * as React from 'react';
import {  StyleSheet } from 'react-native';
//import { TextInput } from 'react-native-gesture-handler';
import { TextInput } from 'react-native-paper';
import { Button } from 'react-native-paper';
import { Badge } from 'react-native-paper';
import {socket} from "../service/socket.js";
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { Audio } from 'expo-av';
import { useEffect } from 'react';
import { RecordingOptions, RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4, RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC } from 'expo-av/build/Audio';
import Navigation from '../navigation';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TabOneScreen({navigation}) {
  const [message,setMessage] = React.useState('');
  //const socket = io("ws://192.168.1.92:3000"); 
  const [room,setRoom] = React.useState(0);
  const [isRecording,setRecording] = React.useState(false);
  const [actualRoom,setActualRoom] = React.useState(0);
 // const [recording, setIsRecording] = React.useState();
  const [recordingUris,setRecordingUris] = React.useState([]);
   Audio.requestPermissionsAsync();
   
  let recording = new Audio.Recording();
  
/*
   useEffect(() => {

    async function getUris()
    {
      var json = await AsyncStorage.getItem('@uris');
      
    if(json !== null && json !== undefined && json.length !== 0)
    {
      console.log(JSON.parse(json));
      setRecordingUris(JSON.parse(json));
    
    }
    }

    getUris();
   

  },[]);
*/

   useEffect(() => {
    /*
    socket.once("isRecordingAnswer", (e) =>{
     // console.log("IS RECORDING ANSWER");
    
    })
    */

    
socket.on("disconnect", (e) =>
{console.log("disconnected")}
);

socket.on("startRecordingSound", (r) => {
  if(!isRecording){
  console.log("started");  
 startRecording();
  setRecording(true);
}
});
socket.on("stopRecordingSound", (r) => {
  
  console.log("stopped");
  stopRecording();
  setRecording(false);

});

//END USE EFFECT 
    },[]);

socket.on("message", (e) => {
  // revert to classic upgrade
 // console.log(e);
});
socket.on("connect", () => {
  //console.log("connected");
  socket.emit("joinRoom",{roomID:room},(response) => {
    if(response.status == "ok"){setActualRoom(room)}
    
   });

},[]);




  const getIsRecording = () => 
  {
    socket.emit("isRecording", {roomID:room}, (response) => {

    })
  }
 
  
 function joinRoom() 
  {
    console.log("join room");
    socket.emit("joinRoom",{roomID:room},(response) => {
     if(response.status == "ok"){setActualRoom(room)}
   //  getIsRecording();
    });
  }

  const setCurrentRoom = (id) => {setRoom(id)}

  async function startRecording() {
      
    try {
      let tempRecording = new Audio.Recording();
      setRecording(true);
      console.log('Requesting permissions..');
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      }); 
      
      recording = tempRecording;

      console.log('Starting recording..');
      await recording.prepareToRecordAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      await recording.startAsync();
      

      //setIsRecording(recording);
      console.log('Recording started');

    } catch (err) {
      console.error('Failed to start recording', err);
      setRecording(false);
    }
  
  }
 async function stopRecording() {
   
    console.log('Stopping recording..');
    try{
    await recording.stopAndUnloadAsync();
    const uri = recording.getURI(); 
    console.log('Recording stopped and stored at', uri);
    setRecordingUris([...recordingUris, uri]);

    let recordingsJSON = await AsyncStorage.getItem("@uris");
    let recordings = JSON.parse(recordingsJSON);

    recordings.push(uri);
    await AsyncStorage.setItem("@uris",JSON.stringify(recordings));
    setRecording(false);
  }
  catch(e)
  {
    
  }
   
  

  }



  return (
    <View style={styles.container}>
      <Button mode="contained" onPress={() => navigation.navigate("ViewRecording",{uris:recordingUris})}>Recordings</Button>
      <View  style={styles.statusContainer}>
        
      <Text>Status : {isRecording ? 'Recording' : 'Not recording' }</Text>
      {isRecording ? <Badge style={{backgroundColor:'red',marginLeft:10}}></Badge> : <Badge style={{backgroundColor:'black',marginLeft:10}}></Badge>}
      </View>
      {actualRoom != 0 ? <Text>Currently in room {actualRoom}</Text> : <Text>Currently in no room</Text>}
      <View style={styles.instruments}>
      <TextInput style={styles.input} label="Room code" editable value={room.toString()} onChangeText={(val) => setCurrentRoom(val)}/>
     
      </View>
      <Button mode="contained" onPress={() => joinRoom(room)}>Join Room</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  statusContainer:{
    flexDirection:'row',
    marginBottom:35,
  },
  input:{
    minWidth:40,
    marginBottom:30,
  },
  instruments:{
    flexDirection:'column',
    maxHeight:60,
    minWidth:200,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
