import React, { useState } from 'react';
import { useAdmin } from '../../../context/AdminContext';
import { Download, Filter, Search, Eye, FileText, ChevronDown } from 'lucide-react';

const AdminLogs = () => {
    const { logs } = useAdmin();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    const filteredLogs = logs.filter(log => {
        const matchesSearch = log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.action.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || log.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'Success': return { bg: '#f0fdf4', text: '#16a34a' };
            case 'Failed': return { bg: '#fef2f2', text: '#ef4444' };
            case 'Warning': return { bg: '#fffbeb', text: '#d97706' };
            default: return { bg: '#f1f5f9', text: '#64748b' };
        }
    };

    return (
        <div style={{ padding: '2.5rem', height: '100%', overflowY: 'auto', background: '#f8fafc' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'end' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#1e293b', marginBottom: '0.5rem' }}>System Audit Logs</h1>
                    <p className="text-label" style={{ fontSize: '1rem' }}>Monitor system activities, security events, and user actions.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="action-btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Download size={18} /> Export CSV
                    </button>
                    <button className="action-btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <FileText size={18} /> Export PDF
                    </button>
                </div>
            </header>

            <div className="detail-card" style={{ padding: '1.5rem 2rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <div className="search-bar-container" style={{ padding: 0, border: 'none', flex: 1 }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="text"
                                placeholder="Search logs by actor or action..."
                                className="search-input"
                                style={{ paddingLeft: '2.5rem', background: '#f8fafc', width: '100%' }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#64748b' }}>Filter Status:</span>
                        <select
                            className="search-input"
                            style={{ padding: '0.6rem 1rem', background: '#f8fafc', width: 'auto' }}
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All">All Events</option>
                            <option value="Success">Success</option>
                            <option value="Warning">Warning</option>
                            <option value="Failed">Failed</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="detail-card" style={{ padding: 0, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '1.25rem 2rem', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Timestamp</th>
                            <th style={{ padding: '1.25rem 2rem', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                            <th style={{ padding: '1.25rem 2rem', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Actor</th>
                            <th style={{ padding: '1.25rem 2rem', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Action</th>
                            <th style={{ padding: '1.25rem 2rem', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Entity</th>
                            <th style={{ padding: '1.25rem 2rem', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.map(log => {
                            const statusStyle = getStatusColor(log.status);
                            return (
                                <tr key={log.id} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.95rem' }}>
                                    <td style={{ padding: '1.25rem 2rem', color: '#64748b', fontFamily: 'monospace' }}>{log.timestamp}</td>
                                    <td style={{ padding: '1.25rem 2rem' }}>
                                        <span style={{
                                            background: statusStyle.bg, color: statusStyle.text,
                                            padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700
                                        }}>
                                            {log.status.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1.25rem 2rem', fontWeight: 600, color: '#1e293b' }}>{log.actor}</td>
                                    <td style={{ padding: '1.25rem 2rem' }}>
                                        <code style={{ background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.85rem', color: '#475569' }}>
                                            {log.action}
                                        </code>
                                    </td>
                                    <td style={{ padding: '1.25rem 2rem', color: '#475569' }}>{log.entity}</td>
                                    <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                                        <button className="btn-ghost" style={{ padding: '0.5rem', cursor: 'pointer', color: '#94a3b8' }}>
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminLogs;
