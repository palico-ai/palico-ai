'use client'

import { useState } from 'react';

interface DialogControllerReturn {
  isOpen: boolean
  open: () => void
  close: () => void
}

export const useDialogController = (): DialogControllerReturn => {
  const [isOpen, setIsOpen] = useState(false);
  const open = (): void => { setIsOpen(true); };
  const close = (): void => { setIsOpen(false); };
  return { isOpen, open, close };
}
