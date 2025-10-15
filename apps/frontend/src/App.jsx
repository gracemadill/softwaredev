import { useMemo, useState } from 'react';

const DEFAULT_LANGUAGE = 'French';

function useApi() {
  return useMemo(() => {
    const baseUrl = import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:4000';

    async function request(path, options = {}) {
      const res = await fetch(`${baseUrl}${path}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...(options.headers || {}),
        },
      });

      if (!res.ok) {
        const detail = await res.json().catch(() => ({}));
        throw new Error(detail.error || `Request failed (${res.status})`);
      }

      return res.json();
    }

    async function upload(path, token, formData) {
      const res = await fetch(`${baseUrl}${path}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) {
        const detail = await res.json().catch(() => ({}));
        throw new Error(detail.error || `Upload failed (${res.status})`);
      }

      return res.json();
    }

    return { request, upload };
  }, []);
}

export default function App() {
  const api = useApi();
  const [token, setToken] = useState(null);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loginStatus, setLoginStatus] = useState(null);
  const [uploadStatus, setUploadStatus] = useState(null);
  const [documentText, setDocumentText] = useState('');
  const [translationStatus, setTranslationStatus] = useState(null);
  const [translatedText, setTranslatedText] = useState('');
  const [targetLanguage, setTargetLanguage] = useState(DEFAULT_LANGUAGE);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoginStatus('Signing in...');
    try {
      const data = await api.request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      setToken(data.token);
      setLoginStatus('Signed in successfully.');
    } catch (err) {
      setToken(null);
      setLoginStatus(err.message);
    }
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (!token) {
      setUploadStatus('Please sign in first.');
      return;
    }

    const file = event.target.elements.file.files[0];
    if (!file) {
      setUploadStatus('Choose a PDF or image file.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('purpose', 'ocr');

    setUploadStatus('Uploading and extracting text...');
    try {
      const data = await api.upload('/documents/upload', token, formData);
      setDocumentText(data.text || '');
      setUploadStatus('Text extracted successfully.');
    } catch (err) {
      setUploadStatus(err.message);
    }
  };

  const handleTranslate = async (event) => {
    event.preventDefault();
    if (!token) {
      setTranslationStatus('Please sign in first.');
      return;
    }

    if (!documentText.trim()) {
      setTranslationStatus('Upload a document first so we have text to translate.');
      return;
    }

    setTranslationStatus(`Translating to ${targetLanguage}...`);
    try {
      const data = await api.request('/ai/translate', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ text: documentText, targetLanguage }),
      });
      setTranslatedText(data.text || '');
      setTranslationStatus('Translation ready.');
    } catch (err) {
      setTranslationStatus(err.message);
    }
  };

  return (
    <div className="app-shell">
      <h1>Easy Read Toolkit</h1>
      <p>
        Sign in with the shared credentials, upload a PDF or image, and the toolkit will run OCR and translation using the
        backend services.
      </p>

      <section>
        <h2>1. Sign in</h2>
        <form onSubmit={handleLogin}>
          <label>
            Email address
            <input
              type="email"
              value={credentials.email}
              onChange={(event) => setCredentials((prev) => ({ ...prev, email: event.target.value }))}
              placeholder="admin@example.com"
              required
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={credentials.password}
              onChange={(event) => setCredentials((prev) => ({ ...prev, password: event.target.value }))}
              placeholder="••••••"
              required
            />
          </label>
          <button type="submit">Sign in</button>
          {loginStatus && <div className={`status ${token ? '' : 'error'}`}>{loginStatus}</div>}
        </form>
      </section>

      <section>
        <h2>2. Upload document</h2>
        <form onSubmit={handleUpload}>
          <label>
            Choose PDF or image
            <input name="file" type="file" accept=".pdf,image/*" />
          </label>
          <button type="submit" disabled={!token}>
            Run OCR
          </button>
          {uploadStatus && <div className={`status ${uploadStatus.includes('successfully') ? '' : 'error'}`}>{uploadStatus}</div>}
        </form>
        {documentText && (
          <div className="output-card" style={{ marginTop: '1rem' }}>
            <strong>Extracted text:</strong>
            <div style={{ marginTop: '0.5rem' }}>{documentText}</div>
          </div>
        )}
      </section>

      <section>
        <h2>3. Translate</h2>
        <form onSubmit={handleTranslate}>
          <label>
            Target language
            <select value={targetLanguage} onChange={(event) => setTargetLanguage(event.target.value)}>
              <option>French</option>
              <option>Spanish</option>
              <option>German</option>
              <option>Italian</option>
              <option>Polish</option>
              <option>Welsh</option>
            </select>
          </label>
          <button type="submit" disabled={!token || !documentText}>
            Translate text
          </button>
          {translationStatus && (
            <div className={`status ${translationStatus.includes('ready') ? '' : 'error'}`}>{translationStatus}</div>
          )}
        </form>
        {translatedText && (
          <div className="output-card" style={{ marginTop: '1rem' }}>
            <strong>Translation:</strong>
            <div style={{ marginTop: '0.5rem' }}>{translatedText}</div>
          </div>
        )}
      </section>
    </div>
  );
}
