export const informationDesk: {
  address?: string;
  directionsUrl?: string;
  phone?: string;
  email?: string;
  social: readonly { label: string; url: string }[];
} = {
  address: "Cape Coast Central Seventh-Day Adventist Church, Cape Coast",
  directionsUrl: "https://maps.app.goo.gl/8MmFCKK1Z9JJGwWZ6",
  social: [],
};

export const givingChannels: readonly {
  name: string;
  accountHolder: string;
  accountNumber: string;
  instructions: string;
}[] = [];
