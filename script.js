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
        
        // Tab key to paste example when input is blank
        if (e.key === 'Tab' && !e.shiftKey && !e.ctrlKey && !e.metaKey && !e.altKey) {
            const currentText = textInput.textContent || textInput.innerText || '';
            if (!currentText.trim()) {
                e.preventDefault();
                const exampleText = 'The capital of France is (Paris)';
                textInput.textContent = exampleText;
                // Move cursor to end
                const range = document.createRange();
                const selection = window.getSelection();
                range.selectNodeContents(textInput);
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
            }
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
        
        // Select All button
        const selectAllBtn = document.getElementById('selectAllBtn');
        if (selectAllBtn) {
            selectAllBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                bracketCheckboxes.forEach(checkbox => {
                    checkbox.checked = true;
                });
                updateDropdownText();
            });
        }
        
        // Select None button
        const selectNoneBtn = document.getElementById('selectNoneBtn');
        if (selectNoneBtn) {
            selectNoneBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                bracketCheckboxes.forEach(checkbox => {
                    checkbox.checked = false;
                });
                updateDropdownText();
            });
        }
        
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
        const italicSelected = document.getElementById('italicText').checked;
        const boldSelected = document.getElementById('boldText').checked;
        const highlightedSelected = document.getElementById('highlightedText').checked;
        const underlinedSelected = document.getElementById('underlinedText').checked;
        
        // Build pattern based on selected bracket types
        const patternParts = [];
        if (chineseSelected) patternParts.push('（([^）]*)）');
        if (englishSelected) patternParts.push('\\(([^\\)]*)\\)');
        if (curlySelected) patternParts.push('\\{([^\\}]*)\\}');
        if (squareSelected) patternParts.push('\\[([^\\]]*)\\]');
        
        // Pattern for fully capitalized words (all letters are uppercase, at least 2 letters)
        const capitalizedWordPattern = /\b[A-Z]{2,}\b/g;
        
        // Find all matches in the plain text first
        const allMatches = [];
        
        // Process bracket patterns
        if (patternParts.length > 0) {
            const bracketPattern = new RegExp(patternParts.join('|'), 'g');
            let bracketMatch;
            while ((bracketMatch = bracketPattern.exec(text)) !== null) {
                let content, leftBracket, rightBracket;
                let groupIndex = 1;
                
                if (chineseSelected && bracketMatch[groupIndex] !== undefined) {
                    content = bracketMatch[groupIndex].trim();
                    leftBracket = '（';
                    rightBracket = '）';
                } else {
                    if (chineseSelected) groupIndex++;
                    if (englishSelected && bracketMatch[groupIndex] !== undefined) {
                        content = bracketMatch[groupIndex].trim();
                        leftBracket = '(';
                        rightBracket = ')';
                    } else {
                        if (englishSelected) groupIndex++;
                        if (curlySelected && bracketMatch[groupIndex] !== undefined) {
                            content = bracketMatch[groupIndex].trim();
                            leftBracket = '{';
                            rightBracket = '}';
                        } else {
                            if (curlySelected) groupIndex++;
                            if (squareSelected && bracketMatch[groupIndex] !== undefined) {
                                content = bracketMatch[groupIndex].trim();
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
                        start: bracketMatch.index,
                        end: bracketPattern.lastIndex,
                        content: content,
                        leftBracket: leftBracket,
                        rightBracket: rightBracket
                    });
                }
            }
        }
        
        // Process fully capitalized words (only if selected)
        if (capitalizedSelected) {
            let capitalizedMatch;
            while ((capitalizedMatch = capitalizedWordPattern.exec(text)) !== null) {
                const word = capitalizedMatch[0];
                const start = capitalizedMatch.index;
                const end = capitalizedWordPattern.lastIndex;
                
                // Check if this word overlaps with any bracket match
                let overlaps = false;
                for (const bracketMatch of allMatches) {
                    if (start >= bracketMatch.start && end <= bracketMatch.end) {
                        overlaps = true;
                        break;
                    }
                }
                
                if (!overlaps) {
                    allMatches.push({
                        type: 'capitalized',
                        start: start,
                        end: end,
                        content: word
                    });
                }
            }
        }
        
        // Sort matches by position
        allMatches.sort((a, b) => a.start - b.start);
        
        // Create a temporary container to hold the HTML
        const tempContainer = document.createElement('div');
        tempContainer.innerHTML = htmlContent || text;
        
        // Process the HTML structure with matches
        const blankButtons = [];
        processHTMLWithMatches(tempContainer, output, allMatches, blankButtons, {
            italicSelected, boldSelected, highlightedSelected, underlinedSelected
        });
        
        // Update blank counter
        updateBlankCounter(blankButtons, blankButtons.length);
    }
    
    function processHTMLWithMatches(sourceNode, targetParent, matches, blankButtons, formatOptions) {
        let charOffset = 0;
        const processedMatches = new Set(); // Track which matches have been processed
        formatOptions = formatOptions || {};
        
        // Helper function to extract HTML content from source structure at a specific range
        function extractHTMLContent(start, end) {
            let currentOffset = 0;
            const container = document.createElement('div');
            
            function extractFromNode(node, targetParent) {
                if (node.nodeType === Node.TEXT_NODE) {
                    const text = node.textContent;
                    const nodeStart = currentOffset;
                    const nodeEnd = currentOffset + text.length;
                    
                    if (nodeStart < end && nodeEnd > start) {
                        // This text node overlaps with the range
                        const extractStart = Math.max(0, start - nodeStart);
                        const extractEnd = Math.min(text.length, end - nodeStart);
                        if (extractEnd > extractStart) {
                            targetParent.appendChild(document.createTextNode(text.substring(extractStart, extractEnd)));
                        }
                    }
                    currentOffset = nodeEnd;
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    const clonedElement = node.cloneNode(false);
                    targetParent.appendChild(clonedElement);
                    
                    for (let child = node.firstChild; child; child = child.nextSibling) {
                        extractFromNode(child, clonedElement);
                        if (currentOffset >= end) break;
                    }
                }
            }
            
            for (let child = sourceNode.firstChild; child; child = child.nextSibling) {
                extractFromNode(child, container);
                if (currentOffset >= end) break;
            }
            
            return container.innerHTML;
        }
        
        // Helper function to check if element is italic
        function isItalic(element) {
            if (!element.tagName) return false;
            const tagName = element.tagName.toLowerCase();
            if (tagName === 'i' || tagName === 'em') return true;
            const style = element.getAttribute('style') || '';
            return style.includes('font-style:') && (style.includes('font-style:italic') || style.includes('font-style: italic'));
        }
        
        // Helper function to check if element is bold
        function isBold(element) {
            if (!element.tagName) return false;
            const tagName = element.tagName.toLowerCase();
            if (tagName === 'b' || tagName === 'strong') return true;
            const style = element.getAttribute('style') || '';
            return style.includes('font-weight:') && (style.includes('font-weight:bold') || style.includes('font-weight: bold') || 
                   style.match(/font-weight:\s*(700|800|900)/));
        }
        
        // Helper function to check if element is highlighted
        function isHighlighted(element) {
            if (!element.tagName) return false;
            const tagName = element.tagName.toLowerCase();
            // Primary check: <mark> tag is the semantic HTML element for highlighting
            if (tagName === 'mark') return true;
            
            // Secondary check: inline style with background color (but exclude white/transparent/default)
            const style = element.getAttribute('style') || '';
            if (!style) return false;
            
            // Check for background-color with a visible highlight color
            if (style.includes('background-color:')) {
                const bgColorMatch = style.match(/background-color:\s*([^;]+)/i);
                if (bgColorMatch) {
                    const bgColor = bgColorMatch[1].trim().toLowerCase();
                    // Exclude transparent, white, and default backgrounds
                    const excludeColors = ['transparent', 'white', '#fff', '#ffffff', 
                                          'rgb(255, 255, 255)', 'rgba(255, 255, 255', 
                                          'inherit', 'initial', 'unset'];
                    if (excludeColors.includes(bgColor)) {
                        return false;
                    }
                    // Only return true if it's clearly a highlight color (has actual color value)
                    if (bgColor && bgColor !== 'none') {
                        return true;
                    }
                }
            }
            
            // Check for background shorthand that includes a color
            if (style.includes('background:')) {
                const bgMatch = style.match(/background:\s*([^;]+)/i);
                if (bgMatch) {
                    const bgValue = bgMatch[1].trim().toLowerCase();
                    // Exclude transparent, white, and default backgrounds
                    const excludeValues = ['transparent', 'white', '#fff', '#ffffff', 
                                          'rgb(255, 255, 255)', 'rgba(255, 255, 255', 
                                          'inherit', 'initial', 'unset', 'none'];
                    if (excludeValues.some(val => bgValue === val || bgValue.startsWith(val + ' '))) {
                        return false;
                    }
                    // If it contains a color value (hex, rgb, rgba, color name), consider it highlighted
                    if (/#[0-9a-f]{3,6}|rgb\(|rgba\(|hsl\(|hsla\(/.test(bgValue)) {
                        // Additional check: make sure it's not white
                        if (!bgValue.includes('255, 255, 255') && !bgValue.includes('#fff')) {
                            return true;
                        }
                    }
                }
            }
            return false;
        }
        
        // Helper function to check if element is underlined
        function isUnderlined(element) {
            if (!element.tagName) return false;
            const tagName = element.tagName.toLowerCase();
            if (tagName === 'u') return true;
            const style = element.getAttribute('style') || '';
            return style.includes('text-decoration') && (style.includes('underline') || style.match(/text-decoration[:\s]*underline/));
        }
        
        function walkNode(node, parent) {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent;
                if (text) {
                    const nodeStart = charOffset;
                    const nodeEnd = charOffset + text.length;
                    
                    // Find all matches (processed or not) that overlap with this text node
                    const allOverlappingMatches = matches.filter(m => m.start < nodeEnd && m.end > nodeStart);
                    
                    if (allOverlappingMatches.length === 0) {
                        // No matches, just add the text
                        parent.appendChild(document.createTextNode(text));
                    } else {
                        // Find unprocessed matches for this text node
                        const nodeMatches = allOverlappingMatches
                            .filter(m => !processedMatches.has(m))
                            .sort((a, b) => a.start - b.start);
                        
                        // Build a list of ranges to skip (from processed matches)
                        const skipRanges = allOverlappingMatches
                            .filter(m => processedMatches.has(m))
                            .map(m => ({
                                start: Math.max(0, m.start - nodeStart),
                                end: Math.min(text.length, m.end - nodeStart)
                            }))
                            .sort((a, b) => a.start - b.start);
                        
                        // Combine unprocessed matches with skip ranges
                        const allRanges = [];
                        for (const match of nodeMatches) {
                            allRanges.push({
                                start: Math.max(0, match.start - nodeStart),
                                end: Math.min(text.length, match.end - nodeStart),
                                match: match,
                                isSkip: false
                            });
                        }
                        for (const skip of skipRanges) {
                            allRanges.push({
                                start: skip.start,
                                end: skip.end,
                                isSkip: true
                            });
                        }
                        allRanges.sort((a, b) => a.start - b.start);
                        
                        // Process ranges
                        let lastIndex = 0;
                        for (const range of allRanges) {
                            // Add text before this range
                            if (range.start > lastIndex) {
                                parent.appendChild(document.createTextNode(text.substring(lastIndex, range.start)));
                            }
                            
                            if (!range.isSkip && range.match && !processedMatches.has(range.match)) {
                                // Process the match
                                if (range.match.type === 'bracket') {
                                    // Add left bracket
                                    parent.appendChild(document.createTextNode(range.match.leftBracket));
                                    // Extract HTML content from source structure for the bracket content
                                    const htmlContent = extractHTMLContent(range.match.start + range.match.leftBracket.length, range.match.end - range.match.rightBracket.length);
                                    // Create button with HTML content
                                    const button = createClickableButton(range.match.content, blankButtons.length, htmlContent);
                                    blankButtons.push(button);
                                    parent.appendChild(button);
                                    // Add right bracket
                                    parent.appendChild(document.createTextNode(range.match.rightBracket));
                                } else if (range.match.type === 'capitalized' || 
                                          range.match.type === 'italic' ||
                                          range.match.type === 'bold' ||
                                          range.match.type === 'highlighted') {
                                    // Extract HTML content from source structure
                                    const htmlContent = extractHTMLContent(range.match.start, range.match.end);
                                    // Create button with HTML content
                                    const button = createClickableButton(range.match.content, blankButtons.length, htmlContent);
                                    blankButtons.push(button);
                                    parent.appendChild(button);
                                }
                                
                                // Mark match as processed
                                processedMatches.add(range.match);
                            }
                            // If it's a skip range, we don't add anything (the text is skipped)
                            
                            lastIndex = range.end;
                        }
                        
                        // Add remaining text after all ranges
                        if (lastIndex < text.length) {
                            parent.appendChild(document.createTextNode(text.substring(lastIndex)));
                        }
                    }
                    charOffset += text.length;
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // Check if element should be converted to button
                const elementText = node.textContent || '';
                let shouldConvert = false;
                let formatType = null;
                
                if (formatOptions.italicSelected && isItalic(node)) {
                    shouldConvert = true;
                    formatType = 'italic';
                } else if (formatOptions.boldSelected && isBold(node)) {
                    shouldConvert = true;
                    formatType = 'bold';
                } else if (formatOptions.highlightedSelected && isHighlighted(node)) {
                    shouldConvert = true;
                    formatType = 'highlighted';
                } else if (formatOptions.underlinedSelected && isUnderlined(node)) {
                    shouldConvert = true;
                    formatType = 'underlined';
                }
                
                if (shouldConvert && elementText.trim()) {
                    // Calculate the element's text position by recursively walking its children
                    // to find the start position, then use textContent length for end
                    let elementStartOffset = charOffset;
                    let elementCharCount = 0;
                    function countChars(node) {
                        if (node.nodeType === Node.TEXT_NODE) {
                            elementCharCount += (node.textContent || '').length;
                        } else if (node.nodeType === Node.ELEMENT_NODE) {
                            for (let child = node.firstChild; child; child = child.nextSibling) {
                                countChars(child);
                            }
                        }
                    }
                    countChars(node);
                    const elementEndOffset = elementStartOffset + elementCharCount;
                    
                    // Mark any capitalized matches that overlap with this element as processed
                    for (const match of matches) {
                        if (match.type === 'capitalized' && 
                            match.start < elementEndOffset && 
                            match.end > elementStartOffset) {
                            processedMatches.add(match);
                        }
                    }
                    
                    // Convert formatted element to button
                    // Preserve the formatting by storing the element's HTML structure
                    let elementHtml = elementText.trim();
                    const tagName = node.tagName.toLowerCase();
                    
                    // Wrap content with appropriate formatting tags
                    if (tagName === 'i' || tagName === 'em') {
                        elementHtml = `<i>${elementHtml}</i>`;
                    } else if (tagName === 'b' || tagName === 'strong') {
                        elementHtml = `<b>${elementHtml}</b>`;
                    } else if (tagName === 'mark') {
                        elementHtml = `<mark>${elementHtml}</mark>`;
                    } else if (tagName === 'u') {
                        elementHtml = `<u>${elementHtml}</u>`;
                    } else {
                        // For elements with inline styles, preserve the style attribute
                        const style = node.getAttribute('style') || '';
                        if (style) {
                            elementHtml = `<span style="${style}">${elementHtml}</span>`;
                        }
                    }
                    
                    const button = createClickableButton(elementText.trim(), blankButtons.length, elementHtml);
                    blankButtons.push(button);
                    parent.appendChild(button);
                    
                    // Update charOffset to skip over this element's text content
                    charOffset = elementEndOffset;
                } else {
                    // Clone element and its attributes to preserve formatting
                    const clonedElement = node.cloneNode(false);
                    parent.appendChild(clonedElement);
                    
                    // Recursively process child nodes
                    for (let child = node.firstChild; child; child = child.nextSibling) {
                        walkNode(child, clonedElement);
                    }
                }
            }
        }
        
        // Start walking from sourceNode's children
        for (let child = sourceNode.firstChild; child; child = child.nextSibling) {
            walkNode(child, targetParent);
        }
    }
    
    // Helper function to extract first character from HTML while preserving formatting
    function getFirstCharacterHTML(htmlContent, plainContent) {
        if (!htmlContent || htmlContent === plainContent) {
            return plainContent ? plainContent.substring(0, 1) : '';
        }
        
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        
        // Find the first text node with content
        function findFirstTextNode(node) {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0) {
                return node;
            }
            for (let child = node.firstChild; child; child = child.nextSibling) {
                const textNode = findFirstTextNode(child);
                if (textNode) return textNode;
            }
            return null;
        }
        
        const firstTextNode = findFirstTextNode(tempDiv);
        if (!firstTextNode) {
            return plainContent ? plainContent.substring(0, 1) : '';
        }
        
        const text = firstTextNode.textContent;
        const trimmedText = text.trim();
        if (!trimmedText) {
            return plainContent ? plainContent.substring(0, 1) : '';
        }
        
        // Find the position of the first non-whitespace character
        const firstCharIndex = text.indexOf(trimmedText[0]);
        const firstChar = text[firstCharIndex];
        
        // Clone the entire structure and modify only the first text node
        const cloneDiv = tempDiv.cloneNode(true);
        const cloneFirstTextNode = findFirstTextNode(cloneDiv);
        if (cloneFirstTextNode) {
            // Replace the text node's content with just the first character
            cloneFirstTextNode.textContent = firstChar;
            
            // Remove all siblings after the first text node in its parent
            let current = cloneFirstTextNode.nextSibling;
            while (current) {
                const next = current.nextSibling;
                current.remove();
                current = next;
            }
            
            // Walk up the parent chain and remove all siblings
            let parent = cloneFirstTextNode.parentNode;
            while (parent && parent !== cloneDiv) {
                let sibling = parent.nextSibling;
                while (sibling) {
                    const next = sibling.nextSibling;
                    sibling.remove();
                    sibling = next;
                }
                parent = parent.parentNode;
            }
        }
        
        return cloneDiv.innerHTML || firstChar;
    }
    
    function createClickableButton(content, index, htmlContent) {
        // Create wrapper to hold button and feedback buttons
        const wrapper = document.createElement('span');
        wrapper.className = 'blank-button-wrapper';
        
        const button = document.createElement('span');
        button.className = 'blank-button';
        button.setAttribute('role', 'button');
        button.setAttribute('tabindex', '0');
        button.textContent = '　　'; // Full-width spaces for blank appearance
        button.setAttribute('data-content', content);
        button.setAttribute('data-html-content', htmlContent || content);
        button.setAttribute('data-state', 'blank'); // blank, hint, answer
        button.setAttribute('data-index', index);
        
        // Create feedback buttons container
        const feedbackContainer = document.createElement('span');
        feedbackContainer.className = 'feedback-buttons';
        feedbackContainer.style.display = 'none';
        
        const checkButton = document.createElement('button');
        checkButton.className = 'feedback-btn feedback-check';
        checkButton.innerHTML = '✓';
        checkButton.setAttribute('aria-label', 'Got it right');
        checkButton.addEventListener('click', function(e) {
            e.stopPropagation();
            checkButton.classList.toggle('active');
            xButton.classList.remove('active');
        });
        
        const xButton = document.createElement('button');
        xButton.className = 'feedback-btn feedback-x';
        xButton.innerHTML = '✗';
        xButton.setAttribute('aria-label', 'Got it wrong');
        xButton.addEventListener('click', function(e) {
            e.stopPropagation();
            xButton.classList.toggle('active');
            checkButton.classList.remove('active');
        });
        
        feedbackContainer.appendChild(checkButton);
        feedbackContainer.appendChild(xButton);
        
        wrapper.appendChild(button);
        wrapper.appendChild(feedbackContainer);
        
        let clickCount = 0;
        
        function handleButtonClick() {
            clickCount++;
            const state = clickCount % 3;
            const storedHtmlContent = button.getAttribute('data-html-content') || content;
            
            if (state === 1) {
                // Show first character as hint with formatting preserved
                let firstCharHtml = getFirstCharacterHTML(storedHtmlContent, content);
                
                // Ensure all block elements are converted to inline to prevent line breaks
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = firstCharHtml;
                
                // Replace <br> tags with spaces first
                tempDiv.querySelectorAll('br').forEach(br => {
                    br.replaceWith(document.createTextNode(' '));
                });
                
                // Convert block elements to inline spans
                const blockElements = tempDiv.querySelectorAll('div, p, h1, h2, h3, h4, h5, h6, section, article, header, footer, nav, aside');
                blockElements.forEach(el => {
                    const span = document.createElement('span');
                    span.style.display = 'inline';
                    while (el.firstChild) {
                        span.appendChild(el.firstChild);
                    }
                    if (el.parentNode) {
                        el.parentNode.replaceChild(span, el);
                    }
                });
                
                button.innerHTML = tempDiv.innerHTML;
                button.setAttribute('data-state', 'hint');
                button.classList.add('hint-state');
                feedbackContainer.style.display = 'none';
            } else if (state === 2) {
                // Show full answer with formatting preserved
                // Ensure all block elements are converted to inline to prevent line breaks
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = storedHtmlContent;
                
                // Replace <br> tags with spaces first
                tempDiv.querySelectorAll('br').forEach(br => {
                    br.replaceWith(document.createTextNode(' '));
                });
                
                // Convert block elements to inline spans
                const blockElements = tempDiv.querySelectorAll('div, p, h1, h2, h3, h4, h5, h6, section, article, header, footer, nav, aside');
                blockElements.forEach(el => {
                    const span = document.createElement('span');
                    span.style.display = 'inline';
                    while (el.firstChild) {
                        span.appendChild(el.firstChild);
                    }
                    if (el.parentNode) {
                        el.parentNode.replaceChild(span, el);
                    }
                });
                
                button.innerHTML = tempDiv.innerHTML;
                button.setAttribute('data-state', 'answer');
                button.classList.remove('hint-state');
                button.classList.add('answer-state');
                feedbackContainer.style.display = 'inline-flex';
            } else {
                // Reset to blank
                button.textContent = '　　';
                button.setAttribute('data-state', 'blank');
                button.classList.remove('hint-state', 'answer-state');
                feedbackContainer.style.display = 'none';
                checkButton.classList.remove('active');
                xButton.classList.remove('active');
            }
            
            // Update blank counter
            updateBlankCounterFromOutput();
        }
        
        button.addEventListener('click', handleButtonClick);
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleButtonClick();
            }
        });
        
        return wrapper;
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
