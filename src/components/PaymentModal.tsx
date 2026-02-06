
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabase";
import { recordPayment } from "@/lib/db";
import { Loader2, CreditCard, Building2 } from "lucide-react";

interface PaymentModalProps {
  planName: string;
  amount: string;
  trigger: React.ReactNode;
}

export const PaymentModal = ({ planName, amount, trigger }: PaymentModalProps) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handlePayment = async (method: "card" | "transfer") => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock saving to Supabase
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        await recordPayment({
          plan: planName,
          amount,
          method,
          date: new Date().toISOString(),
          status: 'success'
        });
      }
    } catch (error) {
      console.warn("Payment recording failed (expected in preview without DB):", error);
    }

    // Always show success in preview mode
    toast({
      title: "Payment Successful",
      description: `You have successfully subscribed to the ${planName} plan!`,
      className: "bg-green-500 text-white",
    });
    setOpen(false);
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Subscribe to {planName}</DialogTitle>
          <DialogDescription>
            Secure payment for {amount}. Choose your preferred payment method.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="card" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="card">
              <CreditCard className="mr-2 h-4 w-4" />
              Card
            </TabsTrigger>
            <TabsTrigger value="transfer">
              <Building2 className="mr-2 h-4 w-4" />
              Transfer
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="card" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Cardholder Name</Label>
              <Input id="name" placeholder="John Doe" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="number">Card Number</Label>
              <Input id="number" placeholder="0000 0000 0000 0000" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry</Label>
                <Input id="expiry" placeholder="MM/YY" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvc">CVC</Label>
                <Input id="cvc" placeholder="123" />
              </div>
            </div>
            <Button onClick={() => handlePayment("card")} className="w-full" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Pay Now"}
            </Button>
          </TabsContent>
          
          <TabsContent value="transfer" className="space-y-4 py-4">
            <div className="bg-secondary/50 p-4 rounded-lg space-y-3">
              <p className="text-sm font-medium">Transfer {amount} to:</p>
              <div>
                <p className="text-xs text-muted-foreground">Bank Name</p>
                <p className="font-bold">Access Bank</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Account Number</p>
                <p className="font-bold font-mono text-lg">0123456789</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Account Name</p>
                <p className="font-bold">Handbook Nigeria Ltd</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Upload Proof of Payment (Optional)</Label>
              <Input type="file" />
            </div>
            <Button onClick={() => handlePayment("transfer")} className="w-full" disabled={loading}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "I've Sent the Money"}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
