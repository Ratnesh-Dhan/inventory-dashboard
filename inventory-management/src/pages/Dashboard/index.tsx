import LeftDashboard from "@/pages/Dashboard/LeftDashboard";
import RightDashboard from "@/pages/Dashboard/RightDashboard";
import React from "react";

export const Dashboard = () => {
  return (
    <div className="flex gap-2 w-full min-h-[100vh] lighter">
      <div className=" gap-2">
        <LeftDashboard />
      </div>
      <div className="gap-2 w-full">
        <RightDashboard />
      </div>
    </div>
  );
};
