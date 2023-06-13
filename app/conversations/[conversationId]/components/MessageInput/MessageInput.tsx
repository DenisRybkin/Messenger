'use client';

import {
  ClipboardEventHandler,
  CSSProperties,
  HTMLAttributes,
  KeyboardEventHandler,
  MutableRefObject,
  useState,
} from 'react';
import { AiOutlineUsergroupAdd } from 'react-icons/ai';
import { FiSmile } from 'react-icons/fi';
import clsx from 'clsx';
import { Popup } from '@/components/base/Popup';
import { EmojiPicker } from '@/app/conversations/[conversationId]/components/MessageInput/EmojiPicker';

interface MessageInputProps extends HTMLAttributes<HTMLDivElement> {
  onChange: (event: any) => void;
  keyDownHandler: KeyboardEventHandler<HTMLDivElement>;
  inputRef: MutableRefObject<HTMLDivElement | null>;
  onAddEmoji: (emoji: string) => void;
  onPaste: ClipboardEventHandler<HTMLDivElement>;
}

export const MessageInput = (props: MessageInputProps) => {
  return (
    <div className="relative w-full flex item-center">
      <div
        ref={props.inputRef}
        suppressContentEditableWarning
        contentEditable
        onInput={props.onChange}
        aria-multiline="true"
        role="textbox"
        onPaste={props.onPaste}
        onKeyDown={props.keyDownHandler}
        data-placeholder={props.placeholder}
        className="overflow-y-auto resize-none max-h-24 min-h-full text-black
        font-light py-2 pl-4 pr-8 bg-neutral-100 w-full rounded-md focus:outline-none"
      />
      <Popup<{ onAddEmoji: (emoji: string) => void }>
        content={EmojiPicker}
        padding={0}
        contentProps={{ onAddEmoji: props.onAddEmoji }}
      >
        <div className="rounded-full inline-block p-2 absolute right-0 text-gray-500 cursor-pointer hover:text-sky-500 transition">
          <FiSmile size={24} />
        </div>
      </Popup>
    </div>
  );
};
