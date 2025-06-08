
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Family } from '@/types';

interface CreateFamilyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (family: Omit<Family, 'id' | 'createdAt' | 'updatedAt' | 'members'>) => void;
}

const CreateFamilyModal: React.FC<CreateFamilyModalProps> = ({
  isOpen,
  onClose,
  onCreate
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) return;

    onCreate({
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      createdBy: '' // Will be set by parent component
    });

    setFormData({ name: '', description: '' });
    onClose();
  };

  const handleClose = () => {
    setFormData({ name: '', description: '' });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Family</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="familyName">Family Name *</Label>
            <Input
              id="familyName"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., The Smith Family"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="familyDescription">Description</Label>
            <Textarea
              id="familyDescription"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="A brief description of this family branch..."
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="family-gradient hover:opacity-90"
              disabled={!formData.name.trim()}
            >
              Create Family
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateFamilyModal;
