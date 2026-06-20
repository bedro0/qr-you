import nameParser from "another-name-parser";

type Organization = {
  company?: string;
  position?: string;
};

export interface ContactCard {
  name: string;
  emailAddresses: string[];
  phoneNumbers: string[];
  urlLinks: Record<string, string>;
  organization?: Organization;
  birthday?: Date;
}

export function newContactCard(card?: Partial<ContactCard>) {
  const newCard: ContactCard = {
    name: "",
    emailAddresses: [],
    phoneNumbers: [],
    urlLinks: {},
  };
  return { ...newCard, ...card };
}

export interface ContactCardContainer {
  uuid: string;
  label: string;
  card: ContactCard;
  color: string;
}

export function newCardContainer(container: Partial<ContactCardContainer>) {
  const newContainer = {
    uuid: "",
    label: "",
    color: "#FFFFFF",
    card: newContactCard(),
  };
  return { ...newContainer, ...container };
}

export function toMeCard(card: ContactCard): string {
  // I wanted to name it Skelly, but that's unprofessional
  const meCardFormatSkeleton: Record<string, string> = {
    beginning: "MECARD:",
    name: `N:${card.name};`,
    phoneNumbers: card.phoneNumbers.map((number) => `TEL:${number};`).join(""),
    emailAddresses: card.emailAddresses
      .map((email) => `EMAIL:${email};`)
      .join(""),
    urlLinks: Object.entries(card.urlLinks)
      .map(([platform, url]) => `URL:${url};`)
      .join(""),
    end: ";",
  };
  const meCard = Object.values(meCardFormatSkeleton).join("");
  return meCard;
}

export function toVCard(card: ContactCard): string {
  const partialName = nameParser(card.name);
  // I wanted to name it Skellington but that would be unprofessional
  const vCardFormatSkeleton = {
    beginning: "BEGIN:VCARD\n",
    version: "VERSION:4.0\n",
    kind: "KIND:individual\n",
    formattedName: `FN:${card.name}\n`,
    name: `N:${partialName.last ?? ""};${partialName.first};${partialName.middle ?? ""};${partialName.prefix ?? ""};${partialName.suffix ?? ""};\n`,
    //nickname: card.nickname ? `NICKNAME:${this.nickname}` : "",
    organization: card.organization?.company
      ? `ORG:${card.organization?.company}\n`
      : "",
    jobTitle: card.organization?.position
      ? `TITLE:${card.organization?.position}\n`
      : "",
    //role: this.organization?.role ? `ROLE: ${this.organization.role}\n` : "",
    phoneNumbers: card.phoneNumbers
      .map((number) => `TEL;:${number}\n`)
      .join(""),
    emailAddresses: card.emailAddresses
      .map((email) => `EMAIL;:${email}\n`)
      .join(""),
    urlLinks: Object.entries(card.urlLinks)
      .map(([platform, url]) => `URL;${platform}:${url}\n`)
      .join(""),
    end: "END:VCARD\n",
  };
  const vCard = Object.values(vCardFormatSkeleton).join("");
  return vCard;
}
