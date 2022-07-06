import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { addReview } from '../../api/review';
import { useNotification } from '../../hooks';
import RatingForm from '../form/RatingForm';
import ModalContainer from './ModalContainer';

export default function AddRatingModal({ visible, onClose, onSuccess }) {
  const [busy, setBusy] = useState(false);
  const { movieId } = useParams();
  const { updateNotification } = useNotification();

  const handleSubmit = async (data) => {
    setBusy(true);
    const { error, message, reviews } = await addReview(movieId, data);
    if (error) return updateNotification('error', error);

    updateNotification('success', message);
    onSuccess(reviews);
    setBusy(false);
    onClose();
  };
  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
      <RatingForm busy={busy} onSubmit={handleSubmit} />
    </ModalContainer>
  );
}
