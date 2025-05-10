# Facebook Friend Mass Unfriender

This is a simple tool that allows you to quickly delete (unfriend) multiple Facebook friends at once. It uses browser automation via JavaScript to click through Facebook's UI and unfriend people.

## Why Delete Facebook Friends?

There are many reasons you might want to unfriend multiple people on Facebook:

- You want to leave Facebook but need to keep your account for other purposes (login to other services, etc.)
- You want a fresh start with fewer connections
- You're concerned about privacy and want to reduce your social footprint
- You're tired of seeing content from people you no longer interact with

## How It Works

This tool doesn't require you to provide your Facebook credentials or any API access. Instead, it runs directly in your browser and simulates clicks to:

1. Find "More" buttons on friend cards
2. Click the button to open a menu
3. Select the "Unfriend" option
4. Confirm the unfriending action
5. Move to the next friend

## Usage Instructions

### Method 1: Using Browser Console (Fastest Method)

1. Log in to Facebook
2. Go to [https://www.facebook.com/friends/list](https://www.facebook.com/friends/list)
3. Open your browser's developer tools:
   - Chrome/Edge: Press F12 or right-click and select "Inspect"
   - Firefox: Press F12 or right-click and select "Inspect Element"
   - Safari: Enable Developer menu in Preferences > Advanced, then right-click and select "Inspect Element"
4. Click on the "Console" tab in developer tools
5. Copy the entire script from `public/facebook-unfriender.js` (or from the web interface)
6. Paste it into the console and press Enter
7. In the console, type `deleteThisMany(400)` (change 400 to the number of friends you want to unfriend)
8. Let it run and watch the console for updates

### Method 2: Using the Web Interface

1. Clone this repository
2. Install dependencies with `npm install`
3. Start the server with `npm start`
4. Open your browser to `http://localhost:3000`
5. Follow the instructions on the web page

## Features

- **No API access required**: Works directly in your browser
- **Automatic scrolling**: The script scrolls down to load more friends as it processes
- **Loop detection**: Avoids getting stuck in a loop processing the same friends
- **Progress tracking**: Shows how many friends have been processed and unfriended
- **Simple interface**: Just copy, paste, and run

## Limitations

- Facebook may detect automation and temporarily block actions
- Facebook's UI can change, potentially breaking the script
- The script can only unfriend people shown in the friends list page
- Facebook may rate-limit unfriending actions if done too quickly

## Web Server

This repository also includes a simple web server built with Express that:

1. Serves the tool's web interface
2. Provides the script for easy copying
3. Includes instructions on how to use the tool

## Contributing

Contributions are welcome! If you encounter an issue or have an improvement:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/improvement`)
3. Make your changes
4. Commit your changes (`git commit -am 'Add new feature'`)
5. Push to the branch (`git push origin feature/improvement`)
6. Create a new Pull Request

## Disclaimer

This tool is provided for educational purposes only. Use at your own risk. Unfriending people is a permanent action and cannot be automatically undone.

This is not affiliated with Facebook in any way. Facebook may consider automation against their terms of service, so use responsibly and at your own discretion.

## License

MIT 