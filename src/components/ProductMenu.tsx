import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Upload, Bold, Italic, X, Image as ImageIcon } from "lucide-react";

interface ProductMenuProps {
  selectedLayout: string;
  onBack: () => void;
}

export default function ProductMenu({ selectedLayout, onBack }: ProductMenuProps) {
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [productName, setProductName] = useState("");
  const [productNameFormat, setProductNameFormat] = useState<{ bold: boolean; italic: boolean }>({ bold: false, italic: false });
  const [miniBlog, setMiniBlog] = useState("");
  const [miniBlogFormat, setMiniBlogFormat] = useState<{ bold: boolean; italic: boolean }>({ bold: false, italic: false });
  const [alsoAvailableEnabled, setAlsoAvailableEnabled] = useState(false);
  const [alsoAvailableUrl, setAlsoAvailableUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    if (uploadedImages.length + files.length > 4) {
      toast({
        title: "Too many images",
        description: "Maximum 4 images allowed.",
        variant: "destructive",
      });
      return;
    }

    // Validate file types
    const validFiles = files.filter(file => 
      file.type.startsWith('image/') && 
      ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(file.type)
    );

    if (validFiles.length !== files.length) {
      toast({
        title: "Invalid file type",
        description: "Please upload only JPG, PNG, or WebP images.",
        variant: "destructive",
      });
    }

    setUploadedImages(prev => [...prev, ...validFiles]);
  };

  const removeImage = (index: number) => {
    setUploadedImages(prev => prev.filter((_, i) => i !== index));
  };

  const toggleFormat = (field: 'productName' | 'miniBlog', format: 'bold' | 'italic') => {
    if (field === 'productName') {
      setProductNameFormat(prev => ({ ...prev, [format]: !prev[format] }));
    } else {
      setMiniBlogFormat(prev => ({ ...prev, [format]: !prev[format] }));
    }
  };

  const getFormattedText = (text: string, format: { bold: boolean; italic: boolean }) => {
    let formattedText = text;
    if (format.bold) formattedText = `**${formattedText}**`;
    if (format.italic) formattedText = `*${formattedText}*`;
    return formattedText;
  };

  const handleSave = async () => {
    if (!productName.trim()) {
      toast({
        title: "Missing product name",
        description: "Please enter a product name.",
        variant: "destructive",
      });
      return;
    }

    if (!miniBlog.trim()) {
      toast({
        title: "Missing mini blog",
        description: "Please enter a mini blog description.",
        variant: "destructive",
      });
      return;
    }

    if (uploadedImages.length === 0) {
      toast({
        title: "No images uploaded",
        description: "Please upload at least one product image.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Upload images to Supabase storage
      const imageUrls: string[] = [];
      
      for (const image of uploadedImages) {
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}-${image.name}`;
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('product-uploads')
          .upload(fileName, image);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from('product-uploads')
          .getPublicUrl(fileName);

        imageUrls.push(urlData.publicUrl);
      }

      // Compose mini blog with optional Also Available link
      let finalMiniBlog = getFormattedText(miniBlog, miniBlogFormat);
      if (alsoAvailableEnabled && alsoAvailableUrl.trim()) {
        const safeUrl = alsoAvailableUrl.trim();
        const prefixedUrl = /^https?:\/\//i.test(safeUrl) ? safeUrl : `https://${safeUrl}`;
        finalMiniBlog = `${finalMiniBlog}\n\nAlso Available @ ${prefixedUrl}`;
      }

      // Save product data to database
      const { error: dbError } = await supabase
        .from('product_upload')
        .insert({
          layout_type: selectedLayout,
          product_name: getFormattedText(productName, productNameFormat),
          mini_blog: finalMiniBlog,
          image_urls: imageUrls,
          created_at: new Date().toISOString()
        });

      if (dbError) throw dbError;

      toast({
        title: "Success!",
        description: "Product information saved successfully.",
      });

      // Reset form
      setUploadedImages([]);
      setProductName("");
      setProductNameFormat({ bold: false, italic: false });
      setMiniBlog("");
      setMiniBlogFormat({ bold: false, italic: false });
      onBack();

    } catch (error) {
      console.error('Error saving product data:', error);
      toast({
        title: "Error",
        description: "Failed to save product information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const layoutTitles = {
    layout1: "Layout 1 - Single Main Focus",
    layout2: "Layout 2 - Balanced Grid", 
    layout3: "Layout 3 - Carousel Style"
  };

  return (
    <div className="min-h-screen bg-gradient-secondary p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Product Configuration
          </h1>
          <p className="text-muted-foreground text-lg">
            {layoutTitles[selectedLayout as keyof typeof layoutTitles]}
          </p>
        </div>

        <Card className="shadow-card border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-foreground">Product Details</CardTitle>
              <CardDescription>
                Upload images and configure product information
              </CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Also Available toggle (applies to all product menus) */}
            <div className="flex items-center justify-between p-3 rounded-md bg-gray-50">
              <Label className="text-sm font-medium text-gray-700 mr-4">Also Available @ (optional)</Label>
              <div className="flex items-center gap-3">
                <Switch checked={alsoAvailableEnabled} onCheckedChange={setAlsoAvailableEnabled} />
                <Input
                  type="text"
                  value={alsoAvailableUrl}
                  onChange={(e) => setAlsoAvailableUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-72"
                  disabled={!alsoAvailableEnabled}
                />
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="space-y-4">
              <Label className="text-base font-semibold flex items-center">
                <ImageIcon className="h-4 w-4 mr-2 text-primary" />
                Product Images (Max 4)
              </Label>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`Product ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border-2 border-border"
                    />
                    <Button
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                
                {uploadedImages.length < 4 && (
                  <div
                    className="w-full h-32 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-6 w-6 text-muted-foreground mb-2" />
                    <span className="text-sm text-muted-foreground">Upload Image</span>
                  </div>
                )}
              </div>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                className="hidden"
              />
              
              <p className="text-sm text-muted-foreground">
                {uploadedImages.length}/4 images uploaded
              </p>
            </div>

            {/* Product Name Section */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Product Name</Label>
              
              <div className="flex gap-2 mb-2">
                <Button
                  type="button"
                  variant={productNameFormat.bold ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFormat('productName', 'bold')}
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant={productNameFormat.italic ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFormat('productName', 'italic')}
                >
                  <Italic className="h-4 w-4" />
                </Button>
              </div>
              
              <Input
                type="text"
                placeholder="Enter product name"
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                className="h-12 text-base"
                style={{
                  fontWeight: productNameFormat.bold ? 'bold' : 'normal',
                  fontStyle: productNameFormat.italic ? 'italic' : 'normal'
                }}
              />
            </div>

            {/* Mini Blog Section */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Mini Blog (Max 400 words)</Label>
              
              <div className="flex gap-2 mb-2">
                <Button
                  type="button"
                  variant={miniBlogFormat.bold ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFormat('miniBlog', 'bold')}
                >
                  <Bold className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant={miniBlogFormat.italic ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleFormat('miniBlog', 'italic')}
                >
                  <Italic className="h-4 w-4" />
                </Button>
              </div>
              
              <Textarea
                placeholder="Enter mini blog description (max 400 words)"
                value={miniBlog}
                onChange={(e) => setMiniBlog(e.target.value)}
                className="min-h-[120px] text-base resize-none"
                style={{
                  fontWeight: miniBlogFormat.bold ? 'bold' : 'normal',
                  fontStyle: miniBlogFormat.italic ? 'italic' : 'normal'
                }}
                maxLength={400}
              />
              
              <p className="text-sm text-muted-foreground text-right">
                {miniBlog.length}/400 characters
              </p>
            </div>

            {/* Save Button */}
            <div className="pt-6">
              <Button
                onClick={handleSave}
                variant="premium"
                size="lg"
                disabled={isUploading}
                className="w-full text-base font-semibold h-14"
              >
                {isUploading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Saving...
                  </div>
                ) : (
                  "Save Product Information"
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 