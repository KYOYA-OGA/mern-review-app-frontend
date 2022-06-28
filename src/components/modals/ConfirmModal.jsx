import React from 'react';
import { ImSpinner3 } from 'react-icons/im';
import ModalContainer from './ModalContainer';

const commonClass = 'px-3 py-1 text-white rounded';

export default function ConfirmModal({
  visible,
  onClose,
  busy,
  onConfirm,
  onCancel,
  title,
  subtitle,
}) {
  return (
    <ModalContainer ignoreContainer visible={visible} onClose={onClose}>
      <div className="dark:bg-primary bg-white rounded p-5">
        <h1 className="text-red-400 font-semibold text-xl">{title}</h1>
        <p className="text-secondary dark:text-white text-sm">{subtitle}</p>

        <div className="mt-3 flex items-center space-x-3">
          {busy ? (
            <p className="flex items-center space-x-2 dark:text-white text-primary">
              <ImSpinner3 className="animate-spin" />
              <span>Please wait...</span>
            </p>
          ) : (
            <>
              {' '}
              <button
                onClick={onConfirm}
                className={`${commonClass} bg-red-500`}
                type="button"
              >
                Confirm
              </button>
              <button
                onClick={onCancel}
                className={`${commonClass} bg-blue-500`}
                type="button"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </ModalContainer>
  );
}
