'use client';

import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface CopyButtonProps {
  text: string;
  label: string;
}

export function CopyButton({ text, label }: CopyButtonProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(label);
    } catch (error) {
      toast.error('Failed to copy text');
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={handleCopy}>
      {label}
    </Button>
  );
}