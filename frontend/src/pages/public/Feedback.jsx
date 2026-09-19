import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, HeartHandshake, CheckCircle2, User, Building } from 'lucide-react';
import { feedbackService } from '../../services/feedback.service';
import HomeBg from '../../assets/Home.png';

const Feedback = () => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [name, setName] = useState('');
    const [department, setDepartment] = useState('General');
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [hoverRating, setHoverRating] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        const load = async () => {
            const data = await feedbackService.getFeedbacks();
            setFeedbacks(data);
        };
        load();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name.trim() || !comment.trim()) return;

        setSubmitting(true);
        try {
            const newFb = await feedbackService.submitFeedback({
                name: name.trim(),
                department,
                rating,
                comment: comment.trim()
            });
            setFeedbacks((prev) => [newFb, ...prev]);
            setSubmitted(true);
            setName('');
            setComment('');
            setRating(5);
            setTimeout(() => setSubmitted(false), 5000);
        } catch (err) {
            console.error('Error submitting feedback:', err);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{
            backgroundImage: `url(${HomeBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: '100vh',
            backgroundAttachment: 'fixed',
            paddingBottom: '4rem'
        }}>
            {/* Hero Header */}
            <div className="landing-hero" style={{ padding: '3.5rem 1rem 2rem' }}>
                <div className="hero-content" style={{ textAlign: 'center' }}>
                    <span className="hero-badge">Patient Voice</span>
                    <h1 className="hero-title" style={{ fontSize: '2.8rem', marginTop: '0.5rem', color: '#ffffff' }}>
                        Patient Feedback & <span className="highlight">Reviews</span>
                    </h1>
                    <p className="hero-subtitle" style={{ color: '#f1f5f9', maxWidth: '650px', margin: '1rem auto 0' }}>
                        We value your health journey. Share your experience with our doctors, staff, and facilities to help us continually elevate patient care.
                    </p>
                </div>
            </div>

            <div className="container" style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem', marginTop: '1.5rem' }}>
                    
                    {/* Submit Feedback Form */}
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(12px)',
                        borderRadius: '16px',
                        padding: '2rem',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
                        border: '1px solid rgba(255, 255, 255, 0.6)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                            <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: 'var(--color-brand-subtle, #e0f2fe)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color, #0284c7)' }}>
                                <HeartHandshake size={24} />
                            </div>
                            <div>
                                <h2 style={{ fontSize: '1.35rem', fontWeight: '700', margin: 0, color: '#0f172a' }}>Share Your Experience</h2>
                                <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Takes less than 1 minute</p>
                            </div>
                        </div>

                        {submitted && (
                            <div style={{
                                padding: '1rem',
                                borderRadius: '10px',
                                background: '#ecfdf5',
                                border: '1px solid #6ee7b7',
                                color: '#065f46',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                marginBottom: '1.5rem',
                                fontSize: '0.9rem'
                            }}>
                                <CheckCircle2 size={18} color="#059669" />
                                <span>Thank you! Your feedback has been recorded successfully.</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#334155', marginBottom: '0.4rem' }}>
                                    Your Full Name
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Sarah Jenkins"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '8px',
                                        border: '1px solid #cbd5e1',
                                        fontSize: '0.95rem',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#334155', marginBottom: '0.4rem' }}>
                                    Department Visited
                                </label>
                                <select
                                    value={department}
                                    onChange={(e) => setDepartment(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '8px',
                                        border: '1px solid #cbd5e1',
                                        fontSize: '0.95rem',
                                        background: '#ffffff',
                                        boxSizing: 'border-box'
                                    }}
                                >
                                    <option value="General">General Consultation</option>
                                    <option value="Cardiology">Cardiology</option>
                                    <option value="Pediatrics">Pediatrics</option>
                                    <option value="Orthopedics">Orthopedics</option>
                                    <option value="Pharmacy">Pharmacy</option>
                                    <option value="Emergency">Emergency & Trauma</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#334155', marginBottom: '0.4rem' }}>
                                    Rating
                                </label>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            type="button"
                                            key={star}
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            style={{
                                                background: 'transparent',
                                                border: 'none',
                                                cursor: 'pointer',
                                                padding: '0.2rem',
                                                transition: 'transform 0.15s'
                                            }}
                                        >
                                            <Star
                                                size={28}
                                                fill={(hoverRating || rating) >= star ? '#f59e0b' : 'none'}
                                                color={(hoverRating || rating) >= star ? '#f59e0b' : '#cbd5e1'}
                                            />
                                        </button>
                                    ))}
                                    <span style={{ fontSize: '0.85rem', color: '#64748b', marginLeft: '0.5rem', fontWeight: '500' }}>
                                        {hoverRating || rating} of 5 Stars
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#334155', marginBottom: '0.4rem' }}>
                                    Your Comments & Feedback
                                </label>
                                <textarea
                                    required
                                    rows={4}
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Tell us about the consultation, staff friendliness, or facility cleanliness..."
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '8px',
                                        border: '1px solid #cbd5e1',
                                        fontSize: '0.95rem',
                                        resize: 'vertical',
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                style={{
                                    width: '100%',
                                    padding: '0.85rem',
                                    borderRadius: '8px',
                                    background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                                    color: '#ffffff',
                                    fontWeight: '600',
                                    fontSize: '1rem',
                                    border: 'none',
                                    cursor: submitting ? 'not-allowed' : 'pointer',
                                    opacity: submitting ? 0.7 : 1,
                                    boxShadow: '0 4px 12px rgba(2, 132, 199, 0.3)',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {submitting ? 'Submitting...' : 'Submit Feedback'}
                            </button>
                        </form>
                    </div>

                    {/* Patient Reviews Feed */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{
                            background: 'rgba(255, 255, 255, 0.95)',
                            backdropFilter: 'blur(12px)',
                            borderRadius: '16px',
                            padding: '1.5rem 2rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                        }}>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a' }}>Recent Patient Testimonials</h3>
                                <p style={{ margin: '0.25rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>Verified reviews from our community</p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#fef3c7', padding: '0.4rem 0.75rem', borderRadius: '20px' }}>
                                <Star size={16} fill="#f59e0b" color="#f59e0b" />
                                <span style={{ fontWeight: '700', color: '#92400e', fontSize: '0.9rem' }}>4.9 / 5.0</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '550px', overflowY: 'auto', paddingRight: '0.25rem' }}>
                            {feedbacks.map((item) => (
                                <div
                                    key={item.id}
                                    style={{
                                        background: 'rgba(255, 255, 255, 0.95)',
                                        backdropFilter: 'blur(10px)',
                                        borderRadius: '14px',
                                        padding: '1.25rem 1.5rem',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
                                        border: '1px solid rgba(255, 255, 255, 0.8)'
                                    }}
                                >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
                                                <User size={18} />
                                            </div>
                                            <div>
                                                <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: '700', color: '#1e293b' }}>{item.name}</h4>
                                                <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                                    {item.department ? `Visited ${item.department}` : 'Patient'} • {item.date || 'Recent'}
                                                </span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '2px' }}>
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star
                                                    key={s}
                                                    size={14}
                                                    fill={s <= item.rating ? '#f59e0b' : 'none'}
                                                    color={s <= item.rating ? '#f59e0b' : '#cbd5e1'}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p style={{ margin: 0, fontSize: '0.9rem', color: '#334155', lineHeight: '1.5' }}>
                                        "{item.comment}"
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Feedback;
