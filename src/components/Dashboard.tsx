
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { FamilyMember } from '@/types';
import { Users, Search, User, Calendar, Bell } from 'lucide-react';
import FamilyMemberCard from './FamilyMemberCard';
import AddMemberModal from './AddMemberModal';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filteredMembers, setFilteredMembers] = useState<FamilyMember[]>([]);

  useEffect(() => {
    // Load family members from localStorage
    const savedMembers = localStorage.getItem('family-directory-members');
    if (savedMembers) {
      const members = JSON.parse(savedMembers);
      setFamilyMembers(members);
      setFilteredMembers(members);
    }
  }, []);

  useEffect(() => {
    // Filter members based on search term
    const filtered = familyMembers.filter(member =>
      member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.relation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.contactInfo.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.notes.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMembers(filtered);
  }, [searchTerm, familyMembers]);

  const handleAddMember = (newMember: Omit<FamilyMember, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>) => {
    const member: FamilyMember = {
      ...newMember,
      id: Date.now().toString(),
      createdBy: user?.id || '',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedMembers = [...familyMembers, member];
    setFamilyMembers(updatedMembers);
    localStorage.setItem('family-directory-members', JSON.stringify(updatedMembers));
  };

  const handleUpdateMember = (updatedMember: FamilyMember) => {
    const updatedMembers = familyMembers.map(member =>
      member.id === updatedMember.id
        ? { ...updatedMember, updatedAt: new Date() }
        : member
    );
    setFamilyMembers(updatedMembers);
    localStorage.setItem('family-directory-members', JSON.stringify(updatedMembers));
  };

  const handleDeleteMember = (memberId: string) => {
    const updatedMembers = familyMembers.filter(member => member.id !== memberId);
    setFamilyMembers(updatedMembers);
    localStorage.setItem('family-directory-members', JSON.stringify(updatedMembers));
  };

  const upcomingBirthdays = familyMembers.filter(member => {
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
  });

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
                <h1 className="text-xl font-bold text-foreground">Family Directory</h1>
                <p className="text-sm text-muted-foreground">Welcome back, {user?.fullName}</p>
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
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Quick Stats */}
            <div className="grid sm:grid-cols-3 gap-4">
              <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Members</p>
                      <p className="text-3xl font-bold text-foreground">{familyMembers.length}</p>
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
                        {familyMembers.reduce((total, member) => total + member.relationships.length, 0)}
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
                      <p className="text-sm font-medium text-muted-foreground">Upcoming Birthdays</p>
                      <p className="text-3xl font-bold text-foreground">{upcomingBirthdays.length}</p>
                    </div>
                    <div className="p-3 warm-gradient rounded-full">
                      <Calendar className="w-6 h-6 text-white" />
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
                      : 'Start building your family directory by adding your first family member'
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Upcoming Birthdays */}
            <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-family-warm" />
                  Upcoming Birthdays
                </CardTitle>
                <CardDescription>Next 30 days</CardDescription>
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

            {/* Quick Actions */}
            <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setIsAddModalOpen(true)}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Add Family Member
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setSearchTerm('')}
                >
                  <Search className="w-4 h-4 mr-2" />
                  Clear Search
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
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
