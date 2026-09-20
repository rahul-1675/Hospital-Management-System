import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Sparkles, Building2, User, Calendar, ShieldAlert, Stethoscope } from 'lucide-react';
import PeekRating from '../ui/PeekRating';
import Button from '../common/Button';
import { reviewService } from '../../services/review.service';
import { useAuth } from '../../hooks/useAuth';

export const ReviewModal = ({
    isOpen,
    onClose,
    appointment = null,
    onSuccess
}) => {
    const { user } = useAuth();
    const [patientName, setPatientName] = useState(user?.name || '');
    const [doctorNameInput, setDoctorNameInput] = useState('');
    const [department, setDepartment] = useState('');
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    if (!isOpen) return null;

    const doctorName = appointment?.doctor?.name || appointment?.doctorName || doctorNameInput;
    const hospitalName = appointment?.hospital?.name || appointment?.hospitalName || 'ProHealth Central Hospital';
    const appointmentDate = appointment?.date || 'Recent Visit';

    const handleRatingChange = (newRating) => {
        setRating(newRating);
        if (errorMsg && newRating > 0) {
            setErrorMsg('');
        }
    };

    const handleCommentChange = (e) => {
        setComment(e.target.value);
        if (errorMsg && e.target.value.trim().length >= 10) {
            setErrorMsg('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (!appointment && !patientName.trim()) {
            setErrorMsg('Please enter your name or nickname.');
            return;
        }

        if (!rating || rating < 1 || rating > 5) {
            setErrorMsg('Please select a rating for your healthcare experience.');
            return;
        }

        const trimmed = comment.trim();
        if (trimmed.length < 10) {
            setErrorMsg('Please write a short review (at least 10 characters) describing your experience.');
            return;
        }

        if (trimmed.length > 1000) {
            setErrorMsg('Your review is too long (maximum 1000 characters).');
            return;
        }

        setSubmitting(true);

        try {
            const appointmentId = appointment?._id || appointment?.id || null;
            const doctorId = appointment?.doctor?._id || appointment?.doctor?.id || appointment?.doctor || null;
            const hospitalId = appointment?.hospital?._id || appointment?.hospital?.id || appointment?.hospital || null;

            await reviewService.submitReview({
                patientName: user?.name || patientName.trim() || 'Verified Patient',
                appointmentId,
                doctorId,
                hospitalId,
                department: department || appointment?.doctor?.department || appointment?.department || '',
                doctorName: doctorNameInput || doctorName,
                rating,
                comment: trimmed
            });

            setIsSuccess(true);
            if (onSuccess) {
                onSuccess({
                    appointmentId,
                    rating,
                    comment: trimmed
                });
            }
        } catch (err) {
            setErrorMsg(err.message || 'Unable to submit your review right now. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleModalClose = () => {
        setRating(0);
        setComment('');
        setErrorMsg('');
        setIsSuccess(false);
        if (!user) setPatientName('');
        setDoctorNameInput('');
        setDepartment('');
        onClose();
    };

    return (
        <div
            style={{
                position: 'fixed',
                inset: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.65)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                zIndex: 1000,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                animation: 'fadeIn 0.25s ease'
            }}
            onClick={handleModalClose}
        >
            <div
                style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '20px',
                    width: '100%',
                    maxWidth: '560px',
                    boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
                    border: '1px solid rgba(226, 232, 240, 0.9)',
                    overflow: 'hidden',
                    animation: 'scaleUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '1.25rem 1.5rem',
                    borderBottom: '1px solid #f1f5f9',
                    background: 'linear-gradient(to right, #f8fafc, #ffffff)',
                    flexShrink: 0
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '10px',
                            background: 'rgba(2, 132, 199, 0.1)',
                            color: '#0284c7',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Sparkles size={20} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                                Share Your Healthcare Experience
                            </h3>
                            <p style={{ margin: '2px 0 0', fontSize: '0.8rem', color: '#64748b' }}>
                                Your honest feedback empowers better patient care and hospital services.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleModalClose}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#64748b',
                            padding: '4px',
                            borderRadius: '8px',
                            display: 'flex'
                        }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Modal Body */}
                <div style={{ padding: '1.5rem', overflowY: 'auto' }}>
                    {isSuccess ? (
                        <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                            <div style={{
                                width: '64px',
                                height: '64px',
                                borderRadius: '50%',
                                background: '#ecfdf5',
                                color: '#10b981',
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyCenter: 'center',
                                marginBottom: '1rem'
                            }}>
                                <CheckCircle2 size={36} />
                            </div>
                            <h4 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem' }}>
                                Thank you for your review!
                            </h4>
                            <p style={{ fontSize: '0.92rem', color: '#64748b', margin: '0 0 1.5rem', lineHeight: 1.5 }}>
                                Your review has been submitted successfully and will appear on the Patient Reviews page.
                            </p>
                            <Button
                                variant="primary"
                                onClick={handleModalClose}
                                style={{ padding: '0.65rem 2rem', borderRadius: '10px', fontWeight: 700 }}
                            >
                                Done
                            </Button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            {/* Appointment Info (If Linked) */}
                            {appointment ? (
                                <div style={{
                                    backgroundColor: '#f8fafc',
                                    border: '1px solid #e2e8f0',
                                    borderRadius: '12px',
                                    padding: '0.85rem 1rem',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '0.4rem',
                                    fontSize: '0.85rem'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155', fontWeight: 600 }}>
                                        <User size={15} color="#0284c7" />
                                        <span>Doctor: <strong style={{ color: '#0f172a' }}>{doctorName}</strong></span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155', fontWeight: 600 }}>
                                        <Building2 size={15} color="#0284c7" />
                                        <span>Hospital: <strong style={{ color: '#0f172a' }}>{hospitalName}</strong></span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#334155', fontWeight: 600 }}>
                                        <Calendar size={15} color="#0284c7" />
                                        <span>Visit Date: <strong style={{ color: '#0f172a' }}>{appointmentDate}</strong></span>
                                    </div>
                                </div>
                            ) : (
                                /* Guest Patient Fields (No Login Required) */
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                                    <div>
                                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                            Your Name / Nickname <span style={{ color: '#ef4444' }}>*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={patientName}
                                            onChange={(e) => setPatientName(e.target.value)}
                                            placeholder="e.g. Rahul Sharma"
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '0.65rem 0.85rem',
                                                borderRadius: '8px',
                                                border: '1px solid #cbd5e1',
                                                fontSize: '0.9rem',
                                                outline: 'none',
                                                color: '#0f172a'
                                            }}
                                        />
                                        <span style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px', display: 'block' }}>
                                            Privacy note: Last names are automatically masked for your privacy (e.g. "Rahul S.").
                                        </span>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                                Doctor Name (Optional)
                                            </label>
                                            <input
                                                type="text"
                                                value={doctorNameInput}
                                                onChange={(e) => setDoctorNameInput(e.target.value)}
                                                placeholder="e.g. Dr. Sarah Jenkins"
                                                style={{
                                                    width: '100%',
                                                    padding: '0.65rem 0.85rem',
                                                    borderRadius: '8px',
                                                    border: '1px solid #cbd5e1',
                                                    fontSize: '0.9rem',
                                                    outline: 'none',
                                                    color: '#0f172a'
                                                }}
                                            />
                                        </div>
                                        <div>
                                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                                                Department (Optional)
                                            </label>
                                            <select
                                                value={department}
                                                onChange={(e) => setDepartment(e.target.value)}
                                                style={{
                                                    width: '100%',
                                                    padding: '0.65rem 0.85rem',
                                                    borderRadius: '8px',
                                                    border: '1px solid #cbd5e1',
                                                    fontSize: '0.9rem',
                                                    outline: 'none',
                                                    color: '#0f172a',
                                                    backgroundColor: '#ffffff'
                                                }}
                                            >
                                                <option value="">General Care</option>
                                                <option value="Cardiology">Cardiology</option>
                                                <option value="Orthopedics">Orthopedics</option>
                                                <option value="Pediatrics">Pediatrics</option>
                                                <option value="Neurology">Neurology</option>
                                                <option value="Dermatology">Dermatology</option>
                                                <option value="Emergency Care">Emergency Care</option>
                                                <option value="General Surgery">General Surgery</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Interactive PeekRating Section */}
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.75rem 0 0.25rem'
                            }}>
                                <label style={{
                                    fontSize: '0.98rem',
                                    fontWeight: 700,
                                    color: '#0f172a'
                                }}>
                                    Rate your healthcare experience
                                </label>

                                <PeekRating
                                    value={rating}
                                    defaultValue={0}
                                    count={5}
                                    shape="star"
                                    labels={['Poor', 'Fair', 'Good', 'Great', 'Excellent']}
                                    activeColor="#f5b400"
                                    idleColor="#cbd5e1"
                                    tipColor="#0f172a"
                                    tipTextColor="#f8fafc"
                                    size={36}
                                    lift={8}
                                    magnify={1.2}
                                    riseDuration={320}
                                    popScale={1.35}
                                    showTip={true}
                                    allowClear={true}
                                    onChange={handleRatingChange}
                                />
                            </div>

                            {/* Review Textarea */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <label style={{ fontSize: '0.9rem', fontWeight: 700, color: '#334155' }}>
                                        Tell us about your experience <span style={{ color: '#ef4444' }}>*</span>
                                    </label>
                                    <span style={{
                                        fontSize: '0.78rem',
                                        fontWeight: 600,
                                        color: comment.length > 1000 ? '#ef4444' : comment.length >= 10 ? '#10b981' : '#64748b'
                                    }}>
                                        {comment.length} / 1000
                                    </span>
                                </div>

                                <textarea
                                    rows={4}
                                    value={comment}
                                    onChange={handleCommentChange}
                                    placeholder="Share details about staff friendliness, wait times, doctor consultation, facilities..."
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '10px',
                                        border: '1px solid #cbd5e1',
                                        fontSize: '0.9rem',
                                        fontFamily: 'inherit',
                                        resize: 'vertical',
                                        outline: 'none',
                                        transition: 'border-color 0.2s ease',
                                        color: '#0f172a'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#0284c7'}
                                    onBlur={(e) => e.target.style.borderColor = '#cbd5e1'}
                                />

                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#64748b', fontSize: '0.78rem' }}>
                                    <ShieldAlert size={14} color="#0284c7" />
                                    <span>Please avoid sharing sensitive personal health records in public reviews.</span>
                                </div>
                            </div>

                            {/* Error Alert */}
                            {errorMsg && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.65rem 0.9rem',
                                    borderRadius: '8px',
                                    backgroundColor: '#fef2f2',
                                    border: '1px solid #fecaca',
                                    color: '#b91c1c',
                                    fontSize: '0.85rem',
                                    fontWeight: 600
                                }}>
                                    <AlertCircle size={16} color="#ef4444" />
                                    <span>{errorMsg}</span>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'flex-end',
                                gap: '0.75rem',
                                paddingTop: '0.5rem'
                            }}>
                                <Button
                                    variant="outline"
                                    onClick={handleModalClose}
                                    disabled={submitting}
                                    style={{ borderRadius: '8px', padding: '0.55rem 1.25rem' }}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    variant="primary"
                                    type="submit"
                                    isLoading={submitting}
                                    loadingText="Submitting..."
                                    style={{ borderRadius: '8px', padding: '0.55rem 1.5rem', fontWeight: 700 }}
                                >
                                    Submit Review
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ReviewModal;

