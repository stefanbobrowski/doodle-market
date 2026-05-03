import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Button from './Button';
import Divider from './Divider';
import type { Doodle } from '../types/doodle';
import { useAuth } from '../context/AuthContext';
import { useAuditLog } from '../context/AuditLogContext';

interface DoodleDetailsProps {
  doodle: Doodle;
}

const DoodleDetails = ({ doodle }: DoodleDetailsProps) => {
  const { user, token, updateBalance } = useAuth();
  const { refreshAuditLog } = useAuditLog();
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

  // Purchase state
  const [purchasing, setPurchasing] = useState(false);
  const [purchaseEmail, setPurchaseEmail] = useState('');
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseSuccess, setPurchaseSuccess] = useState(false);

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
      refreshAuditLog();
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
      refreshAuditLog();
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
      refreshAuditLog();
      navigate('/');
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Delete failed');
      setDeleteLoading(false);
    }
  };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    setPurchaseError(null);
    setPurchaseLoading(true);
    try {
      const res = await fetch(`/api/doodles/${doodle.id}/purchase`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: purchaseEmail }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Purchase failed');
      updateBalance(data.user.balance);
      setPurchaseSuccess(true);
      refreshAuditLog();
    } catch (err) {
      setPurchaseError(err instanceof Error ? err.message : 'Purchase failed');
    } finally {
      setPurchaseLoading(false);
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
            <Button type='submit' disabled={editLoading}>
              {editLoading ? 'Saving…' : 'Save Changes'}
            </Button>
            <Button onClick={() => setEditing(false)}>Cancel</Button>
          </div>
        </form>
      ) : (
        <>
          <div className='doodle-title-row'>
            <h1>{doodle.title}</h1>
            {isOwner && (
              <div className='owner-actions'>
                <Button onClick={() => setEditing(true)}>Edit</Button>
                <Button variant='danger' onClick={() => setConfirmDelete(true)}>
                  Delete
                </Button>
                {confirmDelete ? (
                  <div className='confirm-delete'>
                    <h4>Delete this Doodle?</h4>
                    <div className='flex'>
                      <Button
                        variant='danger'
                        onClick={handleDelete}
                        disabled={deleteLoading}
                      >
                        {deleteLoading ? 'Deleting…' : 'Yes, Delete'}
                      </Button>
                      <Button
                        variant='default'
                        onClick={() => setConfirmDelete(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <></>
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
          <div className='doodle-stats'>
            <span>{doodle.views} views</span>
            <Divider orientation='vertical' />
            <span>{likes} likes</span>
            <Divider orientation='vertical' />
            <Button
              onClick={handleLike}
              disabled={liked}
              aria-label='Like this doodle'
            >
              👍 {liked ? 'Liked' : 'Like'}
            </Button>
          </div>
          <p className='doodle-description'>{doodle.description}</p>

          <p className='doodle-price'>Price: ${doodle.price.toFixed(2)}</p>

          {purchasing ? (
            <div className='purchase-modal'>
              {purchaseSuccess ? (
                <div className='purchase-success'>
                  <p>
                    🎉 Purchase complete! A confirmation has been sent to{' '}
                    <strong>{purchaseEmail}</strong>.
                  </p>
                  <Button
                    onClick={() => {
                      setPurchasing(false);
                      setPurchaseSuccess(false);
                      setPurchaseEmail('');
                    }}
                  >
                    Done
                  </Button>
                </div>
              ) : (
                <form className='purchase-form' onSubmit={handlePurchase}>
                  <h3>Complete Purchase</h3>
                  <p className='muted'>
                    <strong style={{ color: 'var(--price-color)' }}>
                      ${doodle.price.toFixed(2)}
                    </strong>{' '}
                    will be deducted from your balance.
                    {user && (
                      <>
                        {' '}
                        Your current balance:{' '}
                        <span style={{ color: 'var(--price-color)' }}>
                          ${user.balance.toFixed(2)}
                        </span>
                      </>
                    )}
                  </p>
                  {!user && (
                    <p className='muted'>
                      <Link to='/login'>Sign in</Link> to purchase this doodle.
                    </p>
                  )}
                  {user && (
                    <>
                      <div className='form-field'>
                        <label htmlFor='purchase-email'>
                          Email for receipt
                        </label>
                        <input
                          id='purchase-email'
                          type='email'
                          value={purchaseEmail}
                          onChange={(e) => setPurchaseEmail(e.target.value)}
                          placeholder='you@example.com'
                          required
                        />
                      </div>
                      {purchaseError && (
                        <pre>
                          <code className='error'>{purchaseError}</code>
                        </pre>
                      )}
                      <div className='purchase-actions'>
                        <Button
                          type='submit'
                          variant='special'
                          disabled={purchaseLoading}
                        >
                          {purchaseLoading ? 'Processing…' : 'Confirm Purchase'}
                        </Button>
                        <Button
                          onClick={() => {
                            setPurchasing(false);
                            setPurchaseError(null);
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  )}
                </form>
              )}
            </div>
          ) : (
            !isOwner && (
              <Button variant='special' onClick={() => setPurchasing(true)}>
                Buy Now
              </Button>
            )
          )}
        </>
      )}
    </div>
  );
};

export default DoodleDetails;
