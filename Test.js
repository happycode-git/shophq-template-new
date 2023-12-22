import { Alert, Image, Text, View } from "react-native";
import {
  AsyncImage,
  AudioPlayer,
  ButtonOne,
  ButtonTwo,
  CameraPicker,
  CheckboxOne,
  DropdownOne,
  Grid,
  Icon,
  IconButtonOne,
  IconButtonThree,
  IconButtonTwo,
  LinkOne,
  Loading,
  LocalNotification,
  Map,
  PaymentView,
  PlayButton,
  RecordingButton,
  RoundedCorners,
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

  useEffect(() => {
    
  }, []);

  return (
    <SafeArea loading={loading}>
      {/* TESTING AREA */}
      <View>
        
      </View>
    </SafeArea>
  );
}
export default Test;
