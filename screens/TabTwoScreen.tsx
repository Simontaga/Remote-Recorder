import * as React from 'react';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
//import { io } from "socket.io-client";
import {socket} from "../service/socket.js";
import { color } from 'react-native-reanimated';
import { useEffect } from 'react';
import { io } from 'socket.io-client';
export default function TabTwoScreen() {

  const [message,setMessage] = React.useState('');
  //const socket = io("ws://192.168.1.92:3000"); 
  const [room,setRoom] = React.useState(0);
  const [isRecording,setRecording] = React.useState(false);
/*
  socket.on("startRecording", () => {
    setRecording(true);

  });
*/
useEffect(() => {

  socket.on("connect", () => {
    console.log("connected");
    socket.emit("joinRoom",{roomID:room},(response) => {
      
     });
  
  });

  socket.on("askRecording", () => {
    console.log("asked about record state");
    socket.emit("answerRecording", {roomID:room,recording:isRecording});
  
  });



},[]);




  

  const startRecord = () => 
  {
   
    
    
    socket.emit("startRecording", { roomID:room }, (response) => {
      
    }
    );
    
  
  }
  const stopRecord = () => 
  {
   
   
      
    socket.emit("stopRecording", { roomID:room }, (response) => {
     
    });
    
  
  }

  const createRoom = () => 
  {
    
    /*Generate 8 number room code */
      console.log("pressed new room");
      var newRoom = Math.floor(100000 + Math.random() * 900000).toString();
      setRoom(newRoom); 
      socket.emit("newRoom", { roomID:newRoom }, (response) => {
        console.log(response);
      });
    
    
 
  }

  return (
    <View style={styles.container}>
      <View style={styles.roomCodeContainer}>
      {room > 0 ? <Text style={styles.roomCodeText}>Room Code : {room}</Text> : <Text style={styles.roomCodeText}>Generate a new roomcode</Text>}
      </View>
      <Button mode="outlined" onPress={() => createRoom()}>Create Room</Button>
      <View style={styles.recordButtons}>
      <Button style={styles.recordButton} mode="contained" onPress={() => startRecord()}><Text style={styles.recordButtonText}>Record</Text></Button>
      <Button style={styles.recordButton} mode="contained" onPress={() => stopRecord()}><Text style={styles.recordButtonText}>Stop</Text></Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  roomCodeText:{
    fontSize:25,
  },
  roomCodeContainer:
  {
    elevation:2,
    padding:20,
    borderRadius:4,
    marginBottom:100,
  },
  recordButtonText:{
    textAlignVertical:'center',
    color:'white',

  },
  recordButton:
  {
    height:125,
    width:125,
    margin:35,
    alignItems:'center',
    alignContent:'center',
    justifyContent:'center',
    borderRadius:20,
  },
  recordButtons:{
    flexDirection:'row'
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
