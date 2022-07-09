import React, { useState } from 'react';
import { updateReview } from '../../api/review';
import { useNotification } from '../../hooks';
import RatingForm from '../form/RatingForm';
import ModalContainer from './ModalContainer';

export default function EditRatingModal({
  visible,
  initialState,
  onClose,
  onSuccess,
}) {
  const [busy, setBusy] = useState(false);
  const { updateNotification } = useNotification();

  const handleSubmit = async (data) => {
    setBusy(true);
    const { error, message } = await updateReview(initialState.id, data);
    setBusy(false);
    if (error) return updateNotification('error', error);

    onSuccess({ ...data });
    updateNotification('success', message);
    onClose();
  };
  return (
    <ModalContainer visible={visible} onClose={onClose} ignoreContainer>
      <RatingForm
        initialState={initialState}
        busy={busy}
        onSubmit={handleSubmit}
      />
    </ModalContainer>
  );
}
