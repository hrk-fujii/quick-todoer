import React from 'react';
import * as firebaseAuth from 'firebase/auth';
import { Row, Center, Text, Input, Button } from "native-base";
import { googleExpoAuthSessionProviderConfig } from '../.././config';


const Login = () => {
  const auth = firebaseAuth.getAuth();
  
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  const hSubmit = async () => {
    try {
      await firebaseAuth.signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      const messageMatch = error.toString().match(/\(auth\/(.*)\)/);
      let message = "";
      if (message !== null) {
        message = messageMatch[1];
      }
      setErrorMessage(message);
    }
  }

  return <Center flex={1}>
    <Row>
      <Text>ログイン</Text>
    </Row>
    <Row>
      <Text>メールアドレス</Text>
      <Input type='email' keyboardType='email-address' onChangeText={(t) => {setEmail(t)}} />
    </Row>
    <Row>
      <Text>パスワード</Text>
      <Input type="password" onChangeText={(t) => {setEmail(t)}} />
    </Row>
    <Row>
      <Text>{errorMessage}</Text>
      <Button onPress={hSubmit}>
        ログイン
      </Button>
    </Row>
  </Center>
}

export default Login;
