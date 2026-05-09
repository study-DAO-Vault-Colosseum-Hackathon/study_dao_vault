# Frontend Architecture & Storage Strategy

## Quick Summary

Your app needs:
1. **Clear folder structure** → Easy to scale
2. **4 core contexts** → Avoid context bloat
3. **Reusable components** → Notes + Lab Reports share logic
4. **Strategic data storage** → Supabase (metadata), Firebase (files), Solana (reputation)
5. **File compression** → Minimize storage costs
6. **TypeScript types** → Type-safe components

---

## Part 1: Folder Structure

```
frontend/src/
├── pages/
│   ├── ProgramsPage.jsx          # TU BSc CSIT, BCA selection
│   ├── SemesterPage.jsx          # Semester 1-8 selection
│   ├── SubjectPage.jsx           # All subjects in semester
│   └── SubjectContentPage.jsx    # Notes, Lab, Q&A, Assignments (main page)
│
├── contexts/
│   ├── ProgramContext.jsx        # program, semester, subject, activeTab
│   ├── AuthContext.jsx           # user, wallet, isLoggedIn
│   ├── ReputationContext.jsx     # reputation, badges, sync logic
│   └── NotificationContext.jsx   # showNotification, hideNotification
│
├── components/
│   ├── common/
│   │   ├── Button.jsx            # Reusable button (all variants)
│   │   ├── Card.jsx              # Reusable card
│   │   ├── Modal.jsx
│   │   ├── FileUploader.jsx      # Handles ALL file types
│   │   ├── LoadingSpinner.jsx
│   │   └── ConfirmDialog.jsx
│   │
│   ├── layout/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx           # Program/Semester/Subject navigation
│   │   └── MainLayout.jsx
│   │
│   ├── features/
│   │   ├── documents/            # Notes + Lab Reports (SHARED LOGIC)
│   │   │   ├── DocumentUpload.jsx    # Upload (same component)
│   │   │   ├── DocumentCard.jsx      # Card (conditional display)
│   │   │   ├── DocumentList.jsx      # List (shared)
│   │   │   ├── DocumentViewer.jsx    # Preview
│   │   │   ├── MyDocuments.jsx       # My uploads
│   │   │   └── hooks/
│   │   │       └── useDocuments.js   # Shared hook for both notes & labs
│   │   │
│   │   ├── qa/
│   │   │   ├── QuestionCard.jsx
│   │   │   ├── AnswerCard.jsx
│   │   │   ├── AskQuestion.jsx
│   │   │   ├── PostAnswer.jsx
│   │   │   ├── QuestionList.jsx
│   │   │   ├── MyQuestions.jsx
│   │   │   └── hooks/
│   │   │       └── useQA.js
│   │   │
│   │   ├── leaderboard/
│   │   │   ├── LeaderboardTable.jsx
│   │   │   └── hooks/
│   │   │       └── useLeaderboard.js
│   │   │
│   │   └── auth/
│   │       ├── MagicLogin.jsx
│   │       └── UserProfile.jsx
│   │
├── services/
│   ├── api.js              # Express backend calls
│   ├── firebase.js         # Firebase storage
│   ├── supabase.js         # Supabase queries
│   ├── solana.js           # Solana program calls
│   ├── compression.js      # File compression
│   └── fileHandler.js      # Upload/download utilities
│
├── hooks/
│   ├── useFetch.js         # Generic data fetching
│   ├── useLocalStorage.js  # Client-side caching
│   └── useReputationSync.js # Sync reputation from Supabase
│
└── utils/
    ├── constants.js        # Programs, Semesters, Subjects data
    ├── validators.js       # Form validation rules
    ├── formatters.js       # Date, file size formatting
    └── fileUtils.js        # File type checking, size validation
```

---

## Part 2: Context Strategy (Minimize Bloat)

### The 4 Core Contexts:

```javascript
// contexts/ProgramContext.jsx
export const ProgramContext = createContext();

export function ProgramProvider({ children }) {
  const [program, setProgram] = useState('bsc-csit');
  const [semester, setSemester] = useState(1);
  const [subject, setSubject] = useState(null);
  const [activeTab, setActiveTab] = useState('notes'); // 'notes', 'lab-reports', 'qa'

  return (
    <ProgramContext.Provider value={{ program, setProgram, semester, setSemester, subject, setSubject, activeTab, setActiveTab }}>
      {children}
    </ProgramContext.Provider>
  );
}
```

```javascript
// contexts/AuthContext.jsx
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [wallet, setWallet] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (via Magic Link)
    // Set user & wallet
  }, []);

  return (
    <AuthContext.Provider value={{ user, wallet, isLoggedIn, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
```

```javascript
// contexts/ReputationContext.jsx
export const ReputationContext = createContext();

export function ReputationProvider({ children }) {
  const [reputation, setReputation] = useState(0);
  const [badges, setBadges] = useState([]);
  const { wallet } = useContext(AuthContext);

  useEffect(() => {
    // Sync reputation from Supabase every 5 seconds
    if (!wallet) return;

    const fetchReputation = async () => {
      const { data } = await supabase
        .from('users')
        .select('reputation_score')
        .eq('wallet_address', wallet)
        .single();
      setReputation(data?.reputation_score || 0);
    };

    const interval = setInterval(fetchReputation, 5000);
    return () => clearInterval(interval);
  }, [wallet]);

  return (
    <ReputationContext.Provider value={{ reputation, badges }}>
      {children}
    </ReputationContext.Provider>
  );
}
```

### Usage in App:

```javascript
function App() {
  return (
    <AuthProvider>
      <ProgramProvider>
        <ReputationProvider>
          <NotificationProvider>
            <MainLayout>
              <Routes />
            </MainLayout>
          </NotificationProvider>
        </ReputationProvider>
      </ProgramProvider>
    </AuthProvider>
  );
}
```

**Maximum 4-5 contexts. Don't exceed this.**

---

## Part 3: Reusable Components Example

### Single Component, Multiple Purposes: DocumentUpload.jsx

```javascript
// components/features/documents/DocumentUpload.jsx
import { useContext, useState } from 'react';
import { ProgramContext } from '../../../contexts/ProgramContext';
import { AuthContext } from '../../../contexts/AuthContext';
import { Button } from '../../common/Button';
import { FileUploader } from '../../common/FileUploader';
import { useDocuments } from './hooks/useDocuments';

export function DocumentUpload() {
  const { subject, activeTab } = useContext(ProgramContext);
  const { wallet } = useContext(AuthContext);
  const { uploadDocument, isUploading } = useDocuments();

  // Configuration based on activeTab (notes or lab-reports)
  const config = {
    notes: {
      title: 'Upload Study Notes',
      description: 'Share your class notes and study materials',
      acceptedFormats: ['.pdf', '.docx', '.txt'],
      maxSize: 10 * 1024 * 1024,
      reputation: 10,
    },
    'lab-reports': {
      title: 'Upload Lab Report',
      description: 'Share your lab work and findings',
      acceptedFormats: ['.pdf', '.docx', '.xlsx'],
      maxSize: 20 * 1024 * 1024,
      reputation: 15,
    },
  };

  const current = config[activeTab];

  const handleUpload = async (file, title, description) => {
    try {
      await uploadDocument({
        file,
        title,
        description,
        subject,
        documentType: activeTab,
        reputationEarned: current.reputation,
      });
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div className="upload-section">
      <h2>{current.title}</h2>
      <p>{current.description}</p>

      <div className="form">
        <input type="text" placeholder="Document Title" required />
        <textarea placeholder="Description (optional)" />

        <FileUploader
          acceptedFormats={current.acceptedFormats}
          maxSize={current.maxSize}
          onUpload={handleUpload}
        />

        <div className="info">
          <p>💡 Earn +{current.reputation} reputation points when uploaded</p>
          <p>📦 Max file size: {(current.maxSize / 1024 / 1024).toFixed(1)}MB</p>
        </div>

        <Button variant="primary" disabled={isUploading}>
          {isUploading ? 'Uploading...' : 'Upload'}
        </Button>
      </div>
    </div>
  );
}
```

**Key insight:** Same component, different config based on `activeTab` (conditional rendering inside component)

### Shared Hook: useDocuments.js

```javascript
// components/features/documents/hooks/useDocuments.js
import { useContext, useState } from 'react';
import { AuthContext } from '../../../../contexts/AuthContext';
import { api } from '../../../../services/api';
import { firebase } from '../../../../services/firebase';

export function useDocuments() {
  const { wallet } = useContext(AuthContext);
  const [isUploading, setIsUploading] = useState(false);
  const [documents, setDocuments] = useState([]);

  const uploadDocument = async ({
    file,
    title,
    description,
    subject,
    documentType, // 'notes' or 'lab-reports'
    reputationEarned,
  }) => {
    setIsUploading(true);
    try {
      // 1. Upload file to Firebase
      const fileUrl = await firebase.uploadFile(
        `/${documentType}/${subject}/${wallet}/${file.name}`,
        file
      );

      // 2. Save metadata to Supabase
      const { data, error } = await api.post('/documents', {
        title,
        description,
        subject,
        documentType,
        fileUrl,
        fileSize: file.size,
        fileFormat: file.type,
      });

      // 3. Claim reputation on Solana
      await api.post('/api/claim-reputation', {
        user_wallet: wallet,
        reputation_amount: reputationEarned,
        reason: `Upload ${documentType}`,
      });

      setDocuments([...documents, data]);
      return data;
    } finally {
      setIsUploading(false);
    }
  };

  const fetchDocuments = async (subject, documentType) => {
    const { data } = await api.get('/documents', {
      subject,
      documentType,
      sortBy: 'newest', // or 'upvoted'
    });
    setDocuments(data);
    return data;
  };

  const upvoteDocument = async (documentId) => {
    await api.post(`/documents/${documentId}/upvote`);
    // Refresh reputation
  };

  return {
    documents,
    uploadDocument,
    fetchDocuments,
    upvoteDocument,
    isUploading,
  };
}
```

---

## Part 4: Data Storage Strategy

### Supabase (PostgreSQL)

**Users Table:**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  wallet_address TEXT UNIQUE,
  email TEXT,
  reputation_score INT DEFAULT 0,
  total_uploads INT DEFAULT 0,
  total_answers INT DEFAULT 0,
  created_at TIMESTAMP
);
```

**Documents Table (Notes + Lab Reports):**
```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  program TEXT, -- 'bsc-csit' or 'bca'
  semester INT,
  subject TEXT,
  document_type TEXT, -- 'notes' or 'lab-reports'
  title TEXT,
  description TEXT,
  file_url TEXT,        -- From Firebase
  file_size INT,        -- In KB
  file_format TEXT,     -- '.pdf', '.docx', etc
  upvotes INT DEFAULT 0,
  downvotes INT DEFAULT 0,
  created_at TIMESTAMP
);
```

**Questions Table:**
```sql
CREATE TABLE questions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  program TEXT,
  semester INT,
  subject TEXT,
  title TEXT,
  content TEXT,
  upvotes INT DEFAULT 0,
  view_count INT DEFAULT 0,
  created_at TIMESTAMP
);
```

**Answers Table:**
```sql
CREATE TABLE answers (
  id UUID PRIMARY KEY,
  question_id UUID REFERENCES questions(id),
  user_id UUID REFERENCES users(id),
  content TEXT,
  upvotes INT DEFAULT 0,
  is_accepted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP
);
```

### Firebase Storage

```
/notes/{program}/{semester}/{subject}/{user_id}/{filename}
/lab-reports/{program}/{semester}/{subject}/{user_id}/{filename}
/qa/{question_id}/images/{filename}
```

### Solana Devnet (via your Anchor program)

- UserReputation PDA: Stores wallet_address, reputation_score, total_uploads, total_answers
- Badge PDA: Stores awarded achievements (Bronze, Silver, Gold badges)

---

## Part 5: File Compression APIs

Install:
```bash
npm install pdf-lib browser-image-compression jszip pako
```

```javascript
// services/compression.js
import PDFDocument from 'pdf-lib';
import imageCompression from 'browser-image-compression';
import JSZip from 'jszip';
import pako from 'pako';

export async function compressPDF(file) {
  try {
    const bytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(bytes);
    const compressedPdf = await pdfDoc.save();
    return new Blob([compressedPdf], { type: 'application/pdf' });
  } catch (error) {
    console.warn('PDF compression failed, using original:', error);
    return file;
  }
}

export async function compressImage(file) {
  try {
    return await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
    });
  } catch (error) {
    console.warn('Image compression failed, using original:', error);
    return file;
  }
}

export async function optimizeFileForUpload(file) {
  if (file.type.includes('pdf')) {
    return await compressPDF(file);
  }
  if (file.type.includes('image')) {
    return await compressImage(file);
  }
  if (file.size > 5 * 1024 * 1024) {
    // > 5MB: try gzip
    return await gzipCompress(file);
  }
  return file;
}
```

---

## Part 6: Multi-File Type Support

```javascript
// components/common/FileUploader.jsx
import { useRef, useState } from 'react';
import { optimizeFileForUpload } from '../../services/compression';
import { Button } from './Button';

export function FileUploader({ acceptedFormats, maxSize, onUpload }) {
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);

  const validateFile = (file) => {
    const ext = '.' + file.name.split('.').pop().toLowerCase();
    if (!acceptedFormats.includes(ext)) {
      throw new Error(`Format not supported. Accepted: ${acceptedFormats.join(', ')}`);
    }
    if (file.size > maxSize) {
      throw new Error(`File too large. Max: ${(maxSize / 1024 / 1024).toFixed(1)}MB`);
    }
  };

  const handleFiles = async (files) => {
    try {
      for (let file of files) {
        validateFile(file);
        const optimized = await optimizeFileForUpload(file);
        console.log(`Original: ${(file.size / 1024).toFixed(2)}KB → Compressed: ${(optimized.size / 1024).toFixed(2)}KB`);
        onUpload(optimized);
      }
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <div
      className={`file-uploader ${isDragging ? 'dragging' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleFiles(e.dataTransfer.files);
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedFormats.join(',')}
        onChange={(e) => handleFiles(e.target.files)}
        hidden
      />
      <div onClick={() => fileInputRef.current.click()}>
        <p>📁 Drag files here or click to upload</p>
        <p className="meta">Formats: {acceptedFormats.join(', ')} | Max: {(maxSize / 1024 / 1024).toFixed(1)}MB</p>
      </div>
    </div>
  );
}
```

---

## Part 7: Reusable Button Component

```javascript
// components/common/Button.jsx
export function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  loading = false,
  className = '',
}) {
  const variants = {
    primary: 'bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300',
    secondary: 'bg-gray-300 text-black hover:bg-gray-400 disabled:bg-gray-200',
    danger: 'bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300',
    success: 'bg-green-500 text-white hover:bg-green-600 disabled:bg-green-300',
    ghost: 'bg-transparent text-blue-500 border border-blue-500 hover:bg-blue-50',
  };

  const sizes = {
    sm: 'px-2 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={`button ${variants[variant]} ${sizes[size]} rounded font-semibold transition ${className}`}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading ? '⏳ Loading...' : children}
    </button>
  );
}

// Usage everywhere:
// <Button variant="primary" size="md" onClick={handleUpload}>Upload</Button>
// <Button variant="danger" size="sm" onClick={handleDelete}>Delete</Button>
// <Button variant="ghost" loading={isLoading}>Processing...</Button>
```

---

## Part 8: Notes + Lab Reports (Shared Logic)

The key: **Notes and Lab Reports are identical in structure.** Only the metadata differs.

```javascript
// Both use the same DocumentUpload, DocumentCard, DocumentList components
// Only config changes:

config = {
  notes: { title: 'Notes', reputation: 10, maxSize: 10MB },
  'lab-reports': { title: 'Lab Reports', reputation: 15, maxSize: 20MB },
}

// In DocumentUpload.jsx:
const current = config[activeTab]; // Get config
// Render same UI with different labels/limits
```

---

## Scaling Strategy

**Day 1-7:** Build Notes + Lab Reports (same code path)
**Day 8-9:** Add Q&A (different code path, but similar patterns)
**Day 10-11:** Add Assignments (copy Notes pattern)
**Day 12+:** Add Leaderboard, Search, Admin features

Each new feature = new folder under `components/features/`
Reuse hooks, contexts, and common components.

---

## Summary

- **4 contexts max** → Avoid context hell
- **Reusable components** → One Button/Card/Uploader for all
- **Shared hooks** → useDocuments() for Notes + Lab Reports
- **Strategic storage** → Supabase (metadata), Firebase (files), Solana (reputation)
- **Compression first** → Optimize before uploading
- **Conditional rendering** → Same component, different config

This architecture scales to 10+ features with <30% code duplication.
