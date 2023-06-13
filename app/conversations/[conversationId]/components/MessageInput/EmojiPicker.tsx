'use client';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface EmojiPickerProps {
  onClose: () => void;
  onAddEmoji: (emoji: string) => void;
}

export const EmojiPicker = (props: EmojiPickerProps) => {
  return (
    <Picker
      theme="light"
      locale="en"
      data={data}
      emojiSize="20"
      emojiButtonColors={['#0EA5E9']}
      previewPosition="none"
      onEmojiSelect={(e: any) => {
        props.onAddEmoji(e.native);
        props.onClose();
      }}
    />
  );
};
