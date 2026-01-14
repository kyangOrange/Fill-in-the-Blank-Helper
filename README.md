# Fill in the Blank Review Helper

A web application that helps students review by hiding answers in various bracket types. This interactive tool allows users to paste text with answers in parentheses, brackets, or curly braces and test themselves by clicking through hints and full answers.

🌐 **Live Demo**: [https://kyangOrange.github.io/Fill-in-the-Blank-Helper/](https://kyangOrange.github.io/Fill-in-the-Blank-Helper/)

## Features

- **Interactive Review System**: Click once to see the first character as a hint, click again to see the full answer, click a third time to reset
- **Multiple Bracket Type Support**: Works with English `()`, Chinese `（）`, curly brackets `{}`, and square brackets `[]`
- **Bracket Type Selector**: Custom collapsible dropdown to choose which bracket types to process as blanks
- **Blank Counter**: Real-time counter showing how many blanks are open (x/y blanks open)
- **Fullscreen Mode**: Fullscreen button to view processed text in fullscreen for better studying
- **Reset Functionality**: Reset button to clear all input and output
- **User-Friendly Interface**: Clean, modern web interface with intuitive controls
- **Visual Feedback**: Clickable buttons replace answers with visual feedback and state indicators

## Requirements

- A modern web browser (Chrome, Firefox, Safari, Edge, etc.)
- No additional installation or dependencies needed

## How to Use

1. **Open the application**:
   - Simply open `index.html` in your web browser
   - You can double-click the file or drag it into your browser window

2. **Select bracket types** (optional):
   - Use the dropdown menu above the output area to select which bracket types should be processed as blanks
   - Options include: Chinese `（）`, English `()`, Curly `{}`, and Square `[]`
   - All types are selected by default
   - Only selected bracket types will be converted to interactive blanks

3. **Using the application**:
   - Copy text that contains answers in any supported bracket type (e.g., "The capital of France is (Paris)", "The capital of Japan is （Tokyo）", "The capital of Germany is {Berlin}", or "The capital of Spain is [Madrid]")
   - Paste the text into the text area
   - Click the "Process Text" button
   - View the blank counter in the top right of the output area showing how many blanks are open
   - Click on the blank buttons to reveal hints and answers:
     - First click: Shows the first character of the answer
     - Second click: Shows the full answer
     - Third click: Clears the answer and resets
   - Use the "Fullscreen" button to view the processed text in fullscreen mode
   - Use the "Reset" button to clear all input and output

## Example Usage

**Input text:**
```
The capital of France is (Paris).
The capital of Japan is （Tokyo）.
The capital of Germany is {Berlin}.
The capital of Spain is [Madrid].
Water is made of (hydrogen) and (oxygen).
```

After pasting and processing, the answers in the selected bracket types will become clickable buttons that you can interact with to test your knowledge. The blank counter will show how many blanks are currently open.

## Technologies Used

- HTML5 (structure and markup)
- CSS3 (styling and layout)
- JavaScript (interactivity and logic)
- Regular Expressions (for pattern matching)

## Features in Detail

### Bracket Type Detection
- Automatically detects English `()`, Chinese `（）`, curly brackets `{}`, and square brackets `[]`
- Users can select which bracket types to process via the dropdown selector
- Preserves the original bracket style in the output
- Handles empty brackets gracefully

### Bracket Type Selector
- Collapsible dropdown menu located above the output area
- Select multiple bracket types to process
- Shows count of selected types (e.g., "All selected (4)" or "2 selected")
- Click to expand/collapse the dropdown menu

### Blank Counter
- Real-time counter displayed in the top right corner of the output area
- Shows format: "x/y blanks open" where x is the number of currently blank items and y is the total number of blanks
- Updates automatically as you click through hints and answers
- Visible even in fullscreen mode

### Fullscreen Mode
- Fullscreen button located in the footer (bottom right area)
- Click to enter fullscreen mode for distraction-free studying
- Larger text size in fullscreen for better readability
- Button text changes to "Exit Fullscreen" when active

### Reset Functionality
- Reset button located in the footer (bottom right)
- Clears all input text
- Clears all processed output
- Exits fullscreen mode if active
- Resets the blank counter

### Interactive Buttons
- Buttons are styled with blue text
- Hand cursor appears on hover
- Click counter cycles through three states: hint → answer → blank
- Visual state indicators for hint (green) and answer (blue) states

## Keyboard Shortcuts

- **Ctrl+Enter** (or **Cmd+Enter** on Mac): Process the text without clicking the button

## Future Improvements

- Support for additional bracket types
- Customizable hint/answer display styles
- Save and load review sessions
- Export review statistics
- Keyboard navigation for blanks

## License

This project is open source and available for educational purposes.
