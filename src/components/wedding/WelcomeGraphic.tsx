import Image from "next/image";

const LAYERS = [
  {
    src: "/images/wedding/block-welcome.png",
    alt: "Welcome",
    width: 1065,
    height: 341,
    enterDelay: 0,
    floatDelay: 700,
    floatDuration: 3200,
  },
  {
    src: "/images/wedding/block-toour.png",
    alt: "to our",
    width: 1062,
    height: 316,
    enterDelay: 200,
    floatDelay: 900,
    floatDuration: 3600,
  },
  {
    src: "/images/wedding/block-wedding.png",
    alt: "wedding",
    width: 1082,
    height: 294,
    enterDelay: 400,
    floatDelay: 1100,
    floatDuration: 4000,
  },
];

export default function WelcomeGraphic() {
  return (
    <div className="flex flex-col items-center">
      {LAYERS.map((layer, i) => (
        <Image
          key={layer.src}
          src={layer.src}
          alt={layer.alt}
          width={layer.width}
          height={layer.height}
          className={`h-auto w-[calc(100%-50px)] m-t-[-200px] animate-enter-layer ${i > 0 ? "-mt-3" : ""}`}
          style={{
            animation: `enter-layer 700ms ease-out ${layer.enterDelay}ms both, float-layer ${layer.floatDuration}ms ease-in-out ${layer.floatDelay}ms infinite`,
          }}
        />
      ))}
    </div>
  );
}
