import { buttonColors, placeholderTextColor } from "@/lib/colors";
import { ContactCard, ContactCardContainer } from "@/lib/ContactCard";
import { platformsList, platformURLs } from "@/lib/data";
import { buttonAccept, buttonAdd, buttonDelete } from "@/lib/icons";
import { UpdateContactCard } from "@/lib/types";
import { Picker } from "@react-native-picker/picker";
import React, { useRef, useState } from "react";
import {
  Dimensions,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import {
  formatPhoneNumberIntl,
  isPossiblePhoneNumber,
} from "react-phone-number-input";
import PhoneInput from "react-phone-number-input/react-native-input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
export function EditCardContainer({
  container,
  saveToDb,
}: {
  container: ContactCardContainer;
  saveToDb: (container: ContactCardContainer) => void;
}) {
  const [label, setLabel] = useState(container.label);
  const [card, updateCard] = useContactCard(container.card);
  const [color, setColor] = useState(container.color);
  const [errors, setErrors] = useState({
    name: "",
    label: "",
    color: "",
  });
  function validateAndSave(newContainer: ContactCardContainer) {
    const isNameEmpty = newContainer.card.name === "";
    const isLabelEmpty = newContainer.label === "";
    const isColorWhite = newContainer.color === "#FFFFFF";
    setErrors({
      name: isNameEmpty ? "Please enter your name" : "",
      label: isLabelEmpty ? "Please label the card" : "",
      color: isColorWhite ? "Please select a color" : "",
    });
    if (!(isNameEmpty || isLabelEmpty || isColorWhite)) {
      saveToDb({
        ...container,
        ...newContainer,
      });
    }
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView>
          <View style={{ padding: 16 }}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingHorizontal: 4,
              }}
            >
              {/* Label Input */}
              <View style={{ flex: 1 }}>
                <TextInput
                  editable
                  style={{
                    ...styles.inputField,
                    borderColor: errors.label ? "red" : "black",
                  }}
                  value={label}
                  onChangeText={(input) => {
                    setLabel(input);
                    setErrors((prev) => ({ ...prev, label: "" }));
                  }}
                  placeholder="Label"
                  placeholderTextColor={placeholderTextColor}
                />
                {errors.label && (
                  <Text style={styles.errorText}>{errors.label}</Text>
                )}
              </View>
              {/* Tickmark button */}
              <Pressable
                onPress={() => {
                  validateAndSave({
                    ...container,
                    label: label,
                    color: color,
                    card: card,
                  });
                }}
              >
                <Image
                  resizeMode="contain"
                  style={styles.buttonSave}
                  source={buttonAccept}
                />
              </Pressable>
            </View>
            {/* Color Picker */}
            <ColorPicker
              selectedColor={color}
              setSelectedColor={setColor}
              error={errors.color}
              clearError={() => {
                setErrors((prev) => ({ ...prev, color: "" }));
              }}
            />
          </View>
          {/* EditCard Parent */}
          <View
            style={{
              ...styles.editCardParent,
            }}
          >
            <EditCard
              contactCard={card}
              updateContactCard={updateCard}
              errorName={errors.name}
              errorNameClear={() => {
                setErrors((prev) => ({
                  ...prev,
                  name: "",
                }));
              }}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function EditCard({
  contactCard,
  updateContactCard,
  errorName,
  errorNameClear,
}: {
  contactCard: ContactCard;
  updateContactCard: UpdateContactCard;
  errorName: string;
  errorNameClear: VoidFunction;
}) {
  return (
    <View style={{ flex: 1 }}>
      <EditName
        name={contactCard.name}
        updateName={(name: string) => {
          updateContactCard("name", name);
        }}
        error={errorName}
        errorClear={errorNameClear}
      />

      <EditWorkplace
        organization={contactCard.organization}
        updateOrganization={(organization: ContactCard["organization"]) => {
          updateContactCard("organization", organization);
        }}
      />

      <EditPhoneNumbers
        phoneNumbers={contactCard.phoneNumbers}
        updatePhoneNumbers={(phoneNumbers) => {
          updateContactCard("phoneNumbers", phoneNumbers);
        }}
      />

      <EditEmailAddresses
        emailAddresses={contactCard.emailAddresses}
        updateEmailAddresses={(emailAddresses) => {
          updateContactCard("emailAddresses", emailAddresses);
        }}
      />

      <EditUrlLinks
        urlLinks={contactCard.urlLinks}
        updateUrlLinks={(urlLinks) => {
          updateContactCard("urlLinks", urlLinks);
        }}
      />
    </View>
  );
}

function EditName({
  name,
  updateName,
  error,
  errorClear,
}: {
  name: string;
  updateName: (name: string) => void;
  error: string;
  errorClear: VoidFunction;
}) {
  return (
    <View>
      <Text style={styles.contactInfoTitle}>Name</Text>
      <View style={styles.addContactInfo}>
        <TextInput
          editable
          style={{
            ...styles.inputField,
            borderColor: error ? "red" : "black",
          }}
          value={name}
          onChangeText={(input) => {
            updateName(input);
            errorClear();
          }}
        />
      </View>
      <View style={styles.addContactInfo}>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    </View>
  );
}
function EditPhoneNumbers({
  phoneNumbers,
  updatePhoneNumbers,
}: {
  phoneNumbers: string[];
  updatePhoneNumbers: (phoneNumbers: string[]) => void;
}) {
  const liveInputRef = useRef<string | undefined>(undefined);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [error, setError] = useState("");
  const [phoneNumberInput, setPhoneNumberInput] = useState<string>();

  function handlePhoneNumberChange(input: string | undefined) {
    if (input) setError("");
    liveInputRef.current = input;
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setPhoneNumberInput(input);
    }, 100);
  }

  function handleAdd() {
    const input = liveInputRef.current;
    if (!input) {
      setError("Unable to add empty phone number");
      return;
    }
    if (!isPossiblePhoneNumber(input)) {
      setError("Please provide a valid phone number");
      return;
    }
    updatePhoneNumbers([...phoneNumbers, input]);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    liveInputRef.current = undefined;
    setPhoneNumberInput("");
  }

  function handleDelete(indexToDelete: number) {
    const newPhoneNumbers = phoneNumbers.filter(
      (element, index) => index !== indexToDelete,
    );
    updatePhoneNumbers(newPhoneNumbers);
  }

  return (
    <View>
      <Text style={styles.contactInfoTitle}>Phone Numbers</Text>
      <View style={styles.addContactInfo}>
        <PhoneInput
          style={{
            ...styles.inputField,
            borderColor: error ? "red" : "black",
          }}
          placeholder="Phone Number"
          placeholderTextColor={placeholderTextColor}
          value={phoneNumberInput}
          onChange={handlePhoneNumberChange}
          maxLength={20}
        />
        <Pressable onPress={handleAdd}>
          <Image
            source={buttonAdd}
            resizeMode="contain"
            style={styles.buttonPlus}
          />
        </Pressable>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <View style={styles.listAddedInfo}>
        {phoneNumbers.map((phoneNumber, index) => (
          <View
            key={index}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Text>{formatPhoneNumberIntl(phoneNumber)}</Text>
            <Pressable
              onPress={() => {
                handleDelete(index);
              }}
            >
              <Image
                source={buttonDelete}
                resizeMode="contain"
                style={styles.buttonPlus}
              />
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}

function EditEmailAddresses({
  emailAddresses,
  updateEmailAddresses,
}: {
  emailAddresses: string[];
  updateEmailAddresses: (emailAddresses: string[]) => void;
}) {
  const [error, setError] = useState("");
  const [emailInput, setEmailInput] = useState<string>("");
  function validateEmail(input: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(input);
  }
  function handleAdd() {
    if (!emailInput) {
      setError("Unable to add empty email address");
      return;
    }
    if (!validateEmail(emailInput)) {
      setError("Please provide a valid email address");
      return;
    }
    updateEmailAddresses([...emailAddresses, emailInput]);
    setEmailInput("");
    setError("");
  }

  function handleDelete(indexToDelete: number) {
    const newEmailAddresses = emailAddresses.filter(
      (element, index) => index !== indexToDelete,
    );
    updateEmailAddresses(newEmailAddresses);
  }

  return (
    <View>
      <Text style={styles.contactInfoTitle}>Email Addresses</Text>
      <View style={styles.addContactInfo}>
        <TextInput
          style={{
            ...styles.inputField,
            borderColor: error ? "red" : "black",
          }}
          placeholder="Email Address"
          placeholderTextColor={placeholderTextColor}
          value={emailInput}
          onChangeText={(input) => {
            setEmailInput(input);
            setError("");
          }}
        />
        <Pressable onPress={handleAdd}>
          <Image
            source={buttonAdd}
            resizeMode="contain"
            style={styles.buttonPlus}
          />
        </Pressable>
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      <View style={styles.listAddedInfo}>
        {emailAddresses.map((emailAddress, index) => (
          <View
            key={index}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Text>{emailAddress}</Text>
            <Pressable
              onPress={() => {
                handleDelete(index);
              }}
            >
              <Image
                source={buttonDelete}
                resizeMode="contain"
                style={styles.buttonPlus}
              />
            </Pressable>
          </View>
        ))}
      </View>
    </View>
  );
}

function EditUrlLinks({
  urlLinks,
  updateUrlLinks,
}: {
  urlLinks: Record<string, string>;
  updateUrlLinks: (urlLinks: Record<string, string>) => void;
}) {
  const [inputLinkField, setInputLinkField] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("");
  const [platformTextInputField, setPlatformTextInputField] =
    useState<string>("");
  const isSelectedPlatform = selectedPlatform !== "";
  const isCustomPlatform = selectedPlatform === "_add_your_own_";
  function handleAdd() {
    let platform;
    let url;
    if (selectedPlatform === "" || inputLinkField === "") {
      return;
    }
    platform =
      selectedPlatform === "_add_your_own_"
        ? platformTextInputField
        : selectedPlatform;

    if (platformURLs[selectedPlatform]) {
      url = `https://${platformURLs[selectedPlatform]}/${inputLinkField}`;
    } else {
      url = `https://${inputLinkField}`;
    }

    updateUrlLinks({ ...urlLinks, [platform]: url });
    setPlatformTextInputField("");
    setInputLinkField("");
    setSelectedPlatform("");
  }
  function handleDelete(platform: string) {
    const newLinks = { ...urlLinks };
    delete newLinks[platform];
    updateUrlLinks(newLinks);
  }
  function getPlaceholder() {
    if (selectedPlatform === "_add_your_own_") {
      return "example.com/profile";
    }
    return "";
  }

  const entries = Object.entries(urlLinks);

  return (
    <View>
      <Text style={styles.contactInfoTitle}>URL Links</Text>
      <View style={styles.addContactInfo}>
        <Picker
          style={styles.inputField}
          selectedValue={selectedPlatform}
          onValueChange={(itemValue) => {
            setSelectedPlatform(itemValue);
          }}
        >
          <Picker.Item label="Select a platform" value="" enabled={false} />
          {platformsList.map((platformName, index) => (
            <Picker.Item
              key={index}
              label={platformName}
              value={platformName}
            />
          ))}
          <Picker.Item label="Other (Add your own)" value="_add_your_own_" />
        </Picker>
      </View>

      <View>
        {isCustomPlatform && (
          <TextInput
            style={{ ...styles.inputField }}
            value={platformTextInputField}
            onChangeText={setPlatformTextInputField}
            placeholder="Platform Label"
            placeholderTextColor={placeholderTextColor}
          ></TextInput>
        )}
        <View style={styles.addContactInfo}>
          {isSelectedPlatform && (
            <View
              style={{
                ...styles.inputField,
                flexDirection: "row",
                alignItems: "center",
                paddingVertical: 2,
              }}
            >
              {isSelectedPlatform && !isCustomPlatform && (
                <Text
                  style={{ flexGrow: 0, flexShrink: 0, marginLeft: 6 }}
                >{`https://${platformURLs[selectedPlatform]}${platformURLs[selectedPlatform] ? "/" : ""}`}</Text>
              )}
              <TextInput
                style={{
                  flexGrow: 1,
                  flexShrink: 1,
                  marginLeft: isCustomPlatform ? 0 : -4,
                }}
                onChangeText={(input) => setInputLinkField(input)}
                value={inputLinkField}
                placeholder={getPlaceholder()}
                placeholderTextColor={placeholderTextColor}
                editable={isSelectedPlatform}
              ></TextInput>
            </View>
          )}
          {isSelectedPlatform && (
            <Pressable onPress={handleAdd}>
              <Image
                source={buttonAdd}
                resizeMode="contain"
                style={styles.buttonPlus}
              />
            </Pressable>
          )}
        </View>
      </View>

      {entries.map(([platform, url], index) => (
        <View key={index} style={styles.listAddedLinks}>
          <Text style={styles.socialPlatformName}>{`${platform}: `}</Text>
          <Text>{url}</Text>
          <Pressable
            onPress={() => {
              handleDelete(platform);
            }}
          >
            <Image
              source={buttonDelete}
              resizeMode="contain"
              style={styles.buttonPlus}
            />
          </Pressable>
        </View>
      ))}
    </View>
  );
}

function EditWorkplace({
  organization,
  updateOrganization,
}: {
  organization: ContactCard["organization"];
  updateOrganization: (org: ContactCard["organization"]) => void;
}) {
  return (
    <View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={styles.contactInfoTitle}>Workplace</Text>
      </View>
      <View style={styles.addContactInfo}>
        <TextInput
          placeholder="Company"
          placeholderTextColor={placeholderTextColor}
          editable
          style={styles.inputField}
          value={organization?.company}
          onChangeText={(input) => {
            const newOrg: ContactCard["organization"] = {
              ...organization,
              company: input,
            };
            updateOrganization(newOrg);
          }}
        />
      </View>
      {
        <View style={styles.addContactInfo}>
          <TextInput
            placeholder="Job Title"
            placeholderTextColor={placeholderTextColor}
            editable
            style={styles.inputField}
            value={organization?.position}
            onChangeText={(input) => {
              const newOrg: ContactCard["organization"] = {
                ...organization,
                position: input,
              };
              updateOrganization(newOrg);
            }}
          />
        </View>
      }
    </View>
  );
}
function ColorPicker({
  selectedColor,
  setSelectedColor,
  error,
  clearError,
}: {
  selectedColor: string;
  setSelectedColor: (color: ContactCardContainer["color"]) => void;
  error: string;
  clearError: VoidFunction;
}) {
  return (
    <View>
      <View style={styles.colorButtonsWrapper}>
        {buttonColors.map(({ bgColor, borderColor }, index) => (
          <Pressable
            key={index}
            style={{}}
            onPress={() => {
              setSelectedColor(bgColor as ContactCardContainer["color"]);
              clearError();
            }}
          >
            <View
              style={{
                ...styles.colorButtons,
                backgroundColor: `${bgColor}`,
                borderColor: bgColor === selectedColor ? borderColor : "black",
              }}
            ></View>
          </Pressable>
        ))}
      </View>
      <View style={{ marginHorizontal: 8 }}>
        {error && <Text style={styles.errorText}>{error}</Text>}
      </View>
    </View>
  );
}

export function useContactCard(
  initial: ContactCard,
): [ContactCard, UpdateContactCard] {
  const [card, setCard] = useState<ContactCard>(initial);
  function updateCard<K extends keyof ContactCard>(
    key: K,
    value: ContactCard[K],
  ) {
    setCard((prev) => ({
      ...prev,
      [key]: value,
    }));
  }
  return [card, updateCard];
}

const styles = StyleSheet.create({
  editCardParent: {
    marginHorizontal: 24,
    flex: 1,
  },
  contactInfoTitle: {
    fontSize: 32,
    fontFamily: "BitcountSingle-Regular",
  },
  inputField: {
    borderWidth: 2,
    width: "80%",
    borderRadius: 8,
    marginVertical: 4,
    paddingVertical: 12,
  },
  buttonPlus: { width: 32, height: 32 },
  buttonSave: { width: 48, height: 48 },
  addContactInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  listAddedInfo: {
    justifyContent: "center",
  },
  listAddedLinks: {
    flexDirection: "row",
    alignItems: "center",
  },
  socialPlatformName: {
    fontWeight: "bold",
  },
  header: { height: 48 },
  colorButtonsWrapper: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    flexWrap: "wrap",
    marginVertical: 16,
  },
  colorButtons: {
    borderWidth: 2,
    width: 64,
    aspectRatio: 3 / 2,
  },
  errorText: { color: "red" },
});
