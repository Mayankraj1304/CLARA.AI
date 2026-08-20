import { initializeSocketConnection } from "../services/chat.socket";
import {
  sendMessage,
  getChats,
  getMessages,
  deleteChat,
} from "../services/chat.api";
import {
  setChats,
  setCurrentChatId,
  setError,
  setLoading,
  createNewChat,
  addNewMessage,
  addMessages,
} from "../chat.slice";
import { useDispatch } from "react-redux";

export const useChat = () => {
  const dispatch = useDispatch();

  async function handleSendMessage({ message, chatId }) {
    dispatch(setLoading(true));
    try {
      const data = await sendMessage({ message, chatId });
      const { chat, userMessage, aiMessage } = data;
      dispatch(
        createNewChat({
          chatId: chat._id,
          title: chat.title,
        }),
      );
      dispatch(
        addNewMessage({
          chatId: chat._id,
          id: userMessage._id,
          content: userMessage.content,
          role: userMessage.role,
        }),
      );
      dispatch(
        addNewMessage({
          chatId: chat._id,
          id: aiMessage._id,
          content: aiMessage.content,
          role: aiMessage.role,
        }),
      );
      dispatch(setCurrentChatId(chat._id));
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message || "Unable to send message"),
      );
    } finally {
      dispatch(setLoading(false));
    }
  }
  async function handleGetChats() {
    dispatch(setLoading(true));
    try {
      const data = await getChats();
      const { chats } = data;
      dispatch(
        setChats(
          chats.reduce((acc, chat) => {
            acc[chat._id] = {
              id: chat._id,
              title: chat.title,
              messages: [],
              lastUpdated: chat.updatedAt,
            };
            return acc;
          }, {}),
        ),
      );
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message || "Unable to load chats"),
      );
    } finally {
      dispatch(setLoading(false));
    }
  }

  async function handleOpenChat(chatId) {
    dispatch(setLoading(true));
    try {
      const data = await getMessages(chatId);
      const { messages } = data;

      const formattedMessages = messages.map((msg) => ({
        id: msg._id,
        content: msg.content,
        role: msg.role,
      }));
      dispatch(
        addMessages({
          chatId,
          messages: formattedMessages,
        }),
      );
      dispatch(setCurrentChatId(chatId));
    } catch (error) {
      dispatch(
        setError(error.response?.data?.message || "Unable to load messages"),
      );
    } finally {
      dispatch(setLoading(false));
    }
  }

  return {
    initializeSocketConnection,
    handleSendMessage,
    handleGetChats,
    handleOpenChat,
  };
};
