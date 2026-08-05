import { Platform } from 'react-native';

const fonts = {
  heading: Platform.select({
    ios: {
      regular: 'Orbitron-Regular',
      medium: 'Orbitron-Medium',
      semibold: 'Orbitron-SemiBold',
      bold: 'Orbitron-Bold',
      extrabold: 'Orbitron-ExtraBold',
      black: 'Orbitron-Black',
    },
    android: {
      regular: 'Orbitron-Regular',
      medium: 'Orbitron-Medium',
      semibold: 'Orbitron-SemiBold',
      bold: 'Orbitron-Bold',
      extrabold: 'Orbitron-ExtraBold',
      black: 'Orbitron-Black',
    },
  }),
  body: Platform.select({
    ios: {
      thin: 'Montserrat-Thin',
      extralight: 'Montserrat-ExtraLight',
      light: 'Montserrat-Light',
      regular: 'Montserrat-Regular',
      medium: 'Montserrat-Medium',
      semibold: 'Montserrat-SemiBold',
      bold: 'Montserrat-Bold',
      extrabold: 'Montserrat-ExtraBold',
      black: 'Montserrat-Black',
    },
    android: {
      thin: 'Montserrat-Thin',
      extralight: 'Montserrat-ExtraLight',
      light: 'Montserrat-Light',
      regular: 'Montserrat-Regular',
      medium: 'Montserrat-Medium',
      semibold: 'Montserrat-SemiBold',
      bold: 'Montserrat-Bold',
      extrabold: 'Montserrat-ExtraBold',
      black: 'Montserrat-Black',
    },
  }),
};

export default fonts;
