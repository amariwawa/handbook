import { Mail, Phone, MapPin } from "lucide-react";

const footerLinks = {
  Product: ["Features", "Pricing", "Subjects", "Mobile App"],
  Company: ["About Us", "Careers", "Blog", "Press"],
  Support: ["Help Center", "Contact", "FAQs", "Community"],
  Legal: ["Privacy Policy", "Terms of Service", "Cookie Policy"],
};

export const Footer = () => {
  return (
    <footer className="border-t border-border py-16">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2">
            <a href="#home" className="mb-6 inline-block">
              <span className="font-display text-2xl font-bold tracking-tight text-white">
                HAND<span className="italic text-primary">BOOK</span>
              </span>
            </a>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs font-body">
              Empowering Nigerian students with AI-powered learning for academic excellence.
            </p>
            <div className="space-y-3">
              <a href="mailto:hello@handbook.ng" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors text-sm">
                <Mail className="w-4 h-4" />
                hello@handbook.ng
              </a>
              <a href="tel:+2341234567890" className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors text-sm">
                <Phone className="w-4 h-4" />
                +234 123 456 7890
              </a>
              <div className="flex items-center gap-3 text-muted-foreground text-sm">
                <MapPin className="w-4 h-4" />
                Lagos, Nigeria
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="font-display font-semibold mb-4">{title}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-border">
          <p className="text-muted-foreground text-sm">
            © 2026 HANDBOOK. All rights reserved.
          </p>
          <div className="flex items-center gap-6 mt-4 md:mt-0">
            {["Twitter", "Instagram", "LinkedIn", "YouTube"].map((social) => (
              <a
                key={social}
                href="#"
                className="text-muted-foreground hover:text-foreground transition-colors text-sm"
              >
                {social}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
