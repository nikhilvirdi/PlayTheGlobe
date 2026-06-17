import { type Component, type JSX } from "solid-js";
import Navbar from "./Navbar.js";

export interface PageWrapperProps {
  children?: JSX.Element;
}

const PageWrapper: Component<PageWrapperProps> = (props) => {
  return (
    <div class="min-h-screen flex flex-col w-full" style={{ "box-sizing": "border-box" }}>
      <Navbar />
      <main 
        class="flex-1 w-full" 
        style={{
          "padding": "24px",
          "box-sizing": "border-box"
        }}
      >
        {props.children}
      </main>
    </div>
  );
};

export default PageWrapper;
