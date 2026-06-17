import { type Component, createEffect, onCleanup } from "solid-js";

export interface StreakFlameProps {
  streak: number;
}

const StreakFlame: Component<StreakFlameProps> = (props) => {
  createEffect(() => {
    if (props.streak >= 50) {
      document.body.style.boxShadow = "inset 0 0 40px rgba(255, 107, 107, 0.4)";
      document.body.style.transition = "box-shadow 0.5s ease";
    } else {
      document.body.style.boxShadow = "";
    }
  });

  onCleanup(() => {
    document.body.style.boxShadow = "";
  });

  const getFlameDetails = () => {
    const s = props.streak;
    if (s <= 0) return { size: "", color: "", text: "" };
    if (s < 10) return { size: "small", color: "var(--color-accent-yellow)", text: "🔥" };
    if (s < 25) return { size: "medium", color: "var(--color-accent-orange)", text: "🔥" };
    if (s < 50) return { size: "large", color: "var(--color-secondary)", text: "🔥" };
    return { size: "omega", color: "var(--color-secondary)", text: "🔥" };
  };

  const details = getFlameDetails();

  return (
    <span 
      class="flex items-center gap-1"
      style={{
        "font-size": "10px",
        "font-weight": "bold"
      }}
    >
      <span>{props.streak}</span>
      {props.streak > 0 && (
        <span 
          class={props.streak >= 50 ? "streak-flame-anim" : ""}
          style={{
            color: details.color,
            "text-shadow": `0 0 6px ${details.color}`,
            "font-size": props.streak >= 50 ? "14px" : "10px"
          }}
        >
          {details.text}
        </span>
      )}
    </span>
  );
};

export default StreakFlame;
