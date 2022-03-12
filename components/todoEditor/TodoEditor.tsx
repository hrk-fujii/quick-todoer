import React from "react";
import { Box, Button} from "native-base";
import {useSetRecoilState} from "recoil";
import {modalShow_TodoEditModal} from "../../defines/atoms";

const TodoEditor = () => {
    const setModalShow = useSetRecoilState(modalShow_TodoEditModal);
    
    return <Box>
        <Button onPress={() => {setModalShow(true)}}>
            追加
        </Button>
    </Box>;
}

export default TodoEditor;
