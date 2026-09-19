import React from 'react';
import { Users, UserPlus, Activity, Calendar, DollarSign, FileText, Server, AlertCircle } from 'lucide-react';

const KPICard = ({ label, value, subtext, icon: Icon, color, bg }) => (
    <div className="detail-card" style={{
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        transition: 'all 0.3s ease',
        cursor: 'default',
        border: '1px solid rgba(0,0,0,0.05)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
    }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span className="text-label" style={{ fontSize: '0.95rem', fontWeight: 600, color: '#000080' }}>{label}</span>
            <div style={{ padding: '0.6rem', borderRadius: '12px', background: bg, color: color }}>
                <Icon size={22} />
            </div>
        </div>
        <div>
            <span style={{ fontSize: '2.25rem', fontWeight: 800, color: '#000080', letterSpacing: '-0.02em', display: 'block', lineHeight: 1 }}>{value}</span>
            {subtext && <span className="text-label" style={{ marginTop: '0.5rem', display: 'block', fontSize: '0.85rem', color: '#000080' }}>{subtext}</span>}
        </div>
    </div>
);

const AdminOverview = () => {
    return (
        <div style={{ padding: '2.5rem', height: '100%', overflowY: 'auto' }}>
            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#000080', marginBottom: '0.5rem' }}>System Dashboard</h1>
                <p className="text-label" style={{ fontSize: '1.1rem', color: '#000080' }}>Executive overview of hospital operations.</p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '2rem' }}>
                <KPICard
                    label="Total Users"
                    value="142"
                    icon={Users}
                    color="#2563eb"
                    bg="#eff6ff"
                    subtext="+5 new this week"
                />
                <KPICard
                    label="Doctors"
                    value="28"
                    icon={UserPlus}
                    color="#0891b2"
                    bg="#ecfeff"
                    subtext="All Active"
                />
                <KPICard
                    label="Patients"
                    value="854"
                    icon={Users}
                    color="#059669"
                    bg="#ecfdf5"
                    subtext="+12 today"
                />
                <KPICard
                    label="Active Staff"
                    value="64"
                    icon={Activity}
                    color="#7c3aed"
                    bg="#f5f3ff"
                    subtext="Currently On-Shift"
                />
                <KPICard
                    label="Daily Appts"
                    value="45"
                    icon={Calendar}
                    color="#db2777"
                    bg="#fdf2f8"
                    subtext="92% fulfilled"
                />
                <KPICard
                    label="Monthly Revenue"
                    value="$1.2M"
                    icon={DollarSign}
                    color="#059669"
                    bg="#f0fdf4"
                    subtext="↑ 8% vs last month"
                />
                <KPICard
                    label="Pending Invoices"
                    value="12"
                    icon={FileText}
                    color="#d97706"
                    bg="#fffbeb"
                    subtext="$45.2k outstanding"
                />
                <KPICard
                    label="System Health"
                    value="99.9%"
                    icon={Server}
                    color="#2563eb"
                    bg="#eff6ff"
                    subtext="All systems operational"
                />
            </div>

            <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                {/* Could add charts here later, currently just placeholder for layout structure if needed, or remove if cards suffice */}
            </div>
        </div>
    );
};

export default AdminOverview;
