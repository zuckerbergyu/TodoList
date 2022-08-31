import { useState } from "react";
import type { NextPage } from "next";
import {
  useGetTodoList,
  useCreateTodoItem,
  useCheckTodoItem,
  useDeleteTodoItem,
} from "../api";
import {
  Container,
  Box,
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
import CloseIcon from "@mui/icons-material/CloseRounded";
// {
//   data,
//   dataUpdatedAt,
//   error,
//   errorUpdatedAt,
//   failureCount,
//   isError,
//   isFetched,
//   isFetchedAfterMount,
//   isFetching,
//   isPaused,
//   isLoading,
//   isLoadingError,
//   isPlaceholderData,
//   isPreviousData,
//   isRefetchError,
//   isRefetching,
//   isStale,
//   isSuccess,
//   refetch,
//   remove,
//   status,
//   fetchStatus,
// }
/**
 *  npm run update-types:db
 *
 *
 * useQuery => https://tanstack.com/query/v4/docs/reference/useQuery
 *
 * 데이터 조회를 할 때는 useQuery를 사용합니다.
 * useMutation은 React Query를 이용해 서버에 데이터 변경 작업을 요청할 때 사용
 *
 * 1. 리액트 / Node.js / Typescript를 가지고 Todo List 만들기
 * 2. Supabase를 이용한 백엔드 서버를 통해 API 통신하기
 * 3. 2번을 구성할 때 타입 자동 적용하기
 * 4. 웹사이트 올리기 : https://vercel.com/solutions/nextjs
 *
 * 5. react - query를 사용하여 2번에서 만들었던 API를 감싸서 hook 형태로 api 만들기
 * 6. supabase의 realtime 사용해서 실시간 데이터 연동 구현하기
 * 7. 채팅방 구현
 *
 *
 */

// TodoItem 타입을 만듬 ---> definitions["TodoItem"]
// interface TodoItem {
//   id: number;
//   text: string;
//   checked: boolean;
// }

const Home: NextPage = () => {
  const [input, setInput] = useState("");
  const { data: todoList, refetch, isLoading } = useGetTodoList();
  const { mutateAsync: createTodoItem } = useCreateTodoItem();
  const { mutateAsync: checkTodoItem } = useCheckTodoItem();
  const { mutateAsync: deleteTodoItem } = useDeleteTodoItem();

  const handleInput = (event: any) => {
    setInput(event.target.value);
  };
  const handleCreateTodo = async (todoItem: string) => {
    if (todoItem && todoList) {
      await createTodoItem({
        id: todoList.length === 0 ? 0 : todoList[0].id + 1,
        text: todoItem,
        checked: false,
      });
      refetch();
      setInput("");
    }
  };

  const handleCheck = async (id: number) => {
    if (todoList) {
      const index = todoList.findIndex((item) => item.id === id);
      const temp = todoList.slice(); // [...todos]
      const selected = temp[index];
      await checkTodoItem({ ...selected, checked: !selected.checked });
      refetch();
    }
  };

  const handleDelete = async (id: number) => {
    await deleteTodoItem(id);
    refetch();
  };

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
        {todoList?.map((item) => {
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
