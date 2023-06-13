'use client';

import { Modal, ModalProps } from '@/components/base/Modal';
import { useRouter } from 'next/navigation';
import { useConversation } from '@/hooks/useConversation';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { FiAlertTriangle } from 'react-icons/fi';
import { Dialog } from '@headlessui/react';
import { Button } from '@/components/base/Button';

interface ConfirmModalProps extends ModalProps {}

export const ConfirmModal = (props: ConfirmModalProps) => {
  const router = useRouter();
  const { conversationId } = useConversation();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSuccess = () => {
    toast.success('Delete conversation is successful!');
    props.onClose();
    router.push('/conversations');
    router.refresh();
  };

  const handleError = () => toast.error('Something went wrong!');

  const handleDelete = () => {
    setIsLoading(true);
    axios
      .delete('/api/conversations/' + conversationId)
      .then(handleSuccess)
      .catch(handleError)
      .finally(() => setIsLoading(false));
  };

  return (
    <Modal {...props}>
      <div className="sm:flex sm:items-start">
        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
          <FiAlertTriangle className="h-6 w-6 text-red-500" />
        </div>
        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
          <Dialog.Title
            as="h3"
            className="text-base font-semibold leading-6 text-gray-900"
          >
            Delete conversation
          </Dialog.Title>
          <div className="mt-5">
            <p className="text-sm text-gray-500">
              Are you sure you want to delete this conversation? This action
              cannot bu undone.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-4 gap-2 flex flex-row-reverse">
        <Button danger disabled={isLoading} onClick={handleDelete}>
          Delete
        </Button>
        <Button secondary disabled={isLoading} onClick={props.onClose}>
          Cancel
        </Button>
      </div>
    </Modal>
  );
};
