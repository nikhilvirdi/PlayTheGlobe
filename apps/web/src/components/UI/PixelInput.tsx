import { type Component, Show } from "solid-js";

export interface PixelInputProps {
  placeholder?: string;
  value: string;
  onInput: (val: string) => void;
  type?: "text" | "password";
  maxLength?: number;
}

const PixelInput: Component<PixelInputProps> = (props) => {
  return (
    <div class="w-full flex flex-col gap-1 relative">
      <input
        type={props.type || "text"}
        placeholder={props.placeholder}
        value={props.value}
        onInput={(e) => props.onInput(e.currentTarget.value)}
        maxLength={props.maxLength}
        class="pixel-input"
      />
      <Show when={props.maxLength !== undefined}>
        <div 
          class="text-right mt-1" 
          style={{
            "font-size": "8px",
            "color": "var(--color-accent-blue)",
            "letter-spacing": "1px"
          }}
        >
          {props.value.length}/{props.maxLength}
        </div>
      </Show>
    </div>
  );
};

export default PixelInput;
