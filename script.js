// Fill in the Blank Review Helper - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('textInput');
    const processBtn = document.getElementById('processBtn');
    const output = document.getElementById('output');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    
    // Process button click handler
    processBtn.addEventListener('click', function() {
        const text = textInput.value.trim();
        if (text) {
            processText(text);
        } else {
            alert('Please paste some text first!');
        }
    });
    
    // Fullscreen button click handler
    if (fullscreenBtn) {
        fullscreenBtn.addEventListener('click', toggleFullscreen);
    }
    
    // Also allow Enter key to process (Ctrl+Enter or Cmd+Enter)
    textInput.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            processBtn.click();
        }
    });
    
    function processText(text) {
        output.innerHTML = '';
        
        // Pattern to match Chinese （）, English (), and curly brackets {}
        const pattern = /（([^）]*)）|\(([^\)]*)\)|\{([^\}]*)\}/g;
        let lastIndex = 0;
        let match;
        let totalBlanks = 0;
        const blankButtons = [];
        
        while ((match = pattern.exec(text)) !== null) {
            // Add text before the match
            if (match.index > lastIndex) {
                const textBefore = document.createTextNode(text.substring(lastIndex, match.index));
                output.appendChild(textBefore);
            }
            
            // Determine which type of brackets was matched
            let content, leftBracket, rightBracket;
            if (match[1] !== undefined) {
                // Chinese parentheses （）
                content = match[1].trim();
                leftBracket = '（';
                rightBracket = '）';
            } else if (match[2] !== undefined) {
                // English parentheses ()
                content = match[2].trim();
                leftBracket = '(';
                rightBracket = ')';
            } else {
                // Curly brackets {}
                content = match[3].trim();
                leftBracket = '{';
                rightBracket = '}';
            }
            
            // Add left bracket
            output.appendChild(document.createTextNode(leftBracket));
            
            if (content) {
                // Create clickable button
                const button = createClickableButton(content, blankButtons.length);
                blankButtons.push(button);
                output.appendChild(button);
                totalBlanks++;
            }
            
            // Add right bracket
            output.appendChild(document.createTextNode(rightBracket));
            
            lastIndex = pattern.lastIndex;
        }
        
        // Add remaining text after last match
        if (lastIndex < text.length) {
            const textAfter = document.createTextNode(text.substring(lastIndex));
            output.appendChild(textAfter);
        }
        
        // Update blank counter
        updateBlankCounter(blankButtons, totalBlanks);
        
        // Show fullscreen button if there's output
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        if (fullscreenBtn && totalBlanks > 0) {
            fullscreenBtn.style.display = 'block';
        }
        
        // Store blank buttons for counter updates
        output.setAttribute('data-blank-buttons', JSON.stringify(blankButtons.map((_, i) => i)));
    }
    
    function createClickableButton(content, index) {
        const button = document.createElement('button');
        button.className = 'blank-button';
        button.textContent = '　　'; // Full-width spaces for blank appearance
        button.setAttribute('data-content', content);
        button.setAttribute('data-state', 'blank'); // blank, hint, answer
        button.setAttribute('data-index', index);
        
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
            
            // Update blank counter
            updateBlankCounterFromOutput();
        });
        
        return button;
    }
    
    function updateBlankCounter(blankButtons, totalBlanks) {
        let openBlanks = 0;
        blankButtons.forEach(button => {
            const state = button.getAttribute('data-state');
            if (state === 'blank') {
                openBlanks++;
            }
        });
        
        const counterElement = document.getElementById('blankCounter');
        if (counterElement) {
            counterElement.textContent = `${openBlanks}/${totalBlanks} blanks open`;
        }
    }
    
    function updateBlankCounterFromOutput() {
        const buttons = output.querySelectorAll('.blank-button');
        let openBlanks = 0;
        const totalBlanks = buttons.length;
        
        buttons.forEach(button => {
            const state = button.getAttribute('data-state');
            if (state === 'blank') {
                openBlanks++;
            }
        });
        
        const counterElement = document.getElementById('blankCounter');
        if (counterElement) {
            counterElement.textContent = `${openBlanks}/${totalBlanks} blanks open`;
        }
    }
    
    // Fullscreen functionality
    function toggleFullscreen() {
        const outputSection = document.querySelector('.output-section');
        if (!document.fullscreenElement) {
            outputSection.requestFullscreen().catch(err => {
                alert('Error attempting to enable fullscreen: ' + err.message);
            });
        } else {
            document.exitFullscreen();
        }
    }
    
    // Listen for fullscreen changes to update button text
    document.addEventListener('fullscreenchange', function() {
        const fullscreenBtn = document.getElementById('fullscreenBtn');
        if (fullscreenBtn) {
            if (document.fullscreenElement) {
                fullscreenBtn.textContent = 'Exit Fullscreen';
            } else {
                fullscreenBtn.textContent = 'Fullscreen';
            }
        }
    });
});
