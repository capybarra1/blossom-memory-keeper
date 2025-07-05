import React, {useState, useEffect} from "react";
import {
    ArrowLeft,
    Search,
    Heart,
    Download,
    Share2,
    Star,
    Users,
    Filter,
    Leaf,
    Sun,
    TreePine,
    Snowflake,
    Sprout,
    Flower,
    Trees
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card, CardContent} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {Input} from "@/components/ui/input";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Sheet, SheetContent, SheetHeader, SheetTitle} from "@/components/ui/sheet";
import {toast} from "sonner";
import {useNavigate} from "react-router-dom";
import treasureImg from '/src/asset/collages/treasure.png';
import turtleImg from '/src/asset/collages/turtle.png';
import foxImg from '/src/asset/collages/fox.png';
import paradeImg from '/src/asset/collages/parade.png';


interface CollageTemplate {
    id: string;
    name: string;
    imageUrl: string;
    author: string;
    category: "spring" | "summer" | "autumn" | "winter" | "nature" | "garden" | "forest";
    difficulty: "beginner" | "intermediate" | "advanced";
    likes: number;
    downloads: number;
    isLiked?: boolean;
    isShown: boolean;
    tags: string[];
}

// Mock data for templates
const mockTemplates: CollageTemplate[] = [
    {
        id: "template-1",
        name: "Forest Treasures",
        imageUrl: treasureImg,
        author: "LeafWhisperer",
        category: "spring",
        difficulty: "beginner",
        likes: 124,
        downloads: 89,
        isShown :true,
        tags: ["flowers", "meadow", "peaceful"]
    },
    {
        id: "template-2",
        name: "Leafy Turtle",
        imageUrl: turtleImg,
        author: "GreenSteps",
        category: "autumn",
        difficulty: "intermediate",
        likes: 256,
        downloads: 178,
        isShown :true,
        tags: ["leaves", "cozy", "warm"]
    },
    {
        id: "template-3",
        name: "Fox Leaves",
        imageUrl: foxImg,
        author: "PetalCraft",
        category: "winter",
        difficulty: "advanced",
        likes: 89,
        downloads: 45,
        isShown :true,
        tags: ["pine", "minimalist", "serene"]
    },
    {
        id: "template-4",
        name: "Bug Parade",
        imageUrl: paradeImg,
        author: "TinyNature",
        category: "summer",
        difficulty: "intermediate",
        likes: 198,
        downloads: 134,
        isShown :true,
        tags: ["garden", "vibrant", "bloom"]
    },
    {
        id: "template-5",
        name: "Forest Path",
        imageUrl: "https://via.placeholder.com/300x200/228b22/006400?text=Forest+Path",
        author: "WildlifeFan",
        category: "forest",
        difficulty: "beginner",
        likes: 167,
        downloads: 92,
        isShown:false,
        tags: ["forest", "adventure", "peaceful"]
    },
    {
        id: "template-6",
        name: "Botanical Study",
        imageUrl: "https://via.placeholder.com/300x200/f5f5dc/8fbc8f?text=Botanical+Study",
        author: "ScienceNerd",
        category: "nature",
        difficulty: "advanced",
        likes: 78,
        downloads: 34,
        isShown:false,
        tags: ["scientific", "detailed", "educational"]
    }
];

const CommunityCollage: React.FC = () => {
    const navigate = useNavigate();
    const [templates, setTemplates] = useState<CollageTemplate[]>(mockTemplates);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [showFilters, setShowFilters] = useState(false);

    const categories = [
        {id: "all", label: "All", icon: Leaf},
        {id: "spring", label: "Spring", icon: Flower},
        {id: "summer", label: "Summer", icon: Sun},
        {id: "autumn", label: "Autumn", icon: Leaf},
        {id: "winter", label: "Winter", icon: Snowflake},
        {id: "nature", label: "Nature", icon: Sprout},
        {id: "garden", label: "Garden", icon: Flower},
        {id: "forest", label: "Forest", icon: Trees}
    ];

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case "beginner":
                return "bg-green-100 text-green-800";
            case "intermediate":
                return "bg-yellow-100 text-yellow-800";
            case "advanced":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getDifficultyStars = (difficulty: string) => {
        switch (difficulty) {
            case "beginner":
                return 1;
            case "intermediate":
                return 2;
            case "advanced":
                return 3;
            default:
                return 1;
        }
    };

    const filteredTemplates = templates.filter(template => {
        const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
        return matchesSearch && matchesCategory && template.isShown ;
    });

    const handleLike = (templateId: string) => {
        setTemplates(templates.map(template => {
            if (template.id === templateId) {
                return {
                    ...template,
                    isLiked: !template.isLiked,
                    likes: template.isLiked ? template.likes - 1 : template.likes + 1
                };
            }
            return template;
        }));
    };

    const handleDownload = (template: CollageTemplate) => {
        toast.success(`Downloaded "${template.name}" template`);
        setTemplates(templates.map(t =>
            t.id === template.id ? {...t, downloads: t.downloads + 1} : t
        ));
    };

    const handleUseTemplate = (template: CollageTemplate) => {
        //toast.success(`Using "${template.name}" template`);
        navigate("/collage", {state: {templateId: template.id}});
    };

    const handleShare = (template: CollageTemplate) => {
        toast.success(`Shared "${template.name}" template`);
    };

    return (
        <div className="h-screen flex flex-col bg-plantDiary-lightGreen/20">
            {/* Header */}
            <div className="flex justify-between items-center p-4 bg-white shadow-sm">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("/", {state: {activeTab: "collage"}})}
                >
                    <ArrowLeft className="h-5 w-5"/>
                </Button>
                <h1 className="text-lg font-semibold">Community Templates</h1>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowFilters(true)}
                >
                    <Filter className="h-5 w-5"/>
                </Button>
            </div>

            {/* Search */}
            <div className="p-4 bg-white border-b">
                <div className="relative">
                    <Search
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                    <Input
                        placeholder="Search templates..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                    />
                </div>
            </div>

            {/* Category Tabs */}
            <div className="bg-white border-b">
                <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                    <TabsList className="grid w-full grid-cols-4 p-0 h-auto bg-transparent">
                        {categories.slice(0, 4).map((category) => {
                            const IconComponent = category.icon;
                            return (
                                <TabsTrigger
                                    key={category.id}
                                    value={category.id}
                                    className="flex flex-col items-center py-3 data-[state=active]:bg-plantDiary-lightGreen/30"
                                >
                                    <IconComponent className="h-5 w-5 mb-1 text-plantDiary-vividGreen"/>
                                    <span className="text-xs">{category.label}</span>
                                </TabsTrigger>
                            );
                        })}
                    </TabsList>
                </Tabs>
            </div>

            {/* Templates Grid */}
            <div className="flex-1 overflow-y-auto p-4 pb-20">
                <div className="grid grid-cols-2 gap-4">
                    {filteredTemplates.map((template) => (
                        <Card
                            key={template.id}
                            className="overflow-hidden hover:shadow-lg transition-shadow"
                        >
                            <div className="relative">
                                <img
                                    src={template.imageUrl}
                                    alt={template.name}
                                    className="w-full h-full aspect-[6/7] object-cover cursor-pointer"
                                    onClick={() => handleUseTemplate(template)}
                                />
                                <div className="absolute top-2 right-2 flex gap-1">
                                    <Badge className={getDifficultyColor(template.difficulty)}>
                                        {Array.from({length: getDifficultyStars(template.difficulty)}).map((_, i) => (
                                            <Star key={i} className="h-3 w-3 fill-current"/>
                                        ))}
                                    </Badge>
                                </div>
                            </div>
                            <CardContent className="p-3">
                                <h3 className="font-medium text-sm truncate mb-1">{template.name}</h3>
                                <p className="text-xs text-muted-foreground mb-2">by {template.author}</p>
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Heart className={`h-3 w-3 ${template.isLiked ? 'fill-red-500 text-red-500' : ''}`}/>
                        {template.likes}
                    </span>
                                        <span className="flex items-center gap-1">
                      <Download className="h-3 w-3"/>
                                            {template.downloads}
                    </span>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleLike(template.id);
                                            }}
                                        >
                                            <Heart
                                                className={`h-3 w-3 ${template.isLiked ? 'fill-red-500 text-red-500' : ''}`}/>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="h-6 w-6 p-0"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleShare(template);
                                            }}
                                        >
                                            <Share2 className="h-3 w-3"/>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Filters Sheet */}
            <Sheet open={showFilters} onOpenChange={setShowFilters}>
                <SheetContent side="bottom">
                    <SheetHeader>
                        <SheetTitle>Filter Templates</SheetTitle>
                    </SheetHeader>
                    <div className="mt-6 space-y-6">
                        <div>
                            <h3 className="font-medium mb-3">Categories</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {categories.map((category) => {
                                    const IconComponent = category.icon;
                                    return (
                                        <Button
                                            key={category.id}
                                            variant={selectedCategory === category.id ? "default" : "outline"}
                                            className="justify-start"
                                            onClick={() => {
                                                setSelectedCategory(category.id);
                                                setShowFilters(false);
                                            }}
                                        >
                                            <IconComponent className="mr-2 h-4 w-4"/>
                                            {category.label}
                                        </Button>
                                    );
                                })}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-medium mb-3">Difficulty</h3>
                            <div className="space-y-2">
                                {["beginner", "intermediate", "advanced"].map((difficulty) => (
                                    <div key={difficulty} className="flex items-center justify-between">
                                        <span className="capitalize">{difficulty}</span>
                                        <div className="flex">
                                            {Array.from({length: getDifficultyStars(difficulty)}).map((_, i) => (
                                                <Star key={i} className="h-3 w-3 fill-current text-yellow-500"/>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
};

export default CommunityCollage;
