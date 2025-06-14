
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, Search, Cloud, Heart, Calendar } from 'lucide-react';

interface LandingPageProps {
  onShowAuth: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onShowAuth }) => {
  const features = [
    {
      icon: <Shield className="h-8 w-8 text-retro-orange" />,
      title: "Secure & Private",
      description: "Individual login credentials ensure your family data stays protected and private."
    },
    {
      icon: <Users className="h-8 w-8 text-retro-gold" />,
      title: "Relationship Mapping",
      description: "Visualize and connect family relationships dynamically with our intuitive interface."
    },
    {
      icon: <Search className="h-8 w-8 text-retro-burnt" />,
      title: "Smart Search",
      description: "Quickly find family members by name, age, relation, or any other detail."
    },
    {
      icon: <Cloud className="h-8 w-8 text-retro-orange" />,
      title: "Cloud Sync",
      description: "Access your family directory from any device with automatic synchronization."
    },
    {
      icon: <Calendar className="h-8 w-8 text-retro-gold" />,
      title: "Smart Reminders",
      description: "Never miss birthdays, anniversaries, or important family events again."
    },
    {
      icon: <Heart className="h-8 w-8 text-retro-red" />,
      title: "Family First",
      description: "Designed with love for families of all sizes, from small to extended family networks."
    }
  ];

  return (
    <div className="min-h-screen bg-background font-retro">
      {/* Header */}
      <header className="retro-header sticky top-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 family-gradient rounded-lg flex items-center justify-center retro-shadow">
              <Users className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold retro-text font-retro-display tracking-wider">
              FAMILY DIRECTORY
            </h1>
          </div>
          <Button 
            onClick={onShowAuth} 
            className="retro-button hover-scale font-retro font-bold px-6 py-2"
          >
            GET STARTED
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-retro-orange animate-retro-pulse"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 rounded-full bg-retro-gold animate-retro-pulse"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 rounded-full bg-retro-burnt animate-retro-pulse"></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="animate-fade-in-up">
            <h2 className="text-6xl md:text-7xl font-bold retro-text mb-8 font-retro-display tracking-wider">
              KEEP YOUR FAMILY
              <span className="block text-retro-orange animate-retro-glow">
                CONNECTED
              </span>
              <span className="block text-retro-gold">
                & ORGANIZED
              </span>
            </h2>
            <p className="text-xl retro-text mb-12 max-w-4xl mx-auto font-retro leading-relaxed">
              A groovy, secure platform to organize your family members, track relationships, 
              and never lose touch with the people who matter most. Far out!
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button 
                onClick={onShowAuth} 
                size="lg" 
                className="retro-button text-xl px-12 py-4 font-retro-display font-bold tracking-wide hover-scale"
              >
                START YOUR DIRECTORY
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-xl px-12 py-4 border-2 border-retro-gold text-retro-gold hover:bg-retro-gold hover:text-background font-retro-display font-bold tracking-wide hover-scale transition-all"
              >
                LEARN MORE
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-gradient-to-br from-muted/20 to-muted/10 relative">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h3 className="text-4xl md:text-5xl font-bold retro-text mb-6 font-retro-display tracking-wider">
              EVERYTHING YOU NEED
            </h3>
            <p className="text-xl retro-text max-w-3xl mx-auto font-retro">
              Powerful features designed to make family management simple, secure, and totally rad.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="retro-card hover-scale transition-all duration-300 animate-fade-in-up retro-shadow-lg">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-6 p-4 bg-gradient-to-br from-muted to-muted/50 rounded-full w-fit retro-shadow">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-2xl font-retro-display tracking-wide retro-text">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-lg retro-text font-retro">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-10 w-40 h-40 rounded-full bg-retro-gold animate-retro-pulse"></div>
          <div className="absolute bottom-10 left-10 w-28 h-28 rounded-full bg-retro-orange animate-retro-pulse"></div>
        </div>
        
        <div className="container mx-auto text-center relative z-10">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-4xl md:text-5xl font-bold retro-text mb-8 font-retro-display tracking-wider">
              READY TO BRING YOUR
              <span className="block text-retro-orange">
                FAMILY TOGETHER?
              </span>
            </h3>
            <p className="text-xl retro-text mb-12 font-retro leading-relaxed">
              Join thousands of families who have already organized their loved ones with our totally 
              awesome platform. Start your family directory today and never lose touch again!
            </p>
            <Button 
              onClick={onShowAuth} 
              size="lg" 
              className="retro-button text-xl px-16 py-5 font-retro-display font-bold tracking-wide hover-scale animate-retro-glow"
            >
              CREATE YOUR DIRECTORY
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-retro-brown bg-gradient-to-r from-card to-muted/50 py-12 px-4 retro-shadow">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 family-gradient rounded-md flex items-center justify-center retro-shadow">
              <Users className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl retro-text font-retro-display tracking-wider">
              FAMILY DIRECTORY
            </span>
          </div>
          <p className="retro-text font-retro text-lg">
            Building stronger family connections, one groovy member at a time.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
