import React, { useState, useEffect } from 'react';
import { MessageSquare, Star, CheckCircle2, EyeOff, Trash2, RefreshCw, AlertCircle, Search, ShieldCheck } from 'lucide-react';
import { reviewService } from '../../../services/review.service';
import PeekRating from '../../ui/PeekRating';
import Button from '../../common/Button';
import { InlineLoader } from '../../common/Loader';

export const AdminReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    const [toastMessage, setToastMessage] = useState(null);

    const loadAdminReviews = async () => {
        setLoading(true);
        try {
            const res = await reviewService.getReviews({ status: filterStatus === 'ALL' ? undefined : filterStatus });
            const list = Array.isArray(res) ? res : (res?.data || []);
            setReviews(list);
        } catch (err) {
            console.error('Failed to load reviews for admin:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAdminReviews();
    }, [filterStatus]);

    const showToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3500);
    };

    const handleToggleStatus = async (review) => {
        const id = review._id || review.id;
        const newStatus = review.status === 'PUBLISHED' ? 'HIDDEN' : 'PUBLISHED';
        setActionLoadingId(id);
        try {
            await reviewService.updateReviewStatus(id, newStatus);
            setReviews(prev => prev.map(r => (r._id === id || r.id === id) ? { ...r, status: newStatus } : r));
            showToast(`Review status updated to ${newStatus}`);
        } catch (err) {
            alert('Failed to update status: ' + err.message);
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleDelete = async (review) => {
        const id = review._id || review.id;
        if (!window.confirm('Are you sure you want to permanently delete this review?')) return;
        setActionLoadingId(id);
        try {
            await reviewService.deleteReview(id);
            setReviews(prev => prev.filter(r => r._id !== id && r.id !== id));
            showToast('Review permanently deleted.');
        } catch (err) {
            alert('Failed to delete review: ' + err.message);
        } finally {
            setActionLoadingId(null);
        }
    };

    const filteredReviews = reviews.filter(r => {
        const q = searchQuery.toLowerCase().trim();
        if (!q) return true;
        const pName = (r.patientName || '').toLowerCase();
        const dName = (r.doctor?.name || r.doctorName || '').toLowerCase();
        const hName = (r.hospital?.name || r.hospitalName || '').toLowerCase();
        const comment = (r.comment || '').toLowerCase();
        return pName.includes(q) || dName.includes(q) || hName.includes(q) || comment.includes(q);
    });

    return (
        <div style={{ padding: '1.5rem', color: '#0f172a' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                        Patient Reviews & Moderation
                    </h2>
                    <p style={{ margin: '4px 0 0', fontSize: '0.88rem', color: '#64748b' }}>
                        Moderate verified patient ratings, ensure quality standards, and manage published testimonials.
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={loadAdminReviews}
                    style={{ borderRadius: '8px', padding: '0.5rem 1rem' }}
                >
                    <RefreshCw size={15} />
                    <span>Refresh</span>
                </Button>
            </div>

            {toastMessage && (
                <div style={{
                    padding: '0.75rem 1rem',
                    background: '#ecfdf5',
                    border: '1px solid #6ee7b7',
                    color: '#065f46',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    fontWeight: 600,
                    fontSize: '0.88rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    <CheckCircle2 size={16} />
                    <span>{toastMessage}</span>
                </div>
            )}

            {/* Filter Toolbar */}
            <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                padding: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                marginBottom: '1.25rem'
            }}>
                {/* Search */}
                <div style={{ position: 'relative', width: '300px' }}>
                    <Search size={16} color="#64748b" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                        type="text"
                        placeholder="Search patient, doctor, review..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '0.6rem 1rem 0.6rem 2.4rem',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            fontSize: '0.88rem',
                            outline: 'none'
                        }}
                    />
                </div>

                {/* Status Pills */}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {['ALL', 'PUBLISHED', 'HIDDEN'].map((st) => (
                        <button
                            key={st}
                            onClick={() => setFilterStatus(st)}
                            style={{
                                padding: '0.45rem 1rem',
                                borderRadius: '8px',
                                border: 'none',
                                background: filterStatus === st ? '#0f172a' : '#f1f5f9',
                                color: filterStatus === st ? '#ffffff' : '#475569',
                                fontWeight: 700,
                                fontSize: '0.82rem',
                                cursor: 'pointer'
                            }}
                        >
                            {st}
                        </button>
                    ))}
                </div>
            </div>

            {/* Reviews Table */}
            <div style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '14px',
                overflow: 'hidden',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)'
            }}>
                {loading ? (
                    <div style={{ padding: '3rem 1rem', textAlign: 'center' }}>
                        <InlineLoader size="36px" text="Loading reviews for moderation..." />
                    </div>
                ) : filteredReviews.length === 0 ? (
                    <div style={{ padding: '3rem 1rem', textAlign: 'center', color: '#64748b' }}>
                        <MessageSquare size={40} color="#cbd5e1" style={{ margin: '0 auto 0.75rem' }} />
                        <h4 style={{ margin: 0, fontWeight: 700, color: '#1e293b' }}>No Reviews Found</h4>
                        <p style={{ margin: '4px 0 0', fontSize: '0.85rem' }}>No patient feedback matching this filter criteria.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                            <thead>
                                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontWeight: 700 }}>
                                    <th style={{ padding: '0.85rem 1rem' }}>Patient</th>
                                    <th style={{ padding: '0.85rem 1rem' }}>Rating</th>
                                    <th style={{ padding: '0.85rem 1rem' }}>Review Comment</th>
                                    <th style={{ padding: '0.85rem 1rem' }}>Doctor & Hospital</th>
                                    <th style={{ padding: '0.85rem 1rem' }}>Status</th>
                                    <th style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReviews.map((rev) => {
                                    const id = rev._id || rev.id;
                                    const isActionLoading = actionLoadingId === id;
                                    const docName = rev.doctor?.name || rev.doctorName || 'Doctor';
                                    const hospName = rev.hospital?.name || rev.hospitalName || 'Hospital';

                                    return (
                                        <tr key={id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '1rem', fontWeight: 700, color: '#0f172a' }}>
                                                <div>{rev.patientName || 'Patient'}</div>
                                                <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                                                    <ShieldCheck size={12} /> Verified
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <PeekRating
                                                    value={rev.rating}
                                                    count={5}
                                                    shape="star"
                                                    readOnly={true}
                                                    size={16}
                                                    activeColor="#f5b400"
                                                    idleColor="#e2e8f0"
                                                />
                                            </td>
                                            <td style={{ padding: '1rem', maxWidth: '300px', color: '#334155', lineHeight: 1.4 }}>
                                                "{rev.comment}"
                                            </td>
                                            <td style={{ padding: '1rem', fontSize: '0.82rem', color: '#64748b' }}>
                                                <div style={{ fontWeight: 600, color: '#1e293b' }}>{docName}</div>
                                                <div>{hospName}</div>
                                            </td>
                                            <td style={{ padding: '1rem' }}>
                                                <span style={{
                                                    padding: '0.25rem 0.65rem',
                                                    borderRadius: '9999px',
                                                    fontSize: '0.75rem',
                                                    fontWeight: 700,
                                                    background: rev.status === 'PUBLISHED' ? '#ecfdf5' : '#fef2f2',
                                                    color: rev.status === 'PUBLISHED' ? '#065f46' : '#b91c1c',
                                                    border: `1px solid ${rev.status === 'PUBLISHED' ? '#a7f3d0' : '#fecaca'}`
                                                }}>
                                                    {rev.status || 'PUBLISHED'}
                                                </span>
                                            </td>
                                            <td style={{ padding: '1rem', textAlign: 'right' }}>
                                                <div style={{ display: 'inline-flex', gap: '0.45rem' }}>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        disabled={isActionLoading}
                                                        onClick={() => handleToggleStatus(rev)}
                                                        style={{ borderRadius: '6px', fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}
                                                    >
                                                        {rev.status === 'PUBLISHED' ? <EyeOff size={13} /> : <CheckCircle2 size={13} />}
                                                        <span>{rev.status === 'PUBLISHED' ? 'Hide' : 'Publish'}</span>
                                                    </Button>
                                                    <Button
                                                        variant="danger"
                                                        size="sm"
                                                        disabled={isActionLoading}
                                                        onClick={() => handleDelete(rev)}
                                                        style={{ borderRadius: '6px', fontSize: '0.78rem', padding: '0.35rem 0.65rem' }}
                                                    >
                                                        <Trash2 size={13} />
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminReviews;
