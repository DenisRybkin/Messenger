'use client';

import { useConversation } from '@/hooks/useConversation';
import { SubmitHandler, useForm } from 'react-hook-form';
import axios from 'axios';
import { FiImage, FiSend } from 'react-icons/fi';
import { MessageInput } from '@/app/conversations/[conversationId]/components/MessageInput/MessageInput';
import { HiPaperAirplane } from 'react-icons/hi2';
import { CldUploadButton } from 'next-cloudinary';
import {
  ClipboardEventHandler,
  CSSProperties,
  FormEvent,
  KeyboardEventHandler,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { toast } from 'react-toastify';
import clsx from 'clsx';

export const ConversationFrom = () => {
  const { conversationId } = useConversation();
  const [message, setMessage] = useState('');

  const messageInputRef = useRef<HTMLDivElement | null>(null);

  const isDisabled = useMemo(() => !message.trim().length, [message.length]);

  const handleError = () => toast.error('Something went wrong...');

  const handleSubmit = (event?: FormEvent<HTMLFormElement>) => {
    event?.preventDefault();
    setMessage('');
    if (messageInputRef.current) messageInputRef.current.innerText = '';
    axios.post('/api/messages', { message, conversationId }).catch(handleError);
  };

  const handleChangeMessage = (event: any) =>
    setMessage(event.target.innerText);

  const handleUpload = (result: any) => {
    axios
      .post('/api/messages', {
        image: result.info.secure_url,
        conversationId,
      })
      .catch(handleError);
  };

  const handleAddEmoji = (emoji: string) => {
    if (messageInputRef.current) {
      setMessage(prev => prev + emoji);
      messageInputRef.current.innerText += emoji;
    }
  };

  const handlePaste: ClipboardEventHandler<HTMLDivElement> = event => {
    event.preventDefault();
    const text = event.clipboardData?.getData('text/plain');
    if (text && messageInputRef.current) {
      document.execCommand('insertText', false, text);
      const fullText = messageInputRef.current?.innerText;
      fullText && setMessage(fullText);
    }
  };

  const keyDownHandler: KeyboardEventHandler<HTMLDivElement> = e => {
    if (!message.trim().length && e.code == 'Enter') return e.preventDefault();
    if (
      !e.ctrlKey &&
      !e.shiftKey &&
      e.code == 'Enter' &&
      message.trim().length
    ) {
      handleSubmit();
      e.preventDefault();
    }
  };

  return (
    <div className="py-4 px-4 bg-white border-t flex items-center gap-2 lg:gap-4 w-full">
      <CldUploadButton
        options={{ maxFiles: 1 }}
        onUpload={handleUpload}
        uploadPreset="lnmivq6c"
      >
        <FiImage
          size={30}
          className="text-sky-500 hover:text-sky-600 transition"
        />
      </CldUploadButton>
      <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full">
        <MessageInput
          onChange={handleChangeMessage}
          keyDownHandler={keyDownHandler}
          inputRef={messageInputRef}
          placeholder="Write a message"
          onAddEmoji={handleAddEmoji}
          onPaste={handlePaste}
        />
        <button
          disabled={isDisabled}
          type="submit"
          className="rounded-md p-2 cursor-pointer transition disabled:opacity-75"
        >
          <FiSend
            size={30}
            className={clsx(
              'text-gray-400 transition rotate-45',
              !isDisabled && 'text-sky-500 hover:text-sky-600'
            )}
          />
        </button>
      </form>
    </div>
  );
};
