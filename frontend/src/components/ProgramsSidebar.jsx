import React, { useState } from 'react';

const semesters = Array.from({ length: 8 }, (_, index) => index + 1);

const ProgramsSidebar = ({ 
  isOpen, 
  onClose, 
  selectedSemester, 
  onSemesterClick 
}) => {
  const [isSemesterDropdownOpen, setIsSemesterDropdownOpen] = useState(false);
  const [showSemesters, setShowSemesters] = useState(false);

  const handleProgramClick = () => {
    setIsSemesterDropdownOpen(!isSemesterDropdownOpen);
    setShowSemesters(false);
  };

  const handleLocalSemesterClick = (num) => {
    onSemesterClick(num);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <button
          type="button"
          className="programs-sidebar-backdrop"
          onClick={onClose}
          aria-label="Close programs sidebar"
        />
      )}

      <aside className={`programs-sidebar ${isOpen ? 'open' : ''}`}>
        <button
          type="button"
          className="programs-sidebar-close"
          onClick={onClose}
          aria-label="Close programs sidebar"
        >
          ×
        </button>

        <div className="programs-sidebar-header">
          <div className="programs-sidebar-primary">
            <div className="programs-sidebar-avatar">TU</div>
            <div>
              <h3>Tribhuvan University</h3>
              <div className="programs-program-row">
                <button
                  type="button"
                  className="programs-program-button"
                  onClick={handleProgramClick}
                >
                  BSc CSIT
                </button>
                <button
                  type="button"
                  className="programs-animated-icon programs-animated-icon-button"
                  onClick={handleProgramClick}
                  aria-label="Show semester options"
                >
                  <span className="programs-animated-chevron" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {isSemesterDropdownOpen && (
          <div className="programs-semester-list">
            <button
              type="button"
              className="programs-semester-trigger"
              onClick={() => setShowSemesters(!showSemesters)}
            >
              <span>Semester</span>
              <span className="programs-semester-icon" aria-hidden="true">
                <span className="programs-semester-icon-chevron" />
              </span>
            </button>

            {showSemesters && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {semesters.map((semesterNumber) => (
                  <button
                    key={semesterNumber}
                    type="button"
                    className={`programs-semester-item ${selectedSemester === semesterNumber ? 'active' : ''}`}
                    onClick={() => handleLocalSemesterClick(semesterNumber)}
                  >
                    <span className="programs-semester-circle">{semesterNumber}</span>
                    <span>Semester {semesterNumber}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </aside>
    </>
  );
};

export default ProgramsSidebar;
