import { PublicPage } from "@/features/public-site/public-page";
import { PhotoGallery } from "@/features/public-site/photo-gallery";
export const metadata = { title: "Gallery" };
export default function Page() {
  return (
    <PublicPage
      title="Church gallery"
      intro="Photographs of our church and worship gatherings."
    >
      <PhotoGallery />
    </PublicPage>
  );
}
