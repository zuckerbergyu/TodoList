import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { Container, Box, Grid, Button, TextField } from "@mui/material";
import { definitions } from "../../types/database";
import { supabase } from "../../utils/supabaseClient";
import { useCreateChatMessage, useGetChatList } from "../../api";

// 처음에는 메세지목록을 그냥 가져오고 ,
// 그다음에는 변화된것을 가져와서 여기서만 보여줌?.
const Home: NextPage = () => {
  const [input, setInput] = useState("");
  const [newMessage, setNewMessage] = useState<definitions["Chat"][]>([]);
  const { data: chatList } = useGetChatList();
  const { mutateAsync: createChatMessage } = useCreateChatMessage();

  useEffect(() => {
    if (chatList) {
      console.log("이게호출되는지");
      setNewMessage(chatList);
    }
  }, [chatList]);

  const handleCreateChatMessage = async (chatMessage: string) => {
    await createChatMessage({
      name: "이름",
      text: chatMessage,
    });
    setInput("");
  };

  useEffect(() => {
    const subscribe = supabase
      .from<definitions["Chat"]>("Chat")
      .on("*", (payload) => {
        if (newMessage) {
          setNewMessage([...newMessage, payload.new]);
          console.log("payload.new", payload.new);
          console.log("newMessage : ", newMessage);
        }
      })
      .subscribe();
    return () => {
      supabase.removeSubscription(subscribe);
    };
  }, []);

  const handleInput = (event: any) => {
    setInput(event.target.value);
  };

  return (
    <Container maxWidth="sm">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateChatMessage(input);
        }}
      >
        <Grid sx={styles.inputRoot} container spacing={0}>
          <Grid xs={10}>
            <TextField
              sx={styles.input}
              onChange={handleInput}
              value={input}
            ></TextField>
          </Grid>
          <Grid xs={2}>
            <Button sx={styles.button} type="submit">
              Add
            </Button>
          </Grid>
        </Grid>
      </form>
      <Box>
        {newMessage.map(({ text }) => {
          return <div style={{ color: "red" }}>메세지 : {text}</div>;
        })}
      </Box>
    </Container>
  );
};
export default Home;

const styles = {
  inputRoot: {
    backgroundColor: "skyblue",
    textAlign: "center",
  },
  input: { width: "100% " },
  button: {
    width: "100%",
    height: "100%",
    backgroundColor: "red",
    color: "white",
  },
  closeIcon: {
    width: 10,
    justifyContent: "end",
    paddingRight: 0,
  },
  listItems: {
    padding: 0,
    backgroundColor: "gray",
  },
};
