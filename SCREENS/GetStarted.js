import { Image, View } from "react-native";
import {
  ButtonOne,
  Spacer,
  TextView,
  format,
  height,
  layout,
  secondaryThemedBackgroundColor,
  themedBackgroundColor,
  themedButtonColor,
  themedButtonTextColor,
  width,
} from "../EVERYTHING/BAGEL/Things";

export function GetStarted({ title, caption, details, onPress, theme }) {
  return (
    <View style={[{ flex: 1 }, layout.padding, layout.separate_vertical]}>
      {/* TOP */}
      <View style={[layout.relative]}>
        <Image
          source={require("../assets/IMAGES/stock1.jpg")}
          style={[{ width: "100%", height: width * 1.2, objectFit: "cover", borderRadius: 12 }]}
        />
      </View>
      {/* BOTTOM */}
      <View
        style={[
          layout.absolute_bottom_full,
          layout.padding,
          layout.margin,
          { backgroundColor: themedBackgroundColor(theme), borderRadius: 20 },
        ]}
      >
        <View style={[layout.padding_vertical]}>
          <View style={[{width: "80%"}, layout.center]}>
          <TextView size={38} theme={theme} styles={[format.center_text, {letterSpacing: -1}]}>
            {title !== undefined ? title : "Ready to begin your journey as a bagel?"}
          </TextView>
          </View>
          {caption !== undefined && (
            <View>
              <Spacer height={10} />
              <TextView theme={theme} styles={[format.center_text]}>{caption}</TextView>
            </View>
          )}
        </View>
        <Spacer height={20} />
        {details !== undefined && (
          <View style={[layout.padding_vertical]}>
            <TextView theme={theme} size={18}>
              {details}
            </TextView>
          </View>
        )}

        <ButtonOne
          backgroundColor={themedButtonColor(theme)}
          radius={100}
          onPress={
            onPress !== undefined
              ? onPress
              : () => {
                  console.log("PRESSED");
                }
          }
        >
          <TextView
            styles={[format.center_text]}
            size={14}
            color={themedButtonTextColor(theme)}
            theme={theme}
          >
            Get Started
          </TextView>
        </ButtonOne>
      </View>
    </View>
  );
}
