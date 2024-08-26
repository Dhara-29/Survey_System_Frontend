import React, { useState } from 'react';
import axios from 'axios';
import '../User/QuestionsPage.css';
import Header from './Header';
import { useLocation } from 'react-router-dom';
import Footer from './Footer';

export default function QuestionsPage() {
    const user_id = localStorage.getItem("user_id");
    // console.log(user_id);

    const [questions, setQuestions] = useState([]);
    const [questionType, setQuestionType] = useState('MCQ');
    const [newQuestion, setNewQuestion] = useState('');
    const [options, setOptions] = useState([]);
    const [rating, setRating] = useState(1);
    
    const location = useLocation();
    const survey_id = location.state?.survey_id;

    const handleAddQuestion = () => {
        if (newQuestion.trim() === '') return;
        alert(options+" "+questionType)
        const question = {
            questionData: newQuestion,
            questionType: questionType,
            options: questionType === 'MCQ' ? options : [],
            rating: questionType === 'Rating' ? rating : null,
            question_answer_text: null
        };
        console.log("Questions which are here : ",question)

        axios.post('http://localhost:3000/question/addQuestion', {
            question_id:7,
            survey_id: survey_id,
            user_id: user_id,
            question_type: questionType,
            question_text: newQuestion,
            questionOptions: questionType === 'MCQ' ? options : [],
            question_answer_text: null
        })
            .then(response => {
                console.log('Question added successfully:', response.data);
                setQuestions([...questions, question]);
                setNewQuestion('');
                setOptions([]);
                setRating(1);
            })
            .catch(err => {
                console.error("Error adding question:", err);
            });
    };

    return (
        <>
            <Header />
            <div className="question_container">
                <h1>Create Your Survey</h1>

                <div className="form-class">
                    <label htmlFor="questionData">Question:</label>
                    <input
                        type="text"
                        id="questionData"
                        value={newQuestion}
                        onChange={(e) => setNewQuestion(e.target.value)}
                        placeholder="Enter your question"
                    />
                </div>

                <div className="form-class">
                    <label htmlFor="questionType">Question Type:</label>
                    <select
                        id="questionType"
                        value={questionType}
                        onChange={(e) => setQuestionType(e.target.value)}
                    >
                        <option value="MCQ">Multiple Choice</option>
                        <option value="Text">Text</option>
                        <option value="Rating">Rating</option>
                    </select>
                </div>

                {questionType === 'MCQ' && (
                    <div className="form-class">
                        <label htmlFor="options">Options (comma separated):</label>
                        <input
                            type="text"
                            id="options"
                            value={options.join(', ')}
                            onChange={(e) => setOptions(e.target.value.split(',').map(opt => opt.trim()))}
                            placeholder="Enter options"
                        />
                    </div>
                )}

                {questionType === 'Rating' && (
                    <div className="form-class">
                        <label htmlFor="rating">Rating (1-5):</label>
                        <input
                            type="number"
                            id="rating"
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                            min="1"
                            max="5"
                        />
                    </div>
                )}

                <button onClick={handleAddQuestion} className="add-button">Add Question</button>

                <h2 className='text-center mt-4'>Survey Preview</h2>
                {questions.length > 0 ? (
                    <ul>
                        {questions.map((q, index) => (
                            <li key={index}>
                                <strong>Question No.:{index + 1} &nbsp;&nbsp;</strong>
                                <strong>{q.questionData}</strong>
                                {q.questionType === 'MCQ' && (
                                    <ul>
                                        {q.options.map((opt, i) => (
                                            <li key={i}>{opt}</li>
                                        ))}
                                    </ul>
                                )}
                                {q.questionType === 'Rating' && (
                                    <p>Rating: {q.rating}</p>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No questions added yet.</p>
                )}
            </div>
            <Footer/>
        </>
    );
}
