import { useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  CreditCard,
  FileCheck2,
  IndianRupee,
  Save,
  UserRound,
  X,
} from "lucide-react";
import "./PaymentForm.css";
const initialFormData = {
  customerId: "",
  certificateId: "",
  paymentDate: "",
  amount: "",
  paymentMethod: "",
  paymentStatus: "Paid",
  transactionNumber: "",
  notes: "",
};

function PaymentForm({
  customers = [],
  certificates = [],
  initialData = {},
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = "Save Payment",
}) {
  const [formData, setFormData] = useState({
    ...initialFormData,
    ...initialData,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((current) => ({
        ...current,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerId) {
      newErrors.customerId = "Please select a customer";
    }

    if (!formData.certificateId) {
      newErrors.certificateId =
        "Please select a certificate";
    }

    if (!formData.paymentDate) {
      newErrors.paymentDate =
        "Payment date is required";
    }

    if (!formData.amount) {
      newErrors.amount =
        "Payment amount is required";
    } else if (Number(formData.amount) <= 0) {
      newErrors.amount =
        "Payment amount must be greater than 0";
    }

    if (!formData.paymentMethod) {
      newErrors.paymentMethod =
        "Please select a payment method";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit?.(formData);
  };

  const handleReset = () => {
    setFormData({
      ...initialFormData,
      ...initialData,
    });

    setErrors({});
  };

  return (
    <div className="payment-form-wrapper">

      {/* Header */}
      <div className="payment-form-header">
        <div>
          <span className="form-eyebrow">
            PAYMENT MANAGEMENT
          </span>

          <h2>
            {initialData?._id
              ? "Edit Payment"
              : "Record Payment"}
          </h2>

          <p>
            Record customer payment and transaction details.
          </p>
        </div>

        {onCancel && (
          <button
            type="button"
            className="form-close-button"
            onClick={onCancel}
            aria-label="Close form"
          >
            <X size={20} />
          </button>
        )}
      </div>

      <form
        className="payment-form"
        onSubmit={handleSubmit}
      >

        {/* Payment Reference */}
        <section className="form-section">

          <div className="form-section-heading">
            <div className="section-icon">
              <FileCheck2 size={18} />
            </div>

            <div>
              <h3>Payment Reference</h3>

              <p>
                Link the payment to a customer and certificate.
              </p>
            </div>
          </div>

          <div className="form-grid">

            {/* Customer */}
            <div className="form-field">

              <label htmlFor="customerId">
                Customer <span>*</span>
              </label>

              <div
                className={`input-wrapper ${
                  errors.customerId
                    ? "has-error"
                    : ""
                }`}
              >
                <UserRound size={18} />

                <select
                  id="customerId"
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleChange}
                >
                  <option value="">
                    Select customer
                  </option>

                  {customers.map((customer) => {
                    const id =
                      customer._id ||
                      customer.id;

                    return (
                      <option
                        key={id}
                        value={id}
                      >
                        {customer.companyName
                          ? `${customer.companyName} - ${
                              customer.customerName || ""
                            }`
                          : customer.customerName ||
                            customer.name ||
                            "Customer"}
                      </option>
                    );
                  })}
                </select>

                <ChevronDown
                  size={16}
                  className="select-arrow"
                />
              </div>

              {errors.customerId && (
                <small className="field-error">
                  {errors.customerId}
                </small>
              )}
            </div>

            {/* Certificate */}
            <div className="form-field">

              <label htmlFor="certificateId">
                Certificate <span>*</span>
              </label>

              <div
                className={`input-wrapper ${
                  errors.certificateId
                    ? "has-error"
                    : ""
                }`}
              >
                <FileCheck2 size={18} />

                <select
                  id="certificateId"
                  name="certificateId"
                  value={formData.certificateId}
                  onChange={handleChange}
                >
                  <option value="">
                    Select certificate
                  </option>

                  {certificates.map((certificate) => {
                    const id =
                      certificate._id ||
                      certificate.id ||
                      certificate.certificateId;

                    return (
                      <option
                        key={id}
                        value={id}
                      >
                        {certificate.certificateNumber ||
                          certificate.number ||
                          "Certificate"}
                      </option>
                    );
                  })}
                </select>

                <ChevronDown
                  size={16}
                  className="select-arrow"
                />
              </div>

              {errors.certificateId && (
                <small className="field-error">
                  {errors.certificateId}
                </small>
              )}
            </div>

          </div>
        </section>

        {/* Payment Details */}
        <section className="form-section">

          <div className="form-section-heading">
            <div className="section-icon">
              <CreditCard size={18} />
            </div>

            <div>
              <h3>Payment Details</h3>

              <p>
                Enter the payment amount and transaction information.
              </p>
            </div>
          </div>

          <div className="form-grid">

            {/* Payment Date */}
            <div className="form-field">

              <label htmlFor="paymentDate">
                Payment Date <span>*</span>
              </label>

              <div
                className={`input-wrapper ${
                  errors.paymentDate
                    ? "has-error"
                    : ""
                }`}
              >
                <CalendarDays size={18} />

                <input
                  id="paymentDate"
                  name="paymentDate"
                  type="date"
                  value={formData.paymentDate}
                  onChange={handleChange}
                />
              </div>

              {errors.paymentDate && (
                <small className="field-error">
                  {errors.paymentDate}
                </small>
              )}
            </div>

            {/* Amount */}
            <div className="form-field">

              <label htmlFor="amount">
                Amount <span>*</span>
              </label>

              <div
                className={`input-wrapper ${
                  errors.amount
                    ? "has-error"
                    : ""
                }`}
              >
                <IndianRupee size={18} />

                <input
                  id="amount"
                  name="amount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter payment amount"
                />
              </div>

              {errors.amount && (
                <small className="field-error">
                  {errors.amount}
                </small>
              )}
            </div>

            {/* Payment Method */}
            <div className="form-field">

              <label htmlFor="paymentMethod">
                Payment Method <span>*</span>
              </label>

              <div
                className={`input-wrapper ${
                  errors.paymentMethod
                    ? "has-error"
                    : ""
                }`}
              >
                <CreditCard size={18} />

                <select
                  id="paymentMethod"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                >
                  <option value="">
                    Select payment method
                  </option>

                  <option value="Cash">
                    Cash
                  </option>

                  <option value="UPI">
                    UPI
                  </option>

                  <option value="Bank Transfer">
                    Bank Transfer
                  </option>

                  <option value="Cheque">
                    Cheque
                  </option>

                  <option value="Card">
                    Card
                  </option>
                </select>

                <ChevronDown
                  size={16}
                  className="select-arrow"
                />
              </div>

              {errors.paymentMethod && (
                <small className="field-error">
                  {errors.paymentMethod}
                </small>
              )}
            </div>

            {/* Payment Status */}
            <div className="form-field">

              <label htmlFor="paymentStatus">
                Payment Status
              </label>

              <div className="input-wrapper">
                <CreditCard size={18} />

                <select
                  id="paymentStatus"
                  name="paymentStatus"
                  value={formData.paymentStatus}
                  onChange={handleChange}
                >
                  <option value="Paid">
                    Paid
                  </option>

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Partial">
                    Partial
                  </option>

                  <option value="Failed">
                    Failed
                  </option>

                  <option value="Refunded">
                    Refunded
                  </option>
                </select>

                <ChevronDown
                  size={16}
                  className="select-arrow"
                />
              </div>
            </div>

          </div>
        </section>

        {/* Transaction Information */}
        <section className="form-section">

          <div className="form-section-heading">
            <div className="section-icon">
              <CreditCard size={18} />
            </div>

            <div>
              <h3>Transaction Information</h3>

              <p>
                Add the reference number for tracking.
              </p>
            </div>
          </div>

          <div className="form-grid">

            <div className="form-field">

              <label htmlFor="transactionNumber">
                Transaction / Reference Number
              </label>

              <div className="input-wrapper">
                <CreditCard size={18} />

                <input
                  id="transactionNumber"
                  name="transactionNumber"
                  type="text"
                  value={formData.transactionNumber}
                  onChange={handleChange}
                  placeholder="UPI ID, cheque number, reference..."
                />
              </div>

            </div>

          </div>

          <div className="form-field">

            <label htmlFor="notes">
              Notes
            </label>

            <textarea
              id="notes"
              name="notes"
              className="form-textarea"
              rows="4"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Enter payment notes..."
            />

          </div>

        </section>

        {/* Actions */}
        <div className="form-actions">

          <button
            type="button"
            className="secondary-button"
            onClick={handleReset}
            disabled={isLoading}
          >
            Clear
          </button>

          {onCancel && (
            <button
              type="button"
              className="secondary-button"
              onClick={onCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            className="primary-button"
            disabled={isLoading}
          >
            <Save size={18} />

            {isLoading
              ? "Saving..."
              : submitLabel}
          </button>

        </div>

      </form>
    </div>
  );
}

export default PaymentForm;