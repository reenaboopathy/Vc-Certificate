import {
  CalendarDays,
  Eye,
  Pencil,
  Plus,
} from "lucide-react";
import "./FollowUpTable.css";
function formatDate(date) {
  if (!date) return "-";

  return new Date(date).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatusClass(status) {
  const value = String(status || "")
    .toLowerCase()
    .replace(/\s+/g, "-");

  return `followup-status followup-status-${value}`;
}

function FollowUpTable({
  followUps = [],
  onAddFollowUp,
  onViewFollowUp,
  onEditFollowUp,
}) {
  return (
    <div className="follow-up-table-wrapper">

      {/* Table Header */}

      <div className="table-header">

        <div>
          <span className="page-eyebrow">
            FOLLOW-UP RECORDS
          </span>

          <h2>Follow-up History</h2>

          <p>
            View and manage customer follow-up records.
          </p>
        </div>

        {onAddFollowUp && (
          <button
            type="button"
            className="primary-button"
            onClick={onAddFollowUp}
          >
            <Plus size={18} />
            Add Follow-up
          </button>
        )}

      </div>

      {/* Empty State */}

      {followUps.length === 0 ? (

        <div className="empty-state">

          <div className="empty-state-icon">
            <CalendarDays size={28} />
          </div>

          <h3>No follow-ups found</h3>

          <p>
            No follow-up records have been added yet.
          </p>

          {onAddFollowUp && (
            <button
              type="button"
              className="primary-button"
              onClick={onAddFollowUp}
            >
              <Plus size={18} />
              Add Follow-up
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
                <th>Follow-up Date</th>
                <th>Type</th>
                <th>Status</th>
                <th>Next Follow-up</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {followUps.map((followUp, index) => {

                const id =
                  followUp._id ||
                  followUp.id ||
                  index;

                const certificate =
                  followUp.certificate;

                const customer =
                  followUp.customer;

                const certificateNumber =
                  followUp.certificateNumber ||
                  certificate?.certificateNumber ||
                  followUp.certificateId ||
                  "-";

                const customerName =
                  followUp.customerName ||
                  customer?.customerName ||
                  customer?.companyName ||
                  followUp.customerId ||
                  "-";

                const followUpType =
                  followUp.followUpType ||
                  "-";

                const status =
                  followUp.status ||
                  "Pending";

                return (
                  <tr key={id}>

                    {/* Certificate */}

                    <td>
                      <div className="table-primary-text">
                        <FileTextSafe
                          value={certificateNumber}
                        />
                      </div>
                    </td>

                    {/* Customer */}

                    <td>
                      <div className="table-primary-text">
                        {customerName}
                      </div>
                    </td>

                    {/* Follow-up Date */}

                    <td>
                      {formatDate(
                        followUp.followUpDate
                      )}
                    </td>

                    {/* Type */}

                    <td>
                      {followUpType}
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

                    {/* Next Follow-up */}

                    <td>
                      {formatDate(
                        followUp.nextFollowUpDate
                      )}
                    </td>

                    {/* Actions */}

                    <td>

                      <div className="table-actions">

                        {onViewFollowUp && (
                          <button
                            type="button"
                            className="table-action-button"
                            onClick={() =>
                              onViewFollowUp(
                                followUp
                              )
                            }
                            title="View"
                          >
                            <Eye size={16} />
                          </button>
                        )}

                        {onEditFollowUp && (
                          <button
                            type="button"
                            className="table-action-button"
                            onClick={() =>
                              onEditFollowUp(
                                followUp
                              )
                            }
                            title="Edit"
                          >
                            <Pencil size={16} />
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

/*
  Small internal component.
  Keeps certificate text rendering simple
  without adding another dependency.
*/

function FileTextSafe({ value }) {
  return (
    <span>
      {value || "-"}
    </span>
  );
}

export default FollowUpTable;