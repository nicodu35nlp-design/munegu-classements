import apm from "../assets/partners/apm-white.png";
import mizuno from "../assets/partners/mizuno-white.png";
import rdc from "../assets/partners/rdc-white.png";
import vbet from "../assets/partners/vbet-white.png";
import twiga from "../assets/partners/twiga-white.png";
import triangleInterim from "../assets/partners/triangle-interim-white.png";
import teddySmith from "../assets/partners/teddysmith-white.png";
import bangOlufsen from "../assets/partners/bang-olufsen-white.png";
import simplicicar from "../assets/partners/simplicicar-white.png";
import etoro from "../assets/partners/etoro-white.png";

// Structure à 2 paliers : APM Monaco et Mizuno mis en avant (plus grands),
// tous les autres partenaires sur une seule ligne en dessous.
// Logos en blanc pour ressortir sur le fond dégradé Summer Games.
export const partnerTiers = [
  {
    size: "lg",
    partners: [
      { name: "APM Monaco", logo: apm },
      { name: "Mizuno", logo: mizuno },
    ],
  },
  {
    size: "md",
    partners: [
      { name: "R.D. Congo", logo: rdc },
      { name: "Vbet", logo: vbet },
      { name: "Twiga", logo: twiga },
      { name: "Triangle Intérim", logo: triangleInterim },
      { name: "Teddy Smith", logo: teddySmith },
      { name: "Bang & Olufsen", logo: bangOlufsen },
      { name: "Simplicicar", logo: simplicicar },
      { name: "Etoro", logo: etoro },
    ],
  },
];
