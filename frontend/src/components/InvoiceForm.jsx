import { useState } from "react";
import {
  CalendarDays,
  FileText,
  IndianRupee,
  Save,
  UserRound,
  X,
} from "lucide-react";
import "./InvoiceForm.css";

const initialFormData = {
  invoiceNumber: "",
  customerId: "",
  certificateId: "",
  invoiceDate: "",
  dueDate: "",
  amount: "",
  tax: "",
  totalAmount: "",
  status: "Pending",
  description: "",
  remarks: "",
};

function InvoiceForm({
  customers = [],
  certificates = [],
  initialData = {},
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = "Save Invoice",
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

  const handleAmountChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => {
      const updated = {
        ...current,
        [name]: value,
      };

      const amount = Number(updated.amount || 0);
      const tax = Number(updated.tax || 0);

      updated.totalAmount = amount + tax;

      return updated;
    });

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

    if (!formData.invoiceDate) {
      newErrors.invoiceDate = "Invoice date is required";
    }

    if (!formData.amount) {
      newErrors.amount = "Amount is required";
    }

    if (!formData.status) {
      newErrors.status = "Invoice status is required";
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
    <form
      className="invoice-form"
      onSubmit={handleSubmit}
    >
      <div className="form-grid">

        {/* Invoice Number */}
        <div className="form-group">
          <label htmlFor="invoiceNumber">
            <FileText size={16} />
            Invoice Number
          </label>

          <input
            id="invoiceNumber"
            name="invoiceNumber"
            type="text"
            value={formData.invoiceNumber}
            onChange={handleChange}
            placeholder="INV-001"
          />
        </div>

        {/* Customer */}
        <div className="form-group">
          <label htmlFor="customerId">
            <UserRound size={16} />
            Customer *
          </label>

          <select
            id="customerId"
            name="customerId"
            value={formData.customerId}
            onChange={handleChange}
          >
            <option value="">
              Select Customer
            </option>

            {customers.map((customer) => {
              const id =
                customer._id ||
                customer.id;

              const name =
                customer.customerName ||
                customer.companyName ||
                customer.name ||
                "Unnamed Customer";

              return (
                <option
                  key={id}
                  value={id}
                >
                  {name}
                </option>
              );
            })}
          </select>

          {errors.customerId && (
            <small className="form-error">
              {errors.customerId}
            </small>
          )}
        </div>

        {/* Certificate */}
        <div className="form-group">
          <label htmlFor="certificateId">
            <FileText size={16} />
            Certificate
          </label>

          <select
            id="certificateId"
            name="certificateId"
            value={formData.certificateId}
            onChange={handleChange}
          >
            <option value="">
              Select Certificate
            </option>

            {certificates.map((certificate) => {
              const id =
                certificate._id ||
                certificate.id;

              const number =
                certificate.certificateNumber ||
                certificate.number ||
                id;

              return (
                <option
                  key={id}
                  value={id}
                >
                  {number}
                </option>
              );
            })}
          </select>
        </div>

        {/* Invoice Date */}
        <div className="form-group">
          <label htmlFor="invoiceDate">
            <CalendarDays size={16} />
            Invoice Date *
          </label>

          <input
            id="invoiceDate"
            name="invoiceDate"
            type="date"
            value={formData.invoiceDate}
            onChange={handleChange}
          />

          {errors.invoiceDate && (
            <small className="form-error">
              {errors.invoiceDate}
            </small>
          )}
        </div>

        {/* Due Date */}
        <div className="form-group">
          <label htmlFor="dueDate">
            <CalendarDays size={16} />
            Due Date
          </label>

          <input
            id="dueDate"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={handleChange}
          />
        </div>

        {/* Amount */}
        <div className="form-group">
          <label htmlFor="amount">
            <IndianRupee size={16} />
            Amount *
          </label>

          <input
            id="amount"
            name="amount"
            type="number"
            min="0"
            value={formData.amount}
            onChange={handleAmountChange}
            placeholder="0"
          />

          {errors.amount && (
            <small className="form-error">
              {errors.amount}
            </small>
          )}
        </div>

        {/* Tax */}
        <div className="form-group">
          <label htmlFor="tax">
            <IndianRupee size={16} />
            Tax
          </label>

          <input
            id="tax"
            name="tax"
            type="number"
            min="0"
            value={formData.tax}
            onChange={handleAmountChange}
            placeholder="0"
          />
        </div>

        {/* Total */}
        <div className="form-group">
          <label htmlFor="totalAmount">
            <IndianRupee size={16} />
            Total Amount
          </label>

          <input
            id="totalAmount"
            name="totalAmount"
            type="number"
            value={formData.totalAmount}
            readOnly
          />
        </div>

        {/* Status */}
        <div className="form-group">
          <label htmlFor="status">
            Status *
          </label>

          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="Pending">
              Pending
            </option>

            <option value="Paid">
              Paid
            </option>

            <option value="Overdue">
              Overdue
            </option>

            <option value="Cancelled">
              Cancelled
            </option>
          </select>

          {errors.status && (
            <small className="form-error">
              {errors.status}
            </small>
          )}
        </div>

        {/* Description */}
        <div className="form-group form-group-full">
          <label htmlFor="description">
            Description
          </label>

          <textarea
            id="description"
            name="description"
            rows="3"
            value={formData.description}
            onChange={handleChange}
            placeholder="Invoice description"
          />
        </div>

        {/* Remarks */}
        <div className="form-group form-group-full">
          <label htmlFor="remarks">
            Remarks
          </label>

          <textarea
            id="remarks"
            name="remarks"
            rows="3"
            value={formData.remarks}
            onChange={handleChange}
            placeholder="Additional remarks"
          />
        </div>

      </div>

      {/* Buttons */}
      <div className="form-actions">

        <button
          type="button"
          className="secondary-button"
          onClick={handleReset}
          disabled={isLoading}
        >
          <X size={17} />
          Clear
        </button>

        <button
          type="button"
          className="secondary-button"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </button>

        <button
          type="submit"
          className="primary-button"
          disabled={isLoading}
        >
          <Save size={17} />
          {isLoading ? "Saving..." : submitLabel}
        </button>

      </div>
    </form>
  );
}

export default InvoiceForm;