import { CategoryGrid } from "@/components/home/CategoryGrid";
import { FeaturedItems } from "@/components/home/FeaturedItems";
import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { WhyChoose } from "@/components/home/WhyChoose";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedItems />
      <CategoryGrid />
      <WhyChoose />
      <HowItWorks />
    </>
  );
}