import { useEffect, useState } from 'react';
import API from '../api/axios';
import { FiPlus, FiEdit2, FiTrash2, FiBookOpen } from 'react-icons/fi';

const EMPTY_FORM = { title: '', author: '', category: '', totalCopies: '', availableCopies: '', description: '' };
const CATEGORIES = ['Fiction', 'Non-Fiction', 'Technology', 'Fantasy', 'Science Fiction', 'Dystopian', 'Self-Help', 'History', 'Biography', 'Other'];

const AdminBooks = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editBook, setEditBook] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [formError, setFormError] = useState('');
    const [formLoading, setFormLoading] = useState(false);
    const [msg, setMsg] = useState('');

    const fetchBooks = async () => {
        try {
            const { data } = await API.get('/books');
            setBooks(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchBooks(); }, []);

    const showMessage = (text) => {
        setMsg(text);
        setTimeout(() => setMsg(''), 3000);
    };

    const openAdd = () => {
        setEditBook(null);
        setForm(EMPTY_FORM);
        setFormError('');
        setShowModal(true);
    };

    const openEdit = (book) => {
        setEditBook(book);
        setForm({
            title: book.title,
            author: book.author,
            category: book.category,
            totalCopies: book.totalCopies,
            availableCopies: book.availableCopies,
            description: book.description || '',
        });
        setFormError('');
        setShowModal(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFormError('');
        const { title, author, category, totalCopies } = form;
        if (!title || !author || !category || !totalCopies) {
            setFormError('Please fill all required fields');
            return;
        }
        setFormLoading(true);
        try {
            if (editBook) {
                const { data } = await API.put(`/books/${editBook._id}`, form);
                setBooks(books.map((b) => (b._id === editBook._id ? data : b)));
                showMessage('Book updated successfully!');
            } else {
                const { data } = await API.post('/books', form);
                setBooks([data, ...books]);
                showMessage('Book added successfully!');
            }
            setShowModal(false);
        } catch (err) {
            setFormError(err.response?.data?.message || 'Operation failed');
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this book?')) return;
        try {
            await API.delete(`/books/${id}`);
            setBooks(books.filter((b) => b._id !== id));
            showMessage('Book deleted successfully');
        } catch (err) {
            showMessage(err.response?.data?.message || 'Delete failed');
        }
    };

    return (
        <div className="page">
            <div className="page-header">
                <div>
                    <h2>Manage Books</h2>
                    <p>Add, edit, and delete library books</p>
                </div>
                <button className="btn btn-primary" onClick={openAdd}>
                    <FiPlus /> Add Book
                </button>
            </div>

            {msg && <div className="alert alert-success">{msg}</div>}

            {loading ? (
                <div className="loading">Loading books...</div>
            ) : books.length === 0 ? (
                <div className="empty-state">
                    <FiBookOpen size={48} />
                    <p>No books yet. Add your first book!</p>
                </div>
            ) : (
                <div className="table-card">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Author</th>
                                <th>Category</th>
                                <th>Available</th>
                                <th>Total</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {books.map((book, idx) => (
                                <tr key={book._id}>
                                    <td>{idx + 1}</td>
                                    <td className="book-title-cell">{book.title}</td>
                                    <td>{book.author}</td>
                                    <td><span className="badge">{book.category}</span></td>
                                    <td>
                                        <span className={book.availableCopies === 0 ? 'text-danger' : 'text-success'}>
                                            {book.availableCopies}
                                        </span>
                                    </td>
                                    <td>{book.totalCopies}</td>
                                    <td>
                                        <div className="action-btns">
                                            <button className="btn-icon btn-edit" onClick={() => openEdit(book)} title="Edit">
                                                <FiEdit2 />
                                            </button>
                                            <button className="btn-icon btn-danger" onClick={() => handleDelete(book._id)} title="Delete">
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal modal-lg" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
                        <h2>{editBook ? 'Edit Book' : 'Add New Book'}</h2>
                        <form onSubmit={handleSubmit} className="modal-form">
                            {formError && <div className="alert alert-error">{formError}</div>}
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Title *</label>
                                    <input type="text" placeholder="Book title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Author *</label>
                                    <input type="text" placeholder="Author name" value={form.author} onChange={(e) => setForm({ ...form, author: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Category *</label>
                                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                                        <option value="">Select category</option>
                                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Total Copies *</label>
                                    <input type="number" min="1" placeholder="5" value={form.totalCopies} onChange={(e) => setForm({ ...form, totalCopies: e.target.value })} />
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Available Copies</label>
                                <input type="number" min="0" placeholder="Defaults to total copies" value={form.availableCopies} onChange={(e) => setForm({ ...form, availableCopies: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea rows="3" placeholder="Short book description..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn btn-ghost" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" disabled={formLoading}>
                                    {formLoading ? 'Saving...' : editBook ? 'Update Book' : 'Add Book'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminBooks;
