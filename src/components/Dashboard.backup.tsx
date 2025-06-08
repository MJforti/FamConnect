import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Family, FamilyMember, MediaItem, FamilyRelationship } from '@/types';
import { Users, Search, User, Calendar, Bell, Image as ImageIcon, Video, Edit, Trash2, Link as LinkIcon } from 'lucide-react';
import FamilySelector from './FamilySelector';
import FamilyMemberCard from './FamilyMemberCard';
import AddMemberModal from './AddMemberModal';
import MediaGallery from './MediaGallery';
import FamilyTree from './FamilyTree';
import FamilyRelationshipManager from './FamilyRelationshipManager';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [families, setFamilies] = useState<Family[]>([]);
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filteredMembers, setFilteredMembers] = useState<FamilyMember[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);

  useEffect(() => {
    // Load families from localStorage
    const savedFamilies = localStorage.getItem('family-directory-families');
    if (savedFamilies) {
      const parsedFamilies = JSON.parse(savedFamilies);
      setFamilies(parsedFamilies);
      if (parsedFamilies.length > 0) {
        setSelectedFamily(parsedFamilies[0]);
      }
    }

    // Load media items from localStorage
    const savedMedia = localStorage.getItem('family-directory-media');
    if (savedMedia) {
      setMediaItems(JSON.parse(savedMedia));
    }
  }, []);

  // ... rest of the component code ...

  const handleCreateFamily = useCallback((familyData: Omit<Family, 'id' | 'createdAt' | 'updatedAt' | 'members' | 'relatedFamilies' | 'isPublic'>) => {
    const newFamily: Family = {
      ...familyData,
      id: `family-${Date.now()}`,
      members: [],
      relatedFamilies: [],
      isPublic: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedFamilies = [...families, newFamily];
    setFamilies(updatedFamilies);
    setSelectedFamily(newFamily);
    localStorage.setItem('family-directory-families', JSON.stringify(updatedFamilies));
    return newFamily;
  };

  const handleUpdateMember = useCallback((member: FamilyMember) => {
    if (!selectedFamily) return;
    
    const updatedMembers = selectedFamily.members.map(m => 
      m.id === member.id ? { ...member, updatedAt: new Date() } : m
    );
    
    const updatedFamily = {
      ...selectedFamily,
      members: updatedMembers,
      updatedAt: new Date()
    };
    
    handleUpdateFamily(updatedFamily);
  };

  const handleDeleteMember = (memberId: string) => {
    if (!selectedFamily) return;
    
    if (window.confirm('Are you sure you want to delete this member?')) {
      const updatedMembers = selectedFamily.members.filter(member => member.id !== memberId);
      
      // Update relationships to remove references to the deleted member
      const updatedMembersWithFixedRelationships = updatedMembers.map(member => ({
        ...member,
        relationships: member.relationships.filter(rel => rel.memberId !== memberId)
      }));
      
      const updatedFamily = {
        ...selectedFamily,
        members: updatedMembersWithFixedRelationships,
        updatedAt: new Date()
      };
      
      handleUpdateFamily(updatedFamily);
    }
  };

  const handleUploadMedia = (media: Omit<MediaItem, 'id' | 'createdAt'>) => {
    if (!selectedFamily || !user) return null;
    
    const newMediaItem: MediaItem = {
      ...media,
      id: `media-${Date.now()}`,
      familyId: selectedFamily.id,
      uploadedBy: user.id,
      createdAt: new Date()
    };
    
    const updatedMedia = [...mediaItems, newMediaItem];
    setMediaItems(updatedMedia);
    localStorage.setItem('family-directory-media', JSON.stringify(updatedMedia));
    
    return newMediaItem;
  };

  const handleDeleteMedia = (mediaId: string) => {
    if (window.confirm('Are you sure you want to delete this media item?')) {
      const updatedMedia = mediaItems.filter(item => item.id !== mediaId);
      setMediaItems(updatedMedia);
      localStorage.setItem('family-directory-media', JSON.stringify(updatedMedia));
    }
  };

  const handleUpdateFamily = useCallback((updatedFamily: Family) => {
    const updatedFamilies = families.map(f => 
      f.id === updatedFamily.id ? { ...updatedFamily, updatedAt: new Date() } : f
    );
    setFamilies(updatedFamilies);
    if (selectedFamily?.id === updatedFamily.id) {
      setSelectedFamily(updatedFamily);
    }
    localStorage.setItem('family-directory-families', JSON.stringify(updatedFamilies));
    return updatedFamily;
  }, [families, selectedFamily]);

  const handleDeleteFamily = (familyId: string) => {
    // First, remove this family from all related families
    const updatedFamilies = families.map(family => ({
      ...family,
      relatedFamilies: family.relatedFamilies?.filter(rel => rel.familyId !== familyId) || []
    })).filter(f => f.id !== familyId);
    
    setFamilies(updatedFamilies);
    if (selectedFamily?.id === familyId) {
      setSelectedFamily(updatedFamilies[0] || null);
    }
    localStorage.setItem('family-directory-families', JSON.stringify(updatedFamilies));

    // Remove media items for this family
    const updatedMedia = mediaItems.filter(item => item.familyId !== familyId);
    setMediaItems(updatedMedia);
    localStorage.setItem('family-directory-media', JSON.stringify(updatedMedia));
  };

  // ... rest of the component code ...

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="family-gradient p-2 rounded-lg">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Family Tree</h1>
                <p className="text-sm text-muted-foreground">
                  {selectedFamily ? `Managing ${selectedFamily.name}` : 'Welcome back, ' + user?.fullName}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Badge variant={user?.familyRole === 'admin' ? 'default' : 'secondary'}>
                {user?.familyRole === 'admin' ? 'Admin' : 'Member'}
              </Badge>
              <Button variant="outline" onClick={logout}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {!selectedFamily ? (
          <FamilySelector
            families={families}
            selectedFamily={selectedFamily}
            onSelectFamily={setSelectedFamily}
            onCreateFamily={handleCreateFamily}
            onUpdateFamily={handleUpdateFamily}
            onDeleteFamily={handleDeleteFamily}
            canEdit={user?.familyRole === 'admin'}
          />
        ) : (
          <Tabs defaultValue="members" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <TabsList className="grid w-full max-w-2xl grid-cols-4">
                <TabsTrigger value="families">Families</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="family-tree">Family Tree</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="families">
              <div className="space-y-6">
                <FamilySelector
                  families={families}
                  selectedFamily={selectedFamily}
                  onSelectFamily={setSelectedFamily}
                  onCreateFamily={handleCreateFamily}
                  onUpdateFamily={handleUpdateFamily}
                  onDeleteFamily={handleDeleteFamily}
                  canEdit={user?.familyRole === 'admin'}
                />
                
                {selectedFamily && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Manage Family</h3>
                    <div className="grid gap-6 md:grid-cols-2">
                      <Card>
                        <CardHeader>
                          <CardTitle>Family Details</CardTitle>
                          <CardDescription>View and edit family information</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <Label>Family Name</Label>
                              <p className="font-medium">{selectedFamily.name}</p>
                            </div>
                            {selectedFamily.description && (
                              <div>
                                <Label>Description</Label>
                                <p className="text-muted-foreground">{selectedFamily.description}</p>
                              </div>
                            )}
                            {selectedFamily.coverImage && (
                              <div className="mt-4">
                                <Label>Cover Image</Label>
                                <div className="mt-2 rounded-md overflow-hidden">
                                  <img 
                                    src={selectedFamily.coverImage} 
                                    alt={`${selectedFamily.name} cover`} 
                                    className="w-full h-48 object-cover"
                                  />
                                </div>
                              </div>
                            )}
                            <div className="pt-2">
                              <div className="flex items-center gap-2">
                                {selectedFamily.isPublic ? (
                                  <Globe className="h-4 w-4 text-blue-500" />
                                ) : (
                                  <Lock className="h-4 w-4 text-muted-foreground" />
                                )}
                                <span className="text-sm font-medium">
                                  {selectedFamily.isPublic ? 'Public' : 'Private'} Family
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-1">
                                {selectedFamily.isPublic 
                                  ? 'Anyone with the link can view this family' 
                                  : 'Only invited members can view this family'}
                              </p>
                            </div>
                            <div className="text-sm text-muted-foreground">
                              <p>Created: {new Date(selectedFamily.createdAt).toLocaleDateString()}</p>
                              <p>Last updated: {new Date(selectedFamily.updatedAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      <div className="space-y-6">
                        <Card>
                          <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                            <CardDescription>Manage this family</CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <Button 
                              variant="outline" 
                              className="w-full justify-start"
                              onClick={() => {
                                // TODO: Implement edit family modal
                              }}
                            >
                              <Edit className="w-4 h-4 mr-2" />
                              Edit Family Details
                            </Button>
                            <Button 
                              variant="outline" 
                              className="w-full justify-start"
                              onClick={() => {
                                // TODO: Implement add member functionality
                                setIsAddModalOpen(true);
                              }}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Family Member
                            </Button>
                            <Button 
                              variant="outline" 
                              className="w-full justify-start"
                              onClick={() => {
                                // TODO: Implement link to family functionality
                              }}
                            >
                              <LinkIcon className="w-4 h-4 mr-2" />
                              Link to Another Family
                            </Button>
                            <Button 
                              variant="destructive" 
                              className="w-full justify-start"
                              onClick={() => {
                                if (window.confirm(`Are you sure you want to delete the "${selectedFamily.name}" family? This action cannot be undone.`)) {
                                  handleDeleteFamily(selectedFamily.id);
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Delete Family
                            </Button>
                          </CardContent>
                        </Card>

                        {selectedFamily && (
                          <FamilyRelationshipManager
                            currentFamily={selectedFamily}
                            allFamilies={families.filter(f => f.id !== selectedFamily.id)}
                            onUpdateFamily={handleUpdateFamily}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="members" className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search members..."
                    className="pl-10 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button 
                  onClick={() => setIsAddModalOpen(true)}
                  className="family-gradient hover:opacity-90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Member
                </Button>
              </div>

              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {selectedFamily.members
                  .filter(member => 
                    member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    member.relation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    member.contactInfo.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    member.notes.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((member) => (
                    <FamilyMemberCard 
                      key={member.id} 
                      member={member} 
                      onUpdate={handleUpdateMember}
                      onDelete={handleDeleteMember}
                      canEdit={user?.familyRole === 'admin'}
                    />
                  ))}
              </div>

              {selectedFamily.members.length === 0 && (
                <div className="text-center py-12 border-2 border-dashed rounded-lg">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-lg font-medium">No members yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Get started by adding your first family member.
                  </p>
                  <div className="mt-6">
                    <Button 
                      onClick={() => setIsAddModalOpen(true)}
                      className="family-gradient hover:opacity-90"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Member
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="family-tree">
              <FamilyTree 
                members={selectedFamily.members} 
                onUpdateMember={handleUpdateMember} 
                onDeleteMember={handleDeleteMember}
                canEdit={user?.familyRole === 'admin'}
              />
            </TabsContent>

            <TabsContent value="media">
              <MediaGallery 
                familyId={selectedFamily.id}
                mediaItems={mediaItems.filter(item => item.familyId === selectedFamily.id)}
                onUploadMedia={handleUploadMedia}
                onDeleteMedia={handleDeleteMedia}
                canEdit={user?.familyRole === 'admin'}
              />
            </TabsContent>
        )}
        <span className="text-sm font-medium">
          {selectedFamily.isPublic ? 'Public' : 'Private'} Family
        </span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">
        {selectedFamily.isPublic 
          ? 'Anyone with the link can view this family' 
          : 'Only invited members can view this family'}
      </p>
    </div>
    <div className="text-sm text-muted-foreground">
      <p>Created: {new Date(selectedFamily.createdAt).toLocaleDateString()}</p>
      <p>Last updated: {new Date(selectedFamily.updatedAt).toLocaleDateString()}</p>
    </div>
  </div>
</CardContent>
</Card>

<div className="space-y-6">
  <Card>
    <CardHeader>
      <CardTitle>Quick Actions</CardTitle>
      <CardDescription>Manage this family</CardDescription>
    </CardHeader>
    <CardContent className="space-y-2">
      <Button 
        variant="outline" 
        className="w-full justify-start"
        onClick={() => {
          // TODO: Implement edit family modal
        }}
      >
        <Edit className="w-4 h-4 mr-2" />
        Edit Family Details
      </Button>
      <Button 
        variant="outline" 
        className="w-full justify-start"
        onClick={() => {
          // TODO: Implement add member functionality
          setIsAddModalOpen(true);
        }}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Family Member
      </Button>
      <Button 
        variant="outline" 
        className="w-full justify-start"
        onClick={() => {
          // TODO: Implement link to family functionality
        }}
      >
        <LinkIcon className="w-4 h-4 mr-2" />
        Link to Another Family
      </Button>
      <Button 
        variant="destructive" 
        className="w-full justify-start"
        onClick={() => {
          if (window.confirm(`Are you sure you want to delete the "${selectedFamily.name}" family? This action cannot be undone.`)) {
            handleDeleteFamily(selectedFamily.id);
          }
        }}
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Delete Family
      </Button>
    </CardContent>
  </Card>

  {selectedFamily && (
    <FamilyRelationshipManager
      currentFamily={selectedFamily}
      allFamilies={families.filter(f => f.id !== selectedFamily.id)}
      onUpdateFamily={handleUpdateFamily}
    />
  )}
</div>
</div>
</div>
</TabsContent>

<TabsContent value="members" className="space-y-6">
  <div className="flex justify-between items-center">
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search members..."
        className="pl-10 w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
    <Button 
      onClick={() => setIsAddModalOpen(true)}
      className="family-gradient hover:opacity-90"
    >
      <Plus className="w-4 h-4 mr-2" />
      Add Member
    </Button>
  </div>

  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
    {selectedFamily.members
      .filter(member => 
        member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.relation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.contactInfo.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.notes.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map((member) => (
        <FamilyMemberCard 
          key={member.id} 
          member={member} 
          onUpdate={handleUpdateMember}
          onDelete={handleDeleteMember}
          canEdit={user?.familyRole === 'admin'}
        />
      ))}
  </div>

  {selectedFamily.members.length === 0 && (
    <div className="text-center py-12 border-2 border-dashed rounded-lg">
      <Users className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-2 text-lg font-medium">No members yet</h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by adding your first family member.
      </p>
      <div className="mt-6">
        <Button 
          onClick={() => setIsAddModalOpen(true)}
          className="family-gradient hover:opacity-90"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Member
        </Button>
      </div>
    </div>
  )}
</TabsContent>

<TabsContent value="family-tree">
  <FamilyTree 
    members={selectedFamily.members} 
    onUpdateMember={handleUpdateMember} 
    onDeleteMember={handleDeleteMember}
    canEdit={user?.familyRole === 'admin'}
  />
</TabsContent>

<TabsContent value="media">
  <MediaGallery 
    familyId={selectedFamily.id}
    mediaItems={mediaItems.filter(item => item.familyId === selectedFamily.id)}
    onUploadMedia={handleUploadMedia}
    onDeleteMedia={handleDeleteMedia}
    canEdit={user?.familyRole === 'admin'}
};

export default Dashboard;
