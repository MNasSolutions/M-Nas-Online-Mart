import { Mail, Linkedin, Twitter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import robot from "@/assets/abdullahi.jpeg";
import me from "@/assets/pop.png";
import bro from "@/assets/mem1.jpg";

const teamMembers = [
  {
    id: 1,
    name: "Muhammad Sa'ad Ahmad",
    role: "CEO & Founder",
    image: me,
    bio: "Leading with vision and passion for e-commerce innovation",
    email: "mnasonlinemart@gmail.com",
    webisite: "https://mnassolutions.vercel.app/",
    linkedin: "https://www.linkedin.com/in/mnassolutions/",
    twitter: "https://x.com/Muhamma25772152"
  },
  {
    id: 2,
    name: "Salim Sa'ad Ahmad",
    role: "Head of Technology",
    image: bro,
    bio: "Building cutting-edge solutions for seamless shopping experiences",
    email: "reachsalim1@gmail.com",
    linkedin: "https://www.linkedin.com/in/reachsalim/",
    twitter: "https://x.com/reach_salim"
  },
  {
    id: 3,
    name: "Abdullahi Adamu",
    role: "Customer Success Manager",
    image: robot,
    bio: "Ensuring every customer has an exceptional shopping journey",
    email: "aawgr146070@gmail.com",
    linkedin: "https://www.linkedin.com/in/abdullahi-adamu-581894376/",
    twitter: "https://x.com/AbbaA67604"
  }
];

export function TeamSection() {
  return (
    <section className="py-12 sm:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">Meet Our Team</h2>
          <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
            Dedicated professionals working together to bring you the best shopping experience
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
          {teamMembers.map((member) => (
            <Card key={member.id} className="overflow-hidden hover-lift">
              <div className="aspect-square overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
              <CardContent className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-sm sm:text-base text-primary font-medium mb-2 sm:mb-3">{member.role}</p>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">{member.bio}</p>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8 sm:h-10 sm:w-10" asChild>
                    <a href={`mailto:${member.email}`} aria-label="Email">
                      <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 sm:h-10 sm:w-10" asChild>
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                      <Linkedin className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8 sm:h-10 sm:w-10" asChild>
                    <a href={member.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                      <Twitter className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
