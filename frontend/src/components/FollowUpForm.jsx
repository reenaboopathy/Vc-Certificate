import { useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  ClipboardCheck,
  FileCheck2,
  MessageSquare,
  Save,
  UserRound,
  X,
} from "lucide-react";
import "./FollowUpForm.css";
const initialFormData = {
  certificateId: "",
  customerId: "",
  followUpDate: "",
  followUpType: "",
  status: "Pending",
  response: "",
  nextFollowUpDate: "",
  remarks: "",
};

function FollowUpForm({
  certificates = [],
  customers = [],
  initialData = {},
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = "Save Follow-up",
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

    if (!formData.followUpDate) {
      newErrors.followUpDate =
        "Follow-up date is required";
    }

    if (!formData.followUpType) {
      newErrors.followUpType =
        "Please select follow-up type";
    }

    if (!formData.status) {
      newErrors.status =
        "Follow-up status is required";
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
    <div className="follow-up-form-wrapper">

      {/* Header */}

      <div className="follow-up-form-header">
        <div>
          <span className="form-eyebrow">
            RENEWAL MANAGEMENT
          </span>

          <h2>
            {initialData?._id
              ? "Edit Follow-up"
              : "Add Follow-up"}
          </h2>

          <p>
            Record customer communication and renewal follow-up.
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
        className="follow-up-form"
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
                Select the certificate and customer for this follow-up.
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
                          certificate.certificateId ||
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
                          : customer.customerName}
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

        {/* Follow-up Details */}

        <section className="form-section">

          <div className="form-section-heading">

            <div className="section-icon">
              <ClipboardCheck size={18} />
            </div>

            <div>
              <h3>Follow-up Details</h3>

              <p>
                Record when and how the customer was contacted.
              </p>
            </div>

          </div>

          <div className="form-grid">

            {/* Follow-up Date */}

            <div className="form-field">

              <label htmlFor="followUpDate">
                Follow-up Date <span>*</span>
              </label>

              <div
                className={`input-wrapper ${
                  errors.followUpDate
                    ? "has-error"
                    : ""
                }`}
              >

                <CalendarDays size={18} />

                <input
                  id="followUpDate"
                  name="followUpDate"
                  type="date"
                  value={formData.followUpDate}
                  onChange={handleChange}
                />

              </div>

              {errors.followUpDate && (
                <small className="field-error">
                  {errors.followUpDate}
                </small>
              )}

            </div>

            {/* Follow-up Type */}

            <div className="form-field">

              <label htmlFor="followUpType">
                Follow-up Type <span>*</span>
              </label>

              <div
                className={`input-wrapper ${
                  errors.followUpType
                    ? "has-error"
                    : ""
                }`}
              >

                <MessageSquare size={18} />

                <select
                  id="followUpType"
                  name="followUpType"
                  value={formData.followUpType}
                  onChange={handleChange}
                >

                  <option value="">
                    Select follow-up type
                  </option>

                  <option value="Phone Call">
                    Phone Call
                  </option>

                  <option value="WhatsApp">
                    WhatsApp
                  </option>

                  <option value="SMS">
                    SMS
                  </option>

                  <option value="Email">
                    Email
                  </option>

                  <option value="Direct Visit">
                    Direct Visit
                  </option>

                </select>

                <ChevronDown
                  size={16}
                  className="select-arrow"
                />

              </div>

              {errors.followUpType && (
                <small className="field-error">
                  {errors.followUpType}
                </small>
              )}

            </div>

            {/* Status */}

            <div className="form-field">

              <label htmlFor="status">
                Follow-up Status <span>*</span>
              </label>

              <div
                className={`input-wrapper ${
                  errors.status
                    ? "has-error"
                    : ""
                }`}
              >

                <ClipboardCheck size={18} />

                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Contacted">
                    Contacted
                  </option>

                  <option value="Interested">
                    Interested
                  </option>

                  <option value="Not Interested">
                    Not Interested
                  </option>

                  <option value="Renewed">
                    Renewed
                  </option>

                  <option value="No Response">
                    No Response
                  </option>

                  <option value="Completed">
                    Completed
                  </option>

                </select>

                <ChevronDown
                  size={16}
                  className="select-arrow"
                />

              </div>

              {errors.status && (
                <small className="field-error">
                  {errors.status}
                </small>
              )}

            </div>

            {/* Next Follow-up */}

            <div className="form-field">

              <label htmlFor="nextFollowUpDate">
                Next Follow-up Date
              </label>

              <div className="input-wrapper">

                <CalendarDays size={18} />

                <input
                  id="nextFollowUpDate"
                  name="nextFollowUpDate"
                  type="date"
                  value={formData.nextFollowUpDate}
                  onChange={handleChange}
                />

              </div>

            </div>

          </div>

        </section>

        {/* Response */}

        <section className="form-section">

          <div className="form-section-heading">

            <div className="section-icon">
              <MessageSquare size={18} />
            </div>

            <div>
              <h3>Customer Response</h3>

              <p>
                Record the customer's response or communication details.
              </p>
            </div>

          </div>

          <div className="form-field">

            <label htmlFor="response">
              Response
            </label>

            <textarea
              id="response"
              name="response"
              className="form-textarea"
              rows="4"
              value={formData.response}
              onChange={handleChange}
              placeholder="Enter customer response..."
            />

          </div>

        </section>

        {/* Remarks */}

        <section className="form-section">

          <div className="form-section-heading">

            <div className="section-icon">
              <ClipboardCheck size={18} />
            </div>

            <div>
              <h3>Remarks</h3>

              <p>
                Add any additional follow-up notes.
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
              placeholder="Enter additional remarks..."
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

export default FollowUpForm;