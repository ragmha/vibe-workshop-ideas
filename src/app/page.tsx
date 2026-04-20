import Hero from "@/components/Hero";
import IdeaCatalog from "@/components/IdeaCatalog";
import WhatIsVibeCoding from "@/components/WhatIsVibeCoding";
import type { Idea } from "@/types/idea";
import curatedIdeas from "@/data/ideas.json";
import aiIdeas from "@/data/ai-ideas.json";

export default function Home() {
  const allIdeas: Idea[] = [
    ...(curatedIdeas as Idea[]),
    ...(aiIdeas as Idea[]),
  ];

  return (
    <>
      <Hero ideas={allIdeas} />
      <IdeaCatalog ideas={allIdeas} />
      <WhatIsVibeCoding />
    </>
  );
}
