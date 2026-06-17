import { type Component, type JSX, Show } from "solid-js";

export interface PixelPanelProps {
  title?: string;
  children: JSX.Element;
  class?: string;
}

const PixelPanel: Component<PixelPanelProps> = (props) => {
  return (
    <div class={`pixel-panel ${props.class || ""}`}>
      <Show when={props.title}>
        <div 
          class="mb-3 pl-3" 
          style={{
            "border-left": "6px solid var(--color-primary)",
            "font-size": "10px",
            "font-weight": "bold",
            "text-transform": "uppercase",
            "color": "var(--color-primary)",
            "letter-spacing": "1px"
          }}
        >
          {props.title}
        </div>
      </Show>
      <div class="panel-content">
        {props.children}
      </div>
    </div>
  );
};

export default PixelPanel;
