import { useMediaQuery, useTheme } from "@mui/material";
import { useState, useEffect } from "react";

const ImageCarousel = ({
  images,
}: {
  images: { src: string; alt: string }[];
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up(990));
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 10000); // Change slide every 10 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: isMdUp ? "50vh" : isSmUp ? "40vh" : "35vh",
        height: isMdUp ? "50vh" : isSmUp ? "40vh" : "35vh",
        overflow: "hidden",
        marginTop: "2rem",
      }}
    >
      {images.map((image, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            top: 0,
            left: `${(index - currentIndex) * 100}%`,
            width: "100%",
            height: "100%",
            transition: "left 0.5s ease-in-out",
          }}
        >
          <img
            src={image.src}
            alt={image.alt}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      ))}
    </div>
  );
};

export default ImageCarousel;
