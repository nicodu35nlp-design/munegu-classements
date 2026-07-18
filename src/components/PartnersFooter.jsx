import { partnerTiers } from "../data/partners";

export default function PartnersFooter() {
  return (
    <section className="partners">
      {partnerTiers.map((tier, i) => (
        <div key={tier.size}>
          {i > 0 && (
            <div className="partners-divider" aria-hidden="true">
              <span />
            </div>
          )}
          <div className={`partners-row partners-${tier.size}`}>
            {tier.partners.map((p) => (
              <img key={p.name} src={p.logo} alt={p.name} className="partner-logo" />
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
