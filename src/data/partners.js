import apm from "../assets/partners/apm.png";
import mizuno from "../assets/partners/mizuno.png";
import rdc from "../assets/partners/rdc.png";
import vbet from "../assets/partners/vbet.png";
import twiga from "../assets/partners/twiga.png";
import triangleInterim from "../assets/partners/triangle-interim.png";
import teddySmith from "../assets/partners/teddysmith.png";
import bangOlufsen from "../assets/partners/bang-olufsen.png";
import simplicicar from "../assets/partners/simplicicar.png";
import etoro from "../assets/partners/etoro.png";

// Structure à 2 paliers : APM Monaco et Mizuno mis en avant (plus grands),
// tous les autres partenaires sur une seule ligne en dessous.
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
