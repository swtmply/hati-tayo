# Hati Tayo Mobile Application

Hati-Tayo is a mobile application designed to simplify bill splitting among groups. The app allows users to create groups, manage transactions, and keep track of expenses efficiently.

### Features

- **Bill Splitting**: Easily split bills among group members.
- **Group Creation**: Create groups for different occasions or purposes.
- **Hatian Creation**: Create a hatian for groups that have transactions together.
- **Transaction Management**: Create and manage transactions for each hatian.

### Getting Started

**Prerequisites**

- [Bun](https://bun.sh/) or [Node.js](https://nodejs.org/en)
- [Expo](https://expo.dev/) CLI

**Installation**

1. Clone the repository

```bash
   git clone https://github.com/swtmply/hati-tayo.git
   cd hati tayo
```

2. Install dependencies:

```bash
   bun install
   # or
   npm install
```

3. Set up environment variables: Copy .env.example to .env.local and fill in the required values.

**Running the App**

1. Start the Expo development server:

```bash
   bun start
   #or
   npm start
```

2. Use the Expo Go app on your mobile device to scan the QR code and run the application.

### Project Structure

- `app/`: Contains the main application code.
  - `(auth)/`: Authentication-related screens.
  - `(details)/`: Detail screens for various entities.
  - `(forms)/`: Forms for creating and editing entities.
  - `(tabs)/`: Tab navigation components.
- `components/`: Reusable UI components.
- `hooks/`: Custom hooks for data fetching and state management.
- `lib/`: Library files and utilities.
- `assets/`: Static assets such as images and fonts.
- `types/`: Type definitions.

### Contributing

Contributions are welcome! Please follow these steps:

Fork the repository.

1. Create a new branch (git checkout -b feature/your-feature).
2. Commit your changes (git commit -am 'Add new feature').
3. Push to the branch (git push origin feature/your-feature).
4. Create a new Pull Request.

### License

This project is licensed under the MIT License.

---

Enjoy using Hati-Tayo for all your bill splitting needs!
