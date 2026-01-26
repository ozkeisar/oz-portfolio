import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export type HelloWorldProps = {
  title: string;
  subtitle: string;
  backgroundColor: string;
  textColor: string;
};

export const HelloWorld = ({ title, subtitle, backgroundColor, textColor }: HelloWorldProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, fps], [0, 1], {
    extrapolateRight: 'clamp',
  });

  const titleTranslateY = interpolate(frame, [0, fps], [30, 0], {
    extrapolateRight: 'clamp',
  });

  const subtitleOpacity = interpolate(frame, [fps * 0.5, fps * 1.5], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const subtitleTranslateY = interpolate(frame, [fps * 0.5, fps * 1.5], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor,
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 20,
        }}
      >
        <h1
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: textColor,
            margin: 0,
            opacity: titleOpacity,
            transform: `translateY(${titleTranslateY}px)`,
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: 36,
            fontWeight: 400,
            color: textColor,
            margin: 0,
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleTranslateY}px)`,
          }}
        >
          {subtitle}
        </p>
      </div>
    </AbsoluteFill>
  );
};
