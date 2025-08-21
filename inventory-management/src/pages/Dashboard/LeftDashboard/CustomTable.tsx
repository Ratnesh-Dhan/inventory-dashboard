"use client";
import { Entry } from "@/types/entry";
import { FixedSizeList as List } from "react-window";
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
      <div id="count-table-header" className="flex justify-between ml-5 mr-36">
        <span className="each-header">Count</span>
        <span className="each-header">Time</span>
        <span className="each-header">Status</span>
      </div>
      <div className="overflow-auto h-[40vh]" ref={containerRef}>
        <List
          height={400}
          itemCount={entries.length}
          itemSize={40}
          width="100%"
        >
          {({ index }) => {
            const item = entries[index];
            return (
              <div className="flex justify-between px-4 py-2 border-b border-gray-200">
                <span>{item.count}</span>
                <span>{item.time}</span>
                <span>{item.status}</span>
              </div>
            );
          }}
        </List>
      </div>
    </React.Fragment>
  );
};
export default CustomTable;
