import {
  CalendarDays,
  FileCheck2,
  MoreVertical,
  Scale,
  UserRound,
  Eye,
  Pencil,
} from "lucide-react";
import StatusBadge from "./StatusBadge";

function getDaysLeft(expiryDate) {
  if (!expiryDate) {
    return null;
  }

  const today = new Date();
  const expiry = new Date(expiryDate);

  today.setHours(0, 0, 0, 0);
  expiry.setHours(0, 0, 0, 0);

  return Math.ceil(
    (expiry - today) / (1000 * 60 * 60 * 24)
  );
}

function formatDate(date) {
  if (!date) {
    return "-";
  }

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatus(expiryDate, currentStatus) {
  if (currentStatus === "Cancelled") {
    return "Cancelled";
  }

  const daysLeft = getDaysLeft(expiryDate);

  if (daysLeft === null) {
    return "Pending";
  }

  if (daysLeft < 0) {
    return "Expired";
  }

  if (daysLeft <= 30) {
    return "Expiring Soon";
  }

  return "Active";
}

export default function CertificateCard({
  certificate = {},
  onView,
  onEdit,
  onMenu,
}) {
  const status = getStatus(
    certificate.expiryDate,
    certificate.status
  );

  const daysLeft = getDaysLeft(
    certificate.expiryDate
  );

  const customerName =
    certificate.customerName ||
    certificate.customer?.customerName ||
    certificate.customer?.companyName ||
    "Unknown Customer";

  const companyName =
    certificate.companyName ||
    certificate.customer?.companyName ||
    "";

  const scaleId =
    certificate.scaleId?.scaleId ||
    certificate.scaleId ||
    "-";

  const serialNumber =
    certificate.serialNumber ||
    certificate.scale?.serialNumber ||
    "-";

  return (
    <article className="certificate-card">
      {/* Header */}

      <div className="certificate-card-header">
        <div className="certificate-card-title">
          <div className="certificate-card-icon">
            <FileCheck2 size={20} />
          </div>

          <div>
            <span className="certificate-label">
              CERTIFICATE
            </span>

            <h3>
              {certificate.certificateNumber || "-"}
            </h3>
          </div>
        </div>

        <div className="certificate-card-menu">
          {onMenu && (
            <button
              type="button"
              className="certificate-menu-button"
              onClick={() =>
                onMenu(certificate)
              }
              aria-label="More options"
            >
              <MoreVertical size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Status */}

      <div className="certificate-card-status">
        <StatusBadge status={status} />

        {daysLeft !== null && (
          <span
            className={`certificate-days ${
              daysLeft < 0
                ? "danger"
                : daysLeft <= 30
                ? "warning"
                : "success"
            }`}
          >
            {daysLeft < 0
              ? `${Math.abs(daysLeft)} days overdue`
              : daysLeft === 0
              ? "Expires today"
              : `${daysLeft} days left`}
          </span>
        )}
      </div>

      {/* Customer */}

      <div className="certificate-card-section">
        <div className="certificate-info-row">
          <div className="certificate-info-icon">
            <UserRound size={16} />
          </div>

          <div>
            <span>Customer</span>

            <strong>
              {customerName}
            </strong>

            {companyName &&
              companyName !== customerName && (
                <small>
                  {companyName}
                </small>
              )}
          </div>
        </div>

        {/* Scale */}

        <div className="certificate-info-row">
          <div className="certificate-info-icon">
            <Scale size={16} />
          </div>

          <div>
            <span>Weighing Scale</span>

            <strong>
              {scaleId}
            </strong>

            <small>
              Serial: {serialNumber}
            </small>
          </div>
        </div>
      </div>

      {/* Dates */}

      <div className="certificate-card-dates">
        <div>
          <span>
            <CalendarDays size={14} />
            Issue Date
          </span>

          <strong>
            {formatDate(
              certificate.issueDate
            )}
          </strong>
        </div>

        <div>
          <span>
            <CalendarDays size={14} />
            Expiry Date
          </span>

          <strong>
            {formatDate(
              certificate.expiryDate
            )}
          </strong>
        </div>
      </div>

      {/* Amount */}

      {(certificate.certificateAmount ||
        certificate.renewalAmount) && (
        <div className="certificate-card-amount">
          <div>
            <span>Certificate Amount</span>

            <strong>
              ₹
              {Number(
                certificate.certificateAmount || 0
              ).toLocaleString("en-IN")}
            </strong>
          </div>

          {certificate.renewalAmount && (
            <div>
              <span>Renewal Amount</span>

              <strong>
                ₹
                {Number(
                  certificate.renewalAmount
                ).toLocaleString("en-IN")}
              </strong>
            </div>
          )}
        </div>
      )}

      {/* Actions */}

      <div className="certificate-card-actions">
        <button
          type="button"
          className="certificate-action secondary"
          onClick={() =>
            onView?.(certificate)
          }
        >
          <Eye size={16} />
          View
        </button>

        <button
          type="button"
          className="certificate-action primary"
          onClick={() =>
            onEdit?.(certificate)
          }
        >
          <Pencil size={16} />
          Edit
        </button>
      </div>
    </article>
  );
}