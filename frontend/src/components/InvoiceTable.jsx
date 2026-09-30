import {
  CalendarDays,
  Eye,
  FileText,
  Pencil,
  Plus,
} from "lucide-react";
import "./InvoiceTable.css";
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

  return `invoice-status invoice-status-${value}`;
}

function InvoiceTable({
  invoices = [],
  onAddInvoice,
  onViewInvoice,
  onEditInvoice,
}) {
  return (
    <div className="invoice-table-wrapper">

      <div className="table-header">
        <div>
          <span className="page-eyebrow">
            INVOICE RECORDS
          </span>

          <h2>Invoice History</h2>

          <p>
            View and manage customer invoice records.
          </p>
        </div>

        {onAddInvoice && (
          <button
            type="button"
            className="primary-button"
            onClick={onAddInvoice}
          >
            <Plus size={18} />
            Create Invoice
          </button>
        )}
      </div>

      {invoices.length === 0 ? (
        <div className="empty-state">

          <div className="empty-state-icon">
            <CalendarDays size={28} />
          </div>

          <h3>No invoices found</h3>

          <p>
            No invoice records have been added yet.
          </p>

          {onAddInvoice && (
            <button
              type="button"
              className="primary-button"
              onClick={onAddInvoice}
            >
              <Plus size={18} />
              Create Invoice
            </button>
          )}

        </div>
      ) : (
        <div className="table-responsive">

          <table className="data-table">

            <thead>
              <tr>
                <th>Invoice</th>
                <th>Customer</th>
                <th>Invoice Date</th>
                <th>Due Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {invoices.map((invoice, index) => {
                const id =
                  invoice._id ||
                  invoice.id ||
                  index;

                const customer =
                  invoice.customer || {};

                const invoiceNumber =
                  invoice.invoiceNumber ||
                  invoice.number ||
                  `INV-${index + 1}`;

                const customerName =
                  invoice.customerName ||
                  customer.customerName ||
                  customer.companyName ||
                  customer.name ||
                  invoice.customerId ||
                  "-";

                const amount =
                  Number(
                    invoice.totalAmount ||
                    invoice.amount ||
                    0
                  );

                const status =
                  invoice.status ||
                  "Pending";

                return (
                  <tr key={id}>

                    {/* Invoice */}
                    <td>
                      <div className="table-primary-text">
                        <FileText size={16} />
                        {invoiceNumber}
                      </div>
                    </td>

                    {/* Customer */}
                    <td>
                      <div className="table-primary-text">
                        {customerName}
                      </div>
                    </td>

                    {/* Invoice Date */}
                    <td>
                      {formatDate(
                        invoice.invoiceDate
                      )}
                    </td>

                    {/* Due Date */}
                    <td>
                      {formatDate(
                        invoice.dueDate
                      )}
                    </td>

                    {/* Amount */}
                    <td>
                      <strong>
                        ₹{amount.toLocaleString("en-IN")}
                      </strong>
                    </td>

                    {/* Status */}
                    <td>
                      <span
                        className={getStatusClass(status)}
                      >
                        {status}
                      </span>
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="table-actions">

                        {onViewInvoice && (
                          <button
                            type="button"
                            className="table-action-button"
                            onClick={() =>
                              onViewInvoice(invoice)
                            }
                            title="View Invoice"
                          >
                            <Eye size={16} />
                          </button>
                        )}

                        {onEditInvoice && (
                          <button
                            type="button"
                            className="table-action-button"
                            onClick={() =>
                              onEditInvoice(invoice)
                            }
                            title="Edit Invoice"
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

export default InvoiceTable;