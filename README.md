# Snorkle

**Snorkle** is a 100% local, private document search tool. It enables you to run deep, private searches across hundreds of pages per minute to get relevant context for your queries. Snorkle can run on any backend LLM server, using [text-gen-webui](https://github.com/oobabooga/text-generation-webui) by default.

Snorkle is a fork of [Patense.local](https://github.com/JohnZolton/patense-local.git), a document analysis tool for patent attorneys, with a modified system prompt for general searching.

It basically breaks your references up into pages, passes each page to an LLM with the query, and asks if the content is relevant to the query. If it's relevant, it displays a short quote with a link to the full page.

![Demo](./snorkle.gif)

## Features

- **Privacy First**: Run the tool entirely on your local machine, ensuring full control over your data.
- **High Performance**: Search and analyze large documents quickly and efficiently.
- **Flexible Backend**: While text-gen-webui is the default, Patense.local can work with any backend LLM server.

## Requirements

- [text-gen-webui](https://github.com/oobabooga/text-generation-webui) (installation is outside the scope of this guide).
- **Node.js** and **npm** (These are necessary to run the application. If you're unfamiliar with installing them, it might be easier to use Patense.ai).

## Installation

1. **Clone the Repository**

   ```bash
   git clone https://github.com/JohnZolton/snorkle.git
   cd patense.local

2. **Install Dependencies**
   ```bash
   npm install

3. **Configure the Backend**
   
    Start your backend LLM server in api mode

   in your text-gen-webui folder (or other backend) run:
   ```bash
   Linux
   ./start_linux.sh --listen --api
   
   Windows
   ./start_windows.bat --listen --api

   Mac
   ./start_macos.sh --listen --api

  In text-gen-webui, select and load your model (8B tier is quite fast, at about 0.5-1 second per page on a 3090)

4. Run the Application
   in the /snorkle folder, run:
   ```bash
   npm start
5. Naviage to http://localhost:3000

## Usage

Once the application is running, you can begin uploading documents and performing searches.
