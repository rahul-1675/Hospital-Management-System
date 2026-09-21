import React from 'react';
import {
  FloatingDotsCta,
  SlidingTextCta,
  LaunchButton,
  DotBorderButton,
  GradientCta,
  SpinningBorderButton,
  GlassmorphismCta,
  GenerateButton,
  GradientPillButton,
  GradientBeamCta,
  NEUFORM_ISOLATED_DEFAULTS
} from './neuform-isolated/NeuformIsolatedEffects';
import './threeui.css';

const RECTANGLE_BUTTON_VARIANTS = {
  'floating-dots-cta': FloatingDotsCta,
  'sliding-text-cta': SlidingTextCta,
  'launch-button': LaunchButton,
  'dot-border-button': DotBorderButton,
  'gradient-cta': GradientCta,
  'spinning-border-button': SpinningBorderButton,
  'glassmorphism-cta': GlassmorphismCta,
  'generate-button': GenerateButton,
  'gradient-pill-button': GradientPillButton,
  'gradient-beam-cta': GradientBeamCta,
};

export const RECTANGLE_BUTTON_DEFAULTS = {
  ...NEUFORM_ISOLATED_DEFAULTS,
  variant: 'floating-dots-cta',
};

export function RectangleButtons({
  variant = 'floating-dots-cta',
  mode = 'dark',
  hue = 0,
  saturation = 1,
  brightness = 1,
  className = '',
  style = {},
  ...props
}) {
  const Component = RECTANGLE_BUTTON_VARIANTS[variant] || FloatingDotsCta;
  return (
    <div
      className={`rectangle-button-wrapper ${className}`}
      style={{
        display: 'inline-block',
        position: 'relative',
        width: '180px',
        height: '56px',
        borderRadius: '14px',
        overflow: 'hidden',
        cursor: 'pointer',
        ...style
      }}
      {...props}
    >
      <Component
        mode={mode}
        hue={hue}
        saturation={saturation}
        brightness={brightness}
        style={{
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      />
    </div>
  );
}

export default RectangleButtons;
