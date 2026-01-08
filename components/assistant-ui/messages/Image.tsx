import { ImageMessagePartComponent } from "@assistant-ui/react";

export const Image: ImageMessagePartComponent = ({ image, filename }) => {
  return <img src={image} alt={filename || ""} />;
};
