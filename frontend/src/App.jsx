import { useState, useEffect } from 'react'
import './App.css'
import api from './api'
import Aurora from './components/Aurora'
import ShinyText from './components/ShinyText'
import ConfirmationModal from './components/ConfirmationModal'
import SuccessModal from './components/SuccessModal'
import DeleteConfirmModal from './components/DeleteConfirmModal'
import DeleteSuccessModal from './components/DeleteSuccessModal'

function App() {
  const [enquiries, setEnquiries] = useState([])
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [newlyCreatedId, setNewlyCreatedId] = useState(null)
  const [pendingHighlightId, setPendingHighlightId] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    countryCode: '+27',
    phone: '',
    enquiryType: '',
    preferredDate: '',
    preferredTime: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showDeleteSuccessModal, setShowDeleteSuccessModal] = useState(false)
  const [enquiryToDelete, setEnquiryToDelete] = useState(null)
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    enquiryType: false,
    preferredDate: false,
    preferredTime: false,
    notes: false
  })

  useEffect(() => {
    fetchEnquiries()
  }, [])

  useEffect(() => {
    if (newlyCreatedId) {
      const element = document.getElementById(`enquiry-${newlyCreatedId}`)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' })
        const timer = setTimeout(() => setNewlyCreatedId(null), 3000)
        return () => clearTimeout(timer)
      }
    }
  }, [enquiries, newlyCreatedId])

  const fetchEnquiries = async (highlightId = null) => {
    try {
      const { data } = await api.get('/enquiries')
      setEnquiries(data)
      if (highlightId) {
        setNewlyCreatedId(highlightId)
      }
    } catch (error) {
      console.error('Error fetching enquiries:', error)
    }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const isEmailValid = (email) => emailRegex.test(email.trim())
  const isPhoneValid = (phone) => /^\d{10}$/.test(phone.trim())

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'notes' && value.length > 200) return

    if (name === 'phone') {
      const onlyNums = value.replace(/[^0-9]/g, '')
      if (onlyNums.length > 10) return
      setFormData({
        ...formData,
        [name]: onlyNums
      })
    } else {
      setFormData({
        ...formData,
        [name]: value
      })
    }

    setTouched({
      ...touched,
      [name]: true
    })
  }

  const handleSubmitButtonMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    e.currentTarget.style.setProperty('--x', `${x}px`)
    e.currentTarget.style.setProperty('--y', `${y}px`)
  }

  const handleSubmitButtonMouseLeave = (e) => {
    e.currentTarget.style.removeProperty('--x')
    e.currentTarget.style.removeProperty('--y')
  }

  const formatDateTime = (isoString) => {
    if (!isoString) return ''
    const date = new Date(isoString)
    if (Number.isNaN(date.getTime())) return isoString

    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')

    return `${day}/${month}/${year} ${hours}:${minutes}`
  }



  const handleDeleteClick = (enquiry) => {
    setEnquiryToDelete(enquiry)
    setShowDeleteModal(true)
  }

  const handleConfirmDelete = async () => {
    if (!enquiryToDelete) return
    setShowDeleteModal(false)
    try {
      await api.delete(`/enquiries/${enquiryToDelete.id}`)
      setEnquiries(prev => prev.filter(e => e.id !== enquiryToDelete.id))
      setShowDeleteSuccessModal(true)
    } catch (error) {
      console.error('Error deleting enquiry:', error)
    } finally {
      setEnquiryToDelete(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')

    const newTouched = {
      name: true,
      email: true,
      phone: true,
      enquiryType: true,
      preferredDate: true,
      preferredTime: true
    }
    setTouched(newTouched)

    // Client-side validation
    if (!formData.name || !formData.email || !formData.phone || !formData.enquiryType || !formData.preferredDate || !formData.preferredTime) {
      setMessage('Please fill in all required fields.')
      return
    }

    if (!isEmailValid(formData.email)) {
      setMessage('Please enter a valid email address.')
      return
    }

    if (!isPhoneValid(formData.phone)) {
      setMessage('Please enter a valid 10-digit phone number.')
      return
    }

    setShowConfirmModal(true)
  }

  const handleConfirmSubmit = async () => {
    setShowConfirmModal(false)
    setLoading(true)
    
    const selectedDateTime = new Date(formData.preferredDate)
    const [hours, minutes] = formData.preferredTime.split(':').map(Number)
    selectedDateTime.setHours(hours)
    selectedDateTime.setMinutes(minutes)

    const normalizedPhone = formData.phone.trim().replace(/^0+/, '')

    try {
      const { data: result } = await api.post('/enquiries', {
        ...formData,
        phone: `${formData.countryCode} ${normalizedPhone}`,
        preferredDate: selectedDateTime.toISOString()
      })

      setPendingHighlightId(result.id)
      setShowSuccessModal(true)
      setFormData({
        name: '',
        email: '',
        countryCode: '+27',
        phone: '',
        enquiryType: '',
        preferredDate: '',
        preferredTime: '',
        notes: ''
      })
      setTouched({
        name: false,
        email: false,
        phone: false,
        enquiryType: false,
        preferredDate: false,
        preferredTime: false,
        notes: false
      })
      fetchEnquiries()
    } catch (error) {
      setMessage('Error submitting enquiry. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmSubmit}
        formData={formData}
        formatDateTime={formatDateTime}
      />
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false)
          if (pendingHighlightId) {
            setNewlyCreatedId(pendingHighlightId)
            setPendingHighlightId(null)
          }
        }}
      />
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => { setShowDeleteModal(false); setEnquiryToDelete(null) }}
        onConfirm={handleConfirmDelete}
        enquiryName={enquiryToDelete?.name}
      />
      <DeleteSuccessModal
        isOpen={showDeleteSuccessModal}
        onClose={() => setShowDeleteSuccessModal(false)}
      />
      <Aurora
        colorStops={["#00f5ff","#B19EEF","#5227FF"]}
        blend={0.5}
        amplitude={1.0}
        speed={0.3}
      />
      <div className="content">
        <h1>
          <ShinyText
            text="Appointments"
            speed={2}
            delay={1.5}
            color="#28324f"
            shineColor="#ffffff"
            spread={120}
            direction="left"
            yoyo={false}
            pauseOnHover={false}
            disabled={false}
          />
        </h1>
        
        <form onSubmit={handleSubmit} className="enquiry-form" noValidate>
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input
              className={
                touched.name
                  ? formData.name.trim()
                    ? 'valid-input'
                    : 'invalid-input'
                  : ''
              }
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email *</label>
            <input
              className={
                touched.email
                  ? isEmailValid(formData.email)
                    ? 'valid-input'
                    : 'invalid-input'
                  : ''
              }
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="e.g. johndoe@email.com"
              required
            />
          </div>

          <div className="form-group phone-group">
            <label htmlFor="phone">Phone *</label>
            <div className="phone-input-wrapper">
              <select
                className="country-code"
                name="countryCode"
                value={formData.countryCode}
                onChange={handleChange}
              >
                <option value="+27">+27 (South Africa)</option>
                <option value="+1">+1 (USA/Canada)</option>
                <option value="+44">+44 (UK)</option>
                <option value="+61">+61 (Australia)</option>
                <option value="+91">+91 (India)</option>
              </select>
              <input
                className={
                  touched.phone
                    ? isPhoneValid(formData.phone)
                      ? 'valid-input'
                      : 'invalid-input'
                    : ''
                }
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="e.g. 0821234567"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="enquiryType">Enquiry Type *</label>
            <select
              className={
                touched.enquiryType
                  ? formData.enquiryType
                    ? 'valid-input'
                    : 'invalid-input'
                  : ''
              }
              id="enquiryType"
              name="enquiryType"
              value={formData.enquiryType}
              onChange={handleChange}
              required
            >
              <option value="">Select Type</option>
              <option value="General">General</option>
              <option value="Consultation">Consultation</option>
              <option value="Appointment">Appointment</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group date-time-group">
            <div className="date-item">
              <label htmlFor="preferredDate">Preferred Date *</label>
              <input
                className={
                  touched.preferredDate
                    ? formData.preferredDate
                      ? 'valid-input'
                      : 'invalid-input'
                    : ''
                }
                type="date"
                id="preferredDate"
                name="preferredDate"
                value={formData.preferredDate}
                onChange={handleChange}
                required
              />
            </div>
            <div className="time-item">
              <label htmlFor="preferredTime">Preferred Time *</label>
              <input
                className={
                  touched.preferredTime
                    ? formData.preferredTime
                      ? 'valid-input'
                      : 'invalid-input'
                    : ''
                }
                type="time"
                id="preferredTime"
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              maxLength="200"
            />
            <div className="notes-counter">{formData.notes.length}/200</div>
          </div>

          <button
            type="submit"
            disabled={loading}
            onMouseMove={handleSubmitButtonMouseMove}
            onMouseLeave={handleSubmitButtonMouseLeave}
          >
            {loading ? 'Submitting...' : 'Submit Enquiry'}
          </button>

          {message && <p className={`message ${message.includes('success') ? 'success' : 'error'}`}>{message}</p>}
        </form>

        <div className="enquiries-list">
          <h2>Saved Enquiries</h2>
          {enquiries.length === 0 ? (
            <p>No enquiries yet.</p>
          ) : (
            enquiries.map(enquiry => (
              <div 
                key={enquiry.id} 
                id={`enquiry-${enquiry.id}`}
                className={`enquiry-item ${newlyCreatedId === enquiry.id ? 'highlight-item' : ''}`}
              >
                <button
                  className="delete-enquiry-btn"
                  onClick={() => handleDeleteClick(enquiry)}
                  title="Delete enquiry"
                >
                  &times;
                </button>
                <h3>{enquiry.name}</h3>
                <p><strong>Email:</strong> {enquiry.email}</p>
                <p><strong>Phone:</strong> {enquiry.phone.replace(/\b0+(\d+)$/, '$1')}</p>
                <p><strong>Type:</strong> {enquiry.enquiryType}</p>
                <p><strong>Preferred Date:</strong> {formatDateTime(enquiry.preferredDate)}</p>
                {enquiry.notes && <p><strong>Notes:</strong> {enquiry.notes}</p>}
                <p><strong>Submitted:</strong> {formatDateTime(enquiry.dateCreated)}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default App
