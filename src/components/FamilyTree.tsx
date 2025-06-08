import React from 'react';
import { FamilyMember } from '@/types';
import FamilyMemberCard from './FamilyMemberCard';

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
  // Find root members (those without parents or with minimal relationships)
  const rootMembers = members.filter(member => {
    // This is a simplified approach - you might need to adjust the logic
    // based on how your relationships are structured
    return !member.relationships.some(rel => 
      rel.relationType === 'parent' || rel.relationType === 'spouse'
    ) || member.relationships.length === 0;
  });

  // Find relationships for a member
  const getRelationships = (memberId: string, relationType: string) => {
    const member = members.find(m => m.id === memberId);
    if (!member) return [];
    
    return member.relationships
      .filter(rel => rel.relationType === relationType)
      .map(rel => members.find(m => m.id === rel.memberId))
      .filter(Boolean) as FamilyMember[];
  };

  // Recursive function to render family members
  const renderFamilyMember = (member: FamilyMember, level = 0) => {
    const children = getRelationships(member.id, 'child');
    const spouse = getRelationships(member.id, 'spouse')[0];
    
    return (
      <div key={member.id} className="flex flex-col items-center">
        <div className="relative">
          {/* Member card */}
          <div className="mb-4">
            <FamilyMemberCard 
              member={member} 
              onUpdate={onUpdateMember} 
              onDelete={onDeleteMember} 
              canEdit={canEdit} 
            />
          </div>
          
          {/* Spouse connection */}
          {spouse && (
            <div className="absolute top-1/2 right-0 transform translate-x-1/2 -translate-y-1/2">
              <div className="w-8 h-1 bg-border"></div>
            </div>
          )}
        </div>

        {/* Spouse */}
        {spouse && (
          <div className="relative">
            <div className="mb-4">
              <FamilyMemberCard 
                member={spouse} 
                onUpdate={onUpdateMember} 
                onDelete={onDeleteMember} 
                canEdit={canEdit} 
              />
            </div>
            
            {/* Vertical line from couple to children */}
            {children.length > 0 && (
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-6 bg-border"></div>
            )}
          </div>
        )}

        {/* Children */}
        {children.length > 0 && (
          <div className="relative mt-4">
            {/* Horizontal line connecting children */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-border"></div>
            
            <div className="flex justify-center space-x-8 pt-6 relative">
              {children.map((child, index) => (
                <div key={child.id} className="relative">
                  {/* Vertical line from horizontal line to child */}
                  <div className="absolute -top-6 left-1/2 w-1 h-6 bg-border"></div>
                  {renderFamilyMember(child, level + 1)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4 overflow-auto">
      <div className="min-w-max">
        {rootMembers.length > 0 ? (
          <div className="flex justify-center">
            {rootMembers.map(member => (
              <div key={member.id}>
                {renderFamilyMember(member)}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No family members found. Add some family members to see the family tree.
          </div>
        )}
      </div>
    </div>
  );
};

export default FamilyTree;
