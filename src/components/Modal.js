'use client';

import { useEffect } from 'react';
import { X } from '@phosphor-icons/react';
import styles from './Modal.module.css';

export default function Modal({ isOpen, onClose, title, children }) {
  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className={`${styles.overlay} ${styles.show}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`${styles.modal} animate-scale-in`}>
        {/* Gradient top accent */}
        <div className={styles.modalAccent} />

        {/* Header */}
        {title && (
          <div className={styles.modalHeader}>
            <h3 className={styles.modalTitle}>{title}</h3>
            <button className={styles.closeBtn} onClick={onClose} id="btn-close-modal" title="Tutup">
              <X size={16} weight="bold" />
            </button>
          </div>
        )}

        {/* Body */}
        <div className={styles.modalBody}>
          {children}
        </div>
      </div>
    </div>
  );
}
