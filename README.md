# Fill in the Blank Review Helper

A Java desktop application that helps students review by hiding answers in parentheses. This interactive tool allows users to paste text with answers in parentheses and test themselves by clicking through hints and full answers.

## Features

- **Interactive Review System**: Click once to see the first character as a hint, click again to see the full answer, click a third time to reset
- **Dual Parentheses Support**: Works with both English `()` and Chinese `（）` parentheses
- **User-Friendly Interface**: Simple GUI with scrollable text pane and paste button
- **Visual Feedback**: Clickable buttons replace answers with visual feedback

## Requirements

- Java Development Kit (JDK) 8 or higher
- Java Swing (included in JDK)

## How to Use

1. **Compile the program**:
   ```bash
   javac FillInTheBlankReviewHelper.java
   ```

2. **Run the application**:
   ```bash
   java FillInTheBlankReviewHelper
   ```

3. **Using the application**:
   - Copy text that contains answers in parentheses (e.g., "The capital of France is (Paris)" or "The capital of France is （Paris）")
   - Click the "Paste Text" button in the application
   - Click on the blank buttons to reveal hints and answers:
     - First click: Shows the first character of the answer
     - Second click: Shows the full answer
     - Third click: Clears the answer and resets

## Example Usage

**Input text:**
```
The capital of France is (Paris).
The capital of Japan is （Tokyo）.
Water is made of (hydrogen) and (oxygen).
```

After pasting, the answers in parentheses will become clickable buttons that you can interact with to test your knowledge.

## Technologies Used

- Java
- Java Swing (GUI framework)
- Java AWT (for clipboard access and event handling)
- Regular Expressions (for pattern matching)

## Features in Detail

### Parentheses Detection
- Automatically detects both English `()` and Chinese `（）` parentheses
- Preserves the original parentheses style in the output
- Handles empty parentheses gracefully

### Interactive Buttons
- Buttons are styled with blue text
- Hand cursor appears on hover
- Click counter cycles through three states: hint → answer → blank

## Future Improvements

- Support for additional languages
- Customizable hint/answer display styles
- Save and load review sessions
- Export review statistics

## License

This project is open source and available for educational purposes.
