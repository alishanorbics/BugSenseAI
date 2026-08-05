import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');

const design_width = 430;
const design_height = 932;

export const widthPixel = (size) => (width / design_width) * size;

export const heightPixel = (size) => (height / design_height) * size;

export const font = (size) => {
  const scale = width / design_width;
  const new_size = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(new_size));
};

export default { widthPixel, heightPixel, font };
