'use client';

import { Modal, ModalProps } from '@/components/base/Modal';
import Image from 'next/image';

interface ImageModalProps extends ModalProps {
  src?: string | null;
}

export const ImageModal = (props: ImageModalProps) => {
  if (props.src == null) return null;

  return (
    <Modal isOpen={!!props.isOpen} lg onClose={props.onClose}>
      <div className="w-80 h-80">
        <Image
          quality={100}
          className="object-cover"
          fill
          alt="Image"
          src={props.src}
        />
      </div>
    </Modal>
  );
};
