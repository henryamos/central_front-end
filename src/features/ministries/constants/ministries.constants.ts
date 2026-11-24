/** Names and music groups from the church-provided PRD inventory. */
export const ministries = [
  {
    name: "Sabbath School",
    slug: "sabbath-school",
    description: "Bible study and Sabbath School",
  },
  {
    name: "Music",
    slug: "music",
    description: "Choirs, singing and worship",
    groups: ["Church Choir", "Singing Band", "Youth Choir"],
  },
  {
    name: "Adventist Youth Ministries",
    slug: "adventist-youth-ministries",
    description: "Young people and church life",
  },
  {
    name: "Children's Ministry",
    slug: "childrens-ministry",
    description: "Children and families",
  },
  {
    name: "Adventist Women Ministry",
    slug: "adventist-women-ministry",
    description: "Women in our church",
  },
  {
    name: "Adventist Men Ministry",
    slug: "adventist-men-ministry",
    description: "Men in our church",
  },
  {
    name: "Personal Ministry",
    slug: "personal-ministry",
    description: "Ministry and outreach",
  },
  {
    name: "Adventist Family Ministry",
    slug: "adventist-family-ministry",
    description: "Family life and fellowship",
  },
] as const;
