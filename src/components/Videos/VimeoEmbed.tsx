import React from "react";
import ContainerDimensions from "react-container-dimensions";

const VimeoEmbed = ({ vimeoVideoId }: { vimeoVideoId: string }) => (
  <ContainerDimensions>
    {({ width }) => {
      const height = Math.round((width * 720) / 1280);
      return (
        <iframe
          src={`https://player.vimeo.com/video/${vimeoVideoId}`}
          title="vimeo"
          width={width}
          height={height}
          frameBorder="0"
          allow="autoplay; fullscreen"
          allowFullScreen
        ></iframe>
      );
    }}
  </ContainerDimensions>
);

export default VimeoEmbed;
