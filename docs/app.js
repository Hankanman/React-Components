function App() {
    const [sequentialStep, setSequentialStep] = React.useState(1);

    React.useEffect(() => {
        // Basic Example
        ReactDOM.render(
            React.createElement(window.TokenizedText, {
                text: "Welcome to TokenizedText Component Showcase!",
                typingSpeed: 100
            }),
            document.getElementById('basic-example')
        );

        // Custom Speed Example
        ReactDOM.render(
            React.createElement(window.TokenizedText, {
                text: "This text reveals much slower for dramatic effect...",
                typingSpeed: 250,
                initialCursorDelay: 2000
            }),
            document.getElementById('speed-example')
        );
    }, []);

    // Sequential Text Example
    React.useEffect(() => {
        ReactDOM.render(
            React.createElement('div', null, [
                sequentialStep >= 1 && React.createElement(window.TokenizedText, {
                    key: 1,
                    text: "First, let's start with this line...",
                    onComplete: () => setSequentialStep(2)
                }),
                sequentialStep >= 2 && React.createElement(window.TokenizedText, {
                    key: 2,
                    text: "Then, we'll add another line...",
                    onComplete: () => setSequentialStep(3)
                }),
                sequentialStep >= 3 && React.createElement(window.TokenizedText, {
                    key: 3,
                    text: "And finally, a third line appears!",
                })
            ].filter(Boolean)),
            document.getElementById('sequential-example')
        );
    }, [sequentialStep]);

    return null;
}

ReactDOM.render(React.createElement(App), document.getElementById('root'));
