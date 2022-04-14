import React from 'react';
import * as firebaseAuth from 'firebase/auth';
import { Box, Center, Text, Link, Input, Button } from "native-base";
import { googleExpoAuthSessionProviderConfig } from '../.././config';
import {getErrorMessage} from "../../utils/errorMessage";


const Login = (props: {setSignup: ()=>void;}) => {
  const auth = firebaseAuth.getAuth();
  
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [errorMessage, setErrorMessage] = React.useState<string>("");

  const hSubmit = async () => {
    try {
      await firebaseAuth.signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      const message = getErrorMessage(error.toString());
      setErrorMessage(message);
    }
  }

  return <Center flex={1} alignItems="stretch">
    <Box alignItems="center">
      <Text fontSize="lg">ログイン</Text>
    </Box>
    <Box mt={2}>
      <Text m={1}>メールアドレス</Text>
      <Input type='email' keyboardType='email-address' onChangeText={(t) => {setEmail(t)}} />
    </Box>
    <Box mt={1}>
      <Text m={1}>パスワード</Text>
      <Input type="password" onChangeText={(t) => {setPassword(t)}} />
    </Box>
    <Box justifyContent="center" m={2}>
      <Text m={1}>{errorMessage}</Text>
    </Box>
    <Box alignItems="flex-end">
      <Button onPress={hSubmit} width="100px" mx={3}>
        ログイン
      </Button>
    </Box>
    <Box alignItems="center" mt={4}>
      <Link m={2} onPress={props.setSignup}>
        ユーザー登録してはじめる
      </Link>
    </Box>
  </Center>
}

export default Login;
