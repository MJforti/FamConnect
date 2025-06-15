import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { Users, Search, User, Plus } from 'lucide-react';
import { useFamilies } from '@/hooks/useFamilies';
import { useFamilyMembers } from '@/hooks/useFamilyMembers';
import FamilyTree from './FamilyTree';
import CreateFamilyModal from './CreateFamilyModal';
import { SupabaseFamily } from '@/types/supabase';
import { useToast } from '@/hooks/use-toast';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { families, loading: familiesLoading, createFamily, deleteFamily } = useFamilies();
  const [selectedFamily, setSelectedFamily] = useState<SupabaseFamily | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newFamilyName, setNewFamilyName] = useState('');
  const [isCreatingFamily, setIsCreatingFamily] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { toast } = useToast();

  const { 
    members, 
    relationships, 
    loading: membersLoading,
    addMember, 
    updateMember, 
    deleteMember 
  } = useFamilyMembers(selectedFamily?.id || null);

  React.useEffect(() => {
    if (families.length > 0 && !selectedFamily) {
      setSelectedFamily(families[0]);
    }
  }, [families, selectedFamily]);

  const handleCreateFamily = async (familyData: Omit<SupabaseFamily, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('Creating family with data:', familyData);
      const newFamily = await createFamily(familyData);
      console.log('Family created successfully:', newFamily);
      setSelectedFamily(newFamily);
      toast({
        title: "Success",
        description: "Family created successfully",
      });
    } catch (error) {
      console.error('Error creating family:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create family",
        variant: "destructive",
      });
      throw error; // Re-throw to let the modal handle the error state
    }
  };

  const handleQuickCreateFamily = async () => {
    if (!newFamilyName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a family name",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingFamily(true);
    try {
      await handleCreateFamily({ 
        name: newFamilyName.trim(), 
        description: null 
      });
      setNewFamilyName('');
    } catch (error) {
      // Error already handled in handleCreateFamily
    } finally {
      setIsCreatingFamily(false);
    }
  };

  const handleDeleteFamily = async (familyId: string) => {
    try {
      await deleteFamily(familyId);
      if (selectedFamily?.id === familyId) {
        setSelectedFamily(families.length > 1 ? families.find(f => f.id !== familyId) || null : null);
      }
      toast({
        title: "Success",
        description: "Family deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete family",
        variant: "destructive",
      });
    }
  };

  const filteredMembers = members.filter(member =>
    member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.notes?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-foreground">Please log in to continue</h1>
          <Button onClick={() => window.location.href = '/auth'}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  if (familiesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="text-muted-foreground">Loading your families...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Family Tree</h1>
                <p className="text-sm text-muted-foreground">
                  {selectedFamily ? `Managing ${selectedFamily.name}` : 'Welcome back'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant="default">
                Admin
              </Badge>
              <Button variant="outline" onClick={logout}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {families.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Create Your First Family</CardTitle>
              <CardDescription>
                Start building your family tree by creating a family
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button 
                  className="w-full"
                  onClick={() => setShowCreateModal(true)}
                >
                  Create Family
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="family-tree" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <TabsList className="grid w-full max-w-lg grid-cols-3">
                <TabsTrigger value="families">Families</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="family-tree">Family Tree</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="families">
              <Card>
                <CardHeader>
                  <CardTitle>Your Families</CardTitle>
                  <CardDescription>Manage your family groups</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {families.map((family) => (
                      <div key={family.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">{family.name}</h3>
                          {family.description && (
                            <p className="text-sm text-muted-foreground">{family.description}</p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant={selectedFamily?.id === family.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedFamily(family)}
                          >
                            {selectedFamily?.id === family.id ? "Selected" : "Select"}
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteFamily(family.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="pt-4 border-t">
                      <Button 
                        onClick={() => setShowCreateModal(true)}
                        className="w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add New Family
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            
            <TabsContent value="members" className="space-y-6">
              {/* Quick Stats */}
              <div className="grid sm:grid-cols-3 gap-4">
                <Card className="border shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Members</p>
                        <p className="text-3xl font-bold text-foreground">{members.length}</p>
                      </div>
                      <div className="p-3 bg-primary rounded-full">
                        <Users className="w-6 h-6 text-primary-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Relationships</p>
                        <p className="text-3xl font-bold text-foreground">{relationships.length}</p>
                      </div>
                      <div className="p-3 bg-secondary rounded-full">
                        <User className="w-6 h-6 text-secondary-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Active Members</p>
                        <p className="text-3xl font-bold text-foreground">
                          {members.filter(m => m.is_alive).length}
                        </p>
                      </div>
                      <div className="p-3 bg-accent rounded-full">
                        <User className="w-6 h-6 text-accent-foreground" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Search */}
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search family members..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Members List */}
              <div className="space-y-4">
                {filteredMembers.map((member) => (
                  <Card key={member.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src={member.photo_url || undefined} />
                          <AvatarFallback>{member.full_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="font-semibold">{member.full_name}</h3>
                          {member.date_of_birth && (
                            <p className="text-sm text-muted-foreground">
                              Born: {new Date(member.date_of_birth).toLocaleDateString()}
                            </p>
                          )}
                          {member.occupation && (
                            <p className="text-sm text-muted-foreground">{member.occupation}</p>
                          )}
                        </div>
                        <Badge variant={member.is_alive ? "default" : "secondary"}>
                          {member.is_alive ? "Living" : "Deceased"}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredMembers.length === 0 && (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {searchTerm ? 'No members found' : 'No family members yet'}
                    </h3>
                    <p className="text-muted-foreground">
                      {searchTerm 
                        ? 'Try adjusting your search terms'
                        : `Start building the ${selectedFamily?.name} by adding family members`
                      }
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="family-tree" className="space-y-6">
              <Card className="border shadow-sm">
                <CardHeader>
                  <CardTitle>Family Tree</CardTitle>
                  <CardDescription>Visualize your family relationships</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="min-h-[600px] rounded-lg border p-4">
                    {membersLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-muted-foreground">Loading family tree...</div>
                      </div>
                    ) : (
                      <FamilyTree 
                        members={members} 
                        relationships={relationships}
                        canEdit={true}
                      />
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>

      <CreateFamilyModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateFamily}
      />
    </div>
  );
};

export default Dashboard;
