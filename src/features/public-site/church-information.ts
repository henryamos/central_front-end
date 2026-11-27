export const informationDesk: {
  address?: string;
  directionsUrl?: string;
  phone?: string;
  email?: string;
  social: readonly { label: string; url: string }[];
} = { social: [] };

export const givingChannels: readonly {
  name: string;
  accountHolder: string;
  accountNumber: string;
  instructions: string;
}[] = [];
