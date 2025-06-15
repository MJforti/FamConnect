
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { SupabaseFamily } from '@/types/supabase';
import { Users, Plus, Edit, Trash2 } from 'lucide-react';
import CreateFamilyModal from './CreateFamilyModal';

interface FamilySelectorProps {
  families: SupabaseFamily[];
  selectedFamily: SupabaseFamily | null;
  onSelectFamily: (family: SupabaseFamily) => void;
  onCreateFamily: (family: Omit<SupabaseFamily, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onUpdateFamily: (family: SupabaseFamily) => void;
  onDeleteFamily: (familyId: string) => void;
  canEdit: boolean;
}

const FamilySelector: React.FC<FamilySelectorProps> = ({
  families,
  selectedFamily,
  onSelectFamily,
  onCreateFamily,
  onUpdateFamily,
  onDeleteFamily,
  canEdit
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFamilies = families.filter(family =>
    family.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    family.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteFamily = (family: SupabaseFamily) => {
    if (window.confirm(`Are you sure you want to delete the "${family.name}" family? This will remove all members and cannot be undone.`)) {
      onDeleteFamily(family.id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <Input
          placeholder="Search families..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-md"
        />
        {canEdit && (
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="family-gradient hover:opacity-90"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Family
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFamilies.map((family) => (
          <Card
            key={family.id}
            className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
              selectedFamily?.id === family.id
                ? 'ring-2 ring-primary bg-primary/5'
                : 'hover:bg-muted/50'
            }`}
            onClick={() => onSelectFamily(family)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 family-gradient rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{family.name}</CardTitle>
                    <Badge variant="secondary" className="text-xs mt-1">
                      0 members
                    </Badge>
                  </div>
                </div>
                
                {canEdit && (
                  <div className="flex space-x-1" onClick={(e) => e.stopPropagation()}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {/* TODO: Implement edit */}}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteFamily(family)}
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>

            {family.description && (
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {family.description}
                </p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {filteredFamilies.length === 0 && (
        <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {searchTerm ? 'No families found' : 'No families yet'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm 
                ? 'Try adjusting your search terms'
                : 'Start by creating your first family'
              }
            </p>
            {!searchTerm && canEdit && (
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="family-gradient hover:opacity-90"
              >
                Create First Family
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <CreateFamilyModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={onCreateFamily}
      />
    </div>
  );
};

export default FamilySelector;
