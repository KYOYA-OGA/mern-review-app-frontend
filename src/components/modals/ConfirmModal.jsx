import React from 'react';
import ModalContainer from './ModalContainer';

export default function ConfirmModal({ visible, onClose }) {
  return <ModalContainer visible={visible} onClose={onClose}></ModalContainer>;
}
