import '../User/CreateSurvey.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Header from './Header';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

export default function CreateSurveys() {
    const navigate = useNavigate();

    let userId = localStorage.getItem('user_id');

    const [categoryList, setCategoryList] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        userId,
        survey_title: '',
        survey_description: '',
        category_id: '',
        status: 'draft' // Default status
    });


    const [categorySelected, setCategorySelected] = useState(false); // State to track category selection


    useEffect(() => {
        axios.get('http://localhost:3000/category/getAllCategories')
            .then(response => {
                if (Array.isArray(response.data)) {
                    const categories = response.data.map(category => ({
                        value: category.categoryid,
                        text: category.category_name
                    }));
                    setCategoryList(categories);
                } else {
                    console.error('Unexpected response structure:', response.data);
                    setError(new Error('Unexpected response structure'));
                }
            })
            .catch(err => {
                console.error("Error fetching categories:", err);
                setError(err);

            });
    }, []);

    const handleAddCategory = () => {
        if (!newCategory.trim()) {
            alert('Please enter a category name');
            return;
        }

        axios.post('http://localhost:3000/category/addCategory', { category_name: newCategory, user_id: userId })
            .then(response => {
                console.log("New category name : ", newCategory);

                if (response.status === 200) {
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Category added Successfully",
                        showConfirmButton: false,
                        timer: 3000
                    });
                    const newCategoryData = response.data.data;

                    setCategoryList(prevCategories => [
                        ...prevCategories,
                        {
                            value: newCategoryData.categoryid,
                            text: newCategoryData.category_name
                        }
                    ]);


                    setNewCategory('');
                }
            })
            .catch(err => {
                if (err.response.status === 400) {
                    Swal.fire({
                        icon: "warning",
                        title: "Category Already Exist",

                    });

                } else {
                    console.log(err);
                    Swal.fire({
                        icon: "error",
                        title: "Oops..rtrt.",
                        text: "Something went wrong!",
                    });
                }
                // console.error("Error adding category:", err);
                // setError(err);
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value

        }));

        // Update categorySelected state when category is chosen
        if (name === 'category_id') {
            setCategorySelected(value !== '');
        }
    };

    const handleSubmit = (status) => {
        const { survey_title, survey_description, category_id } = formData;

        if (!survey_title || !survey_description || !category_id) {
            alert('Please fill out all required fields.');
            return;
        }

        axios.post('http://localhost:3000/survey/createSurvey', {
            userId,
            survey_title,
            survey_description,
            status,
            category_id,
        })
            .then(response => {
                if (response.status === 200) {
                    alert(`Survey ${status === 'draft' ? 'saved as draft' : 'published'} successfully!`);

                    // Optionally, you can reset the form or navigate away
                    Swal.fire({
                        position: "center",
                        icon: "success",
                        title: "Survey Created Successfully",
                        showConfirmButton: false,
                        timer: 3000
                    });
                    if (status === 'published') {
                        navigate('/questionsPage', { state: { survey_id: response.data.data.survey_id } }); // Pass surveyId as state
                    }
                }
            })
            .catch(err => {
                if (err.response.status === 400) {
                    // Handle known error for already signed-up users
                    Swal.fire({
                        icon: "warning",
                        title: "Survey already exist",
                    });
                } else {
                    // Handle other errors
                    console.log(err);
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: "Something went wrong!",
                    });
                }
                // console.error("Error submitting survey:", err);
                // setError(err);
            });

    };

    return (
        <>
            <Header />
            <div className='survey-main'>
                <div className="form-container survey-form-body">
                    <h1>Survey Form</h1>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            handleSubmit(formData.status);
                        }}
                    >
                        <div className="form-group">
                            <label htmlFor="survey-survey_title">Survey Title</label>
                            <input
                                type="text"
                                id="survey-survey_title"
                                name="survey_title"
                                value={formData.survey_title}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="survey_survey_description">Survey Description</label>
                            <input
                                type="text"
                                id="survey_survey_description"
                                name="survey_description"
                                value={formData.survey_description}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="survey-category">Choose Category</label>
                            <select
                                id="survey-category"
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Please select any category</option>
                                {categoryList.length > 0 ? (
                                    categoryList.map(category => (
                                        <option key={category.value} value={category.value}>
                                            {category.text}
                                        </option>
                                    ))
                                ) : (
                                    <option value="" disabled>No categories available</option>
                                )}

                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="new-category">Add New Category</label>
                            <input
                                type="text"
                                id="new-category"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                placeholder="Enter new category"
                                disabled={categorySelected} // Disable if category is selected
                            />
                            <br></br>
                            <button
                                type="button"
                                className='btn btn-outline-success mt-3'
                                onClick={handleAddCategory}
                                disabled={categorySelected} // Disable if category is selected
                            >
                                Add Category
                            </button>
                        </div>

                        <button
                            type="submit"
                            className='btn btn-outline-secondary'
                            onClick={() => setFormData(prev => ({ ...prev, status: 'draft' }))}
                        >
                            Save as Draft
                        </button>
                        &nbsp;&nbsp;&nbsp;
                        <button
                            type="submit"
                            className='btn btn-outline-danger'
                            onClick={() => setFormData(prev => ({ ...prev, status: 'published' }))}
                        >
                            Publish
                        </button>
                    </form>
                </div>
            </div>
            <Footer />
        </>
    );
}
