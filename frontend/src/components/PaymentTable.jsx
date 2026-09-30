import {
  CalendarDays,
  CreditCard,
  Eye,
  Pencil,
  Plus,
} from "lucide-react";
import "./PaymentTable.css";
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

  return `payment-status payment-status-${value}`;
}

function PaymentTable({
  payments = [],
  onAddPayment,
  onViewPayment,
  onEditPayment,
}) {
  return (
    <div className="payment-table-wrapper">

      <div className="table-header">
        <div>
          <span className="page-eyebrow">
            PAYMENT RECORDS
          </span>

          <h2>Payment History</h2>

          <p>
            View and manage customer payment records.
          </p>
        </div>

        {onAddPayment && (
          <button
            type="button"
            className="primary-button"
            onClick={onAddPayment}
          >
            <Plus size={18} />
            Add Payment
          </button>
        )}
      </div>

      {payments.length === 0 ? (
        <div className="empty-state">

          <div className="empty-state-icon">
            <CreditCard size={28} />
          </div>

          <h3>No payments found</h3>

          <p>
            No payment records have been added yet.
          </p>

          {onAddPayment && (
            <button
              type="button"
              className="primary-button"
              onClick={onAddPayment}
            >
              <Plus size={18} />
              Add Payment
            </button>
          )}

        </div>
      ) : (
        <div className="table-responsive">

          <table className="data-table">

            <thead>
              <tr>
                <th>Customer</th>
                <th>Certificate</th>
                <th>Payment Date</th>
                <th>Amount</th>
                <th>Payment Method</th>
                <th>Status</th>
                <th>Transaction No.</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>

              {payments.map((payment, index) => {

                const id =
                  payment._id ||
                  payment.id ||
                  index;

                const customer =
                  payment.customer || {};

                const certificate =
                  payment.certificate || {};

                const customerName =
                  payment.customerName ||
                  customer.customerName ||
                  customer.companyName ||
                  customer.name ||
                  payment.customerId ||
                  "-";

                const certificateNumber =
                  payment.certificateNumber ||
                  certificate.certificateNumber ||
                  certificate.number ||
                  payment.certificateId ||
                  "-";

                const amount =
                  Number(payment.amount || 0);

                const paymentMethod =
                  payment.paymentMethod ||
                  "-";

                const status =
                  payment.paymentStatus ||
                  payment.status ||
                  "Pending";

                const transactionNumber =
                  payment.transactionNumber ||
                  payment.referenceNumber ||
                  "-";

                return (
                  <tr key={id}>

                    <td>
                      <div className="table-primary-text">
                        {customerName}
                      </div>
                    </td>

                    <td>
                      <div className="table-primary-text">
                        {certificateNumber}
                      </div>
                    </td>

                    <td>
                      <div className="table-date">
                        <CalendarDays size={15} />
                        {formatDate(
                          payment.paymentDate
                        )}
                      </div>
                    </td>

                    <td>
                      <strong>
                        ₹{amount.toLocaleString("en-IN")}
                      </strong>
                    </td>

                    <td>
                      <div className="table-payment-method">
                        <CreditCard size={15} />
                        {paymentMethod}
                      </div>
                    </td>

                    <td>
                      <span
                        className={getStatusClass(status)}
                      >
                        {status}
                      </span>
                    </td>

                    <td>
                      {transactionNumber}
                    </td>

                    <td>
                      <div className="table-actions">

                        {onViewPayment && (
                          <button
                            type="button"
                            className="table-action-button"
                            onClick={() =>
                              onViewPayment(payment)
                            }
                            title="View Payment"
                          >
                            <Eye size={16} />
                          </button>
                        )}

                        {onEditPayment && (
                          <button
                            type="button"
                            className="table-action-button"
                            onClick={() =>
                              onEditPayment(payment)
                            }
                            title="Edit Payment"
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

export default PaymentTable;