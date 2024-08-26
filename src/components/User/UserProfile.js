import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../User/UserProfile.css';
import Footer from './Footer';
import Header from './Header';

export default function UserProfile() {
    const [categories, setCategories] = useState([]);
    const user_id = localStorage.getItem("user_id");
    console.log(user_id);
    const fetchCategories = () => {
        axios.get('http://localhost:3000/category/getCategoriesByUserId', { user_id: user_id })
            .then(response => {
                setCategories(response.data); // Assuming the response data is an array of categories
                console.log(response);
            })
            .catch(error => {
                console.error("There was an error fetching the categories!", error);
                console.log("---------", error);
            });
    }

    return (
        <>
            <Header />
            <div className='user-dashboard-main'>
                <div className="dashboard-container">
                    <nav className="sidebar">
                        <div className="sidebar-header">
                            <h2>Menu</h2>
                        </div>

                        <ul className="sidebar-menu">
                            {categories.map(category => (
                                <li key={category.id}>
                                    <a href="#">{category.name}</a>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <div className="main-content-header">
                        <div className="content">
                            <button className='btn btn-success' onClick={ fetchCategories}>Categories...</button>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Survey Title</th>
                                        <th>Survey Description</th>
                                        <th>Category</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>John Doe</td>
                                        <td>john@example.com</td>
                                        <td>555-1234</td>
                                        <td>
                                            <a href="#">Modifier</a>
                                            <a href="#">Supprimer</a>
                                        </td>
                                    </tr>
                                    {/* Other rows can go here */}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}
