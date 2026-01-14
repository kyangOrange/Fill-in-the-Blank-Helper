// Fill in the Blank Review Helper - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('textInput');
    const processBtn = document.getElementById('processBtn');
    const output = document.getElementById('output');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const resetBtn = document.getElementById('resetBtn');
    
    // Process button click handler
    processBtn.addEventListener('click', function() {
        // Get HTML content from contenteditable div
        const htmlContent = textInput.innerHTML;
        // Extract plain text for processing (strip HTML tags)
        const text = textInput.textContent || textInput.innerText || '';
        if (text.trim()) {
            processText(text, htmlContent);
        } else {
            alert('Please paste some text first!');
        }
    });
    
    // Reset button click handler
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            textInput.innerHTML = '';
            output.innerHTML = '<div id="blankCounter" class="blank-counter">0/0 blanks open</div>';
            // Exit fullscreen if active
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
        });
    }
    
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
    
    // Custom dropdown functionality
    const dropdownToggle = document.getElementById('dropdownToggle');
    const dropdownMenu = document.getElementById('dropdownMenu');
    const dropdownText = document.getElementById('dropdownText');
    const bracketCheckboxes = document.querySelectorAll('.dropdown-option input[type="checkbox"]');
    
    // Toggle dropdown
    if (dropdownToggle && dropdownMenu) {
        dropdownToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            dropdownMenu.classList.toggle('show');
            const arrow = dropdownToggle.querySelector('.dropdown-arrow');
            arrow.textContent = dropdownMenu.classList.contains('show') ? '▲' : '▼';
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!dropdownToggle.contains(e.target) && !dropdownMenu.contains(e.target)) {
                dropdownMenu.classList.remove('show');
                const arrow = dropdownToggle.querySelector('.dropdown-arrow');
                arrow.textContent = '▼';
            }
        });
        
        // Update dropdown text when checkboxes change
        bracketCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', updateDropdownText);
        });
        
        // Initialize dropdown text
        updateDropdownText();
    }
    
    function updateDropdownText() {
        const selected = Array.from(bracketCheckboxes).filter(cb => cb.checked);
        const total = bracketCheckboxes.length;
        
        if (selected.length === 0) {
            dropdownText.textContent = 'None selected';
        } else if (selected.length === total) {
            dropdownText.textContent = `All selected (${total})`;
        } else {
            dropdownText.textContent = `${selected.length} selected`;
        }
    }
    
    function processText(text, htmlContent) {
        output.innerHTML = '';
        
        // Add blank counter to output area
        const counterElement = document.createElement('div');
        counterElement.id = 'blankCounter';
        counterElement.className = 'blank-counter';
        counterElement.textContent = '0/0 blanks open';
        output.appendChild(counterElement);
        
        // Get selected bracket types from checkboxes
        const chineseSelected = document.getElementById('chineseBrackets').checked;
        const englishSelected = document.getElementById('englishBrackets').checked;
        const curlySelected = document.getElementById('curlyBrackets').checked;
        const squareSelected = document.getElementById('squareBrackets').checked;
        const capitalizedSelected = document.getElementById('capitalizedWords').checked;
        
        // Build pattern based on selected bracket types
        const patternParts = [];
        if (chineseSelected) patternParts.push('（([^）]*)）');
        if (englishSelected) patternParts.push('\\(([^\\)]*)\\)');
        if (curlySelected) patternParts.push('\\{([^\\}]*)\\}');
        if (squareSelected) patternParts.push('\\[([^\\]]*)\\]');
        
        // Pattern for fully capitalized words (all letters are uppercase, at least 2 letters)
        const capitalizedWordPattern = /\b[A-Z]{2,}\b/g;
        
        // Create a temporary container to hold the HTML
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = htmlContent || text;
        
        // Process the HTML structure to preserve formatting
        processHTMLNode(tempContainer, output, patternParts, capitalizedWordPattern, {
            chineseSelected, englishSelected, curlySelected, squareSelected, capitalizedSelected
        });
        
        // Update blank counter
        const blankButtons = output.querySelectorAll('.blank-button');
        updateBlankCounter(Array.from(blankButtons), blankButtons.length);
    }
    
    function processHTMLNode(sourceNode, targetParent, patternParts, capitalizedWordPattern, options) {
        const blankButtons = targetParent.parentElement ? 
            Array.from(targetParent.parentElement.querySelectorAll('.blank-button')) : [];
        
        for (let child = sourceNode.firstChild; child; child = child.nextSibling) {
            if (child.nodeType === Node.TEXT_NODE) {
                // Process text nodes
                processTextNode(child, targetParent, patternParts, capitalizedWordPattern, options, blankButtons);
            } else if (child.nodeType === Node.ELEMENT_NODE) {
                // Clone element and its attributes to preserve formatting
                const clonedElement = child.cloneNode(false);
                targetParent.appendChild(clonedElement);
                // Recursively process child nodes
                processHTMLNode(child, clonedElement, patternParts, capitalizedWordPattern, options);
            }
        }
    }
    
    function processTextNode(textNode, targetParent, patternParts, capitalizedWordPattern, options, blankButtons) {
        const text = textNode.textContent;
        if (!text) return;
        
        // Collect all matches
        const allMatches = [];
        let textIndex = 0;
        
        // Process bracket patterns
        if (patternParts.length > 0) {
            const bracketPattern = new RegExp(patternParts.join('|'), 'g');
            let match;
            while ((match = bracketPattern.exec(text)) !== null) {
                let content, leftBracket, rightBracket;
                let groupIndex = 1;
                
                if (options.chineseSelected && match[groupIndex] !== undefined) {
                    content = match[groupIndex].trim();
                    leftBracket = '（';
                    rightBracket = '）';
                } else {
                    if (options.chineseSelected) groupIndex++;
                    if (options.englishSelected && match[groupIndex] !== undefined) {
                        content = match[groupIndex].trim();
                        leftBracket = '(';
                        rightBracket = ')';
                    } else {
                        if (options.englishSelected) groupIndex++;
                        if (options.curlySelected && match[groupIndex] !== undefined) {
                            content = match[groupIndex].trim();
                            leftBracket = '{';
                            rightBracket = '}';
                        } else {
                            if (options.curlySelected) groupIndex++;
                            if (options.squareSelected && match[groupIndex] !== undefined) {
                                content = match[groupIndex].trim();
                                leftBracket = '[';
                                rightBracket = ']';
                            } else {
                                continue;
                            }
                        }
                    }
                }
                
                if (content) {
                    allMatches.push({
                        type: 'bracket',
                        start: match.index,
                        end: bracketPattern.lastIndex,
                        content: content,
                        leftBracket: leftBracket,
                        rightBracket: rightBracket
                    });
                }
            }
        }
        
        // Process capitalized words
        if (options.capitalizedSelected) {
            let match;
            while ((match = capitalizedWordPattern.exec(text)) !== null) {
                let overlaps = false;
                for (const bracketMatch of allMatches) {
                    if (match.index >= bracketMatch.start && capitalizedWordPattern.lastIndex <= bracketMatch.end) {
                        overlaps = true;
                        break;
                    }
                }
                if (!overlaps) {
                    allMatches.push({
                        type: 'capitalized',
                        start: match.index,
                        end: capitalizedWordPattern.lastIndex,
                        content: match[0]
                    });
                }
            }
        }
        
        // Sort matches by position
        allMatches.sort((a, b) => a.start - b.start);
        
        // If no matches, just add the text node
        if (allMatches.length === 0) {
            targetParent.appendChild(document.createTextNode(text));
            return;
        }
        
        // Process matches
        let lastIndex = 0;
        for (const match of allMatches) {
            // Add text before match
            if (match.start > lastIndex) {
                targetParent.appendChild(document.createTextNode(text.substring(lastIndex, match.start)));
            }
            
            if (match.type === 'bracket') {
                // Add left bracket
                targetParent.appendChild(document.createTextNode(match.leftBracket));
                // Create button
                const button = createClickableButton(match.content, blankButtons.length);
                blankButtons.push(button);
                targetParent.appendChild(button);
                // Add right bracket
                targetParent.appendChild(document.createTextNode(match.rightBracket));
            } else if (match.type === 'capitalized') {
                // Create button
                const button = createClickableButton(match.content, blankButtons.length);
                blankButtons.push(button);
                targetParent.appendChild(button);
            }
            
            lastIndex = match.end;
        }
        
        // Add remaining text
        if (lastIndex < text.length) {
            targetParent.appendChild(document.createTextNode(text.substring(lastIndex)));
        }
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
