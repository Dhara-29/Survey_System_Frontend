
// import '../User/CreateSurvey.css';
// import axios from 'axios';
// import React, { useEffect, useState } from 'react';
// import Header from './Header';

// export default function CreateSurveys() {
//     const [categoryList, setCategoryList] = useState([]);
//     const [newCategory, setNewCategory] = useState('');
//     const [error, setError] = useState(null);
//     const [isLoading, setIsLoading] = useState(true);

//     useEffect(() => {
//         axios.get('http://localhost:3000/category/getAllCategories')
//             .then(response => {
//                 console.log(response.data); // Log the entire response data to understand its structure

//                 // Check if response.data is an array
//                 if (Array.isArray(response.data)) {
//                     // Map over the array to extract category names and IDs
//                     const categories = response.data.map(category => ({
//                         value: category.categoryid, // or use another unique identifier if needed
//                         text: category.category_name
//                     }));

//                     setCategoryList(categories); // Set the categories in state
//                 } else {
//                     console.error('Unexpected response structure:', response.data);
//                     setError(new Error('Unexpected response structure'));
//                 }

//                 setIsLoading(false);
//             })
//             .catch(err => {
//                 console.error("Error fetching categories:", err);
//                 setError(err);
//                 setIsLoading(false);
//             });
//     }, []);

//     const handleAddCategory = () => {
//         if (!newCategory.trim()) {
//             alert('Please enter a category name');
//             return;
//         }

//         axios.post('http://localhost:3000/category/addCategory', { category_name: newCategory })
//             .then(response => {
//                 // Assuming the server returns the new category with an ID
//                 const newCategoryData = response.data; // Update based on your response structure
//                 setCategoryList(prevCategories => [
//                     ...prevCategories,
//                     {
//                         value: newCategoryData.categoryid,
//                         text: newCategoryData.category_name
//                     }
//                 ]);
//                 setNewCategory(''); // Clear the input field
//             })
//             .catch(err => {
//                 console.error("Error adding category:", err);
//                 setError(err);
//             });
//     };

//     if (isLoading) return <p>Loading categories...</p>;
//     if (error) return <p>Error fetching categories: {error.message}</p>;

//     return (
//         <>
//             <Header />
//             <div className="form-container survey-form-body">
//                 <h1>Survey Form</h1>
//                 <form action="/submit_form" method="post">
//                     <div className="form-group">
//                         <label htmlFor="survey-title">Survey Title</label>
//                         <input type="text" id="survey-title" name="survey-title" required />
//                     </div>
//                     <div className="form-group">
//                         <label htmlFor="survey_description">Description</label>
//                         <input type="email" id="survey_description" name="survey_description" required />
//                     </div>

//                     <div className="form-group">
//                         <label htmlFor="survey-category">Choose Category</label>
//                         <select id="survey-category" name="survey-category" required>
//                             <option value="">Please select any category</option>
//                             {categoryList.length > 0 ? (
//                                 categoryList.map(category => (
//                                     <option key={category.value} value={category.value}>
//                                         {category.text}
//                                     </option>
//                                 ))
//                             ) : (
//                                 <option value="" disabled>No categories available</option>
//                             )}
//                         </select>
//                     </div>

//                     <div className="form-group">
//                         <label htmlFor="new-category">Add New Category</label>
//                         <input
//                             type="text"
//                             id="new-category"
//                             value={newCategory}
//                             onChange={(e) => setNewCategory(e.target.value)}
//                             placeholder="Enter new category"
//                         />
                     
//                     </div>
//                      <button type="button " className='btn btn-outline-warning' onClick={handleAddCategory}>Add Category</button>

//                     <button className='btn btn-outline-danger' type="submit">Submit</button>
//                 </form>
//             </div>
//         </>
//     );
// }
import '../User/CreateSurvey.css';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Header from './Header';

export default function CreateSurveys() {
    let user_id = localStorage.getItem('user_id');
    
    const [categoryList, setCategoryList] = useState([]);
    const [newCategory, setNewCategory] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState({
        user_id,
        title: '',
        description: '',
        category: '',
        status: 'draft' // Default status
    });

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

                setIsLoading(false);
            })
            .catch(err => {
                console.error("Error fetching categories:", err);
                setError(err);
                setIsLoading(false);
            });
    }, []);

    const handleAddCategory = () => {
        if (!newCategory.trim()) {
            alert('Please enter a category name');
            return;
        }

        axios.post('http://localhost:3000/category/addCategory', { category_name: newCategory })
            .then(response => {
                const newCategoryData = response.data;
                setCategoryList(prevCategories => [
                    ...prevCategories,
                    {
                        value: newCategoryData.categoryid,
                        text: newCategoryData.category_name
                    }
                ]);
                setNewCategory('');
            })
            .catch(err => {
                console.error("Error adding category:", err);
                setError(err);
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleSubmit = (status) => {
        const { title, description, category } = formData;

        if (!title || !description || !category) {
            alert('Please fill out all required fields.');
            return;
        }

        axios.post('http://localhost:3000/survey/createSurvey', {
            user_id,
            title,
            description,
            status,
            category,
        })
        .then(response => {
            alert(`Survey ${status === 'draft' ? 'saved as draft' : 'published'} successfully!`);
            // Optionally, you can reset the form or navigate away
        })
        .catch(err => {
            console.error("Error submitting survey:", err);
            setError(err);
        });
    };

    if (isLoading) return <p>Loading categories...</p>;
    if (error) return <p>Error fetching categories: {error.message}</p>;

    return (
        <>
            <Header />
            <div className="form-container survey-form-body">
                <h1>Survey Form</h1>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit(formData.status);
                    }}
                >
                    <div className="form-group">
                        <label htmlFor="survey-title">Survey Title</label>
                        <input
                            type="text"
                            id="survey-title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="survey_description">Description</label>
                        <input
                            type="text"
                            id="survey_description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="survey-category">Choose Category</label>
                        <select
                            id="survey-category"
                            name="category"
                            value={formData.category}
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
                        />
                        <button
                            type="button"
                            className='btn btn-outline-warning'
                            onClick={handleAddCategory}
                        >
                            Add Category
                        </button>
                    </div>

                    <button
                        type="button"
                        className='btn btn-outline-secondary'
                        onClick={() => setFormData(prev => ({ ...prev, status: 'draft' }))}
                    >
                        Save as Draft
                    </button>
                    <button
                        type="submit"
                        className='btn btn-outline-danger'
                        onClick={() => setFormData(prev => ({ ...prev, status: 'published' }))}
                    >
                        Publish
                    </button>
                </form>
            </div>
        </>
    );
}
