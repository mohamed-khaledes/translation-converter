# 🚀 Translation Converter Web App

A beautiful, modern web application built with Next.js that converts TypeScript translation files to Excel spreadsheets and vice versa. Perfect for teams collaborating on multilingual projects!

![Translation Converter](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)

## ✨ Features

- 🎨 **Beautiful UI** - Modern, elegant design with smooth animations
- 📁 **Drag & Drop** - Simply drag your files or click to upload
- 🔄 **Bidirectional** - Convert TypeScript ↔ Excel seamlessly
- ⚡ **Fast Processing** - Handle thousands of translation entries instantly
- 🎯 **Structure Preservation** - Maintains nested keys using dot notation
- 📱 **Responsive** - Works perfectly on desktop, tablet, and mobile
- 🌐 **No Backend Required** - All processing happens in the browser

## 🎥 Quick Demo

1. Select conversion direction (TS → Excel or Excel → TS)
2. Drop your file or click to browse
3. Click Convert button
4. Download converted file automatically

## 📋 Prerequisites

- **Node.js** 18+ installed
- **npm** or **yarn** package manager

## 🛠️ Installation

1. **Extract the project folder** and navigate to it:
```bash
cd translation-converter
```

2. **Install dependencies:**
```bash
npm install
```

## 🚀 Running the App

### Development Mode
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm start
```

## 📖 How to Use

### Converting TypeScript to Excel

1. **Select "TypeScript to Excel"** mode
2. **Upload your `.ts` file** (e.g., `en.ts`)
3. **Click "Convert to Excel"**
4. **Download** the generated Excel file
5. **Send to translators** for editing

### Converting Excel to TypeScript

1. **Select "Excel to TypeScript"** mode
2. **Upload your `.xlsx` file** (edited translations)
3. **Click "Convert to TypeScript"**
4. **Download** the generated `.ts` file
5. **Replace** in your project

## 📂 Project Structure

```
translation-converter/
├── app/
│   ├── api/
│   │   └── convert/
│   │       └── route.ts          # API endpoint for conversion
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main page component
├── lib/
│   └── converter.ts              # Core conversion logic
├── public/                       # Static assets
├── next.config.js                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies
└── README.md                     # This file
```

## 🎨 Design Features

- **Custom Fonts** - DM Serif Display + Work Sans
- **Color Palette** - Coral, Navy, Sage, and Cream
- **Animations** - Smooth fade-in and hover effects
- **Responsive Grid** - Adapts to any screen size
- **Interactive Feedback** - Real-time drag & drop states

## 🔧 Technical Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Excel Processing**: SheetJS (xlsx)
- **Styling**: Custom CSS with CSS Variables
- **API**: Next.js API Routes

## 💡 Conversion Logic

### TypeScript → Excel
1. Parse TypeScript object
2. Flatten nested structure to dot notation
3. Create Excel with Key/Value columns
4. Auto-size columns for readability

### Excel → TypeScript
1. Read Excel data
2. Extract Key/Value pairs
3. Reconstruct nested object structure
4. Format as TypeScript with proper escaping

## 📊 Excel Format

The generated Excel file has this structure:

| Key | Value |
|-----|-------|
| nav.home | home |
| nav.about | about us |
| home.about.title | about us |
| home.about.subtitle | Want To Know More About Us ? |

**Important**: Only edit the "Value" column. Never modify the "Key" column!

## 🌟 Use Cases

### For Development Teams
- Export translations for review
- Share with non-technical translators
- Version control TypeScript files

### For Translation Teams
- Edit translations in familiar Excel
- No need to understand code structure
- Track changes easily

### For Localization Projects
- Convert between formats quickly
- Maintain consistency across languages
- Automate translation workflows

## 🔒 Privacy & Security

- **Client-Side Processing** - No data sent to external servers
- **No Storage** - Files processed in memory only
- **Secure** - All conversions happen in your browser

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000

# Or use different port
npm run dev -- -p 3001
```

### Module Not Found
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Conversion Errors
- Verify file format (`.ts` or `.xlsx`)
- Check Excel has "Key" and "Value" columns
- Ensure TypeScript file has valid syntax

## 🚀 Deployment Options

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Static Export
```bash
# Add to next.config.js
output: 'export'

# Build
npm run build
# Deploy /out folder to any static host
```

## 🤝 Contributing

Ideas for improvements:
- [ ] Batch file conversion
- [ ] Support for JSON format
- [ ] Translation memory integration
- [ ] Real-time preview
- [ ] Multiple sheet support
- [ ] CSV export option

## 📝 License

MIT License - feel free to use in your projects!

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Excel processing by [SheetJS](https://sheetjs.com/)
- Fonts from [Google Fonts](https://fonts.google.com/)

## 📞 Support

Having issues? Check:
1. Node.js version (18+)
2. Dependencies installed correctly
3. Port 3000 is available
4. File formats are correct

## 🎯 Future Enhancements

- **Multi-language support** in UI
- **Drag & drop for multiple files**
- **Progress indicators** for large files
- **File validation** before conversion
- **Conversion history** tracking
- **Direct Google Sheets integration**

---
## 🤝DEMO
https://translation-converter.vercel.app/
---
Made with ❤️ for developers and translators worldwide
