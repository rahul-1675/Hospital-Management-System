import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../../context/AdminContext';
import { adminService } from '../../../services/admin.service';
import { Download, Filter, Search, Eye, FileText, ChevronDown, RefreshCw, ShieldCheck, Trash2, AlertTriangle } from 'lucide-react';

const AdminLogs = () => {
    const { logs: contextLogs, clearLogs: contextClearLogs } = useAdmin();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');
    const [selectedLog, setSelectedLog] = useState(null);
    const [showClearConfirm, setShowClearConfirm] = useState(false);

    const fetchLiveLogs = async () => {
        setLoading(true);
        try {
            const fetched = await adminService.getLogs();
            if (fetched && fetched.length > 0) {
                setLogs(fetched);
            } else if (contextLogs && contextLogs.length > 0) {
                setLogs(contextLogs);
            }
        } catch (err) {
            console.warn('Error fetching logs:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLiveLogs();
    }, []);

    const handleClearLogs = async () => {
        try {
            await contextClearLogs();
            setLogs([]);
            setShowClearConfirm(false);
        } catch (err) {
            alert('Failed to clear logs: ' + err.message);
        }
    };

    const filteredLogs = logs.filter(log => {
        const matchesSearch = (log.actor || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (log.action || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (log.entity || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || (log.status || '').toLowerCase() === filterStatus.toLowerCase();
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status = '') => {
        switch (status.toLowerCase()) {
            case 'success': return { bg: '#f0fdf4', text: '#16a34a' };
            case 'failed': return { bg: '#fef2f2', text: '#ef4444' };
            case 'warning': return { bg: '#fffbeb', text: '#d97706' };
            default: return { bg: '#f1f5f9', text: '#64748b' };
        }
    };

    const handleExportCSV = () => {
        const headers = 'Timestamp,Status,Actor,Action,Entity\n';
        const rows = filteredLogs.map(l =>
            `"${l.timestamp}","${l.status}","${l.actor}","${l.action}","${l.entity}"`
        ).join('\n');

        const blob = new Blob([headers + rows], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `prohealth-audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const handleExportPDF = () => {
        window.print();
    };

    return (
        <div style={{ padding: '2.5rem', height: '100%', overflowY: 'auto' }}>
            <header style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
                        System Audit Logs
                    </h1>
                    <p style={{ fontSize: '1rem', color: '#64748b', margin: 0 }}>
                        Real-time audit trail of database operations, staff logins, and patient bookings.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    <button
                        onClick={fetchLiveLogs}
                        disabled={loading}
                        className="action-btn btn-outline"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                        title="Refresh Logs"
                    >
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        <span>Refresh</span>
                    </button>
                    <button
                        onClick={handleExportCSV}
                        className="action-btn btn-outline"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Download size={16} /> Export CSV
                    </button>
                    <button
                        onClick={handleExportPDF}
                        className="action-btn btn-outline"
                        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <FileText size={16} /> Export PDF
                    </button>
                    <button
                        onClick={() => setShowClearConfirm(true)}
                        className="action-btn"
                        style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fee2e2', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}
                    >
                        <Trash2 size={16} /> Clear Logs
                    </button>
                </div>
            </header>

            <div className="detail-card" style={{ padding: '1.25rem 1.75rem', marginBottom: '1.75rem', borderRadius: '16px', background: '#ffffff' }}>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <div className="search-bar-container" style={{ padding: 0, border: 'none', flex: 1, minWidth: '240px' }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                type="text"
                                placeholder="Search logs by actor, action, or entity..."
                                className="search-input"
                                style={{ paddingLeft: '2.5rem', background: '#f8fafc', width: '100%', borderRadius: '10px' }}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#64748b' }}>Status:</span>
                        <select
                            className="search-input"
                            style={{ padding: '0.55rem 1rem', background: '#f8fafc', width: 'auto', borderRadius: '8px' }}
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

            <div className="detail-card" style={{ padding: 0, overflow: 'hidden', borderRadius: '16px', background: '#ffffff' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                            <th style={{ padding: '1.1rem 1.75rem', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Timestamp</th>
                            <th style={{ padding: '1.1rem 1.75rem', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Status</th>
                            <th style={{ padding: '1.1rem 1.75rem', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Actor</th>
                            <th style={{ padding: '1.1rem 1.75rem', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Action</th>
                            <th style={{ padding: '1.1rem 1.75rem', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Entity</th>
                            <th style={{ padding: '1.1rem 1.75rem', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', textAlign: 'right' }}></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.length > 0 ? (
                            filteredLogs.map((log, idx) => {
                                const statusStyle = getStatusColor(log.status);
                                return (
                                    <tr key={log.id || idx} style={{ borderBottom: '1px solid #f1f5f9', fontSize: '0.92rem' }}>
                                        <td style={{ padding: '1.1rem 1.75rem', color: '#64748b', fontFamily: 'monospace', fontSize: '0.85rem' }}>
                                            {log.timestamp}
                                        </td>
                                        <td style={{ padding: '1.1rem 1.75rem' }}>
                                            <span style={{
                                                background: statusStyle.bg, color: statusStyle.text,
                                                padding: '0.25rem 0.75rem', borderRadius: '99px', fontSize: '0.75rem', fontWeight: 700
                                            }}>
                                                {(log.status || 'SUCCESS').toUpperCase()}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.1rem 1.75rem', fontWeight: 700, color: '#0f172a' }}>
                                            {log.actor}
                                        </td>
                                        <td style={{ padding: '1.1rem 1.75rem' }}>
                                            <code style={{ background: '#f1f5f9', padding: '0.25rem 0.6rem', borderRadius: '6px', fontSize: '0.82rem', color: '#0284c7', fontWeight: 600 }}>
                                                {log.action}
                                            </code>
                                        </td>
                                        <td style={{ padding: '1.1rem 1.75rem', color: '#475569' }}>
                                            {log.entity}
                                        </td>
                                        <td style={{ padding: '1.1rem 1.75rem', textAlign: 'right' }}>
                                            <button
                                                onClick={() => setSelectedLog(log)}
                                                className="btn-ghost"
                                                style={{ padding: '0.4rem', cursor: 'pointer', color: '#64748b' }}
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="6" style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
                                    No audit logs matching your search filter.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Log Details Modal */}
            {selectedLog && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.6)',
                    backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999
                }} onClick={() => setSelectedLog(null)}>
                    <div className="detail-card" style={{ width: '480px', padding: '2rem', borderRadius: '20px', background: '#ffffff' }} onClick={(e) => e.stopPropagation()}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
                            <div style={{ padding: '0.6rem', background: '#eff6ff', borderRadius: '10px', color: '#0284c7' }}>
                                <ShieldCheck size={22} />
                            </div>
                            <div>
                                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Audit Log Inspection</h3>
                                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Log ID: {selectedLog.id}</span>
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                                <span style={{ color: '#64748b' }}>Timestamp:</span>
                                <span style={{ fontWeight: 600, color: '#0f172a' }}>{selectedLog.timestamp}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                                <span style={{ color: '#64748b' }}>Actor / Initiator:</span>
                                <span style={{ fontWeight: 700, color: '#0284c7' }}>{selectedLog.actor}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                                <span style={{ color: '#64748b' }}>Action Performed:</span>
                                <code style={{ fontWeight: 600, color: '#059669' }}>{selectedLog.action}</code>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f1f5f9' }}>
                                <span style={{ color: '#64748b' }}>Target Entity:</span>
                                <span style={{ fontWeight: 600, color: '#0f172a' }}>{selectedLog.entity}</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                                <span style={{ color: '#64748b' }}>Status:</span>
                                <span style={{ fontWeight: 700, color: '#16a34a' }}>{selectedLog.status}</span>
                            </div>
                        </div>

                        <button
                            onClick={() => setSelectedLog(null)}
                            className="action-btn btn-primary"
                            style={{ width: '100%', justifyContent: 'center', padding: '0.65rem' }}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminLogs;

