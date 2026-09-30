import {
  CalendarDays,
  Eye,
  Pencil,
  Plus,
  RefreshCcw,
} from "lucide-react";
import "./RenewalTable.css";
function formatDate(date) {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatusClass(status) {
  const value = String(status || "")
    .toLowerCase()
    .replace(/\s+/g, "-");

  return `renewal-status renewal-status-${value}`;
}

function RenewalTable({
  renewals = [],
  onAddRenewal,
  onViewRenewal,
  onEditRenewal,
  onMenu,
}) {
  return (
    <div className="renewal-table-wrapper">

      {/* Header */}

      <div className="table-header">

        <div>
          <span className="page-eyebrow">
            RENEWAL RECORDS
          </span>

          <h2>Renewal History</h2>

          <p>
            View and manage certificate renewal records.
          </p>
        </div>

        {onAddRenewal && (
          <button
            type="button"
            className="primary-button"
            onClick={onAddRenewal}
          >
            <Plus size={18} />
            Add Renewal
          </button>
        )}

      </div>

      {/* Empty State */}

      {renewals.length === 0 ? (
        <div className="empty-state">

          <div className="empty-state-icon">
            <RefreshCcw size={28} />
          </div>

          <h3>No renewals found</h3>

          <p>
            No certificate renewal records have been added yet.
          </p>

          {onAddRenewal && (
            <button
              type="button"
              className="primary-button"
              onClick={onAddRenewal}
            >
              <Plus size={18} />
              Add Renewal
            </button>
          )}

        </div>
      ) : (

        /* Table */

        <div className="table-responsive">

          <table className="data-table">

            <thead>
              <tr>
                <th>Certificate</th>
                <th>Customer</th>
                <th>Renewal Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Next Renewal</th>
                <th>New Certificate</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {renewals.map((renewal, index) => {

                const id =
                  renewal._id ||
                  renewal.id ||
                  index;

                const customer =
                  renewal.customer || {};

                const certificate =
                  renewal.certificate || {};

                const newCertificate =
                  renewal.newCertificate || {};

                const certificateNumber =
                  renewal.certificateNumber ||
                  certificate.certificateNumber ||
                  certificate.number ||
                  renewal.certificateId ||
                  "-";

                const customerName =
                  renewal.customerName ||
                  customer.customerName ||
                  customer.companyName ||
                  customer.name ||
                  renewal.customerId ||
                  "-";

                const renewalAmount =
                  Number(
                    renewal.renewalAmount || 0
                  );

                const status =
                  renewal.status ||
                  "Pending";

                const newCertificateNumber =
                  renewal.newCertificateNumber ||
                  newCertificate.certificateNumber ||
                  newCertificate.number ||
                  renewal.newCertificateId ||
                  "-";

                return (
                  <tr key={id}>

                    {/* Certificate */}

                    <td>
                      <div className="table-primary-text">
                        {certificateNumber}
                      </div>
                    </td>

                    {/* Customer */}

                    <td>
                      <div className="table-primary-text">
                        {customerName}
                      </div>
                    </td>

                    {/* Renewal Date */}

                    <td>
                      <div className="table-date">
                        <CalendarDays size={15} />

                        {formatDate(
                          renewal.renewalDate
                        )}
                      </div>
                    </td>

                    {/* Amount */}

                    <td>
                      <strong>
                        ₹
                        {renewalAmount.toLocaleString(
                          "en-IN"
                        )}
                      </strong>
                    </td>

                    {/* Status */}

                    <td>
                      <span
                        className={getStatusClass(
                          status
                        )}
                      >
                        {status}
                      </span>
                    </td>

                    {/* Next Renewal */}

                    <td>
                      {formatDate(
                        renewal.nextRenewalDate
                      )}
                    </td>

                    {/* New Certificate */}

                    <td>
                      {newCertificateNumber}
                    </td>

                    {/* Actions */}

                    <td>

                      <div className="table-actions">

                        {onViewRenewal && (
                          <button
                            type="button"
                            className="table-action-button"
                            onClick={() =>
                              onViewRenewal(
                                renewal
                              )
                            }
                            title="View Renewal"
                          >
                            <Eye size={16} />
                          </button>
                        )}

                        {onEditRenewal && (
                          <button
                            type="button"
                            className="table-action-button"
                            onClick={() =>
                              onEditRenewal(
                                renewal
                              )
                            }
                            title="Edit Renewal"
                          >
                            <Pencil size={16} />
                          </button>
                        )}

                        {onMenu && (
                          <button
                            type="button"
                            className="table-action-button"
                            onClick={() =>
                              onMenu(renewal)
                            }
                            title="More Options"
                          >
                            ⋮
                          </button>
                        )}

                      </div>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>
      )}

    </div>
  );
}

export default RenewalTable;