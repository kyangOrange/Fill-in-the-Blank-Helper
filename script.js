// Fill in the Blank Review Helper - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('textInput');
    const processBtn = document.getElementById('processBtn');
    const output = document.getElementById('output');
    
    // Process button click handler
    processBtn.addEventListener('click', function() {
        const text = textInput.value.trim();
        if (text) {
            processText(text);
        } else {
            alert('Please paste some text first!');
        }
    });
    
    // Also allow Enter key to process (Ctrl+Enter or Cmd+Enter)
    textInput.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            processBtn.click();
        }
    });
    
    function processText(text) {
        output.innerHTML = '';
        
        // Pattern to match both Chinese （） and English () parentheses
        const pattern = /（([^）]*)）|\(([^\)]*)\)/g;
        let lastIndex = 0;
        let match;
        
        while ((match = pattern.exec(text)) !== null) {
            // Add text before the match
            if (match.index > lastIndex) {
                const textBefore = document.createTextNode(text.substring(lastIndex, match.index));
                output.appendChild(textBefore);
            }
            
            // Determine which type of parentheses was matched
            let content, leftParen, rightParen;
            if (match[1] !== undefined) {
                // Chinese parentheses （）
                content = match[1].trim();
                leftParen = '（';
                rightParen = '）';
            } else {
                // English parentheses ()
                content = match[2].trim();
                leftParen = '(';
                rightParen = ')';
            }
            
            // Add left parenthesis
            output.appendChild(document.createTextNode(leftParen));
            
            if (content) {
                // Create clickable button
                const button = createClickableButton(content);
                output.appendChild(button);
            }
            
            // Add right parenthesis
            output.appendChild(document.createTextNode(rightParen));
            
            lastIndex = pattern.lastIndex;
        }
        
        // Add remaining text after last match
        if (lastIndex < text.length) {
            const textAfter = document.createTextNode(text.substring(lastIndex));
            output.appendChild(textAfter);
        }
    }
    
    function createClickableButton(content) {
        const button = document.createElement('button');
        button.className = 'blank-button';
        button.textContent = '　　'; // Full-width spaces for blank appearance
        button.setAttribute('data-content', content);
        button.setAttribute('data-state', 'blank'); // blank, hint, answer
        
        let clickCount = 0;
        
        button.addEventListener('click', function() {
            clickCount++;
            const state = clickCount % 3;
            
            if (state === 1) {
                // Show first character as hint
                button.textContent = content.substring(0, 1);
                button.setAttribute('data-state', 'hint');
                button.classList.add('hint-state');
            } else if (state === 2) {
                // Show full answer
                button.textContent = content;
                button.setAttribute('data-state', 'answer');
                button.classList.remove('hint-state');
                button.classList.add('answer-state');
            } else {
                // Reset to blank
                button.textContent = '　　';
                button.setAttribute('data-state', 'blank');
                button.classList.remove('hint-state', 'answer-state');
            }
        });
        
        return button;
    }
});
