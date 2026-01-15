import { useState } from 'react';

export type CopiedType = 'email' | 'phone' | 'error' | null;

export function useCopyToast(timeout = 2000) {
  const [copiedField, setCopiedField] = useState<CopiedType>(null);

  async function copyToClipboard(value: string, field: Exclude<CopiedType, null>) {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
    } catch {
      setCopiedField('error');
    } finally {
      setTimeout(() => setCopiedField(null), timeout);
    }
  }

  return {
    copiedField,
    copyToClipboard,
  };
}
