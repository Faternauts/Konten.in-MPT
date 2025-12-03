"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RemixModal } from "@/components/remix-modal";
import { UploadAdModal } from "@/components/upload-ad-modal";
import {
  Heart,
  MessageCircle,
  Sparkles,
  Bookmark,
  MoreHorizontal,
  Upload,
  Trash2,
  ChevronDown,
} from "lucide-react";
import {
  saveAd,
  getOrCreateCompany,
  getAllAds,
  deleteAd,
} from "@/lib/supabase";
import { formatNumberWithCommas } from "@/lib/format";

const categories = ["All", "Super Bowl", "Tech", "Viral", "Fashion", "Food"];

const mockAds = [
  {
    id: 2,
    brand: "Apple",
    location: "Cupertino, California",
    image: "/apple-iphone-product-advertisement.jpg",
    caption:
      "Innovation that moves the world forward. Beautifully designed, simply powerful.",
    remixCount: 2891,
    likes: 5234,
    isLiked: false,
    comments: 289,
    category: "Tech",
    topComments: [
      { user: "tech_enthusiast", text: "Can't wait to remix this!", likes: 67 },
      { user: "designer_emma", text: "The minimalism is stunning", likes: 52 },
    ],
  },
  {
    id: 4,
    brand: "Tesla",
    location: "Austin, Texas",
    image: "/tesla-electric-car-advertisement.jpg",
    caption:
      "The future is electric. Sustainable energy for everyone. #Tesla #ElectricVehicle",
    remixCount: 1823,
    likes: 4123,
    isLiked: false,
    comments: 201,
    category: "Tech",
    topComments: [
      { user: "eco_warrior", text: "This is the future!", likes: 38 },
    ],
  },

  {
    id: 6,
    brand: "Spotify",
    location: "Stockholm, Sweden",
    image: "/spotify-music-streaming-advertisement.jpg",
    caption:
      "Music for everyone. Discover, stream, and share the soundtrack to your life.",
    remixCount: 2134,
    likes: 4567,
    isLiked: false,
    comments: 234,
    category: "Viral",
    topComments: [
      { user: "music_lover", text: "The colors are amazing!", likes: 56 },
      { user: "dj_alex", text: "Perfect vibe", likes: 41 },
    ],
  },
];

export default function HomePage() {
  const router = useRouter();
  const [isRemixModalOpen, setIsRemixModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedAd, setSelectedAd] = useState<(typeof mockAds)[0] | null>(
    null
  );
  const [ads, setAds] = useState(mockAds);
  const [deletingAdId, setDeletingAdId] = useState<string | number | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [hasAccess, setHasAccess] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  // Check if user has visited login page
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window !== "undefined") {
        const visited = localStorage.getItem("hasVisitedLogin");
        if (!visited) {
          router.replace("/login");
        } else {
          setHasAccess(true);
        }
        setIsChecking(false);
      }
    };
    checkAuth();
  }, []);

  const filteredAds = searchQuery
    ? ads.filter(
        (ad) =>
          ad.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ad.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
          ad.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : ads;

  // Load ads from Supabase on page load
  useEffect(() => {
    const loadAds = async () => {
      try {
        console.log("🔄 Starting to load ads from Supabase...");
        const supabaseAds = await getAllAds();
        console.log("✅ Loaded ads from Supabase:", supabaseAds.length, "ads");
        console.log("📦 Raw Supabase data:", supabaseAds);

        // Transform Supabase ads to match the format expected by the component
        const transformedAds = supabaseAds.map((ad: any) => {
          const imageUrl = ad.image_url || ad.video_url;
          const isVideo = !ad.image_url && ad.video_url;
          console.log("🔄 Transforming ad:", {
            id: ad.id,
            title: ad.title,
            imageUrl,
            videoUrl: ad.video_url,
            isVideo,
            brand: ad.companies?.name,
          });

          // Get the prompts count by counting the array length
          const promptsCount = ad.prompts?.length || 0;

          return {
            id: ad.id,
            brand: ad.companies?.name || "Unknown",
            location: ad.location || ad.companies?.location || "Unknown",
            image: imageUrl,
            caption: ad.title || "",
            remixCount: promptsCount,
            likes: ad.likes || 0,
            isLiked: false,
            comments: promptsCount,
            category: "Tech", // You can add this to your schema later
            topComments: [],
            isUserCreated: true,
          };
        });

        // Combine with mock ads (user uploaded first, then mock ads)
        setAds([...transformedAds, ...mockAds]);
        console.log(
          "✅ Total ads in feed:",
          transformedAds.length,
          "from Supabase +",
          mockAds.length,
          "mock =",
          transformedAds.length + mockAds.length
        );
      } catch (error) {
        console.error("❌ Error loading from Supabase:", error);
        console.warn("⚠️ Supabase unavailable, using mock data only");
        // Keep using mock ads on error - this is expected if database isn't set up
        setAds(mockAds);
      }
    };

    loadAds();
  }, []);

  const handleUpload = async (adData: {
    brand: string;
    title: string;
    imageUrl: string;
    category: string;
    companyId: string;
    location: string;
    isVideo?: boolean;
  }) => {
    try {
      console.log("Upload started with data:", adData);

      // First, get or create the company
      console.log("Getting or creating company:", adData.brand);
      const company = await getOrCreateCompany(adData.brand);
      console.log("Company retrieved:", company);

      // Then save the ad with the URL from upload and get the returned data
      console.log("Saving ad to database...");

      // Check if it's a video from the upload response or file extension
      const isVideoFile =
        adData.isVideo || adData.imageUrl?.match(/\.(mp4|webm|mov)$/i);

      console.log("File type check:", {
        isVideo: isVideoFile,
        url: adData.imageUrl,
      });

      const savedAd = await saveAd(
        company.id,
        adData.title,
        isVideoFile ? "" : adData.imageUrl, // Image URL (empty string if video)
        adData.location, // Location from form
        isVideoFile ? adData.imageUrl : undefined // Video URL if it's a video
      );

      console.log("Ad saved to Supabase successfully", savedAd);

      // Use the ID and likes returned from Supabase
      const adId = savedAd[0].id;
      const adLikes = savedAd[0].likes || 0;

      // Create new ad for the feed with Supabase ID
      const newAd = {
        id: adId,
        brand: adData.brand,
        location: adData.location,
        image: adData.imageUrl,
        caption: adData.title,
        remixCount: 0,
        likes: adLikes,
        isLiked: false,
        comments: 0,
        category: adData.category,
        topComments: [],
        isUserCreated: true,
      };
      console.log("Adding ad to state:", newAd);
      setAds([newAd, ...ads]);
      console.log("Ad added to state successfully");

      // Create new ad page data
      const newAdPageData = {
        id: adId,
        title: adData.title,
        brand: adData.brand,
        creator: "You",
        image: adData.imageUrl,
        currentEdit: "",
        likes: adLikes,
        tags: [adData.category.toLowerCase()],
        isUserCreated: true,
      };

      // Store ad data in localStorage for later use when viewing details
      const storedAds = JSON.parse(localStorage.getItem("adPagesData") || "{}");
      storedAds[adId] = newAdPageData;
      localStorage.setItem("adPagesData", JSON.stringify(storedAds));

      console.log("Upload completed successfully!");
      alert("Ad uploaded successfully!");
    } catch (error) {
      console.error("Failed to save ad to Supabase:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      alert(`Failed to upload ad: ${errorMessage}`);
      return; // Don't close modal on error
    }

    // Close the upload modal
    setIsUploadModalOpen(false);
  };

  const handleDelete = async (id: number | string) => {
    console.log("handleDelete called with id:", id, "type:", typeof id);
    setDeletingAdId(id);

    try {
      // If it's a Supabase ID (string), delete from database
      if (typeof id === "string") {
        console.log("Deleting from Supabase...");
        await deleteAd(id);
        console.log("Successfully deleted from Supabase");
      }

      // Remove from local state
      console.log("Removing from local state, current ads count:", ads.length);
      setAds((prevAds) => {
        const newAds = prevAds.filter((ad) => ad.id !== id);
        console.log("New ads count:", newAds.length);
        return newAds;
      });

      // Remove from localStorage
      const storedAds = JSON.parse(localStorage.getItem("adPagesData") || "{}");
      console.log("Stored ads before delete:", Object.keys(storedAds));
      delete storedAds[id];
      localStorage.setItem("adPagesData", JSON.stringify(storedAds));
      console.log("Stored ads after delete:", Object.keys(storedAds));

      console.log("Ad deleted successfully");
    } catch (error: any) {
      console.error("Failed to delete ad:", error);
      alert(`Failed to delete ad: ${error?.message || "Unknown error"}`);
    } finally {
      setDeletingAdId(null);
    }
  };

  const handleRemix = (id: number | string) => {
    const ad = ads.find((a) => a.id === id);
    if (ad) {
      setSelectedAd(ad);
      setIsRemixModalOpen(true);
    }
  };

  const handleLike = (id: number) => {
    setAds(
      ads.map((ad) => {
        if (ad.id === id) {
          return {
            ...ad,
            isLiked: !ad.isLiked,
            likes: ad.isLiked ? ad.likes - 1 : ad.likes + 1,
          };
        }
        return ad;
      })
    );
  };

  const scrollToFeed = () => {
    const feedElement = document.getElementById("feed");
    if (feedElement) {
      feedElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Auto-scroll after 2.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      scrollToFeed();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  // Listen for global search events
  useEffect(() => {
    const handleGlobalSearch = (e: any) => {
      setSearchQuery(e.detail);
      // Scroll to feed when searching
      scrollToFeed();
    };

    window.addEventListener("globalSearch", handleGlobalSearch);

    // Check for stored search query on mount
    const storedQuery = sessionStorage.getItem("searchQuery");
    if (storedQuery) {
      setSearchQuery(storedQuery);
      sessionStorage.removeItem("searchQuery");
    }

    return () => window.removeEventListener("globalSearch", handleGlobalSearch);
  }, []);

  // Show nothing while checking authentication
  if (isChecking || !hasAccess) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Welcome Section */}
      <section className="h-screen flex flex-col items-center justify-center px-4 relative overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-primary/5 to-background">
          {/* Blob 1 - Top Right */}
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-primary/80 rounded-full blur-[120px] animate-float-1"></div>

          {/* Blob 2 - Bottom Left */}
          <div className="absolute -bottom-40 -left-40 w-[550px] h-[550px] bg-primary/75 rounded-full blur-[120px] animate-float-2"></div>

          {/* Blob 3 - Middle Left */}
          <div className="absolute top-1/3 left-1/4 w-[450px] h-[450px] bg-primary/70 rounded-full blur-[100px] animate-float-3"></div>

          {/* Blob 4 - Center Right */}
          <div className="absolute top-1/2 right-1/4 w-[500px] h-[500px] bg-primary/78 rounded-full blur-[110px] animate-float-4"></div>

          {/* Blob 5 - Top Center */}
          <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-primary/65 rounded-full blur-[100px] animate-float-1"></div>

          {/* Blob 6 - Bottom Center */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[450px] h-[450px] bg-primary/72 rounded-full blur-[110px] animate-float-2"></div>

          {/* Blob 7 - Middle Right */}
          <div className="absolute top-1/2 right-10 w-[380px] h-[380px] bg-primary/68 rounded-full blur-[90px] animate-float-3"></div>

          {/* Blob 8 - Middle Left Edge */}
          <div className="absolute top-1/2 left-10 w-[420px] h-[420px] bg-primary/70 rounded-full blur-[100px] animate-float-4"></div>

          {/* Flowing Shape - Top */}
          <div className="absolute top-10 left-1/3 w-[700px] h-[250px] bg-gradient-to-r from-primary/70 via-primary/80 to-transparent rounded-full blur-[100px] animate-float-flow-1"></div>

          {/* Flowing Shape - Bottom */}
          <div className="absolute bottom-20 right-1/3 w-[650px] h-[230px] bg-gradient-to-l from-primary/68 via-primary/75 to-transparent rounded-full blur-[100px] animate-float-flow-2"></div>

          {/* Flowing Shape - Center Diagonal */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[200px] bg-gradient-to-r from-transparent via-primary/60 to-transparent rounded-full blur-[80px] animate-float-flow-1 rotate-45"></div>
        </div>

        {/* Content */}
        <div className="text-center relative z-10">
          <h1
            className="text-5xl md:text-8xl font-semibold mb-4 gradient-text"
            style={{ fontFamily: "Gill Sans, sans-serif" }}
          >
            Welcome to Konten.in
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Discover, remix, and create content from the brands you love
          </p>
          <button
            onClick={scrollToFeed}
            className="group flex flex-col items-center gap-2 mx-auto transition-transform hover:scale-110"
          >
            <span className="text-sm text-muted-foreground">
              Scroll to explore
            </span>
            <ChevronDown className="h-8 w-8 text-primary animate-bounce" />
          </button>
        </div>
      </section>

      {/* Feed Header */}
      <section id="feed" className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6 max-w-6xl mx-auto">
          <h1 className="text-2xl font-bold">Feed</h1>
          <Button
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 h-12 px-6 text-base font-semibold"
            size="lg"
          >
            <Upload className="h-5 w-5" />
            Upload Ad
          </Button>
        </div>

        {searchQuery && (
          <div className="max-w-6xl mx-auto mb-4">
            <p className="text-muted-foreground">
              {filteredAds.length} result{filteredAds.length !== 1 ? "s" : ""}{" "}
              for "{searchQuery}"
            </p>
          </div>
        )}

        {/* Instagram-Style Feed */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {filteredAds.map((ad) => (
            <Card key={ad.id} className="overflow-hidden border-0 shadow-sm">
              {/* Post Header */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {ad.brand.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-sm">{ad.brand}</div>
                    <div className="text-xs text-muted-foreground">
                      {ad.location}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {(ad as any).isUserCreated && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:text-destructive"
                      disabled={deletingAdId === ad.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (
                          confirm("Are you sure you want to delete this ad?")
                        ) {
                          handleDelete(ad.id);
                        }
                      }}
                      title="Delete ad"
                    >
                      {deletingAdId === ad.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-destructive border-t-transparent" />
                      ) : (
                        <Trash2 className="h-5 w-5" />
                      )}
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Post Image/Video */}
              <div
                className="relative aspect-square w-full overflow-hidden cursor-pointer"
                onClick={() => router.push(`/ad/${ad.id}`)}
              >
                {ad.image?.endsWith(".mp4") ||
                ad.image?.endsWith(".webm") ||
                ad.image?.endsWith(".mov") ? (
                  <video
                    src={ad.image}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    loop
                    muted
                    playsInline
                    autoPlay
                  />
                ) : (
                  <img
                    src={ad.image || "/placeholder.svg"}
                    alt={ad.brand}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                )}
              </div>

              {/* Action Buttons */}
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(ad.id)}
                      className="transition-transform hover:scale-110"
                    >
                      <Heart
                        className={`h-6 w-6 ${
                          ad.isLiked
                            ? "fill-red-500 text-red-500"
                            : "text-foreground"
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => router.push(`/ad/${ad.id}`)}
                      className="transition-transform hover:scale-110"
                    >
                      <MessageCircle className="h-6 w-6" />
                    </button>
                  </div>
                  <button className="transition-transform hover:scale-110">
                    <Bookmark className="h-6 w-6" />
                  </button>
                </div>

                {/* Likes Count */}
                <div className="font-semibold text-sm mb-2">
                  {formatNumberWithCommas(ad.likes)} likes
                </div>

                {/* Caption */}
                <div className="text-sm mb-2">
                  <span className="font-semibold mr-2">{ad.brand}</span>
                  <span>{ad.caption}</span>
                </div>

                {/* View All Comments */}
                {ad.comments > 0 && (
                  <button
                    onClick={() => router.push(`/ad/${ad.id}`)}
                    className="text-sm text-muted-foreground hover:text-foreground mb-2 block"
                  >
                    View all {ad.comments} comments
                  </button>
                )}

                {/* Top Comments Preview */}
                {(ad as any).topComments &&
                  (ad as any).topComments.length > 0 && (
                    <div className="space-y-1 mb-2">
                      {ad.topComments.slice(0, 2).map((comment, idx) => (
                        <div key={idx} className="text-sm">
                          <span className="font-semibold mr-2">
                            {comment.user}
                          </span>
                          <span>{comment.text}</span>
                        </div>
                      ))}
                    </div>
                  )}

                {/* Remix Count */}
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-2">
                  <Sparkles className="h-3 w-3" />
                  <span>{formatNumberWithCommas(ad.remixCount)} remixes</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Remix Modal */}
      <RemixModal
        isOpen={isRemixModalOpen}
        onClose={() => setIsRemixModalOpen(false)}
        ad={selectedAd}
      />

      {/* Upload Modal */}
      <UploadAdModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSubmit={handleUpload}
      />
    </div>
  );
}
