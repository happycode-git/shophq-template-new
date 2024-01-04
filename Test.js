import { Alert, Button, Image, Text, View } from "react-native";
import {
  Accordion,
  AsyncImage,
  AudioPlayer,
  BarGraphView,
  BlurWrapper,
  ButtonOne,
  ButtonTwo,
  CSVtoJSONConverter,
  CSVtoJSONConverterView,
  CameraPicker,
  ChangeOrderView,
  CheckboxOne,
  ConfettiView,
  DropdownOne,
  FadeWrapper,
  GradientView,
  Grid,
  Icon,
  IconButtonOne,
  IconButtonThree,
  IconButtonTwo,
  IconSegmentedPicker,
  ImageBackground,
  ImagesView,
  LinkOne,
  Loading,
  LocalNotification,
  Map,
  MenuBar,
  NotificationCircle,
  NumberPad,
  PaymentView,
  PlayButton,
  ProgressBar,
  PulsingView,
  RecordingButton,
  RoundedCorners,
  SafeArea,
  SegmentedPicker,
  SegmentedPickerTwo,
  SelectedButton,
  ShowMoreView,
  SlideWrapper,
  SliderView,
  Spacer,
  SplitView,
  TextAreaOne,
  TextFieldOne,
  TextIconButton,
  TimedView,
  TimerView,
  VideoPlayer,
  auth_IsUserSignedIn,
  auth_SignIn,
  auth_SignOut,
  backgrounds,
  checkDate,
  colors,
  firebase_DeleteDocument,
  firebase_GetAllDocuments,
  firebase_GetAllDocumentsListener,
  firebase_GetAllDocumentsListenerByDistance,
  firebase_GetDocument,
  firebase_UpdateDocument,
  format,
  formatDate,
  formatDateTime,
  formatLongDate,
  function_AlgoliaCreateRecord,
  function_AlgoliaDeleteRecord,
  function_AlgoliaSearch,
  function_AsyncString,
  function_ChooseFile,
  function_GetLocation,
  function_OpenFile,
  function_OpenLink,
  function_PickImage,
  function_PlaySound,
  function_SendEmail,
  function_TimedFunction,
  function_UploadFile,
  getDistanceInKilometers,
  getDistanceInMiles,
  layout,
  playSound,
  randomString,
  reduceArray,
  removeDuplicates,
  removeDuplicatesByProperty,
  setupSound,
  sizes,
  storage_DownloadFile,
  storage_UploadFile,
  storage_UploadImage,
} from "./EVERYTHING/BAGEL/Things";
import { useEffect, useState } from "react";

function Test({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [things, setThings] = useState([]);

  useEffect(() => {}, []);

  return (
    <SafeArea loading={loading}>
      <View style={{ flex: 1 }}>
        <Spacer height={160} />
        {/* TESTING AREA */}
        <ButtonOne
          backgroundColor={"rgba(0,0,0,0)"}
          onPress={() => {}}
          padding={10}
        >
          <BlurWrapper styles={[layout.fit_width, { padding: 8 }]}>
            <Text style={[colors.white]}>Press Me</Text>
          </BlurWrapper>
        </ButtonOne>

       

        <Spacer height={20} />
      </View>
    </SafeArea>
  );
}

export default Test;
