import React, { useState, useEffect } from 'react';
import { Family, FamilyRelationship } from '@/types';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Link as LinkIcon } from 'lucide-react';

interface FamilyRelationshipsProps {
  currentFamily: Family;
  allFamilies: Family[];
  onUpdateFamily: (updatedFamily: Family) => void;
}

const FamilyRelationships: React.FC<FamilyRelationshipsProps> = ({
  currentFamily,
  allFamilies,
  onUpdateFamily,
}) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFamilyId, setSelectedFamilyId] = useState('');
  const [relationshipType, setRelationshipType] = useState<FamilyRelationship['relationshipType']>('other');
  const [description, setDescription] = useState('');

  // Filter out current family and already related families
  const availableFamilies = allFamilies.filter(
    family => 
      family.id !== currentFamily.id && 
      !currentFamily.relatedFamilies.some(rel => rel.familyId === family.id)
  );

  const addRelationship = () => {
    if (!selectedFamilyId || !relationshipType) return;

    const newRelationship: FamilyRelationship = {
      familyId: selectedFamilyId,
      relationshipType,
      description: description || undefined,
      createdAt: new Date(),
    };

    const updatedFamily = {
      ...currentFamily,
      relatedFamilies: [...currentFamily.relatedFamilies, newRelationship],
      updatedAt: new Date(),
    };

    onUpdateFamily(updatedFamily);
    setIsDialogOpen(false);
    resetForm();
  };

  const removeRelationship = (familyId: string) => {
    const updatedFamily = {
      ...currentFamily,
      relatedFamilies: currentFamily.relatedFamilies.filter(rel => rel.familyId !== familyId),
      updatedAt: new Date(),
    };
    onUpdateFamily(updatedFamily);
  };

  const resetForm = () => {
    setSelectedFamilyId('');
    setRelationshipType('other');
    setDescription('');
  };

  const getFamilyName = (familyId: string) => {
    const family = allFamilies.find(f => f.id === familyId);
    return family ? family.name : 'Unknown Family';
  };

  return (
    <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Family Relationships</CardTitle>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2">
                <Plus className="w-4 h-4" />
                Add Relationship
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Link to Another Family</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label>Select Family</Label>
                  <Select 
                    value={selectedFamilyId} 
                    onValueChange={setSelectedFamilyId}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a family" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableFamilies.map(family => (
                        <SelectItem key={family.id} value={family.id}>
                          {family.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Relationship Type</Label>
                  <Select 
                    value={relationshipType} 
                    onValueChange={(value: FamilyRelationship['relationshipType']) => setRelationshipType(value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select relationship type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="parent">Parent Family</SelectItem>
                      <SelectItem value="child">Child Family</SelectItem>
                      <SelectItem value="sibling">Sibling Family</SelectItem>
                      <SelectItem value="extended">Extended Family</SelectItem>
                      <SelectItem value="other">Other Relationship</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Description (Optional)</Label>
                  <Input 
                    placeholder="E.g., Maternal side, Father's side, etc." 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={addRelationship}
                    disabled={!selectedFamilyId || !relationshipType}
                  >
                    <LinkIcon className="w-4 h-4 mr-2" />
                    Link Families
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {currentFamily.relatedFamilies.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>No family relationships added yet.</p>
            <p className="text-sm mt-2">Click "Add Relationship" to link this family to another family.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {currentFamily.relatedFamilies.map((relationship, index) => (
              <div 
                key={`${relationship.familyId}-${index}`}
                className="flex items-center justify-between p-3 bg-muted/30 rounded-lg"
              >
                <div>
                  <p className="font-medium">{getFamilyName(relationship.familyId)}</p>
                  <p className="text-sm text-muted-foreground capitalize">
                    {relationship.relationshipType}
                    {relationship.description && ` • ${relationship.description}`}
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-destructive hover:text-destructive/80"
                  onClick={() => removeRelationship(relationship.familyId)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FamilyRelationships;
