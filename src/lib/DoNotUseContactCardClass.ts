// import nameParser from "another-name-parser";
// export class ContactCard {
//   constructor(vCard: {
//     name: Name;
//     organization?: Organization;
//     phoneNumbers?: PhoneNumber[];
//     emailAddresses?: EmailAddress[];
//     urlLinks?: Record<string, string>;
//   }) {
//     this.name = vCard.name;
//     this.organization = vCard.organization;
//     this.phoneNumbers = vCard.phoneNumbers ?? [];
//     this.emailAddresses = vCard.emailAddresses ?? [];
//     this.urlLinks = vCard.urlLinks ?? {};
//   }
//   private _name!: Name;
//   set name(name: Name) {
//     if (!name.full) {
//       this._name = {
//         partial: name.partial!,
//         full: this.#formatFullName(name.partial),
//       };
//     } else {
//       const parsedName = nameParser(name.full);
//       this._name = {
//         full: name.full,
//         partial: {
//           prefix: parsedName.prefix ?? undefined,
//           first: parsedName.first ?? "",
//           last: parsedName.last ?? undefined,
//           middle: parsedName.middle ?? undefined,
//           suffix: parsedName.suffix ?? undefined,
//         },
//       };
//       //this.nickname = parsedName.nick;
//     }
//   }
//   get name() {
//     return this._name;
//   }
//   nickname?: string;
//   kind: string = "individual";

//   private _anniversary?: string;
//   set anniversary(date: string) {
//     this._anniversary = date;
//   }
//   get anniversary() {
//     return this._anniversary ?? "";
//   }

//   private _birthday?: string;
//   set birthday(date: string) {
//     this._birthday = date;
//   }
//   get birthday() {
//     return this._birthday ?? "";
//   }
//   gender?: Gender;
//   organization?: Organization;
//   phoneNumbers: PhoneNumber[] = [];
//   emailAddresses: EmailAddress[] = [];
//   urlLinks: Record<string, string> = {};
//   getVCard(): string {
//     // I wanted to name it Skellington but that would be unprofessional
//     const vCardFormatSkeleton = {
//       beginning: "BEGIN:VCARD\n",
//       version: "VERSION:4.0\n",
//       kind: "KIND:individual\n",
//       formattedName: `FN:${this.name.full}\n`,
//       name: `N:${this.name.partial?.last ?? ""};${this.name.partial?.first};${this.name.partial?.middle ?? ""};${this.name.partial?.prefix ?? ""};${this.name.partial?.suffix ?? ""};\n`,
//       nickname: this.nickname ? `NICKNAME:${this.nickname}` : "",
//       organization: `ORG:${this.organization?.company}\n`,
//       jobTitle: this.organization?.jobTitle
//         ? `TITLE:${this.organization?.jobTitle}\n`
//         : "",
//       //role: this.organization?.role ? `ROLE: ${this.organization.role}\n` : "",
//       phoneNumbers: this.phoneNumbers
//         .map((tel) => `TEL;:${tel.number}\n`)
//         .join(""),
//       emailAddresses: this.emailAddresses
//         .map((email) => `EMAIL;:${email.address}\n`)
//         .join(""),
//       urlLinks: Object.entries(this.urlLinks)
//         .map(([platform, url]) => `URL;${platform}:${url}\n`)
//         .join(""),
//       end: "END:VCARD\n",
//     };
//     const vCard = Object.values(vCardFormatSkeleton).join("");
//     return vCard;
//   }
//   getMeCard(): string {
//     // I wanted to name it Skelly, but that's unprofessional
//     const meCardFormatSkeleton: Record<string, string> = {
//       beginning: "MECARD:",
//       name: `N:${this.name.full};`,
//       phoneNumbers: this.phoneNumbers
//         .map((tel) => `TEL:${tel.number};`)
//         .join(""),
//       emailAddresses: this.emailAddresses
//         .map((email) => `EMAIL:${email.address};`)
//         .join(""),
//       urlLinks: Object.entries(this.urlLinks)
//         .map(([platform, url]) => `URL:${url};`)
//         .join(""),
//       end: ";",
//     };
//     const meCard = Object.values(meCardFormatSkeleton).join("");
//     return meCard;
//   }
//   #formatFullName(partialNames: Name["partial"]) {
//     let fullName = "";
//     const fields = ["prefix", "first", "middle", "last", "suffix"].filter(
//       (elem) => partialNames?.hasOwnProperty(elem),
//     );
//     fields.forEach((elem, index) => {
//       fullName += partialNames![elem as keyof typeof partialNames];
//       if (fields[index + 1] !== "suffix") {
//         fullName += " ";
//       } else {
//         fullName += ", ";
//       }
//     });
//     return fullName;
//   }
// }

// export interface Gender {
//   sex: "" | "M" | "F" | "O" | "N" | "U";
//   genderIdentity: string;
// }

// export interface Organization {
//   company: string;
//   unit?: string; //do not care about
//   jobTitle?: string;
//   role?: string; //do not care about
// }

// export interface EmailAddress {
//   address: string;
//   type?: "work" | "home";
//   pref?: number;
// }
// export interface PhoneNumber {
//   number: string;
//   type?: "work" | "home";
//   pref?: number;
// }

// export type Name = {
//   full?: string;
//   partial?: {
//     last?: string;
//     first: string;
//     middle?: string;
//     prefix?: string;
//     suffix?: string;
//   };
// };
// export type UserProfile = {
//   name: string;
//   nickname: string;
//   phoneNumbers: string[];
//   links: Record<string, string>;
//   emailAddresses: string[];
//   birthday: number | null;
//   gender: {
//     sex: "" | "M" | "F" | "O" | "N" | "U";
//     genderIdentity: string;
//   };
//   languages: string[];
// };
