import { useState, useEffect, useRef, useCallback } from 'react';
import { Message } from '@mocks/mockMessages.ts';
import { FaAngleDown } from 'react-icons/fa';
import ChatHeader from '@components/chat/ChatHeader';
import ChatInput from '@components/chat/ChatInput';
import useLayoutStore from '@store/useLayoutStore';
import { getConsistentTextColor } from '@utils/chatUtils';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@store/useAuthStore';
import { config } from '@config/env';
import ChatProfileModal from '@components/chat/ChatProfileModal';
import ChatMessage from './ChatMessage';

interface ChatWindowProps {
  onAir: boolean;
  id: string;
}

interface SelectedMessage {
  userId: number;
  element: HTMLElement;
}

const MESSAGE_LIMIT = 150;

export default function ChatWindow({ onAir, id }: ChatWindowProps) {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<SelectedMessage | null>(null);
  const [isScrollPaused, setIsScrollPaused] = useState(false);
  const [showPendingMessages, setShowPendingMessages] = useState(false);
  const [pendingMessages, setPendingMessages] = useState<Message[]>([]);
  const chatRef = useRef<HTMLDivElement | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const accessToken = useAuthStore(state => state.accessToken);
  const { toggleChat } = useLayoutStore();

  const isLoggedIn = accessToken !== null;

  const scrollToBottom = () => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;

  const handleNewMessage = (content: string) => {
    setIsScrollPaused(false);
    socketRef.current?.emit('chat', content);
  };

  const handleUserClick = (userId: number, messageElement: HTMLElement) => {
    if (selectedMessage?.userId === userId) {
      setSelectedMessage(null);
      return;
    }
    setSelectedMessage({ userId, element: messageElement });
  };

  const handleModalClose = () => {
    setSelectedMessage(null);
  };

  const handlePendingMessageNotification = () => {
    setMessages(prevMessages => {
      const updatedMessages = [...prevMessages, ...pendingMessages];
      return updatedMessages.slice(-MESSAGE_LIMIT);
    });
    setPendingMessages([]);
    setShowPendingMessages(false);
    setTimeout(() => {
      scrollToBottom();
    }, 100);
  };

  const chatHandler = useCallback(
    (data: string[]) => {
      const newMessages = data.map(v => JSON.parse(v));

      if (isScrollPaused) {
        setShowPendingMessages(true);
        setPendingMessages(prev => [...prev, ...newMessages]);
      } else {
        setMessages(prevMessages => {
          const updatedMessages = [...prevMessages, ...newMessages];
          return updatedMessages.slice(-MESSAGE_LIMIT);
        });
      }
    },
    [isScrollPaused],
  );

  useEffect(() => {
    if (isScrollPaused) return;

    scrollToBottom();
  }, [isScrollPaused, messages]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const isScrolled = !entry.isIntersecting;
        setShowScrollButton(isScrolled);
      },
      {
        root: chatRef.current,
        threshold: 1,
        rootMargin: '-14px',
      },
    );

    if (bottomRef.current) {
      observer.observe(bottomRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!onAir) return undefined;
    if (socketRef.current?.connected) return undefined;

    const socket = io(`${config.apiBaseUrl}/chats`, {
      transports: ['websocket'],
      auth: {
        token: accessToken,
      },
    });

    socket.on('connect', () => {
      socket.emit('join', { channelId: id });
    });

    socketRef.current = socket;

    return () => {
      if (!onAir) {
        socket.disconnect();
        socketRef.current = null;
      }
    };
  }, [onAir, accessToken, id]);

  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) return undefined;

    socket.off('chat').on('chat', chatHandler);

    return () => {
      socket.off('chat');
    };
  }, [chatHandler]);

  return (
    <div className="relative flex h-full flex-col border-l border-lico-gray-3 bg-lico-gray-4">
      <ChatHeader onClose={toggleChat} onSettingsClick={() => {}} />
      <div
        role="log"
        aria-label="채팅 메시지"
        aria-live="polite"
        ref={chatRef}
        className="h-screen overflow-auto p-4 scrollbar-hide"
      >
        {onAir ? (
          <div className="flex break-after-all flex-col">
            {messages?.map(message => (
              <ChatMessage
                id={message.userId}
                nickname={message.nickname}
                content={message.content}
                color={getConsistentTextColor(message.nickname)}
                onUserClick={(userId, element) => handleUserClick(userId, element)}
              />
            ))}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center font-bold text-xl text-lico-gray-1">
            오프라인 입니다.
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {selectedMessage && (
        <ChatProfileModal
          userId={selectedMessage.userId}
          anchorEl={selectedMessage.element}
          onClose={handleModalClose}
        />
      )}

      <div className="relative">
        {showScrollButton && (
          <button
            aria-label="최신 메시지로 이동"
            type="button"
            onClick={scrollToBottom}
            className="absolute -top-10 right-4 rounded-full bg-lico-orange-2 p-2 text-sm text-lico-gray-1 opacity-75 shadow-lg hover:bg-lico-orange-1"
          >
            <FaAngleDown />
          </button>
        )}
        <ChatInput onSubmit={handleNewMessage} isLoggedIn={isLoggedIn} />
      </div>
    </div>
  );
}
