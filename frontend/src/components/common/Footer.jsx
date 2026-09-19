import React from 'react';

const Footer = () => {
    return (
        <footer style={{ backgroundColor: 'white', borderTop: '1px solid var(--border-color)', padding: '2rem 0', marginTop: 'auto' }}>
            <div className="container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ margin: 0 }}>© 2026 Hospital Management System. All rights reserved.</p>
                    <div className="flex gap-md" style={{ gap: '1.5rem' }}>
                        <a href="#">Privacy</a>
                        <a href="#">Terms</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
