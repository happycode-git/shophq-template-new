import { Image, Text, View } from "react-native";
import {
  AsyncImage,
  ButtonOne,
  CameraPicker,
  LinkOne,
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
  function_PickImage,
  layout,
  sizes,
  storage_UploadImage,
} from "./EVERYTHING/BAGEL/Things";
import { useEffect, useState } from "react";

function Test({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(null);
  const [things, setThings] = useState([]);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    setLoading(true);
    firebase_GetAllDocumentsListener(setLoading, "Test", setThings);
  }, []);

  return (
    <SafeArea styles={{ padding: 26 }} loading={loading}>
      {/* TESTING AREA */}
      <Spacer />

      <AsyncImage path="Images/thing.jpg" />
      <AsyncImage path="Images/thing.jpg" />
    </SafeArea>
  );
}
export default Test;
