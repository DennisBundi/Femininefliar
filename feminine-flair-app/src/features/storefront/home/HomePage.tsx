import { Hero } from "./Hero";
import { CategoryGrid } from "./CategoryGrid";
import { NewArrivals } from "./NewArrivals";
import { SocialStrip } from "./SocialStrip";

export function HomePage() {
  return (
    <main>
      <Hero />
      <CategoryGrid />
      <NewArrivals />
      <SocialStrip />
    </main>
  );
}
