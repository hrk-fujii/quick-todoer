import React from 'react';
import * as expoWebBrowser from 'expo-web-browser';
import { ResponseType } from 'expo-auth-session';
import * as googleExpoAuthSessionProvider from 'expo-auth-session/providers/google';
import * as firebaseAuth from 'firebase/auth';
import { Row, Center, Text, Button } from "native-base";
import { googleExpoAuthSessionProviderConfig } from '../.././config';


const Login = () => {

  const [request, response, promptAsync] = googleExpoAuthSessionProvider.useIdTokenAuthRequest(googleExpoAuthSessionProviderConfig,);

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const auth = firebaseAuth.getAuth();
      // const provider = new GoogleAuthProvider();
      const credential = firebaseAuth.GoogleAuthProvider.credential(id_token);
      firebaseAuth.signInWithCredential(auth, credential);
    }
  }, [response]);

  return (
    <Center flex={1}>
      <Text>ようこそ!</Text>
      <Text>開始するには、サインインしてください。</Text>
      <Button
        disabled={!request} onPress={() => {
          promptAsync();
        }}
      >
        <Text>Googleでサインイン</Text>
      </Button>
      </Center>
  );
}

export default Login;
