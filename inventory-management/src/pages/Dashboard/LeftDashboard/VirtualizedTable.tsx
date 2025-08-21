"use client";
import React, { useEffect, useRef, useState } from "react";
import { FixedSizeList as List, ListOnScrollProps } from "react-window";
import { Entry } from "@/types/entry";

interface VirtualizedTableProps {
  entries: Entry[];
  setEntries: React.Dispatch<React.SetStateAction<Entry[]>>;
}

const ROW_HEIGHT = 40;

const VirtualizedTable: React.FC<VirtualizedTableProps> = ({
  entries,
  setEntries,
}) => {
  const listRef = useRef<List>(null);
  const outerRef = useRef<HTMLDivElement>(null); // ✅ correct ref for scroll container
  const [autoScroll, setAutoScroll] = useState(true);

  useEffect(() => {
    const eventSource = new EventSource("http://localhost:8000/stream");
    eventSource.onmessage = (event) => {
      const newEntry: Entry = JSON.parse(event.data);
      setEntries((prev) => [...prev, newEntry]);
    };
    eventSource.onerror = (err) => {
      console.log("SSE connetion error ", err);
      eventSource.close();
    };
    return () => {
      eventSource.close();
    };
  }, []);
  // Auto scroll when new entries arrive
  useEffect(() => {
    if (autoScroll && listRef.current) {
      listRef.current.scrollToItem(entries.length - 1, "end");
    }
  }, [entries, autoScroll]);

  // Detect user scrolls
  const handleScroll = ({
    scrollDirection,
    scrollUpdateWasRequested,
  }: ListOnScrollProps) => {
    if (!outerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = outerRef.current;

    const isAtBottom = scrollHeight - scrollTop - clientHeight < ROW_HEIGHT;

    // if user scrolled manually upward, disable autoScroll
    if (!scrollUpdateWasRequested && scrollDirection === "backward") {
      setAutoScroll(false);
    }

    // if user is back at bottom, enable autoScroll again
    if (isAtBottom) {
      setAutoScroll(true);
    }
  };

  return (
    <div className="w-full">
      {/* Custom sticky header */}
      <div className="flex justify-between px-4 py-2 bg-gray-200 sticky top-0 z-10 darker">
        <span className="each-header">Count</span>
        <span className="each-header">Time</span>
        <span className="each-header">Status</span>
      </div>

      {/* Virtualized list */}
      <List
        ref={listRef}
        outerRef={outerRef} // ✅ attach ref here
        height={400} // visible area height
        itemCount={entries.length}
        itemSize={ROW_HEIGHT}
        width="100%"
        onScroll={handleScroll}
        className="custom-scrollbar"
      >
        {({ index, style }) => {
          const item = entries[index];
          return (
            <div
              style={style}
              className="flex justify-between px-4 py-2 border-b border-gray-200"
            >
              <span>{item.count}</span>
              <span>{item.time}</span>
              <span>{item.status}</span>
            </div>
          );
        }}
      </List>
    </div>
  );
};

export default VirtualizedTable;
