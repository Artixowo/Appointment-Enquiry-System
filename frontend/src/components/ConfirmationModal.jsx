import React from 'react';
import './ConfirmationModal.css';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, formData, formatDateTime }) => {
  if (!isOpen) return null;

  const displayPhone = `${formData.countryCode} ${formData.phone.replace(/^0+/, '')}`;
  const displayDateTime = `${formData.preferredDate} ${formData.preferredTime}`;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Are you sure this information is correct?</h2>
        <div className="info-summary">
          <p><strong>Full Name:</strong> {formData.name}</p>
          <p><strong>Email:</strong> {formData.email}</p>
          <p><strong>Phone:</strong> {displayPhone}</p>
          <p><strong>Enquiry Type:</strong> {formData.enquiryType}</p>
          <p><strong>Preferred Date & Time:</strong> {displayDateTime}</p>
          {formData.notes && <p><strong>Notes:</strong> {formData.notes}</p>}
        </div>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>Cancel</button>
          <button className="btn-confirm" onClick={onConfirm}>Yes</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
