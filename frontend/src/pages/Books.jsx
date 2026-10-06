import { useEffect, useState } from 'react';
import API from '../api/axios';
import { FiSearch, FiBookOpen, FiUser, FiTag } from 'react-icons/fi';

const Books = () => {
    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState('');
    const [category, setCategory] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedBook, setSelectedBook] = useState(null);

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const params = {};
            if (search) params.search = search;
            if (category) params.category = category;
            const { data } = await API.get('/books', { params });
            setBooks(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(fetchBooks, 300);
        return () => clearTimeout(timer);
    }, [search, category]);

    const categories = ['Fiction', 'Non-Fiction', 'Technology', 'Fantasy', 'Science Fiction', 'Dystopian', 'Self-Help'];

    return (
        <div className="page">
            <div className="page-header">
                <h2>Book Catalog</h2>
                <p>Browse and search all available books</p>
            </div>

            {/* Filters */}
            <div className="filters-bar">
                <div className="search-box">
                    <FiSearch />
                    <input
                        type="text"
                        placeholder="Search by title or author..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select
                    className="filter-select"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="">All Categories</option>
                    {categories.map((c) => (
                        <option key={c} value={c}>{c}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="loading">Loading books...</div>
            ) : books.length === 0 ? (
                <div className="empty-state">
                    <FiBookOpen size={48} />
                    <p>No books found</p>
                </div>
            ) : (
                <div className="books-grid">
                    {books.map((book) => (
                        <div
                            key={book._id}
                            className="book-card"
                            onClick={() => setSelectedBook(book)}
                        >
                            <div className="book-card-top">
                                <div className="book-icon">
                                    <FiBookOpen />
                                </div>
                                <span className={`book-avail ${book.availableCopies === 0 ? 'none' : 'ok'}`}>
                                    {book.availableCopies === 0 ? 'Unavailable' : 'Available'}
                                </span>
                            </div>
                            <h3 className="book-title">{book.title}</h3>
                            <p className="book-author">
                                <FiUser size={12} /> {book.author}
                            </p>
                            <span className="book-category">
                                <FiTag size={12} /> {book.category}
                            </span>
                            <div className="book-copies">
                                <span>{book.availableCopies} / {book.totalCopies} copies</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Book Detail Modal */}
            {selectedBook && (
                <div className="modal-overlay" onClick={() => setSelectedBook(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={() => setSelectedBook(null)}>✕</button>
                        <div className="modal-header">
                            <div className="modal-book-icon"><FiBookOpen /></div>
                            <h2>{selectedBook.title}</h2>
                        </div>
                        <div className="modal-body">
                            <div className="detail-row">
                                <span className="detail-label">Author</span>
                                <span>{selectedBook.author}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Category</span>
                                <span className="badge">{selectedBook.category}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Total Copies</span>
                                <span>{selectedBook.totalCopies}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Available</span>
                                <span className={selectedBook.availableCopies === 0 ? 'text-danger' : 'text-success'}>
                                    {selectedBook.availableCopies}
                                </span>
                            </div>
                            {selectedBook.description && (
                                <div className="detail-desc">
                                    <p className="detail-label">Description</p>
                                    <p>{selectedBook.description}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Books;
