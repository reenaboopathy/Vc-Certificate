import { useState } from "react";
import {
  Building2,
  UserRound,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  FileText,
  BriefcaseBusiness,
  StickyNote,
  X,
  Save,
} from "lucide-react";
import "./CustomerForm.css";
const initialFormData = {
  customerName: "",
  companyName: "",
  mobile: "",
  whatsapp: "",
  email: "",
  address: "",
  gstNumber: "",
  customerType: "",
  contactPerson: "",
  notes: "",
};

export default function CustomerForm({
  initialData = {},
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = "Save Customer",
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

  const validateForm = () => {
    const newErrors = {};

    if (!formData.customerName.trim()) {
      newErrors.customerName = "Customer name is required";
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company / shop name is required";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!/^[0-9]{10}$/.test(formData.mobile.trim())) {
      newErrors.mobile = "Enter a valid 10-digit mobile number";
    }

    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      newErrors.email = "Enter a valid email address";
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
    <div className="customer-form-wrapper">
      <div className="customer-form-header">
        <div>
          <span className="form-eyebrow">CUSTOMER MANAGEMENT</span>

          <h2>
            {initialData?._id ? "Edit Customer" : "Add New Customer"}
          </h2>

          <p>
            Add customer details to manage scales, certificates and renewals.
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

      <form className="customer-form" onSubmit={handleSubmit}>
        {/* Basic Information */}

        <section className="form-section">
          <div className="form-section-heading">
            <div className="section-icon">
              <UserRound size={18} />
            </div>

            <div>
              <h3>Basic Information</h3>
              <p>Enter the customer's primary details.</p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="customerName">
                Customer Name
                <span>*</span>
              </label>

              <div
                className={`input-wrapper ${
                  errors.customerName ? "has-error" : ""
                }`}
              >
                <UserRound size={18} />

                <input
                  id="customerName"
                  name="customerName"
                  type="text"
                  value={formData.customerName}
                  onChange={handleChange}
                  placeholder="Enter customer name"
                />
              </div>

              {errors.customerName && (
                <small className="field-error">
                  {errors.customerName}
                </small>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="companyName">
                Company / Shop Name
                <span>*</span>
              </label>

              <div
                className={`input-wrapper ${
                  errors.companyName ? "has-error" : ""
                }`}
              >
                <Building2 size={18} />

                <input
                  id="companyName"
                  name="companyName"
                  type="text"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder="Enter company or shop name"
                />
              </div>

              {errors.companyName && (
                <small className="field-error">
                  {errors.companyName}
                </small>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="customerType">
                Customer Type
              </label>

              <div className="input-wrapper">
                <BriefcaseBusiness size={18} />

                <select
                  id="customerType"
                  name="customerType"
                  value={formData.customerType}
                  onChange={handleChange}
                >
                  <option value="">Select customer type</option>
                  <option value="retail">Retail</option>
                  <option value="wholesale">Wholesale</option>
                  <option value="manufacturing">Manufacturing</option>
                  <option value="commercial">Commercial</option>
                  <option value="individual">Individual</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="contactPerson">
                Contact Person
              </label>

              <div className="input-wrapper">
                <UserRound size={18} />

                <input
                  id="contactPerson"
                  name="contactPerson"
                  type="text"
                  value={formData.contactPerson}
                  onChange={handleChange}
                  placeholder="Enter contact person"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Contact Information */}

        <section className="form-section">
          <div className="form-section-heading">
            <div className="section-icon">
              <Phone size={18} />
            </div>

            <div>
              <h3>Contact Information</h3>
              <p>Keep customer communication details up to date.</p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="mobile">
                Mobile Number
                <span>*</span>
              </label>

              <div
                className={`input-wrapper ${
                  errors.mobile ? "has-error" : ""
                }`}
              >
                <Phone size={18} />

                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="10-digit mobile number"
                />
              </div>

              {errors.mobile && (
                <small className="field-error">
                  {errors.mobile}
                </small>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="whatsapp">
                WhatsApp Number
              </label>

              <div className="input-wrapper">
                <MessageCircle size={18} />

                <input
                  id="whatsapp"
                  name="whatsapp"
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={formData.whatsapp}
                  onChange={handleChange}
                  placeholder="WhatsApp number"
                />
              </div>
            </div>

            <div className="form-field form-field-full">
              <label htmlFor="email">
                Email Address
              </label>

              <div
                className={`input-wrapper ${
                  errors.email ? "has-error" : ""
                }`}
              >
                <Mail size={18} />

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="customer@example.com"
                />
              </div>

              {errors.email && (
                <small className="field-error">
                  {errors.email}
                </small>
              )}
            </div>
          </div>
        </section>

        {/* Business Information */}

        <section className="form-section">
          <div className="form-section-heading">
            <div className="section-icon">
              <FileText size={18} />
            </div>

            <div>
              <h3>Business Information</h3>
              <p>Store registration and business details.</p>
            </div>
          </div>

          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="gstNumber">
                GST Number
              </label>

              <div className="input-wrapper">
                <FileText size={18} />

                <input
                  id="gstNumber"
                  name="gstNumber"
                  type="text"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  placeholder="Enter GST number"
                  style={{ textTransform: "uppercase" }}
                />
              </div>
            </div>

            <div className="form-field form-field-full">
              <label htmlFor="address">
                Address
              </label>

              <div className="textarea-wrapper">
                <MapPin size={18} />

                <textarea
                  id="address"
                  name="address"
                  rows="3"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter complete customer address"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Notes */}

        <section className="form-section">
          <div className="form-section-heading">
            <div className="section-icon">
              <StickyNote size={18} />
            </div>

            <div>
              <h3>Notes</h3>
              <p>Add any additional information about this customer.</p>
            </div>
          </div>

          <div className="form-field">
            <div className="textarea-wrapper">
              <StickyNote size={18} />

              <textarea
                id="notes"
                name="notes"
                rows="4"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Add notes, preferences or important remarks..."
              />
            </div>
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

            {isLoading ? "Saving..." : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}