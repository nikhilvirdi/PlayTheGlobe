import { type Component, splitProps } from "solid-js";

export interface PixelButtonProps {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const PixelButton: Component<PixelButtonProps> = (props) => {
  const [local, rest] = splitProps(props, ["label", "onClick", "variant", "disabled", "type"]);

  const getBgColor = () => {
    switch (local.variant) {
      case "secondary":
        return "var(--color-accent-blue)";
      case "danger":
        return "var(--color-secondary)";
      case "primary":
      default:
        return "var(--color-primary)";
    }
  };

  return (
    <button
      type={local.type || "button"}
      onClick={() => !local.disabled && local.onClick?.()}
      disabled={local.disabled}
      class="pixel-btn"
      style={{
        background: getBgColor(),
        color: "var(--color-dark)",
      }}
      {...rest}
    >
      {local.label}
    </button>
  );
};

export default PixelButton;
