export interface LoomEmbedProps {
  url: string;
}

export const LoomEmbed: React.FC<LoomEmbedProps> = ({ url }) => {
  return (
    <div
      style={{
        position: 'relative',
        paddingBottom: '62.48534583821805%',
        height: 0,
      }}
    >
      <iframe
        title="Loom Embed"
        src={url}
        frameBorder="0"
        allowFullScreen
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      />
    </div>
  );
};
