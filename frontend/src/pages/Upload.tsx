import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useAuditLog } from '../context/AuditLogContext';

const Upload = () => {
  const { user, token } = useAuth();
  const { refreshAuditLog } = useAuditLog();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!user) {
    return (
      <div>
        <h1>Upload a Doodle</h1>
        <p className='muted'>
          You need to <Link to='/login'>sign in</Link> to upload doodles.
        </p>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    if (selected) {
      setPreview(URL.createObjectURL(selected));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select an image file');
      return;
    }
    setError(null);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('price', price);
      formData.append('imagePath', file);

      const res = await fetch('/api/doodles', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Upload failed');
      }

      const doodle = await res.json();
      refreshAuditLog();
      navigate(`/doodle/${doodle.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='upload-page'>
      <h1>Upload a Doodle</h1>
      <p className='muted'>Share your art with the market.</p>

      <form className='upload-form' onSubmit={handleSubmit}>
        <div className='form-field'>
          <label htmlFor='title'>Title</label>
          <input
            id='title'
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={80}
            required
          />
        </div>

        <div className='form-field'>
          <label htmlFor='description'>Description</label>
          <textarea
            id='description'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            maxLength={500}
          />
        </div>

        <div className='form-field'>
          <label htmlFor='price'>Price ($)</label>
          <input
            id='price'
            type='number'
            min='0.01'
            step='0.01'
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />
        </div>

        <div className='form-field'>
          <label>Image</label>
          <div
            className='file-drop-zone'
            onClick={() => fileInputRef.current?.click()}
          >
            {preview ? (
              <img src={preview} alt='Preview' className='file-preview' />
            ) : (
              <span className='muted'>Click to select an image (max 5MB)</span>
            )}
          </div>
          <input
            ref={fileInputRef}
            type='file'
            accept='image/*'
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>

        {error && (
          <pre>
            <code className='error'>Error: {error}</code>
          </pre>
        )}

        <button type='submit' className='btn default' disabled={loading}>
          {loading ? 'Uploading…' : 'Upload Doodle'}
        </button>
      </form>
    </div>
  );
};

export default Upload;
