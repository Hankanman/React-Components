function App() {
    const [sequentialStep, setSequentialStep] = React.useState(1);

    React.useEffect(() => {
        // Basic Example
        ReactDOM.render(
            React.createElement(TokenizedText, {
                text: "Welcome to TokenizedText Component Showcase!",
                typingSpeed: 100
            }),
            document.getElementById('basic-example')
        );

        // Custom Speed Example
        ReactDOM.render(
            React.createElement(TokenizedText, {
                text: "This text reveals much slower for dramatic effect...",
                typingSpeed: 250,
                initialCursorDelay: 2000
            }),
            document.getElementById('speed-example')
        );

        // Sequential Text Example
        function renderSequentialText() {
            const container = document.getElementById('sequential-example');
            if (container) {
                const elements = [
                    sequentialStep >= 1 && React.createElement(TokenizedText, {
                        key: 1,
                        text: "First, let's start with this line...",
                        onComplete: () => setSequentialStep(2)
                    }),
                    sequentialStep >= 2 && React.createElement(TokenizedText, {
                        key: 2,
                        text: "Then, we'll add another line...",
                        onComplete: () => setSequentialStep(3)
                    }),
                    sequentialStep >= 3 && React.createElement(TokenizedText, {
                        key: 3,
                        text: "And finally, a third line appears!",
                    })
                ].filter(Boolean);

                ReactDOM.render(
                    React.createElement('div', null, elements),
                    container
                );
            }
        }

        renderSequentialText();
    }, [sequentialStep]);

    return null;
}

// Render the App component
ReactDOM.render(
    React.createElement(App),
    document.getElementById('root')
);
