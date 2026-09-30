import {
  Eye,
  FileCheck2,
  MoreVertical,
  Pencil,
  Plus,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";

export default function CertificateTable({
  certificates = [],
  onAddCertificate,
  onViewCertificate,
  onEditCertificate,
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [openMenu, setOpenMenu] = useState(null);

  const filteredCertificates = useMemo(() => {
    const searchValue = searchTerm.trim().toLowerCase();

    if (!searchValue) {
      return certificates;
    }

    return certificates.filter((certificate) => {
      const searchableValues = [
        certificate.certificateNumber,
        certificate.customerName,
        certificate.companyName,
        certificate.scaleId,
        certificate.serialNumber,
        certificate.certificateType,
        certificate.status,
      ];

      return searchableValues.some((value) =>
        String(value || "")
          .toLowerCase()
          .includes(searchValue)
      );
    });
  }, [certificates, searchTerm]);

  const getStatusClass = (status) => {
    const normalizedStatus = String(status || "")
      .trim()
      .toLowerCase();

    if (normalizedStatus === "active") {
      return "status-active";
    }

    if (normalizedStatus === "expiring soon") {
      return "status-warning";
    }

    if (normalizedStatus === "expired") {
      return "status-danger";
    }

    if (normalizedStatus === "cancelled") {
      return "status-neutral";
    }

    return "status-neutral";
  };

  const getStatusLabel = (status) => {
    if (!status) {
      return "Pending";
    }

    return String(status)
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getDaysLeft = (expiryDate) => {
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
  };

  const getDaysLabel = (expiryDate, status) => {
    const daysLeft = getDaysLeft(expiryDate);

    if (daysLeft === null) {
      return "—";
    }

    if (String(status).toLowerCase() === "expired") {
      return `${Math.abs(daysLeft)} days ago`;
    }

    if (daysLeft === 0) {
      return "Expires today";
    }

    return `${daysLeft} days`;
  };

  const handleMenuToggle = (certificateId) => {
    setOpenMenu((currentId) =>
      currentId === certificateId ? null : certificateId
    );
  };

  return (
    <section className="certificate-table-card">
      {/* Header */}

      <div className="certificate-table-header">
        <div className="table-title-area">
          <div className="table-title-icon">
            <FileCheck2 size={20} />
          </div>

          <div>
            <h2>Certificates</h2>
            <p>
              Manage verification certificates and expiry details.
            </p>
          </div>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={onAddCertificate}
        >
          <Plus size={18} />
          Add Certificate
        </button>
      </div>

      {/* Toolbar */}

      <div className="certificate-table-toolbar">
        <div className="customer-search">
          <Search size={18} />

          <input
            type="text"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
            placeholder="Search certificate, customer, scale ID, serial..."
            aria-label="Search certificates"
          />
        </div>

        <div className="customer-count">
          <span>{filteredCertificates.length}</span>
          {filteredCertificates.length === 1
            ? " Certificate"
            : " Certificates"}
        </div>
      </div>

      {/* Table */}

      <div className="table-scroll">
        <table className="data-table">
          <thead>
            <tr>
              <th>Certificate</th>
              <th>Customer</th>
              <th>Scale</th>
              <th>Issue Date</th>
              <th>Expiry Date</th>
              <th>Days Left</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredCertificates.length > 0 ? (
              filteredCertificates.map((certificate, index) => {
                const certificateId =
                  certificate._id ||
                  certificate.id ||
                  index;

                const status =
                  certificate.status || "Pending";

                return (
                  <tr key={certificateId}>
                    {/* Certificate */}

                    <td>
                      <div className="certificate-cell">
                        <div className="certificate-icon">
                          <FileCheck2 size={17} />
                        </div>

                        <div className="certificate-details">
                          <strong>
                            {certificate.certificateNumber ||
                              "Certificate Pending"}
                          </strong>

                          <span>
                            {certificate.certificateType ||
                              "Verification Certificate"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Customer */}

                    <td>
                      <div className="certificate-customer">
                        <strong>
                          {certificate.customerName ||
                            "—"}
                        </strong>

                        <span>
                          {certificate.companyName || ""}
                        </span>
                      </div>
                    </td>

                    {/* Scale */}

                    <td>
                      <div className="scale-reference">
                        <strong>
                          {certificate.scaleId || "—"}
                        </strong>

                        <span>
                          S/N:{" "}
                          {certificate.serialNumber || "—"}
                        </span>
                      </div>
                    </td>

                    {/* Issue Date */}

                    <td>
                      <span className="date-value">
                        {formatDate(certificate.issueDate)}
                      </span>
                    </td>

                    {/* Expiry Date */}

                    <td>
                      <span className="date-value">
                        {formatDate(certificate.expiryDate)}
                      </span>
                    </td>

                    {/* Days Left */}

                    <td>
                      <span
                        className={`days-left ${
                          String(status).toLowerCase() ===
                          "expired"
                            ? "days-expired"
                            : ""
                        }`}
                      >
                        {getDaysLabel(
                          certificate.expiryDate,
                          status
                        )}
                      </span>
                    </td>

                    {/* Status */}

                    <td>
                      <span
                        className={`customer-status ${getStatusClass(
                          status
                        )}`}
                      >
                        <span className="status-dot" />

                        {getStatusLabel(status)}
                      </span>
                    </td>

                    {/* Actions */}

                    <td>
                      <div className="table-actions">
                        <button
                          type="button"
                          className="table-icon-button"
                          title="View certificate"
                          onClick={() =>
                            onViewCertificate?.(
                              certificate
                            )
                          }
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          type="button"
                          className="table-icon-button"
                          title="Edit certificate"
                          onClick={() =>
                            onEditCertificate?.(
                              certificate
                            )
                          }
                        >
                          <Pencil size={17} />
                        </button>

                        <div className="action-menu-wrapper">
                          <button
                            type="button"
                            className="table-icon-button"
                            title="More actions"
                            onClick={() =>
                              handleMenuToggle(
                                certificateId
                              )
                            }
                          >
                            <MoreVertical size={17} />
                          </button>

                          {openMenu === certificateId && (
                            <div className="action-menu">
                              <button
                                type="button"
                                onClick={() => {
                                  onViewCertificate?.(
                                    certificate
                                  );
                                  setOpenMenu(null);
                                }}
                              >
                                <Eye size={15} />
                                View Certificate
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  onEditCertificate?.(
                                    certificate
                                  );
                                  setOpenMenu(null);
                                }}
                              >
                                <Pencil size={15} />
                                Edit Certificate
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="8">
                  <div className="empty-table-state">
                    <div className="empty-state-icon">
                      <FileCheck2 size={28} />
                    </div>

                    <h3>
                      {searchTerm
                        ? "No certificates found"
                        : "No certificates yet"}
                    </h3>

                    <p>
                      {searchTerm
                        ? "Try a different certificate number, customer, scale ID or serial number."
                        : "Add a certificate to start tracking verification and expiry dates."}
                    </p>

                    {!searchTerm && (
                      <button
                        type="button"
                        className="primary-button"
                        onClick={onAddCertificate}
                      >
                        <Plus size={17} />
                        Add Certificate
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}