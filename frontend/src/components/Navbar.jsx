import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiBookOpen, FiUsers, FiGrid, FiLogOut, FiBook, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navLinks = [
        { to: '/dashboard', icon: <FiGrid />, label: 'Dashboard' },
        { to: '/books', icon: <FiBook />, label: 'Books' },
        ...(user?.role === 'admin'
            ? [
                { to: '/admin/users', icon: <FiUsers />, label: 'Users' },
                { to: '/admin/books', icon: <FiBookOpen />, label: 'Manage Books' },
            ]
            : []),
    ];

    return (
        <nav className="navbar">
            <div className="navbar-brand">
                <FiBookOpen className="brand-icon" />
                <span>LibraryPro</span>
            </div>

            <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <FiX /> : <FiMenu />}
            </button>

            <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
                {navLinks.map((link) => (
                    <Link
                        key={link.to}
                        to={link.to}
                        className={`nav-link ${location.pathname === link.to ? 'active' : ''}`}
                        onClick={() => setMenuOpen(false)}
                    >
                        {link.icon}
                        <span>{link.label}</span>
                    </Link>
                ))}

                <div className="nav-user">
                    <span className={`role-badge ${user?.role}`}>{user?.role}</span>
                    <span className="username">{user?.username}</span>
                    <button className="logout-btn" onClick={handleLogout}>
                        <FiLogOut />
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
