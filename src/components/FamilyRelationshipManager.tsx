import React, { useState, useEffect } from 'react';
import { Family, FamilyRelationship } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, X, Link2, Unlink } from 'lucide-react';

interface FamilyRelationshipManagerProps {
  isOpen: boolean;
  onClose: () => void;
  family: Family;
  allFamilies: Family[];
  onAddRelationship: (relationship: Omit<FamilyRelationship, 'createdAt'>) => void;
  onRemoveRelationship: (familyId: string) => void;
}

const FamilyRelationshipManager: React.FC<FamilyRelationshipManagerProps> = ({
  isOpen,
  onClose,
  family,
  allFamilies,
  onAddRelationship,
  onRemoveRelationship
}) => {
  const [selectedFamilyId, setSelectedFamilyId] = useState('');
  const [relationshipType, setRelationshipType] = useState<FamilyRelationship['relationshipType']>('related');
  const [notes, setNotes] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // Filter out current family and already related families
  const availableFamilies = allFamilies.filter(
    f => f.id !== family.id && 
         !family.relationships.some(r => r.familyId === f.id)
  );

  const handleAddRelationship = () => {
    if (!selectedFamilyId || !relationshipType) return;
    
    onAddRelationship({
      familyId: selectedFamilyId,
      relationshipType,
      notes: notes.trim() || undefined
    });
    
    // Reset form
    setSelectedFamilyId('');
    setRelationshipType('related');
    setNotes('');
    setIsAdding(false);
  };

  const getRelationshipLabel = (type: string) => {
    switch (type) {
      case 'parent': return 'Parent Family';
      case 'child': return 'Child Family';
      case 'merged': return 'Merged Family';
      default: return 'Related Family';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Manage Family Relationships</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Link {family.name} to other families to show relationships
          </p>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Current Relationships */}
          <div>
            <h3 className="text-sm font-medium mb-3">Current Relationships</h3>
            {family.relationships.length === 0 ? (
              <p className="text-sm text-muted-foreground">No relationships yet. Add one below.</p>
            ) : (
              <div className="space-y-2">
                {family.relationships.map((rel) => {
                  const relatedFamily = allFamilies.find(f => f.id === rel.familyId);
                  if (!relatedFamily) return null;
                  
                  return (
                    <div key={rel.familyId} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <div className="font-medium">{relatedFamily.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {getRelationshipLabel(rel.relationshipType)}
                          {rel.notes && ` • ${rel.notes}`}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onRemoveRelationship(rel.familyId)}
                        className="text-destructive hover:text-destructive/90"
                      >
                        <Unlink className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>


          {/* Add Relationship Form */}
          {isAdding ? (
            <div className="space-y-4 pt-4 border-t">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="relatedFamily">Family</Label>
                  <Select
                    value={selectedFamilyId}
                    onValueChange={setSelectedFamilyId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a family" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFamilies.map((f) => (
                        <SelectItem key={f.id} value={f.id}>
                          {f.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="relationshipType">Relationship Type</Label>
                  <Select
                    value={relationshipType}
                    onValueChange={(value: FamilyRelationship['relationshipType']) => 
                      setRelationshipType(value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="related">Related</SelectItem>
                      <SelectItem value="parent">Parent Family</SelectItem>
                      <SelectItem value="child">Child Family</SelectItem>
                      <SelectItem value="merged">Merged Family</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Input
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., Cousin's family, In-laws, etc."
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAdding(false);
                    setSelectedFamilyId('');
                    setRelationshipType('related');
                    setNotes('');
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddRelationship}
                  disabled={!selectedFamilyId || !relationshipType}
                >
                  <Link2 className="w-4 h-4 mr-2" />
                  Add Relationship
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              className="w-full mt-2"
              onClick={() => setIsAdding(true)}
              disabled={availableFamilies.length === 0}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Family Relationship
              {availableFamilies.length === 0 && ' (No available families)'}
            </Button>
          )}
        </div>

        <DialogFooter>
          <Button onClick={onClose}>Done</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FamilyRelationshipManager;
