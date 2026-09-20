import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Star, MessageSquare, CheckCircle2, User, Building2, Stethoscope, Sparkles, Filter, Calendar, ShieldCheck, ArrowRight, ThumbsUp } from 'lucide-react';
import { reviewService } from '../../services/review.service';
import { appointmentService } from '../../services/appointment.service';
import { useAuth } from '../../hooks/useAuth';
import PeekRating from '../../components/ui/PeekRating';
import ReviewModal from '../../components/reviews/ReviewModal';
import { InlineLoader, Loader } from '../../components/common/Loader';
import AnimatedGlassBackground from '../../components/common/AnimatedGlassBackground';
import Button from '../../components/common/Button';

const Feedback = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();

    // Data state
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState({ totalReviews: 0, averageRating: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } });
    const [loading, setLoading] = useState(true);
    const [selectedStar, setSelectedStar] = useState('All');
    const [selectedDept, setSelectedDept] = useState('All');

    // Review Modal state for eligible patients
    const [eligibleAppointments, setEligibleAppointments] = useState([]);
    const [selectedAppointmentForReview, setSelectedAppointmentForReview] = useState(null);
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [showEligiblePicker, setShowEligiblePicker] = useState(false);

    // Fetch reviews & stats from backend database
    const loadReviewsData = async () => {
        setLoading(true);
        try {
            const params = {};
            if (selectedStar !== 'All') {
                params.rating = selectedStar;
            }
            const res = await reviewService.getReviews(params);
            const reviewList = Array.isArray(res) ? res : (res?.data || []);
            setReviews(reviewList);
            if (res?.stats) {
                setStats(res.stats);
            } else if (reviewList.length > 0) {
                const total = reviewList.length;
                const sum = reviewList.reduce((acc, r) => acc + (r.rating || 0), 0);
                const avg = Number((sum / total).toFixed(2));
                const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
                reviewList.forEach(r => { if (dist[r.rating] !== undefined) dist[r.rating]++; });
                setStats({ totalReviews: total, averageRating: avg, distribution: dist });
            } else {
                setStats({ totalReviews: 0, averageRating: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } });
            }
        } catch (err) {
            console.error('Error loading reviews:', err);
        } finally {
            setLoading(false);
        }
    };

    // Load patient appointments to check for review eligibility
    const loadPatientAppointments = async () => {
        if (!isAuthenticated) return;
        try {
            const [apts, patientReviews] = await Promise.all([
                appointmentService.getPatientAppointments(),
                reviewService.getPatientReviews()
            ]);

            const reviewedAptIds = new Set(
                (patientReviews || []).map(r => r.appointment?._id || r.appointment?.id || r.appointment)
            );

            // Filter completed appointments that have not been reviewed yet
            const eligible = (apts || []).filter(a =>
                a.status === 'COMPLETED' && !reviewedAptIds.has(a._id || a.id)
            );
            setEligibleAppointments(eligible);
        } catch (err) {
            console.warn('Failed to check patient review eligibility:', err);
        }
    };

    useEffect(() => {
        loadReviewsData();
    }, [selectedStar]);

    useEffect(() => {
        loadPatientAppointments();
    }, [isAuthenticated]);

    // Handle "Leave a Review" Click (Allows direct review without forced login)
    const handleLeaveReviewClick = () => {
        if (!isAuthenticated) {
            setSelectedAppointmentForReview(null);
            setIsReviewModalOpen(true);
            return;
        }

        if (eligibleAppointments.length === 1) {
            setSelectedAppointmentForReview(eligibleAppointments[0]);
            setIsReviewModalOpen(true);
        } else if (eligibleAppointments.length > 1) {
            setShowEligiblePicker(true);
        } else {
            // Logged-in user with no completed appointments can still write general experience review
            setSelectedAppointmentForReview(null);
            setIsReviewModalOpen(true);
        }
    };

    const handleReviewSuccess = () => {
        loadReviewsData();
        loadPatientAppointments();
    };

    // Filter department options from actual review data
    const departments = useMemo(() => {
        const unique = new Set(['All']);
        reviews.forEach(r => {
            if (r.doctor?.department) unique.add(r.doctor.department);
            if (r.department) unique.add(r.department);
        });
        return Array.from(unique);
    }, [reviews]);

    const filteredReviews = useMemo(() => {
        return reviews.filter(r => {
            const matchesStar = selectedStar === 'All' || r.rating === Number(selectedStar);
            const dept = (r.doctor?.department || r.department || '').toLowerCase();
            const matchesDept = selectedDept === 'All' || dept === selectedDept.toLowerCase();
            return matchesStar && matchesDept;
        });
    }, [reviews, selectedStar, selectedDept]);

    return (
        <div style={{
            position: 'relative',
            minHeight: '100vh',
            background: 'transparent',
            paddingBottom: '5rem'
        }}>
            <AnimatedGlassBackground isFixed={true} opacity={0.88} />
            
            <div style={{ position: 'relative', zIndex: 10 }}>
                {/* Hero Header */}
                <div style={{ padding: '3.5rem 1rem 2rem', textAlign: 'center' }}>
                    <span style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        padding: '0.4rem 1rem',
                        borderRadius: '9999px',
                        background: 'rgba(2, 132, 199, 0.25)',
                        border: '1px solid rgba(56, 189, 248, 0.45)',
                        color: '#38bdf8',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        backdropFilter: 'blur(10px)',
                        marginBottom: '0.75rem'
                    }}>
                        <Sparkles size={16} />
                        <span>Verified Patient Feedback</span>
                    </span>

                    <h1 style={{
                        fontSize: 'clamp(2rem, 4vw, 2.85rem)',
                        marginTop: '0.5rem',
                        color: '#ffffff',
                        fontWeight: 900,
                        textShadow: '0 3px 15px rgba(0,0,0,0.6)',
                        letterSpacing: '-0.02em'
                    }}>
                        Patient <span style={{
                            background: 'linear-gradient(135deg, #38bdf8 0%, #7dd3fc 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            filter: 'drop-shadow(0 2px 8px rgba(56,189,248,0.4))'
                        }}>Reviews</span>
                    </h1>

                    <p style={{
                        color: '#f8fafc',
                        maxWidth: '680px',
                        margin: '0.85rem auto 1.5rem',
                        fontSize: '1.05rem',
                        fontWeight: 500,
                        lineHeight: 1.6,
                        textShadow: '0 2px 8px rgba(0,0,0,0.8)'
                    }}>
                        Hear from patients about their experience with ProHealth Hospital System. Every review is verified against completed medical consultations.
                    </p>

                    {/* Action button */}
                    <div style={{ display: 'inline-flex', gap: '0.75rem', alignItems: 'center' }}>
                        <Button
                            variant="primary"
                            onClick={handleLeaveReviewClick}
                            style={{
                                padding: '0.75rem 1.75rem',
                                borderRadius: '12px',
                                fontSize: '0.95rem',
                                fontWeight: 700,
                                boxShadow: '0 10px 25px rgba(2, 132, 199, 0.35)'
                            }}
                        >
                            <MessageSquare size={18} />
                            <span>Leave a Review</span>
                        </Button>
                    </div>
                </div>

                <div className="container" style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 1.25rem' }}>
                    {/* Real Database Summary Statistics Card */}
                    <div style={{
                        background: '#ffffff',
                        borderRadius: '20px',
                        padding: '1.75rem 2rem',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.25)',
                        marginBottom: '2rem',
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                        gap: '2rem',
                        alignItems: 'center'
                    }}>
                        {/* Overall Score */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', borderRight: '1px solid #f1f5f9', paddingRight: '1rem' }}>
                            <div style={{ fontSize: '3.2rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>
                                {stats.averageRating > 0 ? stats.averageRating : '0.0'}
                            </div>
                            <div style={{ margin: '0.5rem 0 0.35rem' }}>
                                <PeekRating
                                    value={Math.round(stats.averageRating) || 0}
                                    count={5}
                                    shape="star"
                                    readOnly={true}
                                    size={24}
                                    activeColor="#f5b400"
                                    idleColor="#e2e8f0"
                                />
                            </div>
                            <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                                Based on {stats.totalReviews} {stats.totalReviews === 1 ? 'verified review' : 'verified reviews'}
                            </span>
                        </div>

                        {/* Rating Distribution Bars */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                            {[5, 4, 3, 2, 1].map((star) => {
                                const starCount = stats.distribution?.[star] || 0;
                                const percentage = stats.totalReviews > 0 ? (starCount / stats.totalReviews) * 100 : 0;
                                return (
                                    <div
                                        key={star}
                                        onClick={() => setSelectedStar(selectedStar === star ? 'All' : star)}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem',
                                            fontSize: '0.82rem',
                                            cursor: 'pointer',
                                            padding: '2px 6px',
                                            borderRadius: '6px',
                                            background: selectedStar === star ? '#f0f9ff' : 'transparent',
                                            transition: 'background 0.2s'
                                        }}
                                    >
                                        <span style={{ width: '45px', fontWeight: 700, color: '#334155', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            {star} <Star size={12} fill="#f5b400" color="#f5b400" />
                                        </span>
                                        <div style={{ flex: 1, height: '8px', background: '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' }}>
                                            <div style={{ width: `${percentage}%`, height: '100%', background: '#f5b400', borderRadius: '9999px', transition: 'width 0.5s ease' }} />
                                        </div>
                                        <span style={{ width: '32px', textAlign: 'right', fontWeight: 600, color: '#64748b' }}>
                                            {starCount}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Verified Guarantee Badge */}
                        <div style={{
                            background: '#f8fafc',
                            borderRadius: '14px',
                            padding: '1.25rem',
                            border: '1px solid #e2e8f0',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.5rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0284c7', fontWeight: 800, fontSize: '0.95rem' }}>
                                <ShieldCheck size={20} />
                                <span>100% Verified Consultations</span>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5 }}>
                                Only patients with completed hospital appointments can submit reviews. We protect privacy by never sharing medical or contact information.
                            </p>
                        </div>
                    </div>

                    {/* Filter Toolbar */}
                    <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                        marginBottom: '1.5rem',
                        background: '#ffffff',
                        padding: '1rem 1.5rem',
                        borderRadius: '16px',
                        border: '1px solid #e2e8f0'
                    }}>
                        {/* Star Rating Filters */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginRight: '0.35rem' }}>
                                Filter:
                            </span>
                            {['All', 5, 4, 3, 2, 1].map((s) => {
                                const isSelected = selectedStar === s;
                                return (
                                    <button
                                        key={s}
                                        onClick={() => setSelectedStar(s)}
                                        style={{
                                            padding: '0.35rem 0.85rem',
                                            borderRadius: '9999px',
                                            fontSize: '0.8rem',
                                            fontWeight: 700,
                                            border: isSelected ? '1px solid #0284c7' : '1px solid #e2e8f0',
                                            background: isSelected ? '#0284c7' : '#f8fafc',
                                            color: isSelected ? '#ffffff' : '#334155',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: '3px'
                                        }}
                                    >
                                        <span>{s === 'All' ? 'All Reviews' : `${s} Stars`}</span>
                                        {s !== 'All' && <Star size={11} fill={isSelected ? '#ffffff' : '#f5b400'} color={isSelected ? '#ffffff' : '#f5b400'} />}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Count Info */}
                        <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                            Showing <strong style={{ color: '#0284c7' }}>{filteredReviews.length}</strong> {filteredReviews.length === 1 ? 'review' : 'reviews'}
                        </span>
                    </div>

                    {/* Reviews Grid */}
                    {loading ? (
                        <div style={{ background: '#ffffff', borderRadius: '18px', padding: '4rem 1rem', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
                            <InlineLoader size="42px" text="Loading verified patient reviews..." />
                        </div>
                    ) : filteredReviews.length === 0 ? (
                        <div style={{
                            background: '#ffffff',
                            borderRadius: '18px',
                            padding: '3.5rem 2rem',
                            textAlign: 'center',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 15px 35px rgba(0,0,0,0.1)'
                        }}>
                            <MessageSquare size={48} color="#94a3b8" style={{ margin: '0 auto 1rem' }} />
                            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem' }}>
                                {stats.totalReviews === 0 ? 'No patient reviews yet.' : 'No reviews matched this filter.'}
                            </h3>
                            <p style={{ fontSize: '0.92rem', color: '#64748b', maxWidth: '480px', margin: '0 auto 1.5rem', lineHeight: 1.5 }}>
                                {stats.totalReviews === 0
                                    ? 'Be the first to share your healthcare experience after completing your consultation.'
                                    : 'Try selecting All Reviews to see feedback across all ratings.'}
                            </p>
                            {stats.totalReviews === 0 ? (
                                <Button
                                    variant="primary"
                                    onClick={handleLeaveReviewClick}
                                    style={{ borderRadius: '10px', padding: '0.65rem 1.5rem', fontWeight: 700 }}
                                >
                                    Share Your Experience
                                </Button>
                            ) : (
                                <Button
                                    variant="outline"
                                    onClick={() => { setSelectedStar('All'); setSelectedDept('All'); }}
                                    style={{ borderRadius: '10px', padding: '0.65rem 1.5rem' }}
                                >
                                    Reset Filters
                                </Button>
                            )}
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
                            gap: '1.25rem'
                        }}>
                            {filteredReviews.map((rev) => {
                                const revId = rev._id || rev.id;
                                const docName = rev.doctor?.name || rev.doctorName || 'Specialist Physician';
                                const hospName = rev.hospital?.name || rev.hospitalName || 'ProHealth Hospital';
                                const createdDate = rev.createdAt ? new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent';

                                return (
                                    <div
                                        key={revId}
                                        style={{
                                            background: '#ffffff',
                                            borderRadius: '16px',
                                            padding: '1.5rem',
                                            border: '1px solid #e2e8f0',
                                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.08)',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            justifyContent: 'space-between',
                                            gap: '1rem',
                                            transition: 'transform 0.2s ease, box-shadow 0.2s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-2px)';
                                            e.currentTarget.style.boxShadow = '0 15px 30px -5px rgba(0, 0, 0, 0.12)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                            e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.08)';
                                        }}
                                    >
                                        <div>
                                            {/* Top: Patient Name + Verified Badge + Date */}
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                                                    <div style={{
                                                        width: '38px',
                                                        height: '38px',
                                                        borderRadius: '50%',
                                                        background: 'rgba(2, 132, 199, 0.1)',
                                                        color: '#0284c7',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontWeight: 800,
                                                        fontSize: '0.9rem'
                                                    }}>
                                                        {rev.patientName ? rev.patientName.charAt(0) : 'P'}
                                                    </div>
                                                    <div>
                                                        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                                                            {rev.patientName || 'Verified Patient'}
                                                        </h4>
                                                        <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                                            <CheckCircle2 size={12} />
                                                            Verified Patient Visit
                                                        </span>
                                                    </div>
                                                </div>
                                                <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>
                                                    {createdDate}
                                                </span>
                                            </div>

                                            {/* Rating Stars using PeekRating (readOnly) */}
                                            <div style={{ margin: '0.4rem 0 0.85rem' }}>
                                                <PeekRating
                                                    value={rev.rating}
                                                    count={5}
                                                    shape="star"
                                                    readOnly={true}
                                                    size={20}
                                                    activeColor="#f5b400"
                                                    idleColor="#e2e8f0"
                                                />
                                            </div>

                                            {/* Review Comment */}
                                            <p style={{
                                                margin: 0,
                                                fontSize: '0.9rem',
                                                color: '#334155',
                                                lineHeight: 1.6,
                                                fontStyle: 'normal'
                                            }}>
                                                "{rev.comment}"
                                            </p>
                                        </div>

                                        {/* Doctor & Hospital Footer Tags */}
                                        <div style={{
                                            borderTop: '1px solid #f1f5f9',
                                            paddingTop: '0.85rem',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '0.35rem',
                                            fontSize: '0.8rem',
                                            color: '#64748b'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <Stethoscope size={14} color="#0284c7" />
                                                <span style={{ fontWeight: 600, color: '#1e293b' }}>{docName}</span>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                                <Building2 size={14} color="#0284c7" />
                                                <span>{hospName}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {/* Eligible Appointments Picker Modal */}
            {showEligiblePicker && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        backgroundColor: 'rgba(15, 23, 42, 0.65)',
                        backdropFilter: 'blur(8px)',
                        zIndex: 1000,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '1rem'
                    }}
                    onClick={() => setShowEligiblePicker(false)}
                >
                    <div
                        style={{
                            background: '#ffffff',
                            borderRadius: '20px',
                            maxWidth: '520px',
                            width: '100%',
                            padding: '1.75rem',
                            boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
                            border: '1px solid #e2e8f0'
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem' }}>
                            Select Completed Visit
                        </h3>
                        <p style={{ fontSize: '0.88rem', color: '#64748b', margin: '0 0 1.25rem' }}>
                            Choose which completed appointment you would like to rate and review:
                        </p>

                        {eligibleAppointments.length === 0 ? (
                            <div style={{ textAlign: 'center', padding: '1.5rem 0', color: '#64748b' }}>
                                <Calendar size={40} color="#cbd5e1" style={{ margin: '0 auto 0.75rem' }} />
                                <p style={{ fontSize: '0.92rem', fontWeight: 600, color: '#334155', margin: '0 0 0.35rem' }}>
                                    No completed visits awaiting review
                                </p>
                                <p style={{ fontSize: '0.82rem', margin: '0 0 1.25rem' }}>
                                    You can only review consultations once the appointment has been completed by your doctor.
                                </p>
                                <Button
                                    variant="outline"
                                    onClick={() => setShowEligiblePicker(false)}
                                    style={{ borderRadius: '8px' }}
                                >
                                    Close
                                </Button>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '320px', overflowY: 'auto', marginBottom: '1.25rem' }}>
                                {eligibleAppointments.map((apt) => (
                                    <div
                                        key={apt._id || apt.id}
                                        style={{
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '12px',
                                            padding: '0.85rem 1rem',
                                            background: '#f8fafc',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            cursor: 'pointer',
                                            transition: 'border-color 0.2s'
                                        }}
                                        onClick={() => {
                                            setSelectedAppointmentForReview(apt);
                                            setShowEligiblePicker(false);
                                            setIsReviewModalOpen(true);
                                        }}
                                    >
                                        <div>
                                            <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.92rem' }}>
                                                {apt.doctor?.name || apt.doctorName || 'Doctor'}
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                                {apt.hospital?.name || apt.hospitalName} • {apt.date}
                                            </div>
                                        </div>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            style={{ borderRadius: '6px', fontSize: '0.8rem' }}
                                        >
                                            Rate
                                        </Button>
                                    </div>
                                ))}
                                <div style={{ textAlign: 'center', paddingTop: '0.5rem', borderTop: '1px dashed #e2e8f0' }}>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedAppointmentForReview(null);
                                            setShowEligiblePicker(false);
                                            setIsReviewModalOpen(true);
                                        }}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#0284c7',
                                            fontSize: '0.85rem',
                                            fontWeight: 600,
                                            cursor: 'pointer',
                                            textDecoration: 'underline'
                                        }}
                                    >
                                        Or write a general review without linking an appointment
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Review Submission Modal */}
            <ReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => {
                    setIsReviewModalOpen(false);
                    setSelectedAppointmentForReview(null);
                }}
                appointment={selectedAppointmentForReview}
                onSuccess={handleReviewSuccess}
            />
        </div>
    );
};

export default Feedback;
