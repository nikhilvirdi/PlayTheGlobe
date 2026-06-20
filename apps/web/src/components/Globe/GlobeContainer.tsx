import { createSignal, onMount } from 'solid-js';
import PixelPanel from '../UI/PixelPanel.js';
import GlobeView, { GlobeViewProps } from './GlobeView.js';

export default function GlobeContainer(props: Partial<GlobeViewProps>) {
  const [loading, setLoading] = createSignal(true);

  onMount(() => {
    // Simulate loading for the globe.gl lazy init or just to show the pixel spinner
    setTimeout(() => setLoading(false), 800);
  });

  return (
    <PixelPanel title="Interactive 3D WebGL Globe View" class="mt-2">
      <div 
        style={{
          "width": "100%",
          "max-width": "800px",
          "aspect-ratio": "1 / 1",
          "margin": "0 auto",
          "position": "relative",
          "background": "var(--color-dark)",
          "display": "flex",
          "align-items": "center",
          "justify-content": "center",
          "overflow": "hidden"
        }}
      >
        {loading() ? (
          <div class="flex flex-col items-center gap-2">
            <span class="pixel-float" style={{ "font-size": "32px" }}>🌍</span>
            <span class="text-white text-sm animate-pulse">Initializing Globe...</span>
          </div>
        ) : (
          <GlobeView 
            mode={props.mode || 'guess'} 
            guessedCountries={props.guessedCountries || []} 
            onCountryClick={props.onCountryClick}
          />
        )}
      </div>
    </PixelPanel>
  );
}
