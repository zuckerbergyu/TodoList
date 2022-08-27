import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { supabase } from "../utils/supabaseClient";
import {
  Container,
  Grid,
  Button,
  Checkbox,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemButton,
  ListItemText,
  IconButton,
} from "@mui/material";
import { definitions } from "../types/database";
import CloseIcon from "@mui/icons-material/CloseRounded";

/**
 * 1. 리액트 / Node.js / Typescript를 가지고 Todo List 만들기
 * 2. Supabase를 이용한 백엔드 서버를 통해 API 통신하기
 * 3. 2번을 구성할 때 타입 자동 적용하기
 *
 *  npm run update-types:db
 */

// TodoItem 타입을 만듬 ---> definitions["TodoItem"]
// interface TodoItem {
//   id: number;
//   text: string;
//   checked: boolean;
// }

const useGetTodoList = async (): Promise<definitions["TodoItem"][] | null> => {
  const { data, error } = await supabase
    .from<definitions["TodoItem"]>("TodoItem")
    .select("*")
    .order("id", { ascending: false });
  if (error) {
    return [];
  }
  return data;
};

const useInsertTodoItem = async (todoItem: definitions["TodoItem"]) => {
  const { data, error } = await supabase
    .from<definitions["TodoItem"]>("TodoItem")
    .insert([todoItem]);
  if (error) {
    alert(error);
  }
  return data;
};

const useCheckTodoItem = async (todoItem: definitions["TodoItem"]) => {
  const { data, error } = await supabase
    .from<definitions["TodoItem"]>("TodoItem")
    .update(todoItem)
    .eq("id", todoItem.id);
  if (error) {
    alert(error);
  }
  return data;
};

const useDeleteTodoItem = async (id: number) => {
  const { data, error } = await supabase
    .from<definitions["TodoItem"]>("TodoItem")
    .delete()
    .eq("id", id);
  if (error) {
    alert(error);
  }
  return data;
};

const Home: NextPage = () => {
  const [input, setInput] = useState("");
  const [todos, setTodos] = useState<definitions["TodoItem"][]>([]);
  const getTodoItem = () =>
    useGetTodoList().then((todoList) => setTodos(todoList || []));

  useEffect(() => {
    getTodoItem();
  }, []);

  const handleInput = (event: any) => {
    setInput(event.target.value);
  };
  const handleCreateTodo = (todoItem: string) => {
    if (todoItem) {
      useInsertTodoItem({
        id: todos[0].id + 1,
        text: todoItem,
        checked: false,
      }).then((data) => {
        if (data) {
          getTodoItem();
          setInput("");
        }
      });
    }
  };
  const handleCheck = (id: number) => {
    const index = todos.findIndex((item) => item.id === id);
    const temp = todos.slice(); // [...todos]
    const selected = temp[index];
    useCheckTodoItem({ ...selected, checked: !selected.checked }).then(
      (data) => {
        if (data) {
          getTodoItem();
        }
      }
    );
  };

  const handleDelete = (id: number) =>
    useDeleteTodoItem(id).then((data) => {
      if (data) {
        getTodoItem();
      }
    });

  return (
    <Container maxWidth="sm">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleCreateTodo(input);
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
      <List sx={styles.listItems} dense>
        {todos.map((item) => {
          return (
            <ListItem
              key={item.id}
              disablePadding
              secondaryAction={
                <IconButton
                  edge="end"
                  aria-label="delete"
                  sx={styles.closeIcon}
                  onClick={() => handleDelete(item.id)}
                >
                  <CloseIcon />
                </IconButton>
              }
            >
              <ListItemButton
                role={undefined}
                onClick={() => handleCheck(item.id)}
              >
                <ListItemIcon>
                  <Checkbox
                    edge="start"
                    checked={item.checked}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{
                      "aria-labelledby": item.id as unknown as string,
                    }}
                  />
                </ListItemIcon>
                <ListItemText
                  id={item.id as unknown as string}
                  primary={item.text}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
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
