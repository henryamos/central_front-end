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
          src="/icons/CCC%20SDA%20logo.svg"
          width={938}
          height={173}
          className="h-auto w-full max-w-(--brand-header-width)"
          alt=""
          unoptimized
        />
        <span className="brand-loading-line" />
      </div>
      <span className="sr-only">Loading</span>
    </div>
  );
}
