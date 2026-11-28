import { BoardIdentity } from "@/features/church-life/board-identity";
import { BranchConnector } from "@/features/church-life/branch-connector";
import { BranchPreview } from "@/features/church-life/branch-preview";
import { ministries } from "../constants/ministries.constants";
const art = {
  "sabbath-school": { image: "/images/Boys.jpg", symbol: "study" },
  music: { image: "/images/General2.jpg", symbol: "music" },
  "adventist-youth-ministries": {
    image: "/images/Chilion.jpg",
    symbol: "youth",
  },
  "childrens-ministry": { image: "/images/Childern1.jpg" },
  "adventist-women-ministry": { image: "/images/dance2.jpg", symbol: "people" },
  "adventist-men-ministry": { image: "/images/General.jpg", symbol: "church" },
  "personal-ministry": { image: "/images/New.jpg", symbol: "service" },
  "adventist-family-ministry": {
    image: "/images/dance1.jpg",
    symbol: "people",
  },
} as const;
export function MinistryBoard() {
  return (
    <div className="church-board">
      <BoardIdentity />
      <ul className="board-branches">
        {ministries.map((ministry) => (
          <li
            className="board-branch"
            key={ministry.slug}
            id={ministry.slug}
            tabIndex={-1}
          >
            <BranchConnector />
            <div className="board-entry">
              <BranchPreview
                {...art[ministry.slug]}
                name={ministry.name}
                description={ministry.description}
                href={"/ministries/" + ministry.slug}
              />
              {"groups" in ministry && (
                <details className="music-branches">
                  <summary>Music groups</summary>
                  <ul className="board-children">
                    {ministry.groups.map((name) => (
                      <li key={name}>
                        <BranchConnector />
                        <BranchPreview
                          category="Music group"
                          symbol="music"
                          image="/images/General2.jpg"
                          name={name}
                          description={
                            name +
                            " is part of the Music ministry at Cape Coast Central SDA Church."
                          }
                          href={
                            "/ministries/" +
                            name.toLowerCase().replaceAll(" ", "-")
                          }
                        />
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
