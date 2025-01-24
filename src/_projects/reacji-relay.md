---
title: Reacji Relay
subtitle: Slack app
client: Pendo
cover-image: /assets/images/projects/reacji-relay.png
tags:
  - Javascript
  - Supabase
  - Slack
layout: project
year: 2024
---

A Slack app that forwards messages to different channels, based on the emojis
users react to the message with. Supports private-channel destinations and a
robust administrative interface. <!--more-->

---

## History

Disappointed that Slack's home-grown
[Reacji Channeler](https://reacji-channeler.builtbyslack.com/) app did not
support targeting private channels with their forwarding rules, I took it upon
myself to create a more robust solution.

As a frontend engineer, I wanted to do as little backend work as possible.
Fortunately, in 2024, database-as-a-service providers and edge function
technologies make avoiding backend work an achievable goal. Having experimented
a bit with both Supabase (DBaaS) and edge functions with DigitalOcean, I was
comfortable with the challenge of putting those ideas together into a
production-ready app.

"Production-ready" is a formidable aspiration _outside_ the technical details. I
have yet to implement any sort of payment model (even edge functions aren't
free), airtight privacy policy, or formalized support channel. Even after
installing the app in your workspace, the activation flow is nothing more than
sending me an email at the moment!

However, a "version 1.0" of the app is largely code-complete. For the sake of
giving the app a public web presence, to begin soliciting alpha testing feedback
and share what I'm working on, I'm establishing this project page.

---

The link below allows you to install the app in your workspace, _assuming the Supabase project is running_.
Currently, it is unlikely that the project is active,
because I have no active users (and I don't wish to pay Supabase for an idle project instance).
If you are interested in trying it out, [let me know](mailto:reacjisupport.smite805@passmail.net) and I'll spin up the backend for you!

<a href="https://ouajvwrffkiwzwwjvuzp.supabase.co/functions/v1/oauth/request" style="align-items:center;color:#000;background:#fff;border:1px solid #ddd;border-radius:4px;display:inline-flex;font-family:Lato, sans-serif;font-size:16px;font-weight:600;height:48px;justify-content:center;text-decoration:none;width:236px"><svg xmlns="http://www.w3.org/2000/svg" style="height:20px;width:20px;margin-right:12px" viewBox="0 0 122.8 122.8"><path d="M25.8 77.6c0 7.1-5.8 12.9-12.9 12.9S0 84.7 0 77.6s5.8-12.9 12.9-12.9h12.9v12.9zm6.5 0c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9v32.3c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V77.6z" fill="#e01e5a"></path><path d="M45.2 25.8c-7.1 0-12.9-5.8-12.9-12.9S38.1 0 45.2 0s12.9 5.8 12.9 12.9v12.9H45.2zm0 6.5c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H12.9C5.8 58.1 0 52.3 0 45.2s5.8-12.9 12.9-12.9h32.3z" fill="#36c5f0"></path><path d="M97 45.2c0-7.1 5.8-12.9 12.9-12.9s12.9 5.8 12.9 12.9-5.8 12.9-12.9 12.9H97V45.2zm-6.5 0c0 7.1-5.8 12.9-12.9 12.9s-12.9-5.8-12.9-12.9V12.9C64.7 5.8 70.5 0 77.6 0s12.9 5.8 12.9 12.9v32.3z" fill="#2eb67d"></path><path d="M77.6 97c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9-12.9-5.8-12.9-12.9V97h12.9zm0-6.5c-7.1 0-12.9-5.8-12.9-12.9s5.8-12.9 12.9-12.9h32.3c7.1 0 12.9 5.8 12.9 12.9s-5.8 12.9-12.9 12.9H77.6z" fill="#ecb22e"></path></svg>Add
to Slack</a>

## Usage

The app can be configured using four commands:

- `/reacji help`: Displays a message with usage information.
- `/reacji list`: Displays all forwarding rules currently configured for your
  workspace.
- `/reacji add :emoji: #destination`: Adds a forwarding rule for any messages
  who receive the `:emoji:` reaction. They will be forwarded to the
  `#destination` channel.
- `/reacji remove :emoji: #destination`: Removes the forwarding rule for the
  given emoji and destination.

Note that the app must be **manually invited** to each channel where reactions
should be observed, and where posts should be forwarded. The app will **not**
see messages or reactions in channels it is not invited to, and it will silently
refuse to post messages in destination channels it is not a member of.

Additionally, the app will **never re-post messages from DMs or private
channels**, regardless of destination. The app can safely be invited to private
channels (to serve as a destination) without concern that private information is
re-posted publicly.

## Support

For now, any questions or concerns should be sent directly to me via
[email](mailto:reacjisupport.smite805@passmail.net). Creating a more robust
support system is high on my priority list!

## Privacy Policy

A formal Privacy Policy will be drafted in the near future. In the meantime, the
following is a plain-English overview of what you can expect from using Reacji
Relay:

- Authentication is handled entirely through Slack. We do not collect, manage,
  or even see login information from users.

- The Slack app itself asks for certain permission scopes, such as reading
  message reaction data and posting to private channels. These permissions are
  used to provide the essential functionalities of this app. It will never post
  unsolicited messages or pull post content from Slack.

- Information stored in the database includes Channel IDs, Team/Workspace IDs,
  User IDs, message timestamps, and emoji identifiers. Of these, the only
  "plain-English" information are emoji identifiers (e.g. `:sweat-smile:`). All
  other information is set by Slack. Their IDs typically look like `C12345` or
  `T67890` (a letter followed by numbers). In other words, they do not carry
  personally-identifiable information.

- When deleting/de-registering your application instance, _all data related to
  your workspace is automatically deleted from the system_. Nothing is retained.

- Email [the support address](mailto:reacjisupport.smite805@passmail.net) if you
  desire an export of your data.
