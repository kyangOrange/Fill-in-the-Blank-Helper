# Fill in the Blank Review Helper

A web application that helps students review by hiding answers in various formats. This interactive tool allows users to paste text with answers in parentheses, brackets, or formatted text (capitalized, italic, bold, highlighted, underlined) and test themselves by clicking through hints and full answers. Original text formatting is preserved throughout the process.

🌐 **Live Demo**: [https://kyangOrange.github.io/Fill-in-the-Blank-Helper/](https://kyangOrange.github.io/Fill-in-the-Blank-Helper/)

## Features

- **Interactive Review System**: Click once to see the first character as a hint, click again to see the full answer, click a third time to reset
- **Multiple Answer Format Support**: 
  - **Bracket Types**: English `()`, Chinese `（）`, curly brackets `{}`, and square brackets `[]`
  - **Text Formatting**: Capitalized words (ALL CAPS), italic text, bold text, highlighted text, and underlined text
- **Format Selector**: Custom collapsible dropdown to choose which answer formats to process as blanks
- **Rich Text Preservation**: Original font colors, sizes, styles, and formatting are preserved in both input and output
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

2. **Select answer formats** (optional):
   - Use the dropdown menu above the output area to select which answer formats should be processed as blanks
   - **Bracket options**: Chinese `（）`, English `()`, Curly `{}`, and Square `[]`
   - **Formatting options**: Capitalized Words (ALL CAPS), Italic Text, Bold Text, Highlighted Text, and Underlined Text
   - None are selected by default - select the formats you want to use
   - Only selected formats will be converted to interactive blanks

3. **Using the application**:
   - Copy text that contains answers in any supported format:
     - **Bracket types**: "The capital of France is (Paris)", "The capital of Japan is （Tokyo）", "The capital of Germany is {Berlin}", or "The capital of Spain is [Madrid]"
     - **Formatted text**: Text that is capitalized (ALL CAPS), italic, bold, highlighted, or underlined
   - Paste the text into the text area (original formatting like colors, fonts, and styles will be preserved)
   - Click the "Process Text" button
   - View the blank counter in the top right of the output area showing how many blanks are open
   - Click on the blank buttons to reveal hints and answers:
     - First click: Shows the first character of the answer (preserving original formatting)
     - Second click: Shows the full answer (preserving original formatting)
     - Third click: Clears the answer and resets
   - Use the "Fullscreen" button to view the processed text in fullscreen mode
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
- Resets the blank counter

### Interactive Buttons
- Buttons are styled with blue text and a light background for visibility
- Hand cursor appears on hover
- Click counter cycles through three states: hint → answer → blank
- Visual state indicators for hint (green) and answer (blue) states
- Original text formatting (italic, bold, colors, etc.) is preserved when showing hints and answers

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
