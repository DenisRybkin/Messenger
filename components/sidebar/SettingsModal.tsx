'use client';

import { User } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import axios from 'axios';
import { toast } from 'react-toastify';
import { Modal } from '@/components/base/Modal';
import { Input } from '@/components/base/inputs/Input';
import Image from 'next/image';
import { CldUploadButton } from 'next-cloudinary';
import { Button } from '@/components/base/Button';
import { Dialog } from '@headlessui/react';
import { FiCamera } from 'react-icons/fi';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
}

export const SettingsModal = (props: SettingsModalProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<User>({
    defaultValues: {
      name: props.currentUser?.name,
      image: props.currentUser?.image,
    },
  });

  const image = watch('image');
  const name = watch('name');

  const handleUpload = (result: any) =>
    setValue('image', result.info.secure_url, {
      shouldValidate: true,
    });

  const handleSuccess = () => {
    router.refresh();
    props.onClose();
  };

  const hasChanges = !(
    props.currentUser?.name == name && props.currentUser?.image == image
  );

  const handleError = () => toast.error('Something went wrong...');

  const submitHandler: SubmitHandler<User> = data => {
    setIsLoading(true);

    axios
      .post('/api/settings', data)
      .then(handleSuccess)
      .catch(handleError)
      .finally(() => setIsLoading(false));
  };

  return (
    <Modal isOpen={props.isOpen} onClose={props.onClose}>
      <form onSubmit={handleSubmit(submitHandler)}>
        <div className="space-y-12">
          <div className="pb-6">
            <Dialog.Title
              as="h3"
              className="text-base font-semibold leading-6 text-gray-900"
            >
              Profile
            </Dialog.Title>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Edit your public information.
            </p>

            <div className="mt-8 flex flex-col items-center gap-y-0">
              <div className="relative [&>button>svg]:hover:opacity-100">
                <CldUploadButton
                  options={{ maxFiles: 1, buttonClass: 'brightness-50' }}
                  onUpload={handleUpload}
                  uploadPreset="lnmivq6c"
                >
                  <FiCamera
                    size={25}
                    className="absolute md:opacity-0 z-10 brightness-100 text-white m-auto inset-0"
                  />
                  <div className="transition-all h-32 w-32 brightness-50 md:brightness-100 md:hover:brightness-50">
                    <Image
                      width={128}
                      height={128}
                      className="rounded-full h-full"
                      src={
                        image ||
                        props.currentUser?.image ||
                        '/images/placeholder.jpg'
                      }
                      alt="Avatar"
                    />
                  </div>
                </CldUploadButton>
              </div>
              <div className="w-full">
                <Input
                  disabled={isLoading}
                  label="Name"
                  id="name"
                  errors={errors}
                  required
                  register={register}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-2 flex items-center justify-end gap-x-6">
          <Button disabled={isLoading} secondary onClick={props.onClose}>
            Cancel
          </Button>
          <Button disabled={isLoading || !hasChanges} type="submit">
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
};
