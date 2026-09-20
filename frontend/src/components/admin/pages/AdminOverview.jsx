import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Activity, Calendar, DollarSign, FileText, Server, ArrowUpRight, ShieldCheck, Clock, CheckCircle2, ChevronRight } from 'lucide-react';
import { adminService } from '../../../services/admin.service';

const KPICard = ({ label, value, subtext, icon: Icon, color, bg, onClick }) => (
    <div
        onClick={onClick}
        className="detail-card"
        style={{
            padding: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            transition: 'all 0.25s ease',
            cursor: onClick ? 'pointer' : 'default',
            border: '1px solid rgba(226, 232, 240, 0.9)',
            borderRadius: '16px',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
        }}
        onMouseEnter={(e) => {
            if (onClick) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(2, 132, 199, 0.15)';
                e.currentTarget.style.borderColor = '#38bdf8';
            }
        }}
        onMouseLeave={(e) => {
            if (onClick) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)';
                e.currentTarget.style.borderColor = 'rgba(226, 232, 240, 0.9)';
            }
        }}
    >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.92rem', fontWeight: 700, color: '#334155' }}>{label}</span>
            <div style={{ padding: '0.55rem', borderRadius: '10px', background: bg, color: color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={20} />
            </div>
        </div>
        <div>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', display: 'block', lineHeight: 1 }}>
                {value}
            </span>
            {subtext && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.5rem', fontSize: '0.82rem', color: color, fontWeight: 600 }}>
                    {onClick && <ArrowUpRight size={14} />}
                    <span>{subtext}</span>
                </div>
            )}
        </div>
    </div>
);

const AdminOverview = ({ setActiveTab }) => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalDoctors: 0,
        totalPatients: 0,
        activeStaff: 0,
        dailyAppointments: 0,
        monthlyRevenue: '$0',
        pendingInvoicesCount: 0,
        pendingAmount: 0,
        systemHealth: 'Checking database...',
        databaseConnected: false,
        recentActivities: []
    });
    const [loading, setLoading] = useState(true);

    const loadStats = async () => {
        setLoading(true);
        try {
            const data = await adminService.getOverviewStats();
            if (data) {
                setStats(data);
            }
        } catch (err) {
            console.warn('Failed to fetch real overview stats:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadStats();
    }, []);

    return (
        <div style={{ padding: '2.5rem', height: '100%', overflowY: 'auto' }}>
            <header style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem' }}>
                        System Dashboard
                    </h1>
                    <p style={{ fontSize: '1.05rem', color: '#64748b', margin: 0 }}>
                        Real-time clinical operations and hospital management metrics.
                    </p>
                </div>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.6rem 1.1rem',
                    borderRadius: '9999px',
                    background: stats.databaseConnected ? '#ecfdf5' : '#eff6ff',
                    border: stats.databaseConnected ? '1px solid #a7f3d0' : '1px solid #bfdbfe',
                    color: stats.databaseConnected ? '#059669' : '#0284c7',
                    fontWeight: 700,
                    fontSize: '0.85rem'
                }}>
                    <Server size={16} />
                    <span>{stats.systemHealth}</span>
                </div>
            </header>

            {/* Live KPI Metric Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
                <KPICard
                    label="Total Registered Users"
                    value={loading ? '...' : stats.totalUsers}
                    icon={Users}
                    color="#0284c7"
                    bg="#f0f9ff"
                    subtext="Click to manage accounts"
                    onClick={() => setActiveTab && setActiveTab('users')}
                />
                <KPICard
                    label="Active Doctors"
                    value={loading ? '...' : stats.totalDoctors}
                    icon={UserPlus}
                    color="#0891b2"
                    bg="#ecfeff"
                    subtext="View doctor roster"
                    onClick={() => setActiveTab && setActiveTab('users')}
                />
                <KPICard
                    label="Patient Consultations"
                    value={loading ? '...' : stats.totalPatients}
                    icon={Users}
                    color="#059669"
                    bg="#ecfdf5"
                    subtext="Total hospital visits"
                    onClick={() => setActiveTab && setActiveTab('users')}
                />
                <KPICard
                    label="Active Duty Staff"
                    value={loading ? '...' : stats.activeStaff}
                    icon={Activity}
                    color="#7c3aed"
                    bg="#f5f3ff"
                    subtext="Active in database"
                    onClick={() => setActiveTab && setActiveTab('users')}
                />
                <KPICard
                    label="Daily Appointments"
                    value={loading ? '...' : stats.dailyAppointments}
                    icon={Calendar}
                    color="#db2777"
                    bg="#fdf2f8"
                    subtext="View audit logs"
                    onClick={() => setActiveTab && setActiveTab('logs')}
                />
                <KPICard
                    label="Total Hospital Revenue"
                    value={loading ? '...' : stats.monthlyRevenue}
                    icon={DollarSign}
                    color="#059669"
                    bg="#f0fdf4"
                    subtext="View revenue & billing"
                    onClick={() => setActiveTab && setActiveTab('finance')}
                />
                <KPICard
                    label="Pending Invoices"
                    value={loading ? '...' : stats.pendingInvoicesCount}
                    icon={FileText}
                    color="#d97706"
                    bg="#fffbeb"
                    subtext={stats.pendingAmount > 0 ? `$${stats.pendingAmount} outstanding` : 'All invoices settled'}
                    onClick={() => setActiveTab && setActiveTab('finance')}
                />
                <KPICard
                    label="System Reviews"
                    value="Active"
                    icon={ShieldCheck}
                    color="#2563eb"
                    bg="#eff6ff"
                    subtext="Moderate patient reviews"
                    onClick={() => setActiveTab && setActiveTab('reviews')}
                />
            </div>

            {/* Quick Actions & Recent Live Activity */}
            <div style={{ marginTop: '2.5rem', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', flexWrap: 'wrap' }}>
                {/* Recent Database Events */}
                <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '18px',
                    border: '1px solid #e2e8f0',
                    padding: '1.75rem',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                            Live System Activity
                        </h3>
                        <button
                            onClick={() => setActiveTab && setActiveTab('logs')}
                            style={{ background: 'none', border: 'none', color: '#0284c7', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                            <span>View All Logs</span>
                            <ChevronRight size={16} />
                        </button>
                    </div>

                    {stats.recentActivities && stats.recentActivities.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                            {stats.recentActivities.map((act) => (
                                <div
                                    key={act.id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '0.85rem 1rem',
                                        borderRadius: '12px',
                                        backgroundColor: '#f8fafc',
                                        border: '1px solid #f1f5f9'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <div style={{
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '8px',
                                            background: act.type === 'USER' ? '#eff6ff' : act.type === 'APPOINTMENT' ? '#ecfdf5' : '#fef3c7',
                                            color: act.type === 'USER' ? '#2563eb' : act.type === 'APPOINTMENT' ? '#059669' : '#d97706',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 700,
                                            fontSize: '0.8rem'
                                        }}>
                                            {act.type === 'USER' ? <Users size={18} /> : act.type === 'APPOINTMENT' ? <Calendar size={18} /> : <ShieldCheck size={18} />}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>
                                                {act.title}
                                            </div>
                                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                                {act.subtitle}
                                            </div>
                                        </div>
                                    </div>
                                    <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: 600 }}>
                                        {act.time}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ padding: '2rem 0', textAlign: 'center', color: '#64748b' }}>
                            <CheckCircle2 size={36} color="#cbd5e1" style={{ margin: '0 auto 0.5rem' }} />
                            <p style={{ margin: 0, fontSize: '0.9rem' }}>System initialized and ready for operations.</p>
                        </div>
                    )}
                </div>

                {/* Quick Admin Shortcuts */}
                <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '18px',
                    border: '1px solid #e2e8f0',
                    padding: '1.75rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                }}>
                    <div>
                        <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                            Quick Actions
                        </h3>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '0 0 1.25rem' }}>
                            Fast administrative controls.
                        </p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            <button
                                onClick={() => setActiveTab && setActiveTab('users')}
                                className="action-btn btn-primary"
                                style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
                            >
                                <UserPlus size={18} /> Add New Staff Member
                            </button>
                            <button
                                onClick={() => setActiveTab && setActiveTab('reviews')}
                                className="action-btn btn-outline"
                                style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
                            >
                                <ShieldCheck size={18} /> Moderate Reviews
                            </button>
                            <button
                                onClick={() => setActiveTab && setActiveTab('finance')}
                                className="action-btn btn-outline"
                                style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
                            >
                                <DollarSign size={18} /> Financial Invoices
                            </button>
                            <button
                                onClick={() => setActiveTab && setActiveTab('settings')}
                                className="action-btn btn-outline"
                                style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}
                            >
                                <Server size={18} /> Hospital Settings
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminOverview;

