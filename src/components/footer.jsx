import React from 'react';

const Footer = () => {
    return (
        <footer style={footerStyle}>
            <div style={containerStyle}>
                <p>&copy; {new Date().getFullYear()} Penyiraman. All rights reserved.</p>
            </div>
        </footer>
    );
};

const footerStyle = {
    backgroundColor: '#333',
    color: '#fff',
    padding: '10px 0',
    position: 'fixed',
    bottom: '0',
    width: '100%',
    textAlign: 'center',
};

const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
};

export default Footer;