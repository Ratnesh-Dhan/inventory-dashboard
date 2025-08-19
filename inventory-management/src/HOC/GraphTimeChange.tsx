import { PerMinute } from "@/types/perminute";
import { GraphProps } from "@/types/graphProps";
import React, { useMemo, useState } from "react";
import { elements } from "chart.js";

const withAggregation = (
  IncomingComponent: React.ComponentType<GraphProps>
) => {
  const WithAggregation: React.FC<{ entries: PerMinute[]; title?: string }> = ({
    entries,
    title,
  }) => {
    const [mode, setMode] = useState<"minute" | "hour" | "day">("minute");

    const { labels, values } = useMemo(() => {
      let labelsMapped: string[] = [];
      let valuesMapped: number[] = [];

      if (mode === "minute") {
        labelsMapped = entries.map((e) =>
          String(e.timestamp.split(" ")[1]).slice(0, 5)
        );
        valuesMapped = entries.map((e) => e.count);
      } else if (mode === "hour") {
        let count = 0;
        entries.forEach((element) => {
          // Group by hour: sum counts for consecutive entries with the same hour
          if (labelsMapped.length === 0) {
            // If no labels yet, initialize with first element
            labelsMapped.push(
              String(element.timestamp.split(" ")[1]).slice(0, 2)
            );
            count = element.count;
          } else {
            const currentHour = String(element.timestamp.split(" ")[1]).slice(
              0,
              2
            );
            if (currentHour === labelsMapped[labelsMapped.length - 1]) {
              count += element.count;
            } else {
              valuesMapped.push(count);
              labelsMapped.push(currentHour);
              count = element.count;
            }
          }
        });
      } else {
        let count = 0;
        entries.forEach((element) => {
          if (labelsMapped.length === 0) {
            labelsMapped.push(element.timestamp.split(" ")[0]);
            count = element.count;
          } else {
            const currentDay = element.timestamp.split(" ")[0];
            if (currentDay === labelsMapped[labelsMapped.length - 1]) {
              count += element.count;
            } else {
              valuesMapped.push(count);
              labelsMapped.push(currentDay);
              count = element.count;
            }
          }
        });
      }
      return { labels: labelsMapped, values: valuesMapped };
    }, [entries, mode]);

    return (
      <div className="border border-blue m-38">
        <div>
          <button onClick={() => setMode("minute")} className="button">
            Minute
          </button>
          <button onClick={() => setMode("hour")} className="button">
            Hour
          </button>
          <button onClick={() => setMode("day")} className="button">
            Day
          </button>
        </div>
        <IncomingComponent labels={labels} values={values} title={title} />
      </div>
    );
  };
  return WithAggregation;
};

export default withAggregation;
