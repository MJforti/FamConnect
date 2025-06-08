import * as React from 'react';
import { FamilyMember } from '@/types';
import FamilyMemberCard from './FamilyMemberCard';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
// Extend the FamilyMember type to include our internal __rendered property
declare module '@/types' {
  interface FamilyMember {
    __rendered?: boolean;
  }
}

interface FamilyTreeProps {
  members: FamilyMember[];
  onUpdateMember: (member: FamilyMember) => void;
  onDeleteMember: (memberId: string) => void;
  canEdit: boolean;
}

const FamilyTree: React.FC<FamilyTreeProps> = ({ 
  members, 
  onUpdateMember, 
  onDeleteMember, 
  canEdit 
}) => {
  // Memoize the root members calculation
  const rootMembers = React.useMemo(() => {
    // Find members without parents or with minimal relationships
    return members.filter(member => {
      const hasParents = member.relationships.some(rel => 
        rel.relationType === 'parent'
      );
      const hasSpouse = member.relationships.some(rel => 
        rel.relationType === 'spouse'
      );
      
      // A root member is someone who either:
      // 1. Has no parents AND no spouse, OR
      // 2. Has no parents but has a spouse (and the spouse has parents), OR
      // 3. Is part of a couple where the other person has no parents
      if (!hasParents) {
        if (!hasSpouse) return true;
        
        // Check if the spouse has parents
        const spouse = member.relationships.find(r => r.relationType === 'spouse');
        if (spouse) {
          const spouseData = members.find(m => m.id === spouse.memberId);
          if (spouseData) {
            const spouseHasParents = spouseData.relationships.some(r => 
              r.relationType === 'parent'
            );
            return !spouseHasParents;
          }
        }
        return true;
      }
      return false;
    });
  }, [members]);

  // Memoize the relationships calculation
  const getRelationships = React.useMemo(() => {
    return (memberId: string, relationType: string) => {
      const member = members.find(m => m.id === memberId);
      if (!member) return [];
      
      return member.relationships
        .filter(rel => rel.relationType === relationType)
        .map(rel => members.find(m => m.id === rel.memberId))
        .filter((m): m is FamilyMember => m !== undefined);
    };
  }, [members]);

  // Recursive function to render family members
  const renderFamilyMember = (member: FamilyMember, level = 0) => {
    const children = getRelationships(member.id, 'child');
    const spouses = getRelationships(member.id, 'spouse');
    // Only show the first spouse to avoid infinite loops
    const spouse = spouses[0];
    
    // Skip if we've already rendered this member as a spouse
    if (member.__rendered) return null;
    
    // Mark as rendered to prevent infinite loops
    member.__rendered = true;
    
    // Calculate the width of the card based on the number of children
    const cardWidth = Math.max(200, 280 - (level * 20));
    const cardStyle = {
      width: `${cardWidth}px`,
      minWidth: `${cardWidth}px`
    };
    
    return (
      <div key={member.id} className="flex flex-col items-center">
        <div className={cn("relative flex", {
          'flex-col': !spouse,
          'flex-row items-start gap-2': spouse
        })}>
          {/* Member card */}
          <div className="mb-4 z-10" style={cardStyle}>
            <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
              <FamilyMemberCard 
                member={member} 
                onUpdate={onUpdateMember} 
                onDelete={onDeleteMember} 
                canEdit={canEdit}
                compact={level > 0}
              />
            </Card>
          </div>
          
          {/* Spouse connection */}
          {spouse && (
            <div className="relative">
              <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-4 h-1 bg-border"></div>
              <div className="mb-4 z-10" style={cardStyle}>
                <Card className="border-2 border-primary/20 hover:border-primary/40 transition-colors">
                  <FamilyMemberCard 
                    member={spouse} 
                    onUpdate={onUpdateMember} 
                    onDelete={onDeleteMember} 
                    canEdit={canEdit}
                    compact={level > 0}
                  />
                </Card>
              </div>
            </div>
          )}
        </div>
        
        {/* Vertical line from couple to children */}
        {children.length > 0 && (
          <div className="relative w-full flex justify-center">
            <div className="w-1 h-6 bg-border"></div>
          </div>
        )}

        {/* Children */}
        {children.length > 0 && (
          <div className="relative">
            {/* Horizontal line connecting children */}
            <div className="absolute top-0 left-0 right-0 flex justify-center">
              <div className="h-1 bg-border" style={{
                width: `${Math.max(100, children.length * 100)}px`,
                minWidth: '100px'
              }}></div>
            </div>
            
            <div className="flex justify-center space-x-4 pt-6 relative">
              {children.map((child, index) => {
                // Reset rendered state for each child to allow them to render their own trees
                child.__rendered = false;
                return (
                  <div key={child.id} className="relative flex flex-col items-center">
                    {/* Vertical line from horizontal line to child */}
                    <div className="absolute -top-6 left-1/2 w-1 h-6 bg-border"></div>
                    {renderFamilyMember(child, level + 1)}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Reset rendered state before rendering
  members.forEach(m => delete m.__rendered);
  
  return (
    <div className="p-4 overflow-auto h-full">
      <div className="min-w-full min-h-full flex justify-center">
        {rootMembers.length > 0 ? (
          <div className="flex flex-col items-center">
            {rootMembers.map(member => (
              <div key={member.id} className="relative">
                {renderFamilyMember(member)}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-12">
            <div className="w-16 h-16 mx-auto mb-4 text-muted-foreground/30 flex items-center justify-center text-4xl">👪</div>
            <h3 className="text-lg font-medium">No family members found</h3>
            <p className="text-sm mt-1">
              Add family members to start building your family tree
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FamilyTree;
