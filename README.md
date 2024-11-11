# TokenizedText React Component

A React component that simulates a text animation with a blinking cursor and smooth text reveal.

## Live Demo

Check out the interactive demo at: [https://thepowerpilot.com/blog/projects/react-components](https://thepowerpilot.com/blog/projects/react-components)

## Features

- Word-by-word text animation
- Dynamically sized cursor that matches text height
- Smooth height transitions
- Initial cursor delay for authentic text reveal
- No external dependencies (except React)
- Customizable text speed and delays
- TypeScript support
- Responsive and accessible

## Installation

Copy the code from [src/TokenizedText.tsx](/src/TokenizedText.tsx) into your project, you can use the css from [src/TokenizedText.module.css](/src/TokenizedText.module.css) as well. though you may have to adapt it to your project's styling engine (tailwind etc.)

## Usage

```tsx
import { TokenizedText } from "react-tokenized-text";

function MyComponent() {
  return (
    <TokenizedText
      text="Welcome to my website!"
      typingSpeed={50}
      initialCursorDelay={1000}
      onComplete={() => console.log("Text reveal complete")}
    />
  );
}
```

## Props

| Prop               | Type       | Default    | Description                               |
| ------------------ | ---------- | ---------- | ----------------------------------------- |
| text               | string     | (required) | The text to be animated                   |
| typingSpeed        | number     | 100        | Time in milliseconds between each token   |
| delay              | number     | 0          | Initial delay before text starts          |
| initialCursorDelay | number     | 1000       | Time to show cursor before text starts    |
| className          | string     | ''         | Additional CSS classes                    |
| onComplete         | () => void | undefined  | Callback fired when text reveal completes |

## Examples

### Basic Usage

```tsx
<TokenizedText text="Hello, World!" />
```

### With Custom Timing

```tsx
<TokenizedText
  text="This reveals slower..."
  typingSpeed={150}
  initialCursorDelay={2000}
/>
```

### With Completion Callback

```tsx
<TokenizedText
  text="Triggers a function when done"
  onComplete={() => {
    console.log("Text reveal complete");
    // Start next animation, show next element, etc.
  }}
/>
```

### Chaining Multiple Lines

```tsx
function SequentialText() {
  const [step, setStep] = useState(1);

  return (
    <div>
      <TokenizedText text="This appears first" onComplete={() => setStep(2)} />
      {step >= 2 && (
        <TokenizedText
          text="This appears second"
          onComplete={() => setStep(3)}
        />
      )}
      {step >= 3 && <TokenizedText text="This appears last" />}
    </div>
  );
}
```

### Custom Styling

```tsx
<TokenizedText
  text="Custom styled text"
  className="text-2xl font-bold text-blue-500"
/>
```

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build package
npm run build
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this in your projects!
