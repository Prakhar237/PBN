import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const MAX_OFFERS = 8;

interface AffiliateOfferManagerProps {
  onBack: () => void;
}

export default function AffiliateOfferManager({ onBack }: AffiliateOfferManagerProps) {
  const [offers, setOffers] = useState<string[]>(["Mental Peace Mastery", "Detox Life", "Focus Accelerator", "Productivity Powerhouse"]);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [savingIndex, setSavingIndex] = useState<number | null>(null);
  const [links, setLinks] = useState<string[]>(["", "", "", ""]);
  const [linkEditIndex, setLinkEditIndex] = useState<number | null>(null);
  const [linkEditValue, setLinkEditValue] = useState("");
  const [savingLinkIndex, setSavingLinkIndex] = useState<number | null>(null);
  const { toast } = useToast();

  // Fetch offers from Supabase on mount
  useEffect(() => {
    const fetchOffers = async () => {
      setLoading(true);
      const { data, error } = await supabase.from("AFFILIATE_OFFERS").select("*").single();
      if (data) {
        const loadedOffers = [];
        for (let i = 1; i <= MAX_OFFERS; i++) {
          loadedOffers.push(data[`affiliate_offer_${i}`] || "");
        }
        // Remove trailing empty offers
        setOffers(loadedOffers.filter((offer, idx, arr) => offer || idx < 4));
      }
      setLoading(false);
      if (error) {
        toast({ title: "Error loading offers", description: error.message, variant: "destructive" });
      }
    };
    fetchOffers();
    // eslint-disable-next-line
  }, []);

  // Save offer to Supabase
  const saveOffer = async (idx: number, value: string) => {
    setSavingIndex(idx);
    const colName = `affiliate_offer_${idx + 1}`;
    const updateObj: any = {};
    updateObj[colName] = value;
    const { error } = await supabase.from("AFFILIATE_OFFERS").update(updateObj).eq("id", 1); // assumes single row with id=1
    setSavingIndex(null);
    if (error) {
      toast({ title: "Error saving offer", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Offer saved!", description: `Offer ${idx + 1} updated.` });
      setOffers(prev => prev.map((o, i) => (i === idx ? value : o)));
      setEditIndex(null);
    }
  };

  // Add a new offer (up to 8)
  const addOffer = () => {
    if (offers.length < MAX_OFFERS) {
      setOffers([...offers, ""]);
      setLinks([...links, ""]);
      setEditIndex(offers.length);
      setEditValue("");
    }
  };

  // Save link to Supabase
  const saveLink = async (idx: number, value: string) => {
    setSavingLinkIndex(idx);
    try {
      const { error } = await supabase
        .from("Links")
        .upsert({
          id: idx + 1,
          Link_P: value
        });

      if (error) throw error;

      toast({ title: "Link saved!", description: `Link for offer ${idx + 1} updated.` });
      setLinks(prev => prev.map((l, i) => (i === idx ? value : l)));
      setLinkEditIndex(null);
    } catch (error: any) {
      toast({ title: "Error saving link", description: error.message, variant: "destructive" });
    } finally {
      setSavingLinkIndex(null);
    }
  };

  // Render
  return (
    <div className="min-h-screen bg-gradient-secondary p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-2">
            Affiliate Product Manager
          </h1>
          <p className="text-muted-foreground text-lg">
            Manage your affiliate offers
          </p>
        </div>

        <Card className="shadow-card border-0 bg-white/95 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl text-foreground">AFFILIATE PRODUCT MANAGER</CardTitle>
              <p className="text-muted-foreground">PLEASE SELECT THE OFFERS YOU WANT TO INCLUDE</p>
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
          <CardContent className="py-8">
            <div className="flex flex-col gap-6">
              {offers.map((offer, idx) => (
                <div key={idx} className="space-y-4">
                  {/* Offer Name Row */}
                  <div className="flex items-center justify-between gap-4">
                    {editIndex === idx ? (
                      <Input
                        value={editValue}
                        onChange={e => setEditValue(e.target.value)}
                        className="font-semibold text-lg max-w-xs"
                        autoFocus
                      />
                    ) : (
                      <span className="font-semibold text-lg max-w-xs w-1/2 truncate">{offer || `Offer ${idx + 1}`}</span>
                    )}
                    <div className="flex gap-2">
                      {editIndex === idx ? (
                        <Button
                          onClick={() => saveOffer(idx, editValue)}
                          disabled={savingIndex === idx || loading}
                          className="bg-black text-white font-bold px-6"
                        >
                          {savingIndex === idx ? "Saving..." : "SAVE"}
                        </Button>
                      ) : (
                        <Button
                          onClick={() => { setEditIndex(idx); setEditValue(offer); }}
                          className="bg-black text-white font-bold px-6"
                        >
                          EDIT
                        </Button>
                      )}
                      {editIndex !== idx && (
                        <Button
                          onClick={() => saveOffer(idx, offer)}
                          disabled={loading}
                          className="bg-black text-white font-bold px-6"
                        >
                          SAVE
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Link Row */}
                  <div className="flex items-center justify-between gap-4 ml-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Link:</span>
                      {linkEditIndex === idx ? (
                        <Input
                          value={linkEditValue}
                          onChange={e => setLinkEditValue(e.target.value)}
                          placeholder="Enter affiliate link"
                          className="text-sm max-w-xs"
                          autoFocus
                        />
                      ) : (
                        <span className="text-sm max-w-xs truncate text-blue-600">
                          {links[idx] || "No link added"}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {linkEditIndex === idx ? (
                        <Button
                          onClick={() => saveLink(idx, linkEditValue)}
                          disabled={savingLinkIndex === idx}
                          size="sm"
                          className="bg-blue-600 text-white font-bold px-4"
                        >
                          {savingLinkIndex === idx ? "Saving..." : "SAVE"}
                        </Button>
                      ) : (
                        <Button
                          onClick={() => { setLinkEditIndex(idx); setLinkEditValue(links[idx] || ""); }}
                          size="sm"
                          variant="outline"
                          className="font-bold px-4"
                        >
                          {links[idx] ? "EDIT" : "ADD"}
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {offers.length < MAX_OFFERS && (
                <div className="flex justify-center pt-4">
                  <Button
                    onClick={addOffer}
                    className="rounded-full w-12 h-12 bg-black flex items-center justify-center"
                    aria-label="Add Offer"
                  >
                    <Plus className="text-white w-6 h-6" />
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}