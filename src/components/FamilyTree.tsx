
import React from 'react';
import { SupabaseFamilyMember, SupabaseFamilyRelationship } from '@/types/supabase';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface FamilyTreeProps {
  members: SupabaseFamilyMember[];
  relationships: SupabaseFamilyRelationship[];
  onUpdateMember?: (member: SupabaseFamilyMember) => void;
  onDeleteMember?: (memberId: string) => void;
  canEdit: boolean;
}

const FamilyTree: React.FC<FamilyTreeProps> = ({ 
  members, 
  relationships,
  onUpdateMember, 
  onDeleteMember, 
  canEdit 
}) => {
  // Find relationships for a member
  const getRelationships = (memberId: string, relationType: string) => {
    return relationships
      .filter(rel => rel.member_id === memberId && rel.relationship_type === relationType)
      .map(rel => members.find(m => m.id === rel.related_member_id))
      .filter(Boolean) as SupabaseFamilyMember[];
  };

  // Find root members (those without parents)
  const rootMembers = members.filter(member => {
    const hasParents = relationships.some(rel => 
      rel.member_id === member.id && rel.relationship_type === 'parent'
    );
    return !hasParents;
  });

  // Recursive function to render family members
  const renderFamilyMember = (member: SupabaseFamilyMember, level = 0) => {
    const children = getRelationships(member.id, 'child');
    const spouse = getRelationships(member.id, 'spouse')[0];
    
    return (
      <div key={member.id} className="member">
        <div className="member-card">
          <div className="member-avatar">
            {member.photo_url ? (
              <Avatar className="w-full h-full">
                <AvatarImage src={member.photo_url} alt={member.full_name} />
                <AvatarFallback>{member.full_name.charAt(0)}</AvatarFallback>
              </Avatar>
            ) : (
              member.full_name.charAt(0)
            )}
          </div>
          
          <h3 className="member-name">{member.full_name}</h3>
          
          {member.date_of_birth && (
            <div className="member-details">
              Born: {new Date(member.date_of_birth).toLocaleDateString()}
            </div>
          )}
          
          {member.occupation && (
            <div className="member-details">{member.occupation}</div>
          )}
          
          {member.notes && (
            <div className="member-details">{member.notes}</div>
          )}
        </div>

        {/* Spouse */}
        {spouse && (
          <div className="relative flex items-center">
            <div className="connector horizontal"></div>
            <div className="member-card ml-4">
              <div className="member-avatar">
                {spouse.photo_url ? (
                  <Avatar className="w-full h-full">
                    <AvatarImage src={spouse.photo_url} alt={spouse.full_name} />
                    <AvatarFallback>{spouse.full_name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ) : (
                  spouse.full_name.charAt(0)
                )}
              </div>
              
              <h3 className="member-name">{spouse.full_name}</h3>
              
              {spouse.date_of_birth && (
                <div className="member-details">
                  Born: {new Date(spouse.date_of_birth).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Children */}
        {children.length > 0 && (
          <div className="children">
            {children.map(child => (
              <div key={child.id} className="relative">
                {renderFamilyMember(child, level + 1)}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (members.length === 0) {
    return (
      <div className="family-tree">
        <div className="tree">
          <div className="text-center text-muted-foreground py-8">
            No family members found. Add some family members to see the family tree.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="family-tree">
      <div className="tree">
        {rootMembers.length > 0 ? (
          rootMembers.map(member => (
            <div key={member.id}>
              {renderFamilyMember(member)}
            </div>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-8">
            No family hierarchy found. Relationships may need to be defined.
          </div>
        )}
      </div>
    </div>
  );
};

export default FamilyTree;
