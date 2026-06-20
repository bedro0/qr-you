import { ContactCardContainer, newContactCard } from "@/lib/ContactCard";
import { saveCard } from "@/lib/db";
import { buttonAccept, buttonCancel } from "@/lib/icons";
import { EditCardContainer } from "@/ui/editCard";
import * as Crypto from "expo-crypto";
import { useRouter } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import React, { useState } from "react";
import { Image, Modal, Pressable, StyleSheet, View } from "react-native";
import "react-native-get-random-values";

export default function NewContactCard() {
  const newCard = newContactCard();
  const [container] = useState<ContactCardContainer>({
    card: newCard,
    label: "",
    uuid: "",
    color: "#FFFFFF",
  });
  const router = useRouter();
  const db = useSQLiteContext();

  return (
    <EditCardContainer
      container={container}
      saveToDb={async (container: ContactCardContainer) => {
        await saveCard(db, container);
        router.back();
      }}
    />
  );
}
