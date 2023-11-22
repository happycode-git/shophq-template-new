import { Alert, Image, Text, View } from "react-native";
import {
  AsyncImage,
  ButtonOne,
  CameraPicker,
  CheckboxOne,
  DropdownOne,
  Grid,
  Icon,
  IconButtonOne,
  IconButtonTwo,
  LinkOne,
  LocalNotification,
  Map,
  PlayButton,
  SafeArea,
  SegmentedPicker,
  Spacer,
  SplitView,
  TextAreaOne,
  TextFieldOne,
  VideoPlayer,
  auth_IsUserSignedIn,
  auth_SignIn,
  auth_SignOut,
  backgrounds,
  colors,
  firebase_DeleteDocument,
  firebase_GetAllDocuments,
  firebase_GetAllDocumentsListener,
  firebase_GetDocument,
  firebase_UpdateDocument,
  format,
  function_GetLocation,
  function_PickImage,
  layout,
  playSound,
  setupSound,
  sizes,
  storage_UploadImage,
} from "./EVERYTHING/BAGEL/Things";
import { useEffect, useState } from "react";

function Test({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [toggle, setToggle] = useState(true);


  useEffect(() => {
    
  }, [])
  
  return (
    <SafeArea styles={{ padding: 26 }} loading={loading}>
      {/* TESTING AREA */}
      <Spacer />
      
      <VideoPlayer videoPath={require("./assets/VIDEOS/movie.mp4")} radius={10} />

    </SafeArea>
  );
}
export default Test;
