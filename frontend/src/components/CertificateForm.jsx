import { useState } from "react";
import {
  CalendarDays,
  ChevronDown,
  FileCheck2,
  FileUp,
  IndianRupee,
  Save,
  UserRound,
  X,
  Scale,
  UserCog,
} from "lucide-react";
import "./CertificateForm.css";

const initialFormData = {
  certificateNumber: "",
  customerId: "",
  scaleId: "",
  serialNumber: "",
  issueDate: "",
  expiryDate: "",
  certificateType: "",
  status: "Active",
  certificateAmount: "",
  renewalAmount: "",
  certificateFile: null,
  issuedBy: "",
  remarks: "",
};

export default function CertificateForm({
  customers = [],
  scales = [],
  initialData = {},
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = "Save Certificate",
}) {
  const [formData, setFormData] = useState({
    ...initialFormData,
    ...initialData,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentData) => ({
      ...currentData,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        [name]: "",
      }));
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] || null;

    setFormData((currentData) => ({
      ...currentData,
      certificateFile: file,
    }));

    if (errors.certificateFile) {
      setErrors((currentErrors) => ({
        ...currentErrors,
        certificateFile: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.certificateNumber.trim()) {
      newErrors.certificateNumber =
        "Certificate number is required";
    }

    if (!formData.customerId) {
      newErrors.customerId =
        "Please select a customer";
    }

    if (!formData.scaleId) {
      newErrors.scaleId =
        "Please select a weighing scale";
    }

    if (!formData.serialNumber.trim()) {
      newErrors.serialNumber =
        "Serial number is required";
    }

    if (!formData.issueDate) {
      newErrors.issueDate =
        "Issue date is required";
    }

    if (!formData.expiryDate) {
      newErrors.expiryDate =
        "Expiry date is required";
    }

    if (
      formData.issueDate &&
      formData.expiryDate &&
      new Date(formData.expiryDate) <
        new Date(formData.issueDate)
    ) {
      newErrors.expiryDate =
        "Expiry date cannot be before issue date";
    }

    if (!formData.certificateType) {
      newErrors.certificateType =
        "Certificate type is required";
    }

    if (!formData.issuedBy.trim()) {
      newErrors.issuedBy =
        "Issued by is required";
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

  const selectedScale = scales.find(
    (scale) =>
      (scale._id || scale.id || scale.scaleId) ===
      formData.scaleId
  );

  return (
    <div className="certificate-form-wrapper">
      {/* Header */}

      <div className="certificate-form-header">
        <div>
          <span className="form-eyebrow">
            CERTIFICATE MANAGEMENT
          </span>

          <h2>
            {initialData?._id
              ? "Edit Certificate"
              : "Create New Certificate"}
          </h2>

          <p>
            Add verification certificate details and validity
            information.
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
        className="certificate-form"
        onSubmit={handleSubmit}
      >
        {/* Certificate Information */}

        <section className="form-section">
          <div className="form-section-heading">
            <div className="section-icon">
              <FileCheck2 size={18} />
            </div>

            <div>
              <h3>Certificate Information</h3>
              <p>
                Enter the main verification certificate details.
              </p>
            </div>
          </div>

          <div className="form-grid">
            {/* Certificate Number */}

            <div className="form-field">
              <label htmlFor="certificateNumber">
                Certificate Number
                <span>*</span>
              </label>

              <div
                className={`input-wrapper ${
                  errors.certificateNumber
                    ? "has-error"
                    : ""
                }`}
              >
                <FileCheck2 size={18} />

                <input
                  id="certificateNumber"
                  name="certificateNumber"
                  type="text"
                  value={formData.certificateNumber}
                  onChange={handleChange}
                  placeholder="Example: VC-2026-000125"
                />
              </div>

              {errors.certificateNumber && (
                <small className="field-error">
                  {errors.certificateNumber}
                </small>
              )}
            </div>

            {/* Certificate Type */}

            <div className="form-field">
              <label htmlFor="certificateType">
                Certificate Type
                <span>*</span>
              </label>

              <div
                className={`input-wrapper ${
                  errors.certificateType
                    ? "has-error"
                    : ""
                }`}
              >
                <FileCheck2 size={18} />

                <select
                  id="certificateType"
                  name="certificateType"
                  value={formData.certificateType}
                  onChange={handleChange}
                >
                  <option value="">
                    Select certificate type
                  </option>

                  <option value="verification">
                    Verification
                  </option>

                  <option value="re-verification">
                    Re-Verification
                  </option>

                  <option value="renewal">
                    Renewal
                  </option>

                  <option value="initial">
                    Initial Certificate
                  </option>
                </select>

                <ChevronDown
                  size={16}
                  className="select-arrow"
                />
              </div>

              {errors.certificateType && (
                <small className="field-error">
                  {errors.certificateType}
                </small>
              )}
            </div>

            {/* Status */}

            <div className="form-field">
              <label htmlFor="status">
                Certificate Status
              </label>

              <div className="input-wrapper">
                <FileCheck2 size={18} />

                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="Expiring Soon">
                    Expiring Soon
                  </option>

                  <option value="Expired">
                    Expired
                  </option>

                  <option value="Cancelled">
                    Cancelled
                  </option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Customer & Scale */}

        <section className="form-section">
          <div className="form-section-heading">
            <div className="section-icon">
              <Scale size={18} />
            </div>

            <div>
              <h3>Customer & Scale</h3>
              <p>
                Link the certificate to the correct customer and
                weighing scale.
              </p>
            </div>
          </div>

          <div className="form-grid">
            {/* Customer */}

            <div className="form-field">
              <label htmlFor="customerId">
                Customer
                <span>*</span>
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
                    const customerId =
                      customer._id || customer.id;

                    return (
                      <option
                        key={customerId}
                        value={customerId}
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
              </div>

              {errors.customerId && (
                <small className="field-error">
                  {errors.customerId}
                </small>
              )}
            </div>

            {/* Scale */}

            <div className="form-field">
              <label htmlFor="scaleId">
                Weighing Scale
                <span>*</span>
              </label>

              <div
                className={`input-wrapper ${
                  errors.scaleId
                    ? "has-error"
                    : ""
                }`}
              >
                <Scale size={18} />

                <select
                  id="scaleId"
                  name="scaleId"
                  value={formData.scaleId}
                  onChange={handleChange}
                >
                  <option value="">
                    Select scale
                  </option>

                  {scales.map((scale) => {
                    const scaleId =
                      scale._id ||
                      scale.id ||
                      scale.scaleId;

                    return (
                      <option
                        key={scaleId}
                        value={scaleId}
                      >
                        {scale.scaleId}{" "}
                        {scale.serialNumber
                          ? `- ${scale.serialNumber}`
                          : ""}
                      </option>
                    );
                  })}
                </select>
              </div>

              {errors.scaleId && (
                <small className="field-error">
                  {errors.scaleId}
                </small>
              )}
            </div>

            {/* Serial Number */}

            <div className="form-field">
              <label htmlFor="serialNumber">
                Serial Number
                <span>*</span>
              </label>

              <div
                className={`input-wrapper ${
                  errors.serialNumber
                    ? "has-error"
                    : ""
                }`}
              >
                <Scale size={18} />

                <input
                  id="serialNumber"
                  name="serialNumber"
                  type="text"
                  value={formData.serialNumber}
                  onChange={handleChange}
                  placeholder="Enter scale serial number"
                />
              </div>

              {errors.serialNumber && (
                <small className="field-error">
                  {errors.serialNumber}
                </small>
              )}

              {selectedScale?.serialNumber && (
                <small className="field-hint">
                  Scale serial number:
                  {" "}
                  {selectedScale.serialNumber}
                </small>
              )}
            </div>
          </div>
        </section>

        {/* Validity */}

        <section className="form-section">
          <div className="form-section-heading">
            <div className="section-icon">
              <CalendarDays size={18} />
            </div>

            <div>
              <h3>Certificate Validity</h3>
              <p>
                Set the verification and certificate expiry dates.
              </p>
            </div>
          </div>

          <div className="form-grid">
            {/* Issue Date */}

            <div className="form-field">
              <label htmlFor="issueDate">
                Issue Date
                <span>*</span>
              </label>

              <div
                className={`input-wrapper ${
                  errors.issueDate
                    ? "has-error"
                    : ""
                }`}
              >
                <CalendarDays size={18} />

                <input
                  id="issueDate"
                  name="issueDate"
                  type="date"
                  value={formData.issueDate}
                  onChange={handleChange}
                />
              </div>

              {errors.issueDate && (
                <small className="field-error">
                  {errors.issueDate}
                </small>
              )}
            </div>

            {/* Expiry Date */}

            <div className="form-field">
              <label htmlFor="expiryDate">
                Expiry Date
                <span>*</span>
              </label>

              <div
                className={`input-wrapper ${
                  errors.expiryDate
                    ? "has-error"
                    : ""
                }`}
              >
                <CalendarDays size={18} />

                <input
                  id="expiryDate"
                  name="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={handleChange}
                />
              </div>

              {errors.expiryDate && (
                <small className="field-error">
                  {errors.expiryDate}
                </small>
              )}
            </div>
          </div>
        </section>

        {/* Payment Information */}

        <section className="form-section">
          <div className="form-section-heading">
            <div className="section-icon">
              <IndianRupee size={18} />
            </div>

            <div>
              <h3>Certificate Charges</h3>
              <p>
                Record certificate and renewal amounts.
              </p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="certificateAmount">
                Certificate Amount
              </label>

              <div className="input-wrapper">
                <IndianRupee size={18} />

                <input
                  id="certificateAmount"
                  name="certificateAmount"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.certificateAmount}
                  onChange={handleChange}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="renewalAmount">
                Renewal Amount
              </label>

              <div className="input-wrapper">
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
            </div>
          </div>
        </section>

        {/* Document & Issuer */}

        <section className="form-section">
          <div className="form-section-heading">
            <div className="section-icon">
              <FileUp size={18} />
            </div>

            <div>
              <h3>Certificate Document</h3>
              <p>
                Upload the generated certificate or supporting
                document.
              </p>
            </div>
          </div>

          <div className="form-grid">
            {/* File Upload */}

            <div className="form-field">
              <label htmlFor="certificateFile">
                Certificate PDF / Image
              </label>

              <div className="file-upload-wrapper">
                <FileUp size={22} />

                <div>
                  <strong>
                    {formData.certificateFile
                      ? formData.certificateFile.name
                      : "Choose certificate file"}
                  </strong>

                  <span>
                    PDF, JPG or PNG
                  </span>
                </div>

                <input
                  id="certificateFile"
                  name="certificateFile"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileChange}
                />
              </div>

              {errors.certificateFile && (
                <small className="field-error">
                  {errors.certificateFile}
                </small>
              )}
            </div>

            {/* Issued By */}

            <div className="form-field">
              <label htmlFor="issuedBy">
                Issued By
                <span>*</span>
              </label>

              <div
                className={`input-wrapper ${
                  errors.issuedBy
                    ? "has-error"
                    : ""
                }`}
              >
                <UserCog size={18} />

                <input
                  id="issuedBy"
                  name="issuedBy"
                  type="text"
                  value={formData.issuedBy}
                  onChange={handleChange}
                  placeholder="Enter staff / officer name"
                />
              </div>

              {errors.issuedBy && (
                <small className="field-error">
                  {errors.issuedBy}
                </small>
              )}
            </div>
          </div>
        </section>

        {/* Remarks */}

        <section className="form-section">
          <div className="form-section-heading">
            <div className="section-icon">
              <FileCheck2 size={18} />
            </div>

            <div>
              <h3>Remarks</h3>
              <p>
                Add any additional certificate information.
              </p>
            </div>
          </div>

          <div className="form-field">
            <textarea
              className="form-textarea"
              id="remarks"
              name="remarks"
              rows="4"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Enter remarks or additional information..."
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