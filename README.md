# Realtime Voice Chatbot with OpenAI and Next.js

This repository contains the code for building a realtime voice chatbot using OpenAI's latest realtime models and Next.js. This project demonstrates how to create an interactive voice interface that enables natural conversations with an AI assistant.

## Features

- 🎙️ Real-time voice interactions
- 🤖 OpenAI's latest realtime model integration
- ⚡ Built with Next.js and TypeScript
- 🎨 Modern UI with Tailwind CSS
- 🔒 Secure API key handling

## Prerequisites

- Node.js (v18 or higher)
- OpenAI API key with access to realtime models
- Modern web browser with WebRTC support

## Getting Started

1. Clone the repository:

```bash
git clone <your-repo-url>
cd <repo-name>
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:
   - Copy `example.env.local` to `.env.local`
   - Add your OpenAI API key and configure other variables:

```env
OPENAI_API_KEY=your_api_key_here
NEXT_PUBLIC_OPENAI_REALTIME_MODEL=gpt-4o-mini-realtime-preview
NEXT_PUBLIC_OPENAI_REALTIME_VOICE=sage
NEXT_PUBLIC_OPENAI_BASE_URL=https://api.openai.com/v1/realtime
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Tech Stack

- [Next.js](https://nextjs.org/) - React framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [OpenAI API](https://openai.com/) - AI model integration
- WebRTC - Real-time voice communication

## Project Structure

- `/src/app` - Next.js application routes and API endpoints
- `/src/hooks` - Custom React hooks including WebRTC functionality
- `/public` - Static assets
- `/src/components` - Reusable UI components

## Contributing

This project is part of a YouTube tutorial series. Feel free to fork and modify for your own use.

## License

[MIT](LICENSE)

## Acknowledgments

- OpenAI for providing the realtime AI models
- Next.js team for the amazing framework
- All contributors and viewers of the tutorial series
