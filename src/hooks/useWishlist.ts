import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export function useWishlist() {
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const fetchWishlist = useCallback(async () => {
    if (!user) {
      setWishlistIds([]);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("wishlists")
        .select("product_id")
        .eq("user_id", user.id);

      if (error) throw error;
      setWishlistIds(data?.map((item) => item.product_id) || []);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  }, [user]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const isInWishlist = useCallback(
    (productId: string | number) => {
      return wishlistIds.includes(String(productId));
    },
    [wishlistIds]
  );

  const toggleWishlist = async (productId: string | number, productName?: string) => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please log in to add items to your wishlist.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    const productIdStr = String(productId);

    try {
      if (isInWishlist(productIdStr)) {
        // Remove from wishlist
        const { error } = await supabase
          .from("wishlists")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", productIdStr);

        if (error) throw error;

        setWishlistIds((prev) => prev.filter((id) => id !== productIdStr));
        toast({
          title: "Removed from Wishlist",
          description: productName
            ? `${productName} has been removed from your wishlist.`
            : "Item removed from wishlist.",
        });
      } else {
        // Add to wishlist
        const { error } = await supabase.from("wishlists").insert({
          user_id: user.id,
          product_id: productIdStr,
        });

        if (error) throw error;

        setWishlistIds((prev) => [...prev, productIdStr]);
        toast({
          title: "Added to Wishlist",
          description: productName
            ? `${productName} has been added to your wishlist.`
            : "Item added to wishlist.",
        });
      }
    } catch (error: any) {
      console.error("Error toggling wishlist:", error);
      toast({
        title: "Error",
        description: "Failed to update wishlist. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    wishlistIds,
    isInWishlist,
    toggleWishlist,
    loading,
    refetch: fetchWishlist,
  };
}
