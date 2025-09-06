import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Bot, Globe, Link, Package, Loader2, Edit3, Handshake, Sparkles, Type, Quote } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProductMenu from "./ProductMenu";
import AffiliateOfferManager from "./AffiliateOfferManager";

interface ContentStructureOption {
  id: string;
  label: string;
  description: string;
}

const contentStructureOptions: ContentStructureOption[] = [
  { id: "layout1", label: "Layout 1", description: "Single Main Focus - Large main product image with three supporting images below and mini blog section" },
  { id: "layout2", label: "Layout 2", description: "Balanced Grid - Medium main image with grid of supporting images and mini blog section" },
  { id: "layout3", label: "Layout 3", description: "Carousel Style - Large main image with navigation arrows and mini blog section" },
];

const productOptions = [
  { id: "bible-peace-finder", label: "BiblePeaceFinder.com" },
  { id: "forget-check", label: "ForgetCheck.com" },
  { id: "both", label: "Both" },
];

export default function BlogNetworkForm() {
  const [domain, setDomain] = useState("");
  const [websiteContext, setWebsiteContext] = useState("");
  const [partnershipWith, setPartnershipWith] = useState("");
  const [contentStructure, setContentStructure] = useState("");
  const [affiliateLink, setAffiliateLink] = useState("");
  const [productPromotion, setProductPromotion] = useState<string[]>([]);
  const [contentAssetOption, setContentAssetOption] = useState<"daily" | "youtube" | "image">("daily");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [affiliateOfferHeader, setAffiliateOfferHeader] = useState("Transform your Life today");
  const [byline, setByline] = useState("Choose Your Premium Wellness Journey");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingPhase, setLoadingPhase] = useState(0);
  const [showProductMenu, setShowProductMenu] = useState(false);
  const [showAffiliateManager, setShowAffiliateManager] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const loadingMessages = [
    "Scanning website...",
    "Checking SEO compatibility adding website to blog network...",
    "Website registered"
  ];

  const handleProductPromotionChange = (optionId: string, checked: boolean) => {
    if (optionId === "both") {
      if (checked) {
        setProductPromotion(["BiblePeaceFinder.com", "ForgetCheck.com"]);
      } else {
        setProductPromotion([]);
      }
    } else {
      const productName = optionId === "bible-peace-finder" ? "BiblePeaceFinder.com" : "ForgetCheck.com";
      
      if (checked) {
        setProductPromotion(prev => {
          const newPromotion = [...prev, productName];
          return newPromotion;
        });
      } else {
        setProductPromotion(prev => {
          const filtered = prev.filter(p => p !== productName);
          // If we had both selected and now only one remains, ensure "both" is unchecked
          return filtered;
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!domain || !contentStructure) {
      toast({
        title: "Missing Information",
        description: "Please fill in the domain and select a content structure.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    setLoadingPhase(0);

    // Phase 1: Scanning website (5 seconds)
    setTimeout(() => {
      setLoadingPhase(1);
    }, 5000);

    // Phase 2: Checking SEO compatibility (5 seconds)
    setTimeout(async () => {
      setLoadingPhase(2);
      
      try {
        const { data, error } = await supabase
          .from('BlogData')
          .insert({
            domain: domain,
            website_context: websiteContext || null,
            content_structure: contentStructure,
            affiliate_partner_link: affiliateLink || null,
            product_promotion: productPromotion.length > 0 ? productPromotion : null,
          })
          .select();

        if (error) throw error;

        // Show final success message
        setTimeout(() => {
          toast({
            title: "Success!",
            description: "Blog network configuration saved successfully.",
          });

          // Reset form
          setDomain("");
          setWebsiteContext("");
          setContentStructure("");
          setAffiliateLink("");
          setProductPromotion([]);
          setIsSubmitting(false);
          setLoadingPhase(0);
        }, 2000);

      } catch (error) {
        console.error('Error saving blog data:', error);
        toast({
          title: "Error",
          description: "Failed to save blog network configuration. Please try again.",
          variant: "destructive",
        });
        setIsSubmitting(false);
        setLoadingPhase(0);
      }
    }, 10000);
  };

  const isProductSelected = (optionId: string) => {
    if (optionId === "both") {
      return productPromotion.includes("BiblePeaceFinder.com") && productPromotion.includes("ForgetCheck.com");
    }
    const productName = optionId === "bible-peace-finder" ? "BiblePeaceFinder.com" : "ForgetCheck.com";
    return productPromotion.includes(productName);
  };

  const handleLayoutSelect = (layoutId: string) => {
    setContentStructure(layoutId);
    setShowProductMenu(true);
  };

  const handleBackFromProductMenu = () => {
    setShowProductMenu(false);
  };

  const handleOpenAffiliateManager = () => {
    setShowAffiliateManager(true);
  };

  const handleBackFromAffiliateManager = () => {
    setShowAffiliateManager(false);
  };

  // Show ProductMenu if a layout is selected
  if (showProductMenu) {
    return (
      <ProductMenu 
        selectedLayout={contentStructure} 
        onBack={handleBackFromProductMenu} 
      />
    );
  }

  // Show AffiliateOfferManager if requested
  if (showAffiliateManager) {
    return (
      <AffiliateOfferManager onBack={handleBackFromAffiliateManager} />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-secondary p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Bot className="h-12 w-12 text-primary mr-3" />
            <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              Private Blog Network Automation
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Configure your automated blog network settings
          </p>
        </div>

        <Card className="shadow-card border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-8">
            <CardTitle className="text-2xl text-foreground">Network Configuration</CardTitle>
            <CardDescription>
              Set up your blog network automation parameters
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Domain Input */}
              <div className="space-y-3">
                <Label htmlFor="domain" className="text-base font-semibold flex items-center">
                  <Globe className="h-4 w-4 mr-2 text-primary" />
                  Domain
                </Label>
                <Input
                  id="domain"
                  type="text"
                  placeholder="Enter your domain (e.g., example.com)"
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  className="h-12 text-base"
                  required
                />
              </div>

              {/* Website Context */}
              <div className="space-y-3">
                <Label htmlFor="websiteContext" className="text-base font-semibold flex items-center">
                  <Bot className="h-4 w-4 mr-2 text-primary" />
                  Website Context
                </Label>
                <Input
                  id="websiteContext"
                  type="text"
                  placeholder="Describe the website context (e.g., tech blog, lifestyle, business)"
                  value={websiteContext}
                  onChange={(e) => setWebsiteContext(e.target.value)}
                  className="h-12 text-base"
                />
              </div>

              {/* Content Asset Source */}
              <div className="space-y-4">
                <Label className="text-base font-semibold flex items-center">
                  <Sparkles className="h-4 w-4 mr-2 text-primary" />
                  Content Asset Source
                </Label>
                <div className="space-y-3">
                  {/* Daily Spark tool (default) */}
                  <div className="flex items-start gap-3">
                    <input
                      type="radio"
                      id="asset-daily"
                      name="contentAssetOption"
                      className="mt-1"
                      checked={contentAssetOption === "daily"}
                      onChange={() => setContentAssetOption("daily")}
                    />
                    <Label htmlFor="asset-daily" className="cursor-pointer">Daily Spark tool</Label>
                  </div>

                  {/* YouTube link */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        id="asset-youtube"
                        name="contentAssetOption"
                        className="mt-1"
                        checked={contentAssetOption === "youtube"}
                        onChange={() => setContentAssetOption("youtube")}
                      />
                      <Label htmlFor="asset-youtube" className="cursor-pointer">Enter YouTube link</Label>
                    </div>
                    <Input
                      type="url"
                      placeholder="https://youtube.com/..."
                      value={youtubeUrl}
                      onChange={(e) => setYoutubeUrl(e.target.value)}
                      disabled={contentAssetOption !== "youtube"}
                      className="h-11"
                    />
                  </div>

                  {/* Image URL */}
                  <div className="flex flex-col gap-2">
                    <div className="flex items-start gap-3">
                      <input
                        type="radio"
                        id="asset-image"
                        name="contentAssetOption"
                        className="mt-1"
                        checked={contentAssetOption === "image"}
                        onChange={() => setContentAssetOption("image")}
                      />
                      <Label htmlFor="asset-image" className="cursor-pointer">Image</Label>
                    </div>
                    <Input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      disabled={contentAssetOption !== "image"}
                      className="h-11"
                    />
                  </div>
                </div>
              </div>

              {/* In Partnership With (optional) */}
              <div className="space-y-3">
                <Label htmlFor="partnershipWith" className="text-base font-semibold flex items-center">
                  <Handshake className="h-4 w-4 mr-2 text-purple-600" />
                  In partnership with (optional)
                </Label>
                <Input
                  id="partnershipWith"
                  type="text"
                  placeholder="Enter partner name (optional)"
                  value={partnershipWith}
                  onChange={(e) => setPartnershipWith(e.target.value)}
                  className="h-12 text-base"
                />
              </div>

              {/* Change Affiliate Offer Header */}
              <div className="space-y-3">
                <Label htmlFor="affiliateOfferHeader" className="text-base font-semibold flex items-center">
                  <Type className="h-4 w-4 mr-2 text-primary" />
                  Change Affiliate Offer Header
                </Label>
                <Input
                  id="affiliateOfferHeader"
                  type="text"
                  placeholder="Enter affiliate offer header"
                  value={affiliateOfferHeader}
                  onChange={(e) => setAffiliateOfferHeader(e.target.value)}
                  className="h-12 text-base"
                />
              </div>

              {/* Change Byline */}
              <div className="space-y-3">
                <Label htmlFor="byline" className="text-base font-semibold flex items-center">
                  <Quote className="h-4 w-4 mr-2 text-primary" />
                  Change Byline
                </Label>
                <Input
                  id="byline"
                  type="text"
                  placeholder="Enter byline"
                  value={byline}
                  onChange={(e) => setByline(e.target.value)}
                  className="h-12 text-base"
                />
              </div>

              {/* Digital Product Upload */}
              <div className="space-y-4">
                <Label className="text-base font-semibold flex items-center">
                  <Package className="h-4 w-4 mr-2 text-primary" />
                  Digital Product Upload
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {contentStructureOptions.map((option, index) => (
                    <div key={option.id} className="relative">
                      <input
                        type="radio"
                        id={option.id}
                        name="contentStructure"
                        value={option.id}
                        checked={contentStructure === option.id}
                        onChange={(e) => handleLayoutSelect(e.target.value)}
                        className="sr-only"
                      />
                      <label
                        htmlFor={option.id}
                        className={`block p-6 border-2 rounded-lg cursor-pointer transition-all hover:shadow-card ${
                          contentStructure === option.id
                            ? 'border-primary bg-accent shadow-elegant'
                            : 'border-border hover:border-primary/50'
                        }`}
                        onClick={() => handleLayoutSelect(option.id)}
                      >
                        <div className="text-center">
                          <div className="text-lg font-bold mb-3">{option.label}</div>
                          <div className="mb-4 h-24">
                            {index === 0 && (
                              <div className="space-y-1">
                                {/* Layout 1: Single Main Focus */}
                                <div className="border-2 border-muted h-12 rounded flex items-center justify-center text-xs bg-gray-100">
                                  MAIN IMAGE
                                </div>
                                <div className="grid grid-cols-3 gap-1">
                                  <div className="border border-muted h-6 rounded flex items-center justify-center text-xs bg-gray-50">IMG</div>
                                  <div className="border border-muted h-6 rounded flex items-center justify-center text-xs bg-gray-50">IMG</div>
                                  <div className="border border-muted h-6 rounded flex items-center justify-center text-xs bg-gray-50">IMG</div>
                                </div>
                                <div className="border border-muted h-3 rounded bg-blue-50"></div>
                              </div>
                            )}
                            {index === 1 && (
                              <div className="grid grid-cols-2 gap-1 h-full">
                                {/* Layout 2: Balanced Grid */}
                                <div className="border-2 border-muted rounded flex items-center justify-center text-xs bg-gray-100">
                                  MAIN
                                </div>
                                <div className="space-y-1">
                                  <div className="border border-muted h-8 rounded flex items-center justify-center text-xs bg-gray-50">IMG 04</div>
                                  <div className="grid grid-cols-2 gap-1">
                                    <div className="border border-muted h-6 rounded flex items-center justify-center text-xs bg-gray-50">03</div>
                                    <div className="border border-muted h-6 rounded flex items-center justify-center text-xs bg-gray-50">02</div>
                                  </div>
                                </div>
                              </div>
                            )}
                            {index === 2 && (
                              <div className="space-y-1">
                                {/* Layout 3: Carousel Style */}
                                <div className="relative border-2 border-muted h-16 rounded flex items-center justify-center text-xs bg-gray-100">
                                  <div className="absolute left-1 top-1/2 transform -translate-y-1/2 w-3 h-3 border border-gray-400 rounded-full flex items-center justify-center">◀</div>
                                  MAIN IMAGE
                                  <div className="absolute right-1 top-1/2 transform -translate-y-1/2 w-3 h-3 border border-gray-400 rounded-full flex items-center justify-center">▶</div>
                                </div>
                                <div className="border border-muted h-4 rounded bg-blue-50"></div>
                              </div>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">{option.description}</div>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Blog Publishing Options */}
              <div className="space-y-4">
                <Label className="text-base font-semibold flex items-center">
                  <Edit3 className="h-4 w-4 mr-2 text-primary" />
                  Blog Publishing
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/blog-editor/biblepeacefinder')}
                    className="h-20 flex flex-col items-center justify-center text-center p-4 hover:bg-accent hover:border-primary transition-all"
                  >
                    <Edit3 className="h-6 w-6 mb-2 text-primary" />
                    <span className="font-medium">Publish Blog for</span>
                    <span className="text-sm text-muted-foreground">Bible PeaceFinder</span>
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/blog-editor/forgetcheck')}
                    className="h-20 flex flex-col items-center justify-center text-center p-4 hover:bg-accent hover:border-primary transition-all"
                  >
                    <Edit3 className="h-6 w-6 mb-2 text-primary" />
                    <span className="font-medium">Publish Blog for</span>
                    <span className="text-sm text-muted-foreground">ForgetCheck.com</span>
                  </Button>
                  
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/blog-editor/digitalproduct')}
                    className="h-20 flex flex-col items-center justify-center text-center p-4 hover:bg-accent hover:border-primary transition-all"
                  >
                    <Edit3 className="h-6 w-6 mb-2 text-primary" />
                    <span className="font-medium">Publish Blog for</span>
                    <span className="text-sm text-muted-foreground">Digital Product</span>
                  </Button>
                </div>
              </div>



              {/* Add Affiliate Offers Button */}
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleOpenAffiliateManager}
                  className="w-full h-12 text-base font-semibold"
                >
                  Add Affiliate Offers
                </Button>
              </div>

              {/* Product Promotion */}
              <div className="space-y-4">
                <Label className="text-base font-semibold flex items-center">
                  <Package className="h-4 w-4 mr-2 text-primary" />
                  Product Promotion
                </Label>
                <div className="space-y-3">
                  {productOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={option.id}
                        checked={isProductSelected(option.id)}
                        onCheckedChange={(checked) => handleProductPromotionChange(option.id, checked as boolean)}
                        className="h-5 w-5"
                      />
                      <Label
                        htmlFor={option.id}
                        className="text-base font-medium cursor-pointer"
                      >
                        {option.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  variant="premium"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full text-base font-semibold h-14"
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                      {loadingMessages[loadingPhase]}
                    </div>
                  ) : (
                    "Save Blog Network Configuration"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}