import React from 'react';
import {SSRProvider} from "@react-aria/ssr";
import {RecoilRoot} from "recoil";
import { extendTheme, NativeBaseProvider, Box } from "native-base";
import * as firebaseApp from "firebase/app";
import * as firebaseAuth from "firebase/auth";
import {firebaseConfig} from "./config";
import Signin from "./components/authentication/Login";
import Signup from "./components/authentication/Signup";
import Loading from "./components/container/Loading";
import MainContainer from "./components/container/Main";

// Initialize Firebase
firebaseApp.initializeApp(firebaseConfig);

expoWebBrowser.maybeCompleteAuthSession();


const customComponentTheme = {
  Button: {
    defaultProps: {
      _dark: {
        bg: "rgb(0, 0, 200)",
        color: "rgb(255,255,255)"
      },
      _light: {
        bg: "rgb(150, 150, 255)",
        color: "rgb(0,0,0)"
      }
    }
  }
}

const customThemeConfig = {
  useSystemColorMode: true,
  initialColorMode: "dark"
};
const customTheme = extendTheme({
  components: customComponentTheme,
  config: customThemeConfig
});


function App() {
  const [authorized, setAuthorized] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [signup, setSignup] = React.useState<boolean>(false);
  
  const auth = firebaseAuth.getAuth();
  firebaseAuth.onAuthStateChanged(auth, (user) => {
    if (user) {
      setAuthorized(true);
      setIsLoading(false);
    } else {
      setAuthorized(false);
      setIsLoading(false);
    }
  });

  return <SSRProvider>
    <NativeBaseProvider theme={customTheme}>
      <RecoilRoot>
        <Box flex={1} _dark={{bg: "black"}}>
          {authorized ? ( isLoading ? <Loading /> : <MainContainer /> ) : ( signup ? <Signup setSignup={()=>{setSignup(false)}}/> : <Signin setSignup={()=>{setSignup(true)}}/> )}
        </Box>
      </RecoilRoot>
    </NativeBaseProvider>
  </SSRProvider>;
}

export default App;
