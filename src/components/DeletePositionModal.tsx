import {
  Modal,
  ModalContent,
  ModalFooter,
  Button, ModalHeader,
  ModalBody
} from "@nextui-org/react";
import { } from "swr";
import { useForm } from 'react-hook-form';
import { deletePositionRequest } from '@/api/position/positionServices';

interface DeletePositionModalProps {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  positionId: string | null;
  refresh: () => void;
}

export function DeletePositionModal ({ isOpen, onClose, positionId, refresh }: DeletePositionModalProps) {
  const { handleSubmit } = useForm({})

  const onSubmit = async () => {
    if(!positionId) return
    await deletePositionRequest(positionId)
    refresh()
    onClose()
  };

  return (
    <Modal isOpen={isOpen} size={'md'} onClose={onClose} isDismissable={false}>
    <ModalContent>
        <ModalHeader>
            Eliminar posición
        </ModalHeader>
        <ModalBody>
          <form action="" className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
            <p>¿Estás seguro de eliminar esta posición?</p>
            <ModalFooter>
              <Button type="button" color="secondary" onClick={onClose}>
                No, cancelar
              </Button>
              <Button type="submit" color="primary">
                Sí, eliminar posición
              </Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

