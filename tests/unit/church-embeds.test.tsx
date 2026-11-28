// @vitest-environment jsdom
import "../setup";
import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import { ChurchLocation } from "@/features/public-site/church-location";
import { YouthChoirSongs } from "@/features/ministries/components/youth-choir-songs";
it("embeds the church place from the supplied map and offers direct directions", () => {
  render(<ChurchLocation />);
  expect(
    screen.getByTitle("Google Maps location of Cape Coast Central SDA Church"),
  ).toHaveAttribute(
    "src",
    "https://maps.google.com/maps?cid=4741699906228119699&output=embed",
  );
  expect(screen.getByRole("link", { name: /Get directions/ })).toHaveAttribute(
    "href",
    "https://maps.app.goo.gl/8MmFCKK1Z9JJGwWZ6",
  );
});
it("embeds the supplied youth choir recording with a direct playback fallback", () => {
  render(<YouthChoirSongs />);
  const player = screen.getByTitle("Youth Choir - My Help Comes From The Lord");
  expect(player).toHaveAttribute(
    "src",
    "https://www.youtube-nocookie.com/embed/2KV6TXiTf0k",
  );
  expect(player).toHaveAttribute("loading", "lazy");
  expect(
    screen.getByRole("link", { name: /Watch on YouTube/ }),
  ).toHaveAttribute("href", "https://www.youtube.com/watch?v=2KV6TXiTf0k");
});
