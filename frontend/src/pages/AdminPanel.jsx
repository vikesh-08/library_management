import { useEffect, useState } from 'react';
import API from '../api/axios';
import { FiUserPlus, FiTrash2, FiShield, FiShieldOff, FiUser } from 'react-icons/fi';

const AdminPanel = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({ username: '', password: '', role: 'user' });
    const [formError, setFormError] = useState('');
    const [formLoading, setFormLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const fetchUsers = async () => {
        try {
            const { data } = await API.get('/users');
            setUsers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const showMessage = (text) => {
        setMsg(text);
        setTimeout(() => setMsg(''), 3000);
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setFormError('');
        if (!form.username || !form.password) {
            setFormError('Username and password are required');
            return;
        }
        setFormLoading(true);
        try {
            await API.post('/users', form);
            setShowModal(false);
            setForm({ username: '', password: '', role: 'user' });
            fetchUsers();
            showMessage('User added successfully!');
        } catch (err) {
            setFormError(err.response?.data?.message || 'Failed to add user');
        } finally {
            setFormLoading(false);
        }
    };

    const handleBlock = async (id) => {
        try {
            const { data } = await API.put(`/users/block/${id}`);
            setUsers(users.map((u) => (u._id === id ? { ...u, status: data.status } : u)));
            showMessage(`User ${data.status === 'blocked' ? 'blocked' : 'unblocked'} successfully`);
        } catch (err) {
            showMessage(err.response?.data?.message || 'Action failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;
        try {
            await API.delete(`/users/${id}`);
            setUsers(users.filter((u) => u._id !== id));
            showMessage('User deleted successfully');
        } catch (err) {
            showMessage(err.response?.data?.message || 'Delete failed');
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h2>User Management</h2>
                    <p>Manage all library users</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <FiUserPlus /> Add User
                </button>
            </div>

            {msg && <div className="alert alert-success">{msg}</div>}

            {loading ? (
                <div className="loading">Loading users...</div>
            ) : (
                <div className="table-card">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Username</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u, idx) => (
                                <tr key={u._id}>
                                    <td>{idx + 1}</td>
                                    <td>
                                        <div className="user-cell">
                                            <div className="user-avatar">{u.username[0].toUpperCase()}</div>
                                            {u.username}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`role-badge ${u.role}`}>{u.role}</span>
                                    </td>
                                    <td>
                                        <span className={`status-badge ${u.status}`}>{u.status}</span>
                                    </td>
                                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        {u.role !== 'admin' && (
                                            <div className="action-btns">
                                                <button
                                                    className={`btn-icon ${u.status === 'blocked' ? 'btn-success' : 'btn-warning'}`}
                                                    onClick={() => handleBlock(u._id)}
                                                    title={u.status === 'blocked' ? 'Unblock' : 'Block'}
                                                >
                                                    {u.status === 'blocked' ? <FiShield /> : <FiShieldOff />}
                                                </button>
                                                <button
                                                    className="btn-icon btn-danger"
                                                    onClick={() => handleDelete(u._id)}
                                                    title="Delete"
                                                >
                                                    <FiTrash2 />
                                                </button>
                                            </div>
                                        )}
                                        {u.role === 'admin' && <span className="text-muted">—</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add User Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                        <h2>Add New User</h2>
                        <form onSubmit={handleAddUser} className="modal-form">
                            {formError && <div className="alert alert-error">{formError}</div>}
                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    placeholder="Enter username"
                                    value={form.username}
                                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Password</label>
                                <input
                                    type="password"
                                    placeholder="Enter password"
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Role</label>
                                <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={formLoading}>
                                    {formLoading ? 'Adding...' : 'Add User'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;
