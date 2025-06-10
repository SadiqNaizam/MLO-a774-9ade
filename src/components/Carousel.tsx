import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Card, CardContent } from "@/components/ui/card"; // Example usage of shadcn Card for slide items
import { ArrowLeftCircle, ArrowRightCircle } from 'lucide-react';
import { Button } from '@/components/ui/button'; // For prev/next buttons

interface CarouselProps {
  slides: React.ReactNode[]; // Array of React nodes to display as slides
  options?: Parameters<typeof useEmblaCarousel>[0];
  autoplayOptions?: Parameters<typeof Autoplay>[0];
  showArrows?: boolean;
}

const Carousel: React.FC<CarouselProps> = ({
  slides,
  options = { loop: true },
  autoplayOptions = { delay: 4000, stopOnInteraction: false },
  showArrows = true,
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(options, [Autoplay(autoplayOptions)]);

  console.log("Rendering Carousel with", slides.length, "slides.");

  const scrollPrev = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = React.useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (!slides || slides.length === 0) {
    return <div className="text-center p-4">No slides to display.</div>;
  }

  return (
    <div className="relative embla w-full max-w-3xl mx-auto" ref={emblaRef}>
      <div className="embla__container flex">
        {slides.map((slideContent, index) => (
          <div className="embla__slide flex-[0_0_100%] min-w-0 p-1" key={index}>
            {/* You can wrap slideContent in a Card or other structure if desired */}
            <Card className="h-full">
              <CardContent className="flex aspect-video items-center justify-center p-6">
                {slideContent}
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {showArrows && emblaApi && slides.length > 1 && (
        <>
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 hover:bg-white"
            onClick={scrollPrev}
            aria-label="Previous slide"
          >
            <ArrowLeftCircle className="h-6 w-6 text-gray-700" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/80 hover:bg-white"
            onClick={scrollNext}
            aria-label="Next slide"
          >
            <ArrowRightCircle className="h-6 w-6 text-gray-700" />
          </Button>
        </>
      )}
    </div>
  );
};

export default Carousel;