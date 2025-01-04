import { useCallback, useContext, useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell, getKeyValue,
  Tooltip
} from "@nextui-org/react";
import { CreatePositionModal } from '@/components/CreatePositionModal';
import { CreatePositionModalContext } from '@/context/CreatePositionModalContext';
import { Button } from '@nextui-org/button';
import { calculatePnL } from '@/utils/positions';
import useSWR from 'swr';
import { swrFetcher } from '@/config/swrAxios';
import { GETAllPositionsResponse } from '@/api/position/GETAllPositionsResponse';
import { DeleteIcon } from '@/components/DeleteIcon';
import { CloseIcon } from '@/components/CloseIcon';
import { ClosePositionModal } from '@/components/ClosePositionModal';

interface Column {
  name: string;
  uid: string;
  sortable?: boolean;
}

export const columns: Column[] = [
  // {name: "ID", uid: "id", sortable: true},
  {name: "Ticker", uid: "ticker", sortable: true},
  // {name: "Tipo", uid: "type", sortable: true},
  {name: "Cantidad", uid: "ammount", sortable: true},
  {name: "Precio", uid: "price"},
  { name: "PyG", uid: "pnl" },
  { name: "Actual", uid: "current" },
  {name: "Actions", uid: "actions"},
];

export function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

interface PositionRow {
  id: string;
  ticker: string;
  // type: string;
  ammount: number;
  price: number;
  current: number;
  pnl: number;
  actions: string;
}

export default function Operations() {
  const createPositionModalContext = useContext(CreatePositionModalContext);
  const [modalOpen, setModalOpen] = useState({
    // createPosition: false,
    closePosition: false,
  });
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const { data: positions, mutate } = useSWR<GETAllPositionsResponse>('/position', swrFetcher, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnMount: true,
    revalidateOnReconnect: false,
  });
  const [rows, setRows] = useState<PositionRow[]>([]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      mutate();
    }, 5000);
    return () => clearInterval(intervalId);
  }, [mutate]);

  useEffect(() => {
    if (!positions) return
    const updatedRows = positions.map(position => ({
      id: position.id,
      ticker: position.ticker.symbol,
      // type: capitalize(position.ticker.symbol),
      ammount: position.quantity,
      price: position.price,
      pnl: parseFloat(calculatePnL(position.price, position.ticker.price, position.quantity).toFixed(2)),
      current: position.ticker.price,
      actions: "View",
    }));
    console.log('Actualizando rows', updatedRows);
    setRows(updatedRows);
  }, [positions]);

  const renderCell = useCallback((rows: { [x: string]: any; }, columnKey: string | number) => {
    const cellValue = rows[columnKey];

    switch (columnKey) {
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            {/* <Tooltip content="Edit user">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EditIcon />
              </span>
            </Tooltip> */}
            <Tooltip color="danger" content="Delete position">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <DeleteIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Close position">
              <button
                onClick={() => {
                  setSelectedPosition(rows.id);
                  setModalOpen({ ...modalOpen, closePosition: true });
                }}
                className="text-lg text-danger cursor-pointer active:opacity-50"
              >
                <CloseIcon />
              </button>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <>
      <CreatePositionModal
        isOpen={createPositionModalContext.isOpen}
        onClose={createPositionModalContext.closeModal}
        onOpen={createPositionModalContext.openModal}
      />
      <ClosePositionModal
        isOpen={modalOpen.closePosition}
        onClose={() => {
          setModalOpen({ ...modalOpen, closePosition: false })
          setSelectedPosition(null);
        }}
        onOpen={() => setModalOpen({ ...modalOpen, closePosition: true })}
        positionId={selectedPosition}
      />
      <Table topContent={<TopContent/>} aria-label="Example table with dynamic content">
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}
        </TableHeader>
        <TableBody items={rows}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}

const TopContent = () => {
  const createPositionModalContext = useContext(CreatePositionModalContext);

  return (
    <div className="flex flex-row gap-4 justify-end">
      <Button onClick={createPositionModalContext.openModal} className='w-fit'>
        Agregar posición
      </Button>
    </div>
  )
}
