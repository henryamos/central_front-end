import Image from "next/image";
export function BoardIdentity() {
  return (
    <div className="board-root">
      <Image
        src="/icons/CCC%20SDA%20logo.svg"
        width={938}
        height={173}
        alt="Cape Coast Central Seventh-day Adventist Church"
        unoptimized
        className="h-auto w-full"
      />
    </div>
  );
}
