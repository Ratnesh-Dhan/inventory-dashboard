import React, { useEffect, useRef, useState } from "react";
import Graph from "./Graph";
import CustomTable from "./CustomTable";
import withAggregation from "@/HOC/GraphTimeChange";
import { Entry } from "@/types/entry";
import { PerMinute } from "@/types/perminute";

const ModifiedGraph = withAggregation(Graph);

const LeftDashboard = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [perMinute, setPerMinute] = useState<PerMinute[]>([]);
  const pmref = useRef<EventSource | null>(null);

  useEffect(() => {
    if (pmref.current) return;
    const eventSource = new EventSource(
      "http://localhost:8000/perminute_stream"
    );
    eventSource.onmessage = (event) => {
      const per_minute = JSON.parse(event.data);
      console.log({ incomming: per_minute });
      setPerMinute((prev) => [...prev, per_minute]);
    };

    eventSource.onerror = (err) => {
      console.log("SSE error :", err);
      eventSource.close();
      pmref.current = null;
    };

    return () => {
      eventSource.close();
      pmref.current = null;
    };
  }, []);

  useEffect(() => {
    if (entries.length > 0) {
      setTotal((prev) => prev + entries[entries.length - 1].count);
    }
  }, [entries]);

  // const values = [12, 19, 3, 5, 2, 30, 13];
  // const lables = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "jul"];

  return (
    <div className="gap-2 w-[50vw] pl-2">
      <div className=" darker px-3">
        <CustomTable entries={entries} setEntries={setEntries} />
      </div>
      <div className="darker mt-2 px-3 flex flex-row-reverse">
        <div>
          <span className="text-xl">Current Status</span>
          <p className="text-4xl">{total}</p>
        </div>
        <div id="graph-area" className="h-[45vh]">
          <ModifiedGraph entries={perMinute} />
        </div>
      </div>
    </div>
  );
};

export default LeftDashboard;
