
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
      icon: <Shield className="h-8 w-8 text-primary" />,
      title: "Secure & Private",
      description: "Individual login credentials ensure your family data stays protected and private."
    },
    {
      icon: <Users className="h-8 w-8 text-accent" />,
      title: "Relationship Mapping",
      description: "Visualize and connect family relationships dynamically with our intuitive interface."
    },
    {
      icon: <Search className="h-8 w-8 text-family-warm" />,
      title: "Smart Search",
      description: "Quickly find family members by name, age, relation, or any other detail."
    },
    {
      icon: <Cloud className="h-8 w-8 text-family-connection" />,
      title: "Cloud Sync",
      description: "Access your family directory from any device with automatic synchronization."
    },
    {
      icon: <Calendar className="h-8 w-8 text-family-love" />,
      title: "Smart Reminders",
      description: "Never miss birthdays, anniversaries, or important family events again."
    },
    {
      icon: <Heart className="h-8 w-8 text-destructive" />,
      title: "Family First",
      description: "Designed with love for families of all sizes, from small to extended family networks."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 family-gradient rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-foreground">Family Directory</h1>
          </div>
          <Button onClick={onShowAuth} className="family-gradient hover:opacity-90">
            Get Started
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="animate-fade-in">
            <h2 className="text-5xl md:text-6xl font-bold text-foreground mb-6">
              Keep Your Family
              <span className="block bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Connected & Organized
              </span>
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              A secure, user-friendly platform to organize your family members, track relationships, 
              and never lose touch with the people who matter most.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={onShowAuth} 
                size="lg" 
                className="family-gradient hover:opacity-90 text-lg px-8 py-3"
              >
                Start Building Your Directory
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="text-lg px-8 py-3 border-primary text-primary hover:bg-primary/10"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need for Family Organization
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to make family management simple, secure, and enjoyable for everyone.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 animate-fade-in bg-card/80 backdrop-blur-sm">
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-muted rounded-full w-fit">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
              Ready to Bring Your Family Together?
            </h3>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of families who have already organized their loved ones with our platform.
              Start your family directory today and never lose touch again.
            </p>
            <Button 
              onClick={onShowAuth} 
              size="lg" 
              className="warm-gradient hover:opacity-90 text-lg px-12 py-4"
            >
              Create Your Family Directory
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-card/50 backdrop-blur-sm py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-6 h-6 family-gradient rounded-md flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-foreground">Family Directory</span>
          </div>
          <p className="text-muted-foreground">
            Building stronger family connections, one member at a time.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
