import { createNavigationContainerRef, StackActions } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef();

const isReady = () => navigationRef.isReady();

export const navigate = (name, params) => {
  if (isReady()) {
    navigationRef.navigate(name, params);
  }
};

export const push = (name, params) => {
  if (isReady()) {
    navigationRef.dispatch(StackActions.push(name, params));
  }
};

export const replace = (name, params) => {
  if (isReady()) {
    navigationRef.dispatch(StackActions.replace(name, params));
  }
};

export const goBack = () => {
  if (isReady() && navigationRef.canGoBack()) {
    navigationRef.goBack();
  }
};

export const reset = (state) => {
  if (isReady()) {
    navigationRef.reset(state);
  }
};
