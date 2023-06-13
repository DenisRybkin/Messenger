import React, { useState } from 'react';
import { Modal, ModalProps } from '@/components/base/Modal';
import { User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Input } from '@/components/base/inputs/Input';
import { Button } from '@/components/base/Button';
import { Select } from '@/components/base/inputs/Select';

interface IUserOpts {
  value: string;
  label: string;
}

interface IGroupChat {
  name: string;
  members: IUserOpts[];
}

interface GroupChatModalProps extends ModalProps {
  users: User[];
}

export const GroupChatModal = (props: GroupChatModalProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<IGroupChat>({
    defaultValues: {
      name: '',
      members: [],
    },
  });

  const members = watch('members');

  const handleSuccess = () => {
    router.refresh();
    props.onClose();
  };

  const handleError = () => toast.error('Something went wrong!');

  const submitHandler: SubmitHandler<IGroupChat> = data => {
    setIsLoading(true);

    axios
      .post('/api/conversations', { ...data, isGroup: true })
      .then(handleSuccess)
      .catch(handleError)
      .finally(() => setIsLoading(false));
  };
  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <form onSubmit={handleSubmit(submitHandler)}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Create a group chat
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Create a chat with more than 2 people.
            </p>
            <div className="mt-10 flex flex-col gap-y-8">
              <Input
                disabled={isLoading}
                label="Name"
                id="name"
                placeholder="Write a group chat name"
                errors={errors}
                required
                register={register}
              />
              <Select<IUserOpts, true>
                disabled={isLoading}
                label="Members"
                placeholder="Select an users"
                options={props.users.map(user => ({
                  value: user.id,
                  label: user.name ?? `User#${user.id}`,
                }))}
                onChange={value =>
                  setValue('members', value, {
                    shouldValidate: true,
                  })
                }
                isMultiple
                value={members}
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          <Button
            disabled={isLoading}
            onClick={props.onClose}
            type="button"
            secondary
          >
            Cancel
          </Button>
          <Button disabled={isLoading} type="submit">
            Create
          </Button>
        </div>
      </form>
    </Modal>
  );
};
