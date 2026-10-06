import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import { FiBook, FiCheckCircle, FiUsers, FiAlertCircle } from 'react-icons/fi';

const StatCard = ({ icon, label, value, color }) => (
    <div className={`stat-card stat-${color}`}>
        <div className="stat-icon">{icon}</div>
        <div className="stat-info">
            <h3>{value}</h3>
            <p>{label}</p>
        </div>
    </div>
);

const Dashboard = () => {
    const { user } = useAuth();
    const [books, setBooks] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const booksRes = await API.get('/books');
                setBooks(booksRes.data);
                if (user?.role === 'admin') {
                    const usersRes = await API.get('/users');
                    setUsers(usersRes.data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user]);

    const totalBooks = books.length;
    const totalCopies = books.reduce((sum, b) => sum + b.totalCopies, 0);
    const availableCopies = books.reduce((sum, b) => sum + b.availableCopies, 0);
    const borrowedCopies = totalCopies - availableCopies;

    return (
        <div className="page">
            <div className="page-header">
                <h2>Dashboard</h2>
                <p>Welcome back, <strong>{user?.username}</strong> 👋</p>
            </div>

            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <>
                    <div className="stats-grid">
                        <StatCard icon={<FiBook />} label="Total Books" value={totalBooks} color="blue" />
                        <StatCard icon={<FiCheckCircle />} label="Available Copies" value={availableCopies} color="green" />
                        <StatCard icon={<FiAlertCircle />} label="Borrowed Copies" value={borrowedCopies} color="orange" />
                        {user?.role === 'admin' && (
                            <StatCard icon={<FiUsers />} label="Total Users" value={users.length} color="purple" />
                        )}
                    </div>

                    <div className="recent-books">
                        <h3>Recent Books</h3>
                        <div className="books-table-wrapper">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Author</th>
                                        <th>Category</th>
                                        <th>Available</th>
                                        <th>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {books.slice(0, 5).map((book) => (
                                        <tr key={book._id}>
                                            <td>{book.title}</td>
                                            <td>{book.author}</td>
                                            <td><span className="badge">{book.category}</span></td>
                                            <td>
                                                <span className={book.availableCopies === 0 ? 'text-danger' : 'text-success'}>
                                                    {book.availableCopies}
                                                </span>
                                            </td>
                                            <td>{book.totalCopies}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default Dashboard;
