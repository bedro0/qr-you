import { ContactCard } from "./ContactCard";

export type UpdateContactCard = <K extends keyof ContactCard>(
  key: K,
  value: ContactCard[K],
) => void;
