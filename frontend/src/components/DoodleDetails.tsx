import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from './Button';
import Divider from './Divider';
import type { Doodle } from '../types/doodle';
import { useAuth } from '../context/AuthContext';

interface DoodleDetailsProps {
  doodle: Doodle;
}

const DoodleDetails = ({ doodle }: DoodleDetailsProps) => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const isOwner = user && (user.id === doodle.userId || user.role === 'admin');

  const [likes, setLikes] = useState(doodle.likes);
  const [liked, setLiked] = useState(false);

  // Edit state
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(doodle.title);
  const [editDescription, setEditDescription] = useState(doodle.description);
  const [editPrice, setEditPrice] = useState(String(doodle.price));
  const [editFile, setEditFile] = useState<File | null>(null);
  const [editPreview, setEditPreview] = useState<string | null>(null);
  const [editError, setEditError] = useState<string | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Delete state
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleLike = async () => {
    if (liked) return;
    try {
      const response = await fetch(`/api/doodles/${doodle.id}/like`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to like');
      const data = await response.json();
      setLikes(data.likes);
      setLiked(true);
    } catch (err) {
      console.error('Failed to increment like count', err);
    }
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    setEditFile(selected);
    setEditPreview(selected ? URL.createObjectURL(selected) : null);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditError(null);
    setEditLoading(true);
    try {
      const formData = new FormData();
      formData.append('title', editTitle);
      formData.append('description', editDescription);
      formData.append('price', editPrice);
      if (editFile) formData.append('imagePath', editFile);

      const res = await fetch(`/api/doodles/${doodle.id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Update failed');
      }

      // Reload the page to reflect updated data
      navigate(0);
    } catch (err) {
      setEditError(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleteLoading(true);
    setDeleteError(null);
    try {
      const res = await fetch(`/api/doodles/${doodle.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Delete failed');
      }
      navigate('/');
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Delete failed');
      setDeleteLoading(false);
    }
  };

  return (
    <div className='doodle-details'>
      {editing ? (
        <form className='edit-form' onSubmit={handleEditSubmit}>
          <h2>Edit Doodle</h2>
          <div className='form-field'>
            <label htmlFor='edit-title'>Title</label>
            <input
              id='edit-title'
              type='text'
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              maxLength={80}
              required
            />
          </div>
          <div className='form-field'>
            <label htmlFor='edit-description'>Description</label>
            <textarea
              id='edit-description'
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={4}
              maxLength={500}
            />
          </div>
          <div className='form-field'>
            <label htmlFor='edit-price'>Price ($)</label>
            <input
              id='edit-price'
              type='number'
              min='0.01'
              step='0.01'
              value={editPrice}
              onChange={(e) => setEditPrice(e.target.value)}
              required
            />
          </div>
          <div className='form-field'>
            <label>Replace Image (optional)</label>
            <div
              className='file-drop-zone'
              onClick={() => fileInputRef.current?.click()}
            >
              {editPreview ? (
                <img
                  src={editPreview}
                  alt='New preview'
                  className='file-preview'
                />
              ) : (
                <img
                  src={doodle.imagePath}
                  alt={doodle.title}
                  className='file-preview'
                />
              )}
            </div>
            <input
              ref={fileInputRef}
              type='file'
              accept='image/*'
              onChange={handleEditFileChange}
              style={{ display: 'none' }}
            />
          </div>
          {editError && (
            <pre>
              <code className='error'>Error: {editError}</code>
            </pre>
          )}
          <div className='edit-actions'>
            <button
              type='submit'
              className='btn default'
              disabled={editLoading}
            >
              {editLoading ? 'Saving…' : 'Save Changes'}
            </button>
            <button
              type='button'
              className='btn default'
              onClick={() => setEditing(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <div className='doodle-title-row'>
            <h1>{doodle.title}</h1>
            {isOwner && (
              <div className='owner-actions'>
                <button
                  className='btn default'
                  onClick={() => setEditing(true)}
                >
                  Edit
                </button>
                {confirmDelete ? (
                  <div className='confirm-delete'>
                    <span className='muted'>Are you sure?</span>
                    <button
                      className='btn danger'
                      onClick={handleDelete}
                      disabled={deleteLoading}
                    >
                      {deleteLoading ? 'Deleting…' : 'Yes, Delete'}
                    </button>
                    <button
                      className='btn default'
                      onClick={() => setConfirmDelete(false)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    className='btn danger'
                    onClick={() => setConfirmDelete(true)}
                  >
                    Delete
                  </button>
                )}
              </div>
            )}
          </div>

          {deleteError && (
            <pre>
              <code className='error'>Error: {deleteError}</code>
            </pre>
          )}

          <div className='doodle-image'>
            <img src={doodle.imagePath} alt={doodle.title} />
          </div>
          <p className='doodle-description'>{doodle.description}</p>
          <div className='doodle-stats'>
            <span>{doodle.views} views</span>
            <Divider orientation='vertical' />
            <span>{likes} likes</span>
          </div>

          <Button
            onClick={handleLike}
            disabled={liked}
            aria-label='Like this doodle'
          >
            👍 {liked ? 'Liked' : 'Like'}
          </Button>

          <p className='doodle-price'>Price: ${doodle.price.toFixed(2)}</p>

          <Button variant='special' onClick={() => alert('Buy now!')}>
            Buy Now
          </Button>
        </>
      )}
    </div>
  );
};

export default DoodleDetails;
