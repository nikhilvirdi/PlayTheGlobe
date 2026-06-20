import { onMount, onCleanup, createEffect } from 'solid-js';
import Globe from 'globe.gl';
import countriesData from '../../data/countries.geo.json';

export type Mode = 'guess' | 'reveal' | 'pin';

export interface GuessedCountry {
  iso_code: string;
  heat: 'hot' | 'warm' | 'cold' | 'correct';
}

export interface GlobeViewProps {
  mode: Mode;
  onCountryClick?: (data: any) => void;
  highlightedCountry?: string;
  guessedCountries?: GuessedCountry[];
}

export default function GlobeView(props: GlobeViewProps) {
  let containerRef!: HTMLDivElement;
  let globeInstance: any;

  onMount(() => {
    globeInstance = Globe()(containerRef)
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
      .polygonsData(countriesData.features)
      .polygonAltitude(0.01)
      .polygonCapColor((feat: any) => {
        const iso = feat.properties.iso_code;
        const guessed = props.guessedCountries?.find((c) => c.iso_code === iso);
        if (guessed) {
          switch (guessed.heat) {
            case 'correct': return '#00ff88'; // var(--color-primary)
            case 'hot': return '#ff6b6b'; // var(--color-secondary)
            case 'warm': return '#ff9f43'; // var(--color-accent-orange)
            case 'cold': return '#4ecdc4'; // var(--color-accent-blue)
          }
        }
        return 'rgba(255,255,255,0.15)';
      })
      .polygonStrokeColor(() => '#000000')
      .polygonSideColor(() => 'rgba(0,0,0,0.3)')
      .onPolygonClick((feat: any) => {
        if (props.mode === 'guess') {
          console.log('Clicked country:', feat.properties.iso_code);
          if (props.onCountryClick) {
            props.onCountryClick(feat.properties.iso_code);
          }
        }
      })
      .onGlobeClick(({ lat, lng }: any) => {
        if (props.mode === 'pin' && props.onCountryClick) {
          props.onCountryClick({ lat, lng });
        }
      });

    // Auto-rotate when idle
    globeInstance.controls().autoRotate = true;
    globeInstance.controls().autoRotateSpeed = 0.3;

    // Stop rotation on user interaction
    const stopRotation = () => {
      globeInstance.controls().autoRotate = false;
    };
    containerRef.addEventListener('pointerdown', stopRotation);
    containerRef.addEventListener('wheel', stopRotation);

    // Responsive container using ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        globeInstance.width(width).height(height);
      }
    });
    resizeObserver.observe(containerRef);

    onCleanup(() => {
      resizeObserver.disconnect();
      containerRef.removeEventListener('pointerdown', stopRotation);
      containerRef.removeEventListener('wheel', stopRotation);
      if (globeInstance) {
        if (globeInstance._destructor) {
           globeInstance._destructor();
        }
        containerRef.innerHTML = '';
      }
    });
  });

  // Handle highlightedCountry changes
  createEffect(() => {
    if (props.highlightedCountry && globeInstance) {
      const feat = countriesData.features.find(
        (f: any) => f.properties.iso_code === props.highlightedCountry
      );
      if (feat && feat.geometry.coordinates[0][0]) {
        // Approximate center by taking first coordinate for camera animation
        const [lng, lat] = feat.geometry.coordinates[0][0];
        globeInstance.pointOfView({ lat, lng, altitude: 2 }, 1000);
      }
    }
  });

  // Handle guessedCountries updates
  createEffect(() => {
    if (props.guessedCountries && globeInstance) {
      globeInstance.polygonCapColor((feat: any) => {
        const iso = feat.properties.iso_code;
        const guessed = props.guessedCountries?.find((c: any) => c.iso_code === iso);
        if (guessed) {
          switch (guessed.heat) {
            case 'correct': return '#00ff88';
            case 'hot': return '#ff6b6b';
            case 'warm': return '#ff9f43';
            case 'cold': return '#4ecdc4';
          }
        }
        return 'rgba(255,255,255,0.15)';
      });
    }
  });

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
  );
}
