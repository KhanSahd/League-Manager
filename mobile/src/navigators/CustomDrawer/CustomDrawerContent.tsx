import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from "@react-navigation/drawer";
import * as SecureStore from "expo-secure-store";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logout } from "@/redux/slices/AuthSlice";
import { Image, View } from "react-native";
import { MotiView } from "moti";
import { Text } from "@/ui/text";
import { RootState } from "@/redux/store";

const CustomDrawerContent = (props: any) => {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state: RootState) => state.auth.user);

  async function doLogOut() {
    await SecureStore.deleteItemAsync("token");
    dispatch(logout());
  }

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label={() => (
          <View className="flex-row items-center">
            <MotiView
              className="w-1/2 h-32 flex items-center justify-center"
              from={{
                opacity: 0.9,
                scale: 0.98,
                rotate: "-6deg",
                translateY: -8,
              }}
              animate={{
                opacity: 1,
                scale: 1.02,
                rotate: "6deg",
                translateY: 8,
              }}
              transition={{
                type: "timing",
                duration: 2000,
                loop: true,
                repeatReverse: true,
              }}
            >
              <Image
                source={require("../../../assets/transparentLogo.png")}
                className="w-full h-full"
                resizeMode="contain"
              />
            </MotiView>
            {/* User Profile */}
            <View className="w-1/2 justify-center pt-5 gap-2 items-center flex-col">
              <Image
                source={require("../../../assets/profile_pic.png")}
                className="w-1/2 h-16 rounded-full"
              />
              <View>
                <Text>
                  {(user?.firstName.charAt(0).toUpperCase() as string) +
                    user?.firstName.slice(1)}{" "}
                  {(user?.lastName.charAt(0).toUpperCase() as string) +
                    user?.lastName.slice(1)}
                </Text>
              </View>
            </View>
          </View>
        )}
        onPress={() => null}
      />
      {/* Renders your default screen items */}
      <DrawerItemList {...props} />
      {/* Renders your custom non-screen item */}
      <DrawerItem label="Log Out" onPress={doLogOut} />
    </DrawerContentScrollView>
  );
};

export default CustomDrawerContent;
