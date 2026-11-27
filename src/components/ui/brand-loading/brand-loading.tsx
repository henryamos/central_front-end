import Image from "next/image";
export function BrandLoading({ leaving = false }: { leaving?: boolean }) {
  return (
    <div
      className="brand-loading"
      data-leaving={leaving}
      role="status"
      aria-label="Loading Cape Coast Central SDA Church"
    >
      <div className="brand-loading-mark">
        <Image
          src="/icons/adventist-symbol--bluejay.png"
          width={96}
          height={96}
          alt=""
          unoptimized
        />
        <span className="brand-loading-line" />
      </div>
      <p>Cape Coast Central SDA</p>
      <span className="sr-only">Loading</span>
    </div>
  );
}
