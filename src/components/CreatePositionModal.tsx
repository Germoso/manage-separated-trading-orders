import {
  Modal,
  ModalContent,
  ModalFooter,
  Button,
  Input, ModalHeader,
  ModalBody
} from "@nextui-org/react";
import { SearchableSelect } from './SearchableSelect';
import useSWR, { } from "swr";
import { swrFetcher } from '@/config/swrAxios';
import { GETAllTickers } from '@/api/tickers/GETAllTickersResponse';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { createPositionRequest } from '@/api/position/positionServices';

interface CreatePositionModalProps {
  isOpen: boolean;
  refresh: () => void;
  onOpen: () => void;
  onClose: () => void;
}

const schema = yup.object({
  tickerId: yup.string().required("Ticker is required"),
  ammount: yup.number().required("Ammount is required"),
  price: yup.number().required("Price is required"),
  // type: yup.string().required("Type is required"),

}).required();

interface CreatePositionFormValues {
  tickerId: string;
  ammount: number;
  price: number;
  // type: string;
}

export function CreatePositionModal ({ isOpen, onClose, refresh }: CreatePositionModalProps) {
  const { data: tickers } = useSWR<GETAllTickers>('/ticker', swrFetcher)
  const { register, handleSubmit, formState: { errors }, setValue, getValues} = useForm({
    resolver: yupResolver(schema)
  })

  const onSubmit = async (data: CreatePositionFormValues) => {
    await createPositionRequest({
      accountId: '6776db61f909e939f8e75d79',
      tickerId: data.tickerId,
      quantity: data.ammount,
      price: data.price
    })

    refresh()
  };

  return (
    <Modal isOpen={isOpen} size={'md'} onClose={onClose} isDismissable={false}>
    <ModalContent>
        <ModalHeader>
            Crear posición
        </ModalHeader>
        <ModalBody>
          <form action="" className='flex flex-col gap-4' onSubmit={handleSubmit(onSubmit)}>
            {/* <Input
              label="Nombre"
              labelPlacement="outside"
              placeholder="Ingrese el nombre"
              type="text"
          /> */}
            {/* <RadioGroup
              className='mb-2'
              classNames={{
                wrapper: 'flex flex-row',
              }}
              label="Tipo" size='sm'
              {...register("type", { required: true })}
              errorMessage={errors.type?.message}
              isInvalid={!!errors.type}
            >
              <Radio value="LONG">Largo</Radio>
              <Radio value="SHORT">Corto</Radio>
            </RadioGroup> */}
            <SearchableSelect
              options={tickers?.map(el => ({ label: el.symbol, value: el.id })) || []}
              onChange={
                (e) => {
                  setValue('tickerId', e.value)
                }
              }
              selectedValue={{
                label: tickers?.find(el => el.id === getValues('tickerId'))?.symbol || '',
                value: getValues('tickerId')
              }}
            />
            <Input
              label="Cantidad"
              labelPlacement="outside"
              placeholder="Ingrese la cantidad"
              type="number"
              {...register("ammount", { required: true })}
              errorMessage={errors.ammount?.message}
              isInvalid={!!errors.ammount}
            />
            <Input
              label="Precio"
              labelPlacement="outside"
              placeholder="Ingrese el precio"
              type="number"
              {...register("price", { required: true })}
              errorMessage={errors.price?.message}
              isInvalid={!!errors.price}
          />
            <ModalFooter>
              <Button type="submit" color="primary">
              Registrar
              </Button>
              <Button type="button" color="secondary" onClick={onClose}>
              Cancelar
              </Button>
            </ModalFooter>
          </form>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}

