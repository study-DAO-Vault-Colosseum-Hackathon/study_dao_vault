import React, { useState } from 'react'
import bscCsitData from '../data/csitdata';
const Questionform = ({onPost}) => {
    const [inputValue , setInputValue] = useState({input : '', semester: '', subject:'', answer:''});
    
    const handleSubmit = (e) =>{
        e.preventDefault();
        if (inputValue.input.trim()) {
            onPost(inputValue);
            setInputValue({input : '', semester: '', subject:'', answer:''});
        }
    };

    const handleChange = (e) => {
        setInputValue({...inputValue, [e.target.name]: e.target.value});
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

  return (
    <div className="post-form-container">
      <form onSubmit={handleSubmit}>
        <div className="input-wrapper">
          <p>Have a question for the Vault?</p>
          <textarea 
            placeholder="Type your question or post here..."
            value={inputValue.input}
            onChange={(e) => setInputValue({...inputValue , input : e.target.value})}
            onKeyDown={handleKeyDown}
            rows="3"
            className="post-input"
          />
          {/* {Object.keys(bscCsitData.semesters).map((semKey) => (
              <label key={semKey}>
          <input
             type="radio"
             name="semester"
             value={semKey}
             checked={inputValue.semester === semKey}
             onChange={handleChange}
             />
            {semKey}
  </label>
))} */}
             <div className="filter-group">
            <label>Semester:</label>
             <select name="semester" onChange={handleChange}>
  <option value="">Select Semester</option>
  { 
    Object.keys(bscCsitData.semesters).map((semKey) => (
      <option key={semKey} value={semKey}>{semKey}</option>
    ))
  }
</select>
        </div>
        {/* subject */}
         <div className="filter-group">
          <label>Subject:</label>
          <select name="subject" onChange={handleChange} value={inputValue.subject}>
  <option value="">Select Subject</option>
  {inputValue.semester && 
    bscCsitData.semesters[inputValue.semester].subjects.map((sub) => (
      <option key={sub} value={sub}>{sub}</option>
    ))
  }
</select>
        </div>

        
          <div className="form-actions">
            <button type="submit" className="btn-send">Post to Vault</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Questionform;
