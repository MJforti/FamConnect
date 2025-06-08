
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Family, FamilyMember, MediaItem } from '@/types';
import { Users, Search, User, Calendar, Bell, Image as ImageIcon, Video } from 'lucide-react';
import FamilySelector from './FamilySelector';
import FamilyMemberCard from './FamilyMemberCard';
import AddMemberModal from './AddMemberModal';
import MediaGallery from './MediaGallery';

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

  useEffect(() => {
    // Filter members based on search term and selected family
    if (selectedFamily) {
      const filtered = selectedFamily.members.filter(member =>
        member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.relation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.contactInfo.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.notes.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMembers(filtered);
    } else {
      setFilteredMembers([]);
    }
  }, [searchTerm, selectedFamily]);

  const handleCreateFamily = (newFamilyData: Omit<Family, 'id' | 'createdAt' | 'updatedAt' | 'members'>) => {
    const family: Family = {
      ...newFamilyData,
      id: Date.now().toString(),
      createdBy: user?.id || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      members: []
    };

    const updatedFamilies = [...families, family];
    setFamilies(updatedFamilies);
    localStorage.setItem('family-directory-families', JSON.stringify(updatedFamilies));
    setSelectedFamily(family);
  };

  const handleDeleteFamily = (familyId: string) => {
    const updatedFamilies = families.filter(family => family.id !== familyId);
    setFamilies(updatedFamilies);
    localStorage.setItem('family-directory-families', JSON.stringify(updatedFamilies));
    
    if (selectedFamily?.id === familyId) {
      setSelectedFamily(updatedFamilies.length > 0 ? updatedFamilies[0] : null);
    }

    // Remove media items for this family
    const updatedMedia = mediaItems.filter(item => item.familyId !== familyId);
    setMediaItems(updatedMedia);
    localStorage.setItem('family-directory-media', JSON.stringify(updatedMedia));
  };

  const handleAddMember = (newMember: Omit<FamilyMember, 'id' | 'createdBy' | 'createdAt' | 'updatedAt' | 'familyId'>) => {
    if (!selectedFamily) return;

    const member: FamilyMember = {
      ...newMember,
      id: Date.now().toString(),
      familyId: selectedFamily.id,
      createdBy: user?.id || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedFamily = {
      ...selectedFamily,
      members: [...selectedFamily.members, member],
      updatedAt: new Date()
    };

    const updatedFamilies = families.map(family =>
      family.id === selectedFamily.id ? updatedFamily : family
    );

    setFamilies(updatedFamilies);
    setSelectedFamily(updatedFamily);
    localStorage.setItem('family-directory-families', JSON.stringify(updatedFamilies));
  };

  const handleUpdateMember = (updatedMember: FamilyMember) => {
    if (!selectedFamily) return;

    const updatedFamily = {
      ...selectedFamily,
      members: selectedFamily.members.map(member =>
        member.id === updatedMember.id
          ? { ...updatedMember, updatedAt: new Date() }
          : member
      ),
      updatedAt: new Date()
    };

    const updatedFamilies = families.map(family =>
      family.id === selectedFamily.id ? updatedFamily : family
    );

    setFamilies(updatedFamilies);
    setSelectedFamily(updatedFamily);
    localStorage.setItem('family-directory-families', JSON.stringify(updatedFamilies));
  };

  const handleDeleteMember = (memberId: string) => {
    if (!selectedFamily) return;

    const updatedFamily = {
      ...selectedFamily,
      members: selectedFamily.members.filter(member => member.id !== memberId),
      updatedAt: new Date()
    };

    const updatedFamilies = families.map(family =>
      family.id === selectedFamily.id ? updatedFamily : family
    );

    setFamilies(updatedFamilies);
    setSelectedFamily(updatedFamily);
    localStorage.setItem('family-directory-families', JSON.stringify(updatedFamilies));
  };

  const handleUploadMedia = (newMediaData: Omit<MediaItem, 'id' | 'createdAt'>) => {
    const mediaItem: MediaItem = {
      ...newMediaData,
      id: Date.now().toString(),
      uploadedBy: user?.id || '',
      createdAt: new Date()
    };

    const updatedMedia = [...mediaItems, mediaItem];
    setMediaItems(updatedMedia);
    localStorage.setItem('family-directory-media', JSON.stringify(updatedMedia));
  };

  const handleDeleteMedia = (mediaId: string) => {
    const updatedMedia = mediaItems.filter(item => item.id !== mediaId);
    setMediaItems(updatedMedia);
    localStorage.setItem('family-directory-media', JSON.stringify(updatedMedia));
  };

  const currentFamilyMedia = selectedFamily ? mediaItems.filter(item => item.familyId === selectedFamily.id) : [];

  const upcomingBirthdays = selectedFamily ? selectedFamily.members.filter(member => {
    const today = new Date();
    const birthday = new Date(member.dateOfBirth);
    const thisYearBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
    const daysDiff = Math.ceil((thisYearBirthday.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return daysDiff >= 0 && daysDiff <= 30;
  }).sort((a, b) => {
    const today = new Date();
    const aBirthday = new Date(today.getFullYear(), new Date(a.dateOfBirth).getMonth(), new Date(a.dateOfBirth).getDate());
    const bBirthday = new Date(today.getFullYear(), new Date(b.dateOfBirth).getMonth(), new Date(b.dateOfBirth).getDate());
    return aBirthday.getTime() - bBirthday.getTime();
  }) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 family-gradient rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
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
            onUpdateFamily={() => {}} // TODO: Implement
            onDeleteFamily={handleDeleteFamily}
            canEdit={user?.familyRole === 'admin'}
          />
        ) : (
          <Tabs defaultValue="members" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="families">Families</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="families">
              <FamilySelector
                families={families}
                selectedFamily={selectedFamily}
                onSelectFamily={setSelectedFamily}
                onCreateFamily={handleCreateFamily}
                onUpdateFamily={() => {}} // TODO: Implement
                onDeleteFamily={handleDeleteFamily}
                canEdit={user?.familyRole === 'admin'}
              />
            </TabsContent>

            <TabsContent value="members" className="space-y-6">
              {/* Quick Stats */}
              <div className="grid sm:grid-cols-3 gap-4">
                <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Total Members</p>
                        <p className="text-3xl font-bold text-foreground">{selectedFamily.members.length}</p>
                      </div>
                      <div className="p-3 family-gradient rounded-full">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Relationships</p>
                        <p className="text-3xl font-bold text-foreground">
                          {selectedFamily.members.reduce((total, member) => total + member.relationships.length, 0)}
                        </p>
                      </div>
                      <div className="p-3 connection-gradient rounded-full">
                        <User className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Media Items</p>
                        <p className="text-3xl font-bold text-foreground">{currentFamilyMedia.length}</p>
                      </div>
                      <div className="p-3 warm-gradient rounded-full">
                        <ImageIcon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Search and Add */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search family members..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  className="family-gradient hover:opacity-90"
                >
                  Add Family Member
                </Button>
              </div>

              {/* Family Members Grid */}
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredMembers.map((member) => (
                  <FamilyMemberCard
                    key={member.id}
                    member={member}
                    onUpdate={handleUpdateMember}
                    onDelete={handleDeleteMember}
                    canEdit={user?.familyRole === 'admin' || member.createdBy === user?.id}
                  />
                ))}
              </div>

              {filteredMembers.length === 0 && (
                <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
                  <CardContent className="p-12 text-center">
                    <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {searchTerm ? 'No members found' : 'No family members yet'}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {searchTerm 
                        ? 'Try adjusting your search terms'
                        : `Start building the ${selectedFamily.name} by adding your first family member`
                      }
                    </p>
                    {!searchTerm && (
                      <Button
                        onClick={() => setIsAddModalOpen(true)}
                        className="family-gradient hover:opacity-90"
                      >
                        Add First Member
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="media">
              <MediaGallery
                mediaItems={currentFamilyMedia}
                familyId={selectedFamily.id}
                onUploadMedia={handleUploadMedia}
                onDeleteMedia={handleDeleteMedia}
                canEdit={user?.familyRole === 'admin'}
              />
            </TabsContent>
          </Tabs>
        )}

        {/* Sidebar - only show when a family is selected */}
        {selectedFamily && (
          <div className="fixed right-4 top-24 w-80 space-y-6 hidden xl:block">
            {/* Upcoming Birthdays */}
            <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Upcoming Birthdays
                </CardTitle>
                <CardDescription>Next 30 days in {selectedFamily.name}</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingBirthdays.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingBirthdays.slice(0, 5).map((member) => {
                      const birthday = new Date(member.dateOfBirth);
                      const today = new Date();
                      const thisYearBirthday = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
                      const daysDiff = Math.ceil((thisYearBirthday.getTime() - today.getTime()) / (1000 * 3600 * 24));
                      
                      return (
                        <div key={member.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{member.fullName}</p>
                            <p className="text-xs text-muted-foreground">{member.relation}</p>
                          </div>
                          <Badge variant={daysDiff === 0 ? 'default' : 'secondary'}>
                            {daysDiff === 0 ? 'Today!' : `${daysDiff} days`}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">No upcoming birthdays</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddMember}
      />
    </div>
  );
};

export default Dashboard;
