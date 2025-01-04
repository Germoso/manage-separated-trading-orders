import { useCallback, useContext, useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell, Tooltip,
  Select,
  SelectItem
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
import { DeletePositionModal } from '@/components/DeletePositionModal';

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


type PositionStatus = "OPEN" | "CLOSED";
type GeneralStatus = "ACTIVE" | "INACTIVE";

interface PositionStatusOption {
  key: PositionStatus;
  label: string;
}

export const positionStatuses: PositionStatusOption[] = [
  { key: "OPEN", label: "Open" },
  { key: "CLOSED", label: "Closed" },
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
  status: GeneralStatus;
  positionStatus: PositionStatus;
}

interface Filters {
  positionStatus: PositionStatus;
}

export default function Operations() {
  const createPositionModalContext = useContext(CreatePositionModalContext);
  const [modalOpen, setModalOpen] = useState({
    // createPosition: false,
    closePosition: false,
    deletePosition: false,
  });
  const [filters, setFilters] = useState<Filters>({
    positionStatus: "OPEN",
  });
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null);
  const { data: positions, mutate } = useSWR<GETAllPositionsResponse>(`/position?positionStatus=${filters.positionStatus}`, swrFetcher, {
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
      pnl: calculatePnL(position.price, position.ticker.price, position.quantity),
      current: position.ticker.price,
      actions: "View",
      status: position.generalStatus,
      positionStatus: position.positionStatus
    }));
    setRows(updatedRows);
  }, [positions]);

  const renderCell = useCallback((rows: PositionRow, columnKey: keyof PositionRow) => {
    const cellValue = rows[columnKey];
    console.log('rpw', rows);
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
            <button
                onClick={() => {
                  setSelectedPosition(rows.id);
                  setModalOpen({ ...modalOpen, deletePosition: true });
                }}
                className="text-lg text-danger cursor-pointer active:opacity-50"
              >
                <DeleteIcon />
              </button>
            </Tooltip>
            {rows.positionStatus === 'OPEN' &&
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
            }
          </div>
        );
      default:
        return cellValue;
    }
  }, [rows]);

  return (
    <>
      <CreatePositionModal
        refresh={mutate}
        isOpen={createPositionModalContext.isOpen}
        onClose={createPositionModalContext.closeModal}
        onOpen={createPositionModalContext.openModal}
      />
      <ClosePositionModal
        refresh={mutate}
        isOpen={modalOpen.closePosition}
        onClose={() => {
          setModalOpen({ ...modalOpen, closePosition: false })
          setSelectedPosition(null);
        }}
        onOpen={() => setModalOpen({ ...modalOpen, closePosition: true })}
        positionId={selectedPosition}
      />
      <DeletePositionModal
        refresh={mutate}
        isOpen={modalOpen.deletePosition}
        onClose={() => {
          setModalOpen({ ...modalOpen, deletePosition: false })
          setSelectedPosition(null);
        }}
        onOpen={() => setModalOpen({ ...modalOpen, deletePosition: true })}
        positionId={selectedPosition}
      />
      <Table
        topContent={
          <TopContent setFilters={setFilters} />
        }
        aria-label="Example table with dynamic content">
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}
        </TableHeader>
        <TableBody items={rows}>
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey as keyof PositionRow)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </>
  );
}

interface TopContentProps {
  setFilters: (filters: { positionStatus: PositionStatus }) => void;
}

const TopContent = ({ setFilters } : TopContentProps) => {
  const createPositionModalContext = useContext(CreatePositionModalContext);

  return (
    <div className="flex flex-row gap-4 justify-end">
      <Select className="max-w-xs" placeholder="Select position status" onChange={(e) => {
        setFilters({ positionStatus: e.target.value as unknown as PositionStatus || 'OPEN' });
      }}>
        {positionStatuses.map((status) => (
          <SelectItem key={status.key}>{status.label}</SelectItem>
        ))}
      </Select>
      <Button onClick={createPositionModalContext.openModal} className='w-fit'>
        Agregar posición
      </Button>
    </div>
  )
}
