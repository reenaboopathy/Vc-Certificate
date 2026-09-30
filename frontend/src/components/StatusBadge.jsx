import "./StatusBadge.css";

function StatusBadge({ status }) {
  const getStatusClass = () => {
    switch (status) {
      case "Active":
        return "status-active";

      case "Expiring Soon":
        return "status-warning";

      case "Expired":
        return "status-expired";

      case "Pending":
        return "status-pending";

      case "Cancelled":
        return "status-cancelled";

      default:
        return "status-default";
    }
  };

  return (
    <span className={`status-badge ${getStatusClass()}`}>
      {status || "Unknown"}
    </span>
  );
}

export default StatusBadge;