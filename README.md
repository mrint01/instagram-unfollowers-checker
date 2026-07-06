# Who Doesn't Follow You Back

A simple React app that compares your Instagram **followers** and **following**
lists and shows you who you follow that doesn't follow you back. Click any name
to open their Instagram profile.

Everything runs entirely in your browser — your data files are never uploaded
anywhere.

## How to get your Instagram data

1. Open Instagram → your profile → **Settings and privacy**.
2. Go to **Accounts Center → Your information and permissions → Download your information**.
3. Choose **Request a download** → select your profile → **Select types of information**.
4. Select only **Followers and following**.
5. Set format to **JSON** and date range to **All time**, then submit.
6. Instagram emails you a link to a `.zip` file — download and unzip it.
7. Inside, find `connections/followers_and_following/followers_1.json` and `following.json`.

(The app also shows these steps in-app under "How do I get my followers/following JSON files?")

## Running locally

```bash
npm install
npm run dev
```

Then open the printed local URL, upload both JSON files, and see who doesn't
follow you back.

## Tech

React + Vite, no backend, no analytics.
