import React from 'react';
import {SSRProvider} from "@react-aria/ssr";
import { extendTheme, NativeBaseProvider, Box } from "native-base";
import * as expoWebBrowser from 'expo-web-browser';
import * as firebaseApp from "firebase/app";
import * as firebaseAuth from "firebase/auth";
import { firebaseConfig, googleExpoAuthSessionProviderConfig } from './config';
import GoogleSignin from "./components/authentication/Login";
import MainContainer from "./components/container/Main";

// Initialize Firebase
firebaseApp.initializeApp(firebaseConfig);

expoWebBrowser.maybeCompleteAuthSession();

const customThemeConfig = {
  useSystemColorMode: true,
  initialColorMode: "dark"
};
const customTheme = extendTheme({config: customThemeConfig});


function App() {
  const [authorized, setAuthorized] = React.useState<boolean>(false);
  
  const auth = firebaseAuth.getAuth();
  firebaseAuth.onAuthStateChanged(auth, (user) => {
    if (user) {
      setAuthorized(true);
    } else {
      setAuthorized(false);
    }
  });

  return <SSRProvider>
    <NativeBaseProvider theme={customTheme}>
      <Box flex={1} _dark={{bg: "black"}}>
        {authorized ? <MainContainer /> : <GoogleSignin />}
      </Box>
    </NativeBaseProvider>
  </SSRProvider>;
}

export default App;
