import { Image, Text, View } from "react-native";
import {
  AsyncImage,
  ButtonOne,
  CameraPicker,
  CheckboxOne,
  DropdownOne,
  IconButtonOne,
  LinkOne,
  Map,
  SafeArea,
  Spacer,
  SplitView,
  TextAreaOne,
  TextFieldOne,
  auth_IsUserSignedIn,
  auth_SignIn,
  auth_SignOut,
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
  const [toggle, setToggle] = useState(false)

  useEffect(() => {}, []);

  return (
    <SafeArea styles={{ padding: 26 }} loading={loading}>
      {/* TESTING AREA */}
      <Spacer />

      <CheckboxOne value={toggle} setter={setToggle} text={"Ting of a ting"} />
    </SafeArea>
  );
}
export default Test;
