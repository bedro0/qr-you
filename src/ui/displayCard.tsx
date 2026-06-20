import { ContactCard, ContactCardContainer, toVCard } from "@/lib/ContactCard";
import { deleteCard } from "@/lib/db";
import { buttonCancel, buttonDelete, buttonQR } from "@/lib/icons";
import { useSQLiteContext } from "expo-sqlite";
import React, { useState } from "react";
import {
  Button,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatPhoneNumberIntl } from "react-phone-number-input";
import QRCode from "react-qr-code";

export function DisplayCard({
  cardContainer,
  fetchDb,
}: {
  cardContainer: ContactCardContainer;
  fetchDb: VoidFunction;
}) {
  const db = useSQLiteContext();
  const [qrModal, setQRModal] = useState<boolean>(false);
  const [qrCard, setQRCard] = useState<ContactCard | null>(null);
  const { width: qrWidth } = useWindowDimensions();
  return (
    <View style={{ ...styles.cardRoot, backgroundColor: cardContainer.color }}>
      <View style={styles.header}>
        <Text style={styles.label}>{cardContainer.label}</Text>
        <View style={styles.headerButtons}>
          <Pressable
            onPress={() => {
              setQRModal(true);
              setQRCard(cardContainer.card);
            }}
          >
            <Image
              source={buttonQR}
              resizeMode="contain"
              style={{ width: 48, height: 48 }}
            />
          </Pressable>
          <Pressable
            onPress={() => {
              deleteCard(db, cardContainer.uuid);
              fetchDb();
            }}
          >
            <Image
              source={buttonDelete}
              resizeMode="contain"
              style={{ width: 48, height: 48 }}
            />
          </Pressable>
        </View>
      </View>
      <Text style={styles.name}>{cardContainer.card.name}</Text>
      {cardContainer.card.organization && (
        <View>
          {cardContainer.card.organization.position && (
            <Text style={styles.company}>
              {cardContainer.card.organization.position +
                (cardContainer.card.organization.company && ",")}
            </Text>
          )}
          {cardContainer.card.organization.company && (
            <Text style={styles.company}>
              {cardContainer.card.organization?.company}
            </Text>
          )}
        </View>
      )}
      <View style={styles.contactInfoWrapper}>
        {cardContainer.card.phoneNumbers.map((phoneNumber, index) => (
          <Text style={styles.contactInfo} key={index}>
            {formatPhoneNumberIntl(phoneNumber)}
          </Text>
        ))}
        {cardContainer.card.emailAddresses.map((address, index) => (
          <Text style={styles.contactInfo} key={index}>
            {address.toUpperCase()}
          </Text>
        ))}
        {Object.entries(cardContainer.card.urlLinks).map(
          ([platform, url], index) => (
            <View key={index}>
              <Text
                style={styles.contactInfo}
              >{`${url.replace("https://", "").replace("www.", "").toUpperCase()}`}</Text>
            </View>
          ),
        )}
      </View>

      <Modal
        animationType="slide"
        transparent={false}
        visible={qrModal}
        onRequestClose={() => {
          setQRModal(false);
        }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          <Pressable
            style={{ position: "absolute", top: 16, right: 16 }}
            onPress={() => {
              setQRModal(false);
              setQRCard(null);
            }}
          >
            <Image
              source={buttonCancel}
              resizeMode="contain"
              style={{ width: 48, height: 48 }}
            />
          </Pressable>
          <View style={styles.centerAll}>
            <QRCode
              size={qrWidth - 64}
              style={{ height: "auto", maxWidth: "100%", width: "100%" }}
              value={qrCard ? toVCard(qrCard) : ""}
            />
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  cardRoot: {
    padding: 32,
    borderRadius: 32,
    maxWidth: "100%",
    minWidth: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerButtons: {
    flexDirection: "row",
  },
  label: { fontFamily: "Kredit-Back", maxWidth: "50%" },
  name: { fontFamily: "Kredit-Back", fontSize: 48 },
  company: { fontFamily: "PlaywriteDEGrund-Regular", fontSize: 24 },
  contactInfoWrapper: { marginVertical: 12 },
  contactInfo: { fontFamily: "Oswald-Medium", fontSize: 24 },
  centerAll: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});
