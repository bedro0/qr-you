import QRCode from "react-qr-code";
import { View } from "react-native";
import { z } from "zod";

export const platformsList = [
  "BeReal",
  "Bluesky",
  "Discord",
  "Facebook",
  "GitHub",
  "Instagram",
  "LinkedIn",
  "Mastodon",
  "Meetup",
  "Pinterest",
  "Quora",
  "Reddit",
  "Snapchat",
  "SoundCloud",
  "StackOverflow",
  "Steam",
  "TikTok",
  "Tumblr",
  "Twitch",
  "Twitter",
];

export const platformURLs: Record<string, string> = {
  BeReal: "bereal.com",
  Bluesky: "bsky.app",
  Discord: "discord.com",
  Facebook: "facebook.com",
  GitHub: "github.com",
  Instagram: "instagram.com",
  LinkedIn: "linkedin.com",
  Mastodon: "mastodon.social",
  Meetup: "meetup.com",
  Pinterest: "pinterest.com",
  Quora: "quora.com",
  Reddit: "reddit.com",
  Snapchat: "snapchat.com",
  SoundCloud: "soundcloud.com",
  StackOverflow: "stackoverflow.com",
  Steam: "steampowered.com",
  TikTok: "tiktok.com",
  Tumblr: "tumblr.com",
  Twitch: "twitch.tv",
  Twitter: "twitter.com",
};
