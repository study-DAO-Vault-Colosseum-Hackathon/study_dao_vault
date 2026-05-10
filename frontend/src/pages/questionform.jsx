import React, { useState } from 'react';
import bscCsitData from '../data/csitdata';
import { Send, BookOpen, Layers } from 'lucide-react'; // Optional: Use Lucide for better icons
import './qa.css'
const Questionform = ({ onPost }) => {
  const [inputValue, setInputValue] = useState({ 
    input: '', 
    semester: '', 
    subject: '', 
    answer: '' 
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputValue.input.trim() && inputValue.semester && inputValue.subject) {
      onPost(inputValue);
      // Reset form
      setInputValue({ input: '', semester: '', subject: '', answer: '' });
    } else {
      alert("Please fill in the question, semester, and subject.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Reset subject if semester changes
    if (name === "semester") {
      setInputValue({ ...inputValue, semester: value, subject: '' });
    } else {
      setInputValue({ ...inputValue, [name]: value });
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="post-form-card">
      <form onSubmit={handleSubmit}>
        <div className="form-header">
          <div className="glow-dot"></div>
          <h3>Ask the Community</h3>
        </div>

        <textarea
          placeholder="What's on your mind? (Shift + Enter for new line)"
          value={inputValue.input}
          onChange={(e) => setInputValue({ ...inputValue, input: e.target.value })}
          onKeyDown={handleKeyDown}
          className="post-textarea"
        />

        <div className="form-controls">
          <div className="select-wrapper">
            <Layers size={16} className="select-icon" />
            <select 
              name="semester" 
              value={inputValue.semester} 
              onChange={handleChange}
              className="custom-select"
            >
              <option value="">Semester</option>
              {Object.keys(bscCsitData.semesters).map((semKey) => (
                <option key={semKey} value={semKey}>{semKey}</option>
              ))}
            </select>
          </div>

          <div className="select-wrapper">
            <BookOpen size={16} className="select-icon" />
            <select
              name="subject"
              value={inputValue.subject}
              onChange={handleChange}
              disabled={!inputValue.semester}
              className="custom-select"
            >
              <option value="">Subject</option>
              {inputValue.semester &&
                bscCsitData.semesters[inputValue.semester].subjects.map((sub) => (
                  <option key={sub} value={sub}>{sub}</option>
                ))}
            </select>
          </div>

          <button type="submit" className="post-submit-btn">
            <span>Post to Vault</span>
            <Send size={16} />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Questionform;