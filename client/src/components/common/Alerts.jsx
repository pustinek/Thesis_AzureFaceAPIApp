import React from "react";
import { useGlobal } from "reactn";
import AlertModal from "./AlertModal";

const Alerts = () => {
  const [alerts] = useGlobal("alerts");
  return (
    <div style={{ position: "fixed", bottom: "5px", right: "5px", backgroundColor: "transparent" }}>
      {alerts.map(alert => (
        <AlertModal key={alert.id} type={alert.type} title={alert.title} description={alert.description} />
      ))}
    </div>
  );
};

export default Alerts;
