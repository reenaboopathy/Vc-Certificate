import { useState } from "react";
import {
  CalendarDays,
  Gauge,
  MapPin,
  Package,
  Ruler,
  Save,
  Scale,
  X,
} from "lucide-react";
import "./ScaleForm.css";

const initialFormData = {
  scaleId: "",
  customerId: "",
  scaleType: "",
  capacity: "",
  capacityUnit: "kg",
  make: "",
  model: "",
  serialNumber: "",
  location: "",
  installationDate: "",
  status: "Active",
};

export default function ScaleForm({
  customers = [],
  initialData = {},
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = "Save Scale",
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

    if (!formData.scaleId.trim()) {
      newErrors.scaleId = "Scale ID is required";
    }

    if (!formData.customerId) {
      newErrors.customerId = "Please select a customer";
    }

    if (!formData.scaleType) {
      newErrors.scaleType = "Scale type is required";
    }

    if (!formData.capacity.trim()) {
      newErrors.capacity = "Capacity is required";
    }

    if (!formData.serialNumber.trim()) {
      newErrors.serialNumber = "Serial number is required";
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
    <div className="scale-form-wrapper">
      {/* Header */}

      <div className="scale-form-header">
        <div>
          <span className="form-eyebrow">
            WEIGHING SCALE MANAGEMENT
          </span>

          <h2>
            {initialData?._id
              ? "Edit Weighing Scale"
              : "Add New Weighing Scale"}
          </h2>

          <p>
            Add scale details and link the scale to a customer.
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

      <form className="scale-form" onSubmit={handleSubmit}>
        {/* Scale Identification */}

        <section className="form-section">
          <div className="form-section-heading">
            <div className="section-icon">
              <Scale size={18} />
            </div>

            <div>
              <h3>Scale Identification</h3>
              <p>
                Enter the identification details of the weighing scale.
              </p>
            </div>
          </div>

          <div className="form-grid">
            {/* Scale ID */}

            <div className="form-field">
              <label htmlFor="scaleId">
                Scale ID
                <span>*</span>
              </label>

              <div
                className={`input-wrapper ${
                  errors.scaleId ? "has-error" : ""
                }`}
              >
                <Gauge size={18} />

                <input
                  id="scaleId"
                  name="scaleId"
                  type="text"
                  value={formData.scaleId}
                  onChange={handleChange}
                  placeholder="Example: SS-000125"
                />
              </div>

              {errors.scaleId && (
                <small className="field-error">
                  {errors.scaleId}
                </small>
              )}
            </div>

            {/* Customer */}

            <div className="form-field">
              <label htmlFor="customerId">
                Customer
                <span>*</span>
              </label>

              <div
                className={`input-wrapper ${
                  errors.customerId ? "has-error" : ""
                }`}
              >
                <Package size={18} />

                <select
                  id="customerId"
                  name="customerId"
                  value={formData.customerId}
                  onChange={handleChange}
                >
                  <option value="">
                    Select customer
                  </option>

                  {customers.map((customer) => (
                    <option
                      key={customer._id || customer.id}
                      value={customer._id || customer.id}
                    >
                      {customer.companyName
                        ? `${customer.companyName} - ${
                            customer.customerName || ""
                          }`
                        : customer.customerName}
                    </option>
                  ))}
                </select>
              </div>

              {errors.customerId && (
                <small className="field-error">
                  {errors.customerId}
                </small>
              )}
            </div>

            {/* Scale Type */}

            <div className="form-field">
              <label htmlFor="scaleType">
                Scale Type
                <span>*</span>
              </label>

              <div
                className={`input-wrapper ${
                  errors.scaleType ? "has-error" : ""
                }`}
              >
                <Scale size={18} />

                <select
                  id="scaleType"
                  name="scaleType"
                  value={formData.scaleType}
                  onChange={handleChange}
                >
                  <option value="">
                    Select scale type
                  </option>
                  <option value="platform">
                    Platform Scale
                  </option>
                  <option value="table-top">
                    Table Top Scale
                  </option>
                  <option value="counter">
                    Counter Scale
                  </option>
                  <option value="weighing-machine">
                    Weighing Machine
                  </option>
                  <option value="hanging">
                    Hanging Scale
                  </option>
                  <option value="floor">
                    Floor Scale
                  </option>
                  <option value="other">
                    Other
                  </option>
                </select>
              </div>

              {errors.scaleType && (
                <small className="field-error">
                  {errors.scaleType}
                </small>
              )}
            </div>

            {/* Status */}

            <div className="form-field">
              <label htmlFor="status">
                Status
              </label>

              <div className="input-wrapper">
                <Gauge size={18} />

                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                  <option value="Under Maintenance">
                    Under Maintenance
                  </option>
                  <option value="Retired">Retired</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {/* Scale Specifications */}

        <section className="form-section">
          <div className="form-section-heading">
            <div className="section-icon">
              <Ruler size={18} />
            </div>

            <div>
              <h3>Scale Specifications</h3>
              <p>
                Add the technical specifications of the scale.
              </p>
            </div>
          </div>

          <div className="form-grid">
            {/* Capacity */}

            <div className="form-field">
              <label htmlFor="capacity">
                Capacity
                <span>*</span>
              </label>

              <div
                className={`input-wrapper ${
                  errors.capacity ? "has-error" : ""
                }`}
              >
                <Gauge size={18} />

                <input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="Example: 30"
                />

                <select
                  className="input-unit"
                  name="capacityUnit"
                  value={formData.capacityUnit}
                  onChange={handleChange}
                  aria-label="Capacity unit"
                >
                  <option value="kg">kg</option>
                  <option value="g">g</option>
                  <option value="ton">ton</option>
                  <option value="lb">lb</option>
                </select>
              </div>

              {errors.capacity && (
                <small className="field-error">
                  {errors.capacity}
                </small>
              )}
            </div>

            {/* Make */}

            <div className="form-field">
              <label htmlFor="make">
                Make / Brand
              </label>

              <div className="input-wrapper">
                <Package size={18} />

                <input
                  id="make"
                  name="make"
                  type="text"
                  value={formData.make}
                  onChange={handleChange}
                  placeholder="Example: Essae"
                />
              </div>
            </div>

            {/* Model */}

            <div className="form-field">
              <label htmlFor="model">
                Model
              </label>

              <div className="input-wrapper">
                <Package size={18} />

                <input
                  id="model"
                  name="model"
                  type="text"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="Example: DS-215"
                />
              </div>
            </div>

            {/* Serial Number */}

            <div className="form-field">
              <label htmlFor="serialNumber">
                Serial Number
                <span>*</span>
              </label>

              <div
                className={`input-wrapper ${
                  errors.serialNumber ? "has-error" : ""
                }`}
              >
                <FileSerialIcon />

                <input
                  id="serialNumber"
                  name="serialNumber"
                  type="text"
                  value={formData.serialNumber}
                  onChange={handleChange}
                  placeholder="Example: ES123456"
                />
              </div>

              {errors.serialNumber && (
                <small className="field-error">
                  {errors.serialNumber}
                </small>
              )}
            </div>
          </div>
        </section>

        {/* Installation Details */}

        <section className="form-section">
          <div className="form-section-heading">
            <div className="section-icon">
              <MapPin size={18} />
            </div>

            <div>
              <h3>Installation Details</h3>
              <p>
                Record where and when the scale was installed.
              </p>
            </div>
          </div>

          <div className="form-grid">
            {/* Location */}

            <div className="form-field">
              <label htmlFor="location">
                Installation Location
              </label>

              <div className="input-wrapper">
                <MapPin size={18} />

                <input
                  id="location"
                  name="location"
                  type="text"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="Example: Billing Counter"
                />
              </div>
            </div>

            {/* Installation Date */}

            <div className="form-field">
              <label htmlFor="installationDate">
                Installation Date
              </label>

              <div className="input-wrapper">
                <CalendarDays size={18} />

                <input
                  id="installationDate"
                  name="installationDate"
                  type="date"
                  value={formData.installationDate}
                  onChange={handleChange}
                />
              </div>
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

            {isLoading
              ? "Saving..."
              : submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
}

/*
  Small inline icon component used for the serial number field.
  Keeping it local avoids adding another icon dependency.
*/
function FileSerialIcon() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "13px",
        fontWeight: 700,
      }}
    >
      #
    </span>
  );
}