import React, { useState, useEffect } from "react";
import { PlusCircle, Share2, Trash2, Image, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import EmptyState from "@/components/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import Header from "@/components/Header";

// Define the Collage interface (same as in the Collage page)
interface SavedCollage {
  id: string;
  name: string;
  imageUrl: string;
  createdAt: Date;
  stickers: Array<{
    id: string;
    plant: any;
    position: { x: number; y: number };
    rotation: number;
    scale: number;
    zIndex: number;
  }>;
}

interface CollageGalleryProps {
  onCreateNew: () => void;
}

const CollageGallery: React.FC<CollageGalleryProps> = ({ onCreateNew }) => {
  const navigate = useNavigate();
  const [collages, setCollages] = useState<SavedCollage[]>([]);
  const [selectedCollage, setSelectedCollage] = useState<SavedCollage | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Load saved collages from localStorage on component mount
  useEffect(() => {
    const savedCollagesData = localStorage.getItem('savedCollages');
    if (savedCollagesData) {
      try {
        const parsedData = JSON.parse(savedCollagesData);
        // Convert string dates back to Date objects
        const collagesWithDates = parsedData.map((collage: any) => ({
          ...collage,
          createdAt: new Date(collage.createdAt),
        }));
        setCollages(collagesWithDates);
      } catch (error) {
        console.error('Failed to load saved collages:', error);
      }
    }
  }, []);

  // Save collages to localStorage when they change
  useEffect(() => {
    if (collages.length > 0) {
      localStorage.setItem('savedCollages', JSON.stringify(collages));
    }
  }, [collages]);

  const handleDeleteCollage = () => {
    if (selectedCollage) {
      const updatedCollages = collages.filter(collage => collage.id !== selectedCollage.id);
      setCollages(updatedCollages);
      setSelectedCollage(null);
      setDeleteDialogOpen(false);
      toast.success("Collage deleted successfully!");
    }
  };

  const handleShare = (collage: SavedCollage) => {
    toast.success(`Sharing collage "${collage.name}"`);
  };

  const handleViewCollage = (collage: SavedCollage) => {
    // In a real app, we would navigate to a view page
    // For now, just show a toast
    toast.success(`Viewed collage "${collage.name}"`);
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto pb-16">
      <Header 
        title="Collage"
        subtitle="Create your plant art"
      />
      <div className="p-4">
      {/* Create New Section */}
      <div className="mb-6 bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-2">Start a New Collage</h2>
        <p className="text-muted-foreground mb-4">
          Create a new collage from your plant stickers
        </p>
        <Button 
          onClick={onCreateNew}
          className="bg-plantDiary-vividGreen hover:bg-plantDiary-darkGreen w-full"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Start Creating
        </Button>
      </div>

      {/* Community Section */}
      <div className="mb-6 bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <Users className="h-5 w-5 text-plantDiary-vividGreen" />
          <h2 className="text-xl font-semibold">Community</h2>
        </div>
        <p className="text-muted-foreground mb-4">
          Browse templates and get inspired by other creators
        </p>
        <Button 
          onClick={() => navigate("/community-collage")}
          variant="outline"
          className="w-full border-plantDiary-vividGreen text-plantDiary-vividGreen hover:bg-plantDiary-lightGreen/30"
        >
          <Users className="mr-2 h-5 w-5" />
          Browse Templates
        </Button>
      </div>

      {/* Separator */}
      <div className="flex items-center gap-4 mb-6">
        <Separator className="flex-1" />
        <h2 className="text-lg font-medium">Your Collages</h2>
        <Separator className="flex-1" />
      </div>

      {/* Gallery Section */}
      <div className="flex-1">
        {collages.length === 0 ? (
          <EmptyState
            icon={<Image className="h-8 w-8 text-foreground/40" />}
            title="No collages yet"
            description="Your saved collages will appear here"
            className="bg-white rounded-xl shadow-sm"
          />
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {collages.map((collage) => (
              <Card 
                key={collage.id} 
                className="overflow-hidden hover:shadow-md transition-shadow"
              >
                <div 
                  className="aspect-[3/2] relative cursor-pointer" 
                  onClick={() => handleViewCollage(collage)}
                >
                  <img 
                    src={collage.imageUrl} 
                    alt={collage.name} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-3">
                  <h3 className="font-medium text-sm truncate">{collage.name}</h3>
                  <p className="text-xs text-muted-foreground">{formatDate(collage.createdAt)}</p>
                  <div className="flex justify-between mt-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-xs px-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(collage);
                      }}
                    >
                      <Share2 className="h-3.5 w-3.5 mr-1" />
                      Share
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive text-xs px-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedCollage(collage);
                        setDeleteDialogOpen(true);
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Collage</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this collage? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCollage} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      </div>
    </div>
  );
};

export default CollageGallery;
