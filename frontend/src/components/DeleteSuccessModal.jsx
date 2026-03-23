import React, { useEffect, useState } from 'react';
import './DeleteSuccessModal.css';

const DeleteSuccessModal = ({ isOpen, onClose }) => {
  const [countdown, setCountdown] = useState(2);

  useEffect(() => {
    if (!isOpen) {
      setCountdown(2);
      return;
    }
    if (countdown === 0) {
      onClose();
      return;
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    return () => clearTimeout(timer);
  }, [isOpen, countdown, onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content delete-success-modal-content">
        <div className="trashbin-wrapper">
          <svg className="trashbin" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle className="trashbin-circle" cx="26" cy="26" r="25" fill="none" />
            <g>
              <rect className="trashbin-handle" pathLength="100" x="20" y="5" width="12" height="5" rx="2" fill="none" />
              <rect className="trashbin-lid" pathLength="100" x="8" y="10" width="36" height="5" rx="1" fill="none" />
              <path className="trashbin-body" pathLength="100" fill="none" d="M11,15 L13,43 h26 L41,15" />
              <line className="trashbin-line1" pathLength="100" x1="20" y1="19" x2="19" y2="39" />
              <line className="trashbin-line2" pathLength="100" x1="26" y1="19" x2="26" y2="39" />
              <line className="trashbin-line3" pathLength="100" x1="32" y1="19" x2="33" y2="39" />
            </g>
          </svg>
        </div>
        <h2>Enquiry Deleted</h2>
        <p className="redirect-text">Closing in {countdown}...</p>
      </div>
    </div>
  );
};

export default DeleteSuccessModal;
