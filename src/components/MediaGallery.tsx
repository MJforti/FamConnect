
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MediaItem } from '@/types';
import { Upload, Search, Play, Image as ImageIcon, Calendar, User } from 'lucide-react';
import MediaUploadModal from './MediaUploadModal';

interface MediaGalleryProps {
  mediaItems: MediaItem[];
  familyId: string;
  onUploadMedia: (media: Omit<MediaItem, 'id' | 'createdAt'>) => void;
  onDeleteMedia: (mediaId: string) => void;
  canEdit: boolean;
}

const MediaGallery: React.FC<MediaGalleryProps> = ({
  mediaItems,
  familyId,
  onUploadMedia,
  onDeleteMedia,
  canEdit
}) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');

  const filteredMedia = mediaItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesType;
  });

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex gap-2 items-center">
          <Input
            placeholder="Search media..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
          <div className="flex gap-2">
            <Button
              variant={filterType === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('all')}
            >
              All
            </Button>
            <Button
              variant={filterType === 'image' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('image')}
            >
              <ImageIcon className="w-4 h-4 mr-1" />
              Photos
            </Button>
            <Button
              variant={filterType === 'video' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterType('video')}
            >
              <Play className="w-4 h-4 mr-1" />
              Videos
            </Button>
          </div>
        </div>
        
        {canEdit && (
          <Button
            onClick={() => setIsUploadModalOpen(true)}
            className="family-gradient hover:opacity-90"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Media
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredMedia.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-video relative bg-muted flex items-center justify-center">
              {item.type === 'image' ? (
                <img
                  src={item.url}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="relative w-full h-full bg-black flex items-center justify-center">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-white">
                      <Play className="w-12 h-12" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <Play className="w-8 h-8 text-white" />
                  </div>
                </div>
              )}
              <Badge 
                variant="secondary" 
                className="absolute top-2 right-2 text-xs"
              >
                {item.type}
              </Badge>
            </div>
            
            <CardContent className="p-4">
              <h3 className="font-semibold text-sm mb-2 line-clamp-1">{item.title}</h3>
              
              {item.description && (
                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                  {item.description}
                </p>
              )}
              
              <div className="flex items-center text-xs text-muted-foreground mb-2">
                <Calendar className="w-3 h-3 mr-1" />
                {formatDate(item.createdAt)}
              </div>
              
              {item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {item.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs px-1 py-0">
                      {tag}
                    </Badge>
                  ))}
                  {item.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs px-1 py-0">
                      +{item.tags.length - 3}
                    </Badge>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMedia.length === 0 && (
        <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-sm">
          <CardContent className="p-12 text-center">
            <ImageIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {searchTerm ? 'No media found' : 'No media uploaded yet'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm 
                ? 'Try adjusting your search terms or filters'
                : 'Start building your family memories by uploading photos and videos'
              }
            </p>
            {!searchTerm && canEdit && (
              <Button
                onClick={() => setIsUploadModalOpen(true)}
                className="family-gradient hover:opacity-90"
              >
                Upload First Media
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      <MediaUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        familyId={familyId}
        onUpload={onUploadMedia}
      />
    </div>
  );
};

export default MediaGallery;
