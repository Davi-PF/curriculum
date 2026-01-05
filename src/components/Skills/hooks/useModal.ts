import { useState, useEffect } from 'react';

export function useModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const openModal = () => {
    setIsClosing(false);
    setTimeout(() => setIsOpen(true), 10);
  };

  const closeModal = () => {
    setIsOpen(false);
    setIsClosing(true);
  };

  useEffect(() => {
    if (isClosing) {
      const timer = setTimeout(() => {
        setIsClosing(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [isClosing]);

  return {
    isOpen,
    isClosing,
    openModal,
    closeModal,
    isModalVisible: isOpen || isClosing
  };
}