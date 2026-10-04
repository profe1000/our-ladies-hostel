import useEstateBranding from "../../../hooks/useEstateBranding";

type Props = {
  isAdmin?: boolean;
  onClick?: () => void;
};

/** The estate's logo, or its name when it has none */
const EstateLogo = ({ isAdmin = false, onClick }: Props) => {
  const branding = useEstateBranding(isAdmin);

  if (branding?.logoUrl) {
    return (
      <img
        onClick={onClick}
        style={{ height: "70px", cursor: "pointer" }}
        className="favicon-header"
        src={branding.logoUrl}
        alt={branding.name}
      />
    );
  }

  return (
    <span
      onClick={onClick}
      className="myfont5"
      style={{ display: "inline-flex", alignItems: "center", minHeight: "70px", fontSize: "20px", cursor: "pointer" }}
    >
      {branding?.name || ""}
    </span>
  );
};

export default EstateLogo;
