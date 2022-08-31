import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { Container, Box, Grid, Button, TextField } from "@mui/material";
import { definitions } from "../../types/database";
import { supabase } from "../../utils/supabaseClient";
import { getChatList, createChatMessage } from "../../api";

const Home: NextPage = () => {
  const [input, setInput] = useState("");
  const [chatList, setChatList] = useState<definitions["Chat"][]>([]);

  const handleCreateChatMessage = async (chatMessage: string) => {
    await createChatMessage({
      name: "이름",
      text: chatMessage,
    });
    setInput("");
  };

  useEffect(() => {
    getChatList().then((data) => {
      if (data) {
        setChatList(data);
      }
    });
  }, []);

  useEffect(() => {
    console.log("chatList useEffect : ", chatList);
  }, [chatList]);

  useEffect(() => {
    const subscribe = supabase
      .from<definitions["Chat"]>("Chat")
      .on("INSERT", (payload) => {
        console.log("payload.new: ", payload.new);

        setChatList((oldMessage) => {
          console.log([...oldMessage, payload.new]);
          return [payload.new, ...oldMessage];
        });
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
      <div>
        {chatList?.map(({ text, timestamp }) => {
          return (
            <div style={{ color: "red" }}>
              메세지 : {text}-{timestamp}
            </div>
          );
        })}
      </div>
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
