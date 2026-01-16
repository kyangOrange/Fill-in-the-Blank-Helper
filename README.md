# Fill in the Blank Review Helper

A web application that helps students review by hiding answers in various formats. This interactive tool allows users to paste text with answers in parentheses, brackets, or formatted text (capitalized, italic, bold, highlighted, underlined) and test themselves by clicking through hints and full answers. Original text formatting is preserved throughout the process.

🌐 **Live Demo**: [https://kyangOrange.github.io/Fill-in-the-Blank-Helper/](https://kyangOrange.github.io/Fill-in-the-Blank-Helper/)

## Features

- **Interactive Review System**: Click once to see the first character as a hint, click again to see the full answer, click a third time to reset
- **Multiple Answer Format Support**: 
  - **Bracket Types**: English `()`, Chinese `（）`, curly brackets `{}`, and square brackets `[]`
  - **Text Formatting**: Capitalized words (ALL CAPS), italic text, bold text, highlighted text, underlined text, and colored text
- **Color Detection**: Automatically detects colors in pasted text and allows selection of specific colors to process as blanks
- **Format Selector**: Custom collapsible dropdown to choose which answer formats to process as blanks
- **Rich Text Preservation**: Original font colors, sizes, styles, and formatting are preserved in both input and output
- **Blank Counter**: Real-time counter showing how many blanks are open (x/y blanks open) in the top right of the output area
- **Accuracy Tracking**: Track your performance with feedback buttons (✓ correct, ✗ incorrect) and see your accuracy percentage
- **Retest Feature**: Retest button to reset all answers and accuracy while keeping the same text for practice
- **Fullscreen Mode**: Fullscreen button to view processed text in fullscreen for better studying
- **Reset Functionality**: Reset button to clear all input and output
- **User-Friendly Interface**: Clean, modern web interface with intuitive controls
- **Visual Feedback**: Clickable buttons replace answers with visual feedback and state indicators
- **Privacy-Focused**: All processing happens in your browser; no data is uploaded or stored

## Requirements

- A modern web browser (Chrome, Firefox, Safari, Edge, etc.)
- No additional installation or dependencies needed

## How to Use

1. **Open the application**:
   - Simply open `index.html` in your web browser
   - You can double-click the file or drag it into your browser window

2. **Select answer formats** (optional):
   - Use the dropdown menu above the output area to select which answer formats should be processed as blanks
   - **Bracket options**: Chinese `（）`, English `()`, Curly `{}`, and Square `[]`
   - **Formatting options**: Capitalized Words (ALL CAPS), Italic Text, Bold Text, Highlighted Text, Underlined Text, and Color
   - **Color option**: When selected, the application automatically detects all colors present in your text
     - Detected colors appear as colored boxes below the dropdown
     - Click on a color to select/deselect it (selected colors have a purple border)
     - Only selected colors will be processed as blanks
     - Click the × button to remove a color from the list
   - Use "Select All" or "Select None" buttons for quick selection
   - None are selected by default - select the formats you want to use
   - Only selected formats will be converted to interactive blanks

3. **Using the application**:
   - Copy text that contains answers in any supported format:
     - **Bracket types**: "The capital of France is (Paris)", "The capital of Japan is （Tokyo）", "The capital of Germany is {Berlin}", or "The capital of Spain is [Madrid]"
     - **Formatted text**: Text that is capitalized (ALL CAPS), italic, bold, highlighted, underlined, or colored
   - Paste the text into the text area (original formatting like colors, fonts, and styles will be preserved)
   - **Tip**: Press the Tab key when the input box is empty to paste an example text
   - Click the "Process Text" button (or press Ctrl+Enter / Cmd+Enter)
   - View the blank counter in the top right of the output area showing how many blanks are open
   - View the accuracy counter below the blank counter (shows your accuracy percentage once you start answering)
   - Click on the blank buttons to reveal hints and answers:
     - First click: Shows the first character of the answer (preserving original formatting)
     - Second click: Shows the full answer (preserving original formatting)
     - When the full answer is shown, feedback buttons (✓ and ✗) appear to mark if you got it correct or not
     - Third click: Clears the answer and hides the feedback buttons (feedback colors persist)
   - Use the "Fullscreen" button to view the processed text in fullscreen mode
   - Use the "Retest" button to reset all answers and accuracy while keeping the same text (useful for practicing again)
   - Use the "Reset" button to clear all input and output

## Example Usage

**Input text with brackets:**
```
The capital of France is (Paris).
The capital of Japan is （Tokyo）.
The capital of Germany is {Berlin}.
The capital of Spain is [Madrid].
Water is made of (hydrogen) and (oxygen).
```

**Input text with formatting:**
```
The capital of France is PARIS (capitalized word).
The capital of Italy is Rome (in italic).
The capital of Spain is Madrid (in bold).
The capital of Germany is Berlin (highlighted).
The capital of Japan is Tokyo (underlined).
```

After pasting and processing, the answers in the selected formats will become clickable buttons that you can interact with to test your knowledge. Original formatting (colors, fonts, styles) is preserved. The blank counter will show how many blanks are currently open.

## Technologies Used

- HTML5 (structure and markup)
- CSS3 (styling and layout)
- JavaScript (interactivity and logic)
- Regular Expressions (for pattern matching)

## Features in Detail

### Answer Format Detection

#### Bracket Types
- Automatically detects English `()`, Chinese `（）`, curly brackets `{}`, and square brackets `[]`
- Preserves the original bracket style in the output
- Handles empty brackets gracefully

#### Text Formatting
- **Capitalized Words**: Detects words where ALL letters are uppercase (minimum 2 letters)
- **Italic Text**: Detects text formatted with `<i>`, `<em>`, or `font-style: italic`
- **Bold Text**: Detects text formatted with `<b>`, `<strong>`, or `font-weight: bold/700+`
- **Highlighted Text**: Detects text formatted with `<mark>` or background-color styling
- **Underlined Text**: Detects text formatted with `<u>` or `text-decoration: underline`

### Format Selector
- Collapsible dropdown menu located above the output area
- Select multiple answer formats to process (brackets and/or text formatting)
- Shows count of selected types (e.g., "5 selected" or "None selected")
- Click to expand/collapse the dropdown menu
- None are selected by default - choose the formats you want to use

### Rich Text Preservation
- **Input**: Supports pasting rich text with colors, fonts, sizes, and styles
- **Output**: Preserves all original formatting when displaying hints and answers
- Uses contenteditable div to maintain formatting throughout the process
- Formatting tags and inline styles are preserved when converting to blanks

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
- Resets the blank counter and accuracy

### Retest Functionality
- Retest button located in the footer (between Fullscreen and Reset buttons)
- Resets all answers to blank state
- Clears accuracy tracking
- Removes all feedback (correct/wrong) markings
- Keeps the same input and output text for repeated practice

### Feedback and Accuracy
- When you reveal the full answer, two feedback buttons appear (✓ green checkmark and ✗ red x-mark)
- Click ✓ if you got the answer correct
- Click ✗ if you got the answer wrong
- Feedback colors persist even when the answer is hidden (light green for correct, light red for wrong)
- Accuracy is calculated as: (Number of correct answers) / (Total number of answered questions)
- Accuracy counter appears below the blank counter once you start answering
- Only counts questions that you've explicitly marked as correct or wrong

### Interactive Buttons
- Buttons are styled with blue text and a light background for visibility
- Hand cursor appears on hover
- Click counter cycles through three states: hint → answer → blank
- Visual state indicators for hint (green) and answer (blue) states
- Original text formatting (italic, bold, colors, superscripts, etc.) is preserved when showing hints and answers
- Button size adjusts to match the length of the answer text
- Buttons wrap properly when text is long

## Keyboard Shortcuts

- **Ctrl+Enter** (or **Cmd+Enter** on Mac): Process the text without clicking the button
- **Tab**: When the input box is empty, paste an example text ("The capital of France is (Paris)")

## Privacy

- All processing happens entirely in your browser
- No information is uploaded to any server
- No data is stored on your device beyond your current session
- Your privacy is fully protected

## Future Improvements

- Support for additional bracket types
- Customizable hint/answer display styles
- Save and load review sessions
- Export review statistics
- Keyboard navigation for blanks
- Support for more complex formatting (tables, lists, etc.)

## License

This project is open source and available for educational purposes.
