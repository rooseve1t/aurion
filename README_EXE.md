# Building the Executable

This project includes a script to build a standalone executable for the application.

## Prerequisites

- Node.js 18+
- npm

## Build Command

To build the executable, run:

```bash
npm run build:exe
```

This script will:
1. Build the frontend (React/Vite) into the `dist` folder.
2. Bundle the backend (Express/Node) into `dist-server/index.js` using `esbuild`.
3. Package everything into a standalone executable using `pkg`.
4. Copy necessary native modules (like `better-sqlite3`) to the output folder.

## Output

The executable will be located in the `build` folder.

- `build/react-example-win.exe` (Windows)
- `build/react-example-linux` (Linux)
- `build/react-example-macos` (macOS)

## Running the Executable

Simply double-click the executable or run it from the command line.

**Note:** Since the application uses `better-sqlite3`, the `better_sqlite3.node` file must be in the same directory as the executable if it wasn't bundled correctly by `pkg`. The build script attempts to copy it for you.

## Troubleshooting

If you encounter errors about missing modules, check if they are native modules. Native modules often need to be externalized in `esbuild` and copied manually or configured in `pkg`.

If the frontend doesn't load, ensure the `dist` folder was correctly included as an asset in `package.json` under the `pkg` configuration.
