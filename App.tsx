import React from 'react';
import * as notifications from "expo-notifications";
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


const customComponentTheme = {
  Button: {
    defaultProps: {
      borderRadius: "xl",
      borderWidth: "2",
      _dark: {
        bg: "rgb(0, 0, 200)",
        color: "rgb(255,255,255)",
        borderColor: "rgb(150,150,255)"
      },
      _light: {
        bg: "rgb(150, 150, 255)",
        color: "rgb(0,0,0)",
        borderColor: "rgb(0,0,200)"
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
  const [notificationRequesting, setNotificationRequesting] = React.useState<boolean>(false);
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

  const requestNotificationPermission = async (): void => {
    const result = await notifications.getPermissionsAsync();
    if (result.granted) {
      setNotificationRequesting(false);
    } else {
      await notifications.requestPermissionsAsync();
      setNotificationRequesting(false);
    }
  }
  
  React.useEffect(() => {
    requestNotificationPermission();
  })

  return <SSRProvider>
    <NativeBaseProvider theme={customTheme}>
      <RecoilRoot>
        <Box flex={1} _dark={{bg: "black"}}>
          {authorized ? ( (isLoading || notificationRequesting) ? <Loading /> : <MainContainer /> ) : ( signup ? <Signup setSignup={()=>{setSignup(false)}}/> : <Signin setSignup={()=>{setSignup(true)}}/> )}
        </Box>
      </RecoilRoot>
    </NativeBaseProvider>
  </SSRProvider>;
}

export default App;
