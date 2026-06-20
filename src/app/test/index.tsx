import {
  ContactCard,
  newCardContainer,
  newContactCard,
  toMeCard,
  toVCard,
} from "@/lib/ContactCard";
import { closeDB, deleteDB, getCards, saveCard } from "@/lib/db";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React from "react";
import { Button, View } from "react-native";
import "react-native-get-random-values";
import QRCode from "react-qr-code";

const testCard = newContactCard({
  name: "TEST",
  phoneNumbers: ["+12345678910"],
  organization: {
    company: "COMPANY TEST",
    position: "JOB TITLE TEST",
  },
});

export const testUserProfile: ContactCard = {
  name: "John Doe",
  urlLinks: {
    Facebook: "https://www.facebook.com/zuck/",
    Twitch: "https://www.twitch.tv/bedro_dev",
    Instagram: "https://www.instagram.com/instagram/",
    Discord: "https://discord.gg/KaDPvQMu5a",
  },
  emailAddresses: ["example@example.com"],
  phoneNumbers: ["+1 555 555 5555", "+995555555555"],
  //gender: { sex: "O", genderIdentity: "Whatever I damn please" },
  organization: { company: "Google LLC", position: "Software Engineer" },
};

export default function Index() {
  const router = useRouter();
  const db = useSQLiteContext();
  const card = newContactCard(testUserProfile);
  const meCard = toMeCard(card);
  const vCard = toVCard(card);
  console.log(vCard, meCard);
  const container = newCardContainer({ card: card });
  return (
    // <View style={{ padding: 32 }}>
    //   <Button title="Clear Local Storage" onPress={userProfile.clearData} />
    //   <QRCode value={vCard} style={{ padding: 32 }} />
    //   <QRCode value={meCard} style={{ padding: 32 }} />
    // </View>
    <View style={{ flex: 1 }}>
      {/* <EditCardContainer
        container={container as ContactCardContainer}
        saveToDb={(container: ContactCardContainer) => {
          saveCard(db, container);
          router.back();
        }}
      /> */}
      <QRCode value={toVCard(card)} />
      <Button
        title="DB insert"
        onPress={async () => {
          const result = await saveCard(db, {
            card: testUserProfile,
            label: "TESTUSERPROFILE",
            color: "#FF7F7F",
            uuid: "",
          });
          console.log(result);
        }}
      />
      <Button
        title="DB GET"
        onPress={async () => {
          const result = await getCards(db);
          console.log(result);
        }}
      />
      <Button
        title="Delete DB"
        onPress={async () => {
          await closeDB(db);
          await deleteDB();
        }}
      />
    </View>
  );
}
