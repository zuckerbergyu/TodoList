import { definitions } from "../types/database";
import { supabase } from "../utils/supabaseClient";
import { useQuery, useMutation } from "react-query";

export const getTodoList = async (): Promise<
  definitions["TodoItem"][] | null
> => {
  const { data, error } = await supabase
    .from<definitions["TodoItem"]>("TodoItem")
    .select("*")
    .order("id", { ascending: false });
  if (error) {
    return [];
  }
  return data;
};
export const useGetTodoList = () => useQuery(["TodoItem"], () => getTodoList());

export const createTodoItem = async (todoItem: definitions["TodoItem"]) => {
  const { data, error } = await supabase
    .from<definitions["TodoItem"]>("TodoItem")
    .insert([todoItem]);
  if (error) {
    alert(error);
  }
  return data;
};
export const useCreateTodoItem = () => useMutation(createTodoItem);

export const checkTodoItem = async (todoItem: definitions["TodoItem"]) => {
  const { data, error } = await supabase
    .from<definitions["TodoItem"]>("TodoItem")
    .update(todoItem)
    .eq("id", todoItem.id);
  if (error) {
    alert(error);
  }
  return data;
};
export const useCheckTodoItem = () => useMutation(checkTodoItem);

export const deleteTodoItem = async (id: number) => {
  const { data, error } = await supabase
    .from<definitions["TodoItem"]>("TodoItem")
    .delete()
    .eq("id", id);
  if (error) {
    alert(error);
  }
  return data;
};
export const useDeleteTodoItem = () => useMutation(deleteTodoItem);

// Chat
export const getChatList = async (): Promise<definitions["Chat"][] | null> => {
  const { data, error } = await supabase
    .from<definitions["Chat"]>("Chat")
    .select("*")
    .order("id", { ascending: false });
  if (error) {
    return [];
  }
  return data;
};
export const useGetChatList = () => useQuery(["Chat"], () => getChatList());

export const createChatMessage = async (chat: any) => {
  const { data, error } = await supabase
    .from<definitions["Chat"]>("Chat")
    .insert([chat]);
  if (error) {
    alert(error);
    console.log(error);
  }
  return data;
};
export const useCreateChatMessage = () => useMutation(createChatMessage);
