import {
  Modal,
  ModalContent,
  ModalFooter,
  Button, ModalHeader,
  ModalBody
} from "@nextui-org/react";
import { } from "swr";
import { useForm } from 'react-hook-form';
import { closePositionRequest } from '@/api/position/positionServices';

interface ClosePositionModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  positionId: string | null;
}

export function ClosePositionModal ({ isOpen, onClose, positionId }: ClosePositionModalProps) {
  const { handleSubmit } = useForm({})

  const onSubmit = async () => {
    if(!positionId) return
    const response = await closePositionRequest(positionId)
    if (response) {
      onClose()
    }
  };

  return (
    <Modal isOpen={isOpen} size={'md'} onClose={onClose} isDismissable={false}>
    <ModalContent>
        <ModalHeader>
            Crear posición
        </ModalHeader>
        <ModalBody>
          <form action="" className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
            <p>¿Estás seguro de cerrar esta posición?</p>
            <ModalFooter>
              <Button type="button" color="secondary" onClick={onClose}>
                No, cancelar
              </Button>
              <Button type="submit" color="primary">
                Sí, cerrar posición
              </Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

