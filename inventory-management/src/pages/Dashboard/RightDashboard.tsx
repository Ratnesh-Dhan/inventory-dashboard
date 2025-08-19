import React, { useEffect, useState } from "react";
import axios from "axios";

const RightDashboard = () => {
  const [result, setResult] = useState<string>("");

  useEffect(() => {
    axios
      .get("http://localhost:8000")
      .then((response) => {
        setResult(JSON.stringify(response.data));
      })
      .catch((error) => {
        setResult("Error: " + error.message);
      });
  }, []);
  return (
    <div>
      <div className="h-[50vh] mb-2 darker">VIDEO AREA</div>
      <div className="darker h-[40vh]">
        {result ? JSON.parse(result).status : result}
      </div>
    </div>
  );
};

export default RightDashboard;

// "https://jsonplaceholder.typicode.com/todos/1"
