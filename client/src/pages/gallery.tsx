import { BubbleBackground } from "@/components/ui/bubble-background";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { DreamGallery } from "@/components/dream-gallery";

export default function Gallery() {
  return (
    <div className="bg-deepSpace min-h-screen font-space text-starlight">
      <BubbleBackground />
      
      <Header />
      
      <main className="container mx-auto px-6 py-12 relative z-10">
        <h1 className="text-4xl font-poppins font-bold mb-12 text-center">Dream Gallery</h1>
        <DreamGallery />
      </main>
      
      <Footer />
    </div>
  );
}
