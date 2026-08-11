import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StickyMobileCTA from "@/components/StickyMobileCTA";

export default function MainLayout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ minHeight: "calc(100vh - 200px)" }}>
        {children}
      </main>
      <Footer />
      <StickyMobileCTA />
    </>
  );
}
