import { Mail, Linkedin, Twitter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import robot from "@/assets/abdullahi.jpeg";
import me from "@/assets/GITHUB.png";
import bro from "@/assets/mem1.jpg";

const teamMembers = [
  {
    id: 1,
    name: "Muhammad Sa'ad Ahmad",
    role: "CEO & Founder",
    image: me,
    bio: "Leading with vision and passion for e-commerce innovation",
    email: "mnasonlinemart@gmail.com",
    linkedin: "https://www.linkedin.com/in/mnassolutions/",
    twitter: "https://x.com/Muhamma25772152"
  },
  {
    id: 2,
    name: "Salim Sa'ad Ahmad",
    role: "Head of Technology",
    image: bro,
    bio: "Building cutting-edge solutions for seamless shopping experiences",
    email: "michael@mnas.com",
    linkedin: "https://www.linkedin.com/in/reachsalim/",
    twitter: "https://x.com/reach_salim"
  },
  {
    id: 3,
    name: "Abdullahi Adamu",
    role: "Customer Success Manager",
    image: robot,
    bio: "Ensuring every customer has an exceptional shopping journey",
    email: "emily@mnas.com",
    linkedin: "https://www.linkedin.com/in/abdullahi-adamu-581894376/",
    twitter: "https://x.com/AbbaA67604"
  }
];

export function TeamSection() {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Meet Our Team</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Dedicated professionals working together to bring you the best shopping experience
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <Card key={member.id} className="overflow-hidden hover-lift">
              <div className="aspect-square overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                />
              </div>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-primary font-medium mb-3">{member.role}</p>
                <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                
                <div className="flex gap-2">
                  <Button variant="outline" size="icon" asChild>
                    <a href={`mailto:${member.email}`} aria-label="Email">
                      <Mail className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                      <Linkedin className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <a href={member.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                      <Twitter className="h-4 w-4" />
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
