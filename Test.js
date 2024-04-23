import { Alert, Button, Image, Text, View } from "react-native";
import {
  Accordion,
  AsyncImage,
  AudioPlayer,
  BarCodeView,
  BarGraphView,
  BlurWrapper,
  BorderPill,
  ButtonOne,
  ButtonTwo,
  CSVtoJSONConverter,
  CSVtoJSONConverterView,
  CalendarView,
  CameraPicker,
  CameraView,
  ChangeOrderView,
  CheckboxOne,
  ConfettiView,
  CreditCardScanner,
  DatePicker,
  DateTime,
  DebitCreditCardScanner,
  Divider,
  DropdownOne,
  FadeWrapper,
  GradientView,
  Grid,
  HHMMtoDate,
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
  ModalView,
  NotificationCircle,
  NumberPad,
  OptionsView,
  PaymentView,
  PlayButton,
  ProgressBar,
  ProgressCircle,
  PulsingView,
  QRCodeView,
  QRReader,
  RecordingButton,
  RoundedCorners,
  SafeArea,
  SegmentedPicker,
  SegmentedPickerTwo,
  SelectedButton,
  SeparatedView,
  ShowMoreView,
  SideBySide,
  SlideWrapper,
  SliderCircleView,
  SmallBubble,
  Spacer,
  SplitView,
  SwitchOne,
  TextAreaOne,
  TextFieldOne,
  TextIconPill,
  TextPill,
  TextView,
  TimePicker,
  TimedView,
  TimerView,
  VideoPlayer,
  auth_IsUserSignedIn,
  auth_SignIn,
  auth_SignOut,
  backgrounds,
  checkDate,
  colors,
  copyToClipboard,
  createDate,
  dateToHHMM,
  dateToTime24,
  firebase_CreateDocument,
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
  function_QuickBooksNewSale,
  function_SendEmail,
  function_StripeConnect,
  function_TimedFunction,
  function_UploadFile,
  getDaysOfMonth,
  getDistanceInKilometers,
  getDistanceInMiles,
  getFirstDateOfMonth,
  getInDevice,
  layout,
  monthLongtoNum,
  monthNumToLong,
  playSound,
  randomString,
  reduceArray,
  removeDuplicates,
  removeDuplicatesByProperty,
  setInDevice,
  setupSound,
  shopify_CreateOrder,
  shopify_GetAllProducts,
  shopify_GetStorefrontKey,
  shopify_UpdateProduct,
  sizes,
  storage_DownloadFile,
  storage_UploadFile,
  storage_UploadImage,
  width,
} from "./EVERYTHING/BAGEL/Things";
import { useEffect, useState } from "react";
import { LoginScreen } from "./SCREENS/LoginScreen";
import {
  TopFive,
  TopFour,
  TopOne,
  TopThree,
  TopTwo,
} from "./SCREEN_COMPONENTS/Top";
import { SignUpScreen } from "./SCREENS/SignUpScreen";
import { GetStarted } from "./SCREENS/GetStarted";

function Test({ navigation, route }) {
  const [loading, setLoading] = useState(false);
  const [thing, setThing] = useState("");
  const [toggle, setToggle] = useState(false);
  const [theme, setTheme] = useState("light");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setInDevice("theme", "dark");
    getInDevice("theme", setTheme);
    shopify_GetStorefrontKey(setThing);
  }, []);

  return (
    <SafeArea loading={loading} theme={theme}>
      <Spacer height={100} />
      <IconButtonTwo
        theme={theme}
        onPress={() => {
          shopify_GetAllProducts(thing, (things) => {
            setProducts(things);
            console.log(things[0].variants)
          });
        }}
      />
      <IconButtonTwo
        name={"document-text"}
        onPress={() => {
          shopify_CreateOrder(
            thing,
            products[0],
            10,
            "Jesus",
            "Jimenez",
            "happycode.inbox@gmail.com",
            "1024 E 4th St.",
            "National City",
            "CA",
            "91950",
            "US",
            (data) => {
              // console.log(data);
            }
          );
        }}
        theme={theme}
      />
    </SafeArea>
  );
}

export default Test;
