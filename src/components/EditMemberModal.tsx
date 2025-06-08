
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FamilyMember } from '@/types';
import { Edit, User, Calendar, Mail, Phone, MapPin } from 'lucide-react';

interface EditMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: FamilyMember;
  onUpdate: (member: FamilyMember) => void;
}

const relationshipTypes = [
  'Parent', 'Child', 'Sibling', 'Spouse', 'Grandparent', 'Grandchild',
  'Uncle', 'Aunt', 'Cousin', 'Other'
];

const EditMemberModal: React.FC<EditMemberModalProps> = ({ isOpen, onClose, member, onUpdate }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    relation: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
  });

  useEffect(() => {
    if (member) {
      setFormData({
        fullName: member.fullName,
        dateOfBirth: new Date(member.dateOfBirth).toISOString().split('T')[0],
        relation: member.relation,
        email: member.contactInfo.email || '',
        phone: member.contactInfo.phone || '',
        address: member.contactInfo.address || '',
        notes: member.notes,
      });
    }
  }, [member]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const updatedMember: FamilyMember = {
      ...member,
      fullName: formData.fullName,
      dateOfBirth: new Date(formData.dateOfBirth),
      relation: formData.relation,
      contactInfo: {
        email: formData.email || undefined,
        phone: formData.phone || undefined,
        address: formData.address || undefined,
      },
      notes: formData.notes,
    };

    onUpdate(updatedMember);
    onClose();
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl border-0 shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 p-3 connection-gradient rounded-full w-fit">
            <Edit className="w-8 h-8 text-white" />
          </div>
          <DialogTitle className="text-2xl font-bold">Edit Family Member</DialogTitle>
          <DialogDescription>
            Update information for {member.fullName}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-sm font-medium">
                  Full Name *
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter full name"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-sm font-medium">
                  Date of Birth *
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth}
                    onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                    className="pl-10"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="relation" className="text-sm font-medium">
                Relationship to Family *
              </Label>
              <Select value={formData.relation} onValueChange={(value) => handleInputChange('relation', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  {relationshipTypes.map((type) => (
                    <SelectItem key={type} value={type.toLowerCase()}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Contact Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-sm font-medium">
                Phone Number
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter phone number"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-sm font-medium">
                Address
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="address"
                  type="text"
                  placeholder="Enter address"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Additional Information</h3>
            
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">
                Notes
              </Label>
              <Textarea
                id="notes"
                placeholder="Any additional notes about this family member..."
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                rows={3}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-full sm:w-auto connection-gradient hover:opacity-90"
              disabled={!formData.fullName || !formData.dateOfBirth || !formData.relation}
            >
              Update Member
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditMemberModal;
