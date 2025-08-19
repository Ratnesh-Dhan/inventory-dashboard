"use client";
import { Entry } from "@/types/entry";
import {
  getKeyValue,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import React, { useEffect, useRef, useState } from "react";

const columns = [
  {
    key: "count",
    label: "Count",
  },
  {
    key: "time",
    label: "Time",
  },
  {
    key: "status",
    label: "Status",
  },
];

interface CustomTableProps {
  entries: Entry[];
  setEntries: React.Dispatch<React.SetStateAction<Entry[]>>;
}

const CustomTable: React.FC<CustomTableProps> = ({ entries, setEntries }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState<boolean>(true);
  const esref = useRef<EventSource | null>(null);

  useEffect(() => {
    if (containerRef.current && autoScroll) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [entries, autoScroll]);

  useEffect(() => {
    if (esref.current) return;
    const eventSource = new EventSource("http://localhost:8000/stream");
    esref.current = eventSource;
    eventSource.onmessage = (event) => {
      const newEntry: Entry = JSON.parse(event.data);
      setEntries((prev) => [...prev, newEntry]);
    };
    eventSource.onerror = (err) => {
      console.log("SSE connetion error ", err);
      eventSource.close();
      esref.current = null;
    };
    return () => {
      eventSource.close();
      esref.current = null;
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const isNearBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight <
        50; // px threshold
      setAutoScroll(isNearBottom);
    };

    container.addEventListener("scroll", handleScroll);
    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <React.Fragment>
      <span className="text-xl">Recent Count Updates</span>
      <div className="overflow-auto h-[40vh]" ref={containerRef}>
        <Table
          aria-label="Example table with dynamic content"
          className="border-collapse w-full"
        >
          <TableHeader columns={columns} className="sticky top-0 z-10">
            {(column) => (
              <TableColumn
                key={column.key}
                className="bg-gray-700 rounded-sm sticky top-0 z-10"
              >
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody items={entries}>
            {(item) => (
              <TableRow key={item.id}>
                {(columnKey) => (
                  <TableCell className="border-b border-gray-200 p-2">
                    {getKeyValue(item, columnKey)}
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </React.Fragment>
  );
};
export default CustomTable;
