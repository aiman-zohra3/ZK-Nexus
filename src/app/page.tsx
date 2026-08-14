import Image from "next/image";
import ServiceSection from "@/components/ServicesSection";
import HeroSection from "@/components/Hero/HeroSection1";
import Testimonials from "@/components/Testimonials";
import WhyChooseUs from "@/components/WhyChooseUs";
import WorkFlowSection from "@/components/WorkfowSection";
import Faqs from "@/components/Faqs";
import CTASection from "@/components/CTASection";
import ProjectSection from "@/components/ProjectSection";
export default function Home() {
  return (
    <div className="flex flex-col flex-1">
      <main className=" ">
        <HeroSection/>
        <ServiceSection/>
        <ProjectSection/>
        <WorkFlowSection/>
        <WhyChooseUs/>
        <Testimonials/>
        <Faqs/>
        <CTASection/>
        
      </main>
    </div>
  );
}
