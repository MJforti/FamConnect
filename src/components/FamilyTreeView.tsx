import * as React from 'react';
import { Family, FamilyMember } from '@/types';
import FamilyTree from './FamilyTree';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FamilyTreeViewProps {
  families: Family[];
  selectedFamily: Family | null;
  onSelectFamily: (family: Family) => void;
  onUpdateMember: (member: FamilyMember) => void;
  onDeleteMember: (memberId: string) => void;
  canEdit: boolean;
}

const FamilyTreeView: React.FC<FamilyTreeViewProps> = ({
  families,
  selectedFamily,
  onSelectFamily,
  onUpdateMember,
  onDeleteMember,
  canEdit
}) => {
  const [showAllFamilies, setShowAllFamilies] = React.useState(false);
  
  // Get all members from selected family and optionally from related families
  const getAllMembers = React.useMemo(() => {
    if (!selectedFamily) return [];
    
    if (!showAllFamilies) return selectedFamily.members;
    
    // Get all related family IDs
    const relatedFamilyIds = selectedFamily.relationships.map(r => r.familyId);
    
    // Get all members from selected family and related families
    const allMembers = [...selectedFamily.members];
    
    relatedFamilyIds.forEach(familyId => {
      const family = families.find(f => f.id === familyId);
      if (family) {
        // Only add members that aren't already in the list (by ID)
        const newMembers = family.members.filter(
          m => !allMembers.some(am => am.id === m.id)
        );
        allMembers.push(...newMembers);
      }
    });
    
    return allMembers;
  }, [selectedFamily, families, showAllFamilies]);

  if (!selectedFamily) {
    return (
      <div className="flex items-center justify-center h-64 text-muted-foreground">
        Select a family to view the family tree
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-xl font-semibold">{selectedFamily.name} Family Tree</h2>
          <p className="text-sm text-muted-foreground">
            Visualize your family relationships and connections
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Select
            value={showAllFamilies ? 'all' : 'current'}
            onValueChange={(value) => setShowAllFamilies(value === 'all')}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Family Only</SelectItem>
              <SelectItem value="all">Include Related Families</SelectItem>
            </SelectContent>
          </Select>
          
          {selectedFamily.relationships.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAllFamilies(!showAllFamilies)}
            >
              {showAllFamilies ? 'Show Less' : 'Show More'}
            </Button>
          )}
        </div>
      </div>
      
      <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm overflow-hidden">
        <CardContent className="p-0 h-[600px] overflow-auto">
          <div className="p-4 min-w-max min-h-full flex justify-center">
            {getAllMembers && getAllMembers.length > 0 ? (
              <FamilyTree 
                members={getAllMembers} 
                onUpdateMember={onUpdateMember}
                onDeleteMember={onDeleteMember}
                canEdit={canEdit}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <div className="w-16 h-16 mb-4 text-4xl">👨‍👩‍👧‍👦</div>
                <h3 className="text-lg font-medium">No family members found</h3>
                <p className="text-sm mt-1">
                  Add family members to start building your family tree
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {selectedFamily.relationships.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium mb-2">
            {showAllFamilies ? 'Included Families' : 'Related Families'}
          </h3>
          <div className="flex flex-wrap gap-2">
            <div 
              className={cn(
                "px-3 py-1 text-sm rounded-full cursor-pointer transition-colors",
                showAllFamilies 
                  ? "bg-primary/10 text-primary" 
                  : "bg-secondary/50 text-foreground hover:bg-secondary/70"
              )}
              onClick={() => setShowAllFamilies(!showAllFamilies)}
            >
              {selectedFamily.name} (Current)
            </div>
            {selectedFamily.relationships.map(rel => {
              const family = families.find(f => f.id === rel.familyId);
              if (!family) return null;
              return (
                <div 
                  key={rel.familyId}
                  className={cn(
                    "px-3 py-1 text-sm rounded-full cursor-pointer transition-colors",
                    showAllFamilies 
                      ? "bg-secondary/50 text-foreground hover:bg-secondary/70"
                      : "bg-muted/50 text-foreground/70 hover:bg-muted"
                  )}
                  onClick={() => {
                    onSelectFamily(family);
                    setShowAllFamilies(false);
                  }}
                >
                  {family.name} ({rel.relationshipType})
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyTreeView;
