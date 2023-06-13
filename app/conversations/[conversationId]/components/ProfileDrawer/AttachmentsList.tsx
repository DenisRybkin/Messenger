'use client';

import { useConversation } from '@/hooks/useConversation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { ImageModal } from '@/app/conversations/[conversationId]/components/ImageModal';
import { usePaging } from '@/hooks/usePaging';
import { toast } from 'react-toastify';
import { Message } from '@prisma/client';
import { EmptyItems } from '@/components/EmptyItems';
import { ViewTrigger } from '@/components/ViewTrigger';

interface AttachmentsListProps {
  isOpenDrawer: boolean;
}

export const AttachmentsList = (props: AttachmentsListProps) => {
  const { conversationId } = useConversation();

  const [isOpenImageModal, setIsOpenImageModal] = useState<boolean>(false);
  const [srcImageToOpen, setSrcImageToOpen] = useState<string>('');

  const attachments = usePaging<Message>(
    params =>
      axios.get(`/api/conversations/${conversationId}/attachments`, { params }),
    undefined,
    undefined,
    undefined,
    () => toast.error('Something went wrong')
  );
  const handleOpenImageOpen = (src: string) => () => {
    setSrcImageToOpen(src);
    setIsOpenImageModal(true);
  };

  const handleCloseImageOpen = () => setIsOpenImageModal(false);

  useEffect(() => {
    props.isOpenDrawer && !attachments.items.length && attachments.restart();
  }, [props.isOpenDrawer]);

  return (
    <>
      <ImageModal
        isOpen={isOpenImageModal}
        src={srcImageToOpen}
        onClose={handleCloseImageOpen}
      />
      <div className="mt-5 flex-1 relative w-full flex gap-2 items-start flex-wrap overflow-y-auto">
        {/* <Loader size="md" />*/}
        {!attachments.items.length && !attachments.info.isLoading ? (
          <EmptyItems text="Attachment&#39;s list is empty" />
        ) : (
          attachments.items.map(attachment => (
            <div
              key={attachment.id}
              className="w-[31.5%] rounded-md overflow-hidden"
            >
              <Image
                width={117}
                height={117}
                src={attachment.image!}
                onClick={handleOpenImageOpen(attachment.image!)}
                alt="Attachment"
                className="w-full h-full object-cover cursor-pointer hover:scale-110 transition translate"
              />
            </div>
          ))
        )}
        <ViewTrigger
          onIntersection={attachments.loadNext}
          mt={5}
          hidden={attachments.info.isDone}
        />
      </div>
    </>
  );
};
