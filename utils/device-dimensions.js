import { Dimensions } from "react-native";

export const DeviceWidth = Dimensions.get("window").width;

export const DeviceHeight = Dimensions.get("window").height;

export const isTablet = DeviceWidth >= 768;

export const isSmallDevice = DeviceWidth < 360;

export const isLargeDevice = DeviceWidth > 414;

export const getDeviceOrientation = () => {
  const { width, height } = Dimensions.get("window");
  return width > height ? "landscape" : "portrait";
};

export const isPortrait = () => {
  const { width, height } = Dimensions.get("window");
  return height >= width;
};

export const isLandscape = () => {
  const { width, height } = Dimensions.get("window");
  return width >= height;
};
