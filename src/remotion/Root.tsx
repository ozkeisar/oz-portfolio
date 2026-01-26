import { Composition, Folder } from 'remotion';
import { HelloWorld, type HelloWorldProps } from './compositions/HelloWorld';

export const RemotionRoot = () => {
  return (
    <Folder name="Portfolio">
      <Composition
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={
          {
            title: 'Welcome',
            subtitle: 'My Portfolio',
            backgroundColor: '#0f172a',
            textColor: '#f8fafc',
          } satisfies HelloWorldProps
        }
      />
    </Folder>
  );
};
