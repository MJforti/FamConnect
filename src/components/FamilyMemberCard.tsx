
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FamilyMember } from '@/types';
import { User, Calendar, Mail, Phone, MapPin, Edit, Trash2 } from 'lucide-react';
import EditMemberModal from './EditMemberModal';

interface FamilyMemberCardProps {
  member: FamilyMember;
  onUpdate: (member: FamilyMember) => void;
  onDelete: (memberId: string) => void;
  canEdit: boolean;
}

const FamilyMemberCard: React.FC<FamilyMemberCardProps> = ({ 
  member, 
  onUpdate, 
  onDelete, 
  canEdit 
}) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const calculateAge = (dateOfBirth: Date): number => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete ${member.fullName} from the family directory?`)) {
      onDelete(member.id);
    }
  };

  return (
    <>
      <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card/80 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 family-gradient rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">{member.fullName}</CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {member.relation}
                </Badge>
              </div>
            </div>
            
            {canEdit && (
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditModalOpen(true)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDelete}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex items-center text-sm text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2" />
            <span>
              Age {calculateAge(member.dateOfBirth)} • Born {formatDate(member.dateOfBirth)}
            </span>
          </div>

          {member.contactInfo.email && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Mail className="w-4 h-4 mr-2" />
              <span className="truncate">{member.contactInfo.email}</span>
            </div>
          )}

          {member.contactInfo.phone && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Phone className="w-4 h-4 mr-2" />
              <span>{member.contactInfo.phone}</span>
            </div>
          )}

          {member.contactInfo.address && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mr-2" />
              <span className="truncate">{member.contactInfo.address}</span>
            </div>
          )}

          {member.relationships.length > 0 && (
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Relationships:</p>
              <div className="flex flex-wrap gap-1">
                {member.relationships.slice(0, 3).map((relationship, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {relationship.relationType}
                  </Badge>
                ))}
                {member.relationships.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{member.relationships.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
          )}

          {member.notes && (
            <div>
              <p className="text-sm font-medium text-foreground mb-1">Notes:</p>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {member.notes}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <EditMemberModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        member={member}
        onUpdate={onUpdate}
      />
    </>
  );
};

export default FamilyMemberCard;
