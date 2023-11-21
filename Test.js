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
  SafeArea,
  SegmentedPicker,
  Spacer,
  SplitView,
  TextAreaOne,
  TextFieldOne,
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
  sizes,
  storage_UploadImage,
} from "./EVERYTHING/BAGEL/Things";
import { useEffect, useState } from "react";

function Test({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [toggle, setToggle] = useState(true);

  return (
    <SafeArea styles={{ padding: 26 }} loading={loading}>
      {/* TESTING AREA */}
      <Spacer />
    </SafeArea>
  );
}
export default Test;
