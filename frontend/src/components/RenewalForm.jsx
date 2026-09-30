import { useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  FileCheck2,
  IndianRupee,
  RefreshCcw,
  Save,
  UserRound,
  X,
} from "lucide-react";
import "./RenewalForm.css";
const initialFormData = {
  certificateId: "",
  customerId: "",
  renewalDate: "",
  renewalAmount: "",
  status: "Pending",
  newCertificateId: "",
  nextRenewalDate: "",
  remarks: "",
};

function RenewalForm({
  certificates = [],
  customers = [],
  initialData = {},
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = "Save Renewal",
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

    if (!formData.certificateId) {
      newErrors.certificateId =
        "Please select a certificate";
    }

    if (!formData.customerId) {
      newErrors.customerId =
        "Please select a customer";
    }

    if (!formData.renewalDate) {
      newErrors.renewalDate =
        "Renewal date is required";
    }

    if (
      formData.renewalAmount !== "" &&
      Number(formData.renewalAmount) < 0
    ) {
      newErrors.renewalAmount =
        "Renewal amount cannot be negative";
    }

    if (!formData.status) {
      newErrors.status =
        "Renewal status is required";
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
    <div className="renewal-form-wrapper">

      {/* Header */}

      <div className="renewal-form-header">

        <div>
          <span className="form-eyebrow">
            RENEWAL MANAGEMENT
          </span>

          <h2>
            {initialData?._id
              ? "Edit Renewal"
              : "Create Renewal"}
          </h2>

          <p>
            Record certificate renewal and next validity details.
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
        className="renewal-form"
        onSubmit={handleSubmit}
      >

        {/* Certificate & Customer */}

        <section className="form-section">

          <div className="form-section-heading">

            <div className="section-icon">
              <FileCheck2 size={18} />
            </div>

            <div>
              <h3>Certificate & Customer</h3>

              <p>
                Select the certificate being renewed.
              </p>
            </div>

          </div>

          <div className="form-grid">

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

          </div>

        </section>

        {/* Renewal Details */}

        <section className="form-section">

          <div className="form-section-heading">

            <div className="section-icon">
              <RefreshCcw size={18} />
            </div>

            <div>
              <h3>Renewal Details</h3>

              <p>
                Enter renewal date, amount and current status.
              </p>
            </div>

          </div>

          <div className="form-grid">

            {/* Renewal Date */}

            <div className="form-field">

              <label htmlFor="renewalDate">
                Renewal Date <span>*</span>
              </label>

              <div
                className={`input-wrapper ${
                  errors.renewalDate
                    ? "has-error"
                    : ""
                }`}
              >

                <CalendarDays size={18} />

                <input
                  id="renewalDate"
                  name="renewalDate"
                  type="date"
                  value={formData.renewalDate}
                  onChange={handleChange}
                />

              </div>

              {errors.renewalDate && (
                <small className="field-error">
                  {errors.renewalDate}
                </small>
              )}

            </div>

            {/* Renewal Amount */}

            <div className="form-field">

              <label htmlFor="renewalAmount">
                Renewal Amount
              </label>

              <div
                className={`input-wrapper ${
                  errors.renewalAmount
                    ? "has-error"
                    : ""
                }`}
              >

                <IndianRupee size={18} />

                <input
                  id="renewalAmount"
                  name="renewalAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.renewalAmount}
                  onChange={handleChange}
                  placeholder="0.00"
                />

              </div>

              {errors.renewalAmount && (
                <small className="field-error">
                  {errors.renewalAmount}
                </small>
              )}

            </div>

            {/* Status */}

            <div className="form-field">

              <label htmlFor="status">
                Renewal Status
              </label>

              <div className="input-wrapper">

                <RefreshCcw size={18} />

                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Renewed">
                    Renewed
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>

                  <option value="Failed">
                    Failed
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

        {/* New Certificate */}

        <section className="form-section">

          <div className="form-section-heading">

            <div className="section-icon">
              <FileCheck2 size={18} />
            </div>

            <div>
              <h3>New Certificate</h3>

              <p>
                Link the newly issued certificate after renewal.
              </p>
            </div>

          </div>

          <div className="form-grid">

            {/* New Certificate */}

            <div className="form-field">

              <label htmlFor="newCertificateId">
                New Certificate
              </label>

              <div className="input-wrapper">

                <FileCheck2 size={18} />

                <select
                  id="newCertificateId"
                  name="newCertificateId"
                  value={formData.newCertificateId}
                  onChange={handleChange}
                >

                  <option value="">
                    Select new certificate
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

            </div>

            {/* Next Renewal Date */}

            <div className="form-field">

              <label htmlFor="nextRenewalDate">
                Next Renewal Date
              </label>

              <div className="input-wrapper">

                <CalendarDays size={18} />

                <input
                  id="nextRenewalDate"
                  name="nextRenewalDate"
                  type="date"
                  value={formData.nextRenewalDate}
                  onChange={handleChange}
                />

              </div>

            </div>

          </div>

        </section>

        {/* Remarks */}

        <section className="form-section">

          <div className="form-section-heading">

            <div className="section-icon">
              <RefreshCcw size={18} />
            </div>

            <div>
              <h3>Remarks</h3>

              <p>
                Add additional renewal information.
              </p>
            </div>

          </div>

          <div className="form-field">

            <textarea
              id="remarks"
              name="remarks"
              className="form-textarea"
              rows="4"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Enter renewal remarks..."
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

export default RenewalForm;