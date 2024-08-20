
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function Header() {
    const navigate = useNavigate();
    const userId = localStorage.getItem("user_id");

    const logout = () => {
        if (userId) {
            localStorage.clear();
        }
        console.log("After clear : ", userId);

        Swal.fire({
            position: "center",
            icon: "success",
            title: "Logged Out",
            showConfirmButton: false,
            timer: 1500,
        });
        navigate("/userSignUp");
    };

    return (
        <div>
            <header>
                <div className="header-main">
                    <div className="container">
                        <nav id='cssmenu'>
                            <div className="logo">
                                <img src="./survey_system_logo.png" style={{ width: "400px", height: "60px" }} alt="Survey Logo" />
                            </div>
                            <ul>
                                <li className='active'><a href='/'>Home</a></li>
                                <li>
                                    <a 
                                        onClick={() => {
                                            if (userId) {
                                                navigate('/createSurvey');
                                            } else {
                                                Swal.fire({
                                                    icon: 'warning',
                                                    title: 'Access Denied',
                                                    text: 'Please sign in to create surveys.',
                                                });
                                            }
                                        }}
                                    >
                                        Create Surveys
                                    </a>
                                </li>
                                <li><a href='#'>View Surveys</a></li>
                                <li><a href='#'>View Responses</a></li>
                                <span>
                                    {userId ? (
                                        <button className='btn btn-dark' onClick={logout}>Log out</button>
                                    ) : (
                                        <button className='btn btn-dark' onClick={() => navigate('/userSignUp')}>Join now</button>
                                    )}
                                </span>
                            </ul>
                        </nav>
                    </div>
                </div>
            </header>
        </div>
    );
}

