// Fill in the Blank Review Helper - JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('textInput');
    const processBtn = document.getElementById('processBtn');
    const output = document.getElementById('output');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const resetBtn = document.getElementById('resetBtn');
    const retestBtn = document.getElementById('retestBtn');
    
    // Process button click handler
    if (processBtn) {
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
    }
    
    // Reset button click handler
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            textInput.innerHTML = '';
            output.innerHTML = '<div id="blankCounter" class="blank-counter">0/0 blanks open</div><div id="accuracyCounter" class="accuracy-counter"></div>';
            // Exit fullscreen if active
            if (document.fullscreenElement) {
                document.exitFullscreen();
            }
        });
    }
    
    // Retest button click handler
    if (retestBtn) {
        retestBtn.addEventListener('click', function() {
            // Reset all buttons to blank state and clear feedback
            const buttons = output.querySelectorAll('.blank-button');
            buttons.forEach(button => {
        // Reset to blank state
        const content = button.getAttribute('data-content') || '';
        button.textContent = generateBlankText(content);
        button.setAttribute('data-state', 'blank');
        button.classList.remove('hint-state', 'answer-state', 'correct-answer', 'wrong-answer');
                
                // Remove feedback attributes
                button.removeAttribute('data-answered');
                button.removeAttribute('data-correct');
                
                // Hide feedback buttons
                const wrapper = button.closest('.blank-button-wrapper');
                if (wrapper) {
                    const feedbackContainer = wrapper.querySelector('.feedback-buttons');
                    if (feedbackContainer) {
                        feedbackContainer.style.display = 'none';
                    }
                    const checkButton = wrapper.querySelector('.feedback-check');
                    const xButton = wrapper.querySelector('.feedback-x');
                    if (checkButton) checkButton.classList.remove('active');
                    if (xButton) xButton.classList.remove('active');
                }
            });
            
            // Clear accuracy counter
            const accuracyElement = document.getElementById('accuracyCounter');
            if (accuracyElement) {
                accuracyElement.textContent = '';
            }
            
            // Update blank counter
            updateBlankCounterFromOutput();
            
            // Clamp blanks to end of current line after state change
            requestAnimationFrame(clampBlanksToLineEnd);
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
            checkbox.addEventListener('change', function() {
                updateDropdownText();
                // Show/hide color picker section when color checkbox is toggled
                if (checkbox.id === 'colorText') {
                    const colorSection = document.getElementById('colorPickerSection');
                    if (colorSection) {
                        colorSection.style.display = checkbox.checked ? 'block' : 'none';
                    }
                }
            });
        });
        
        // Color detection functionality
        const colorTextCheckbox = document.getElementById('colorText');
        const colorPickerSection = document.getElementById('colorPickerSection');
        const colorList = document.getElementById('colorList');
        let selectedColors = []; // Store selected colors as hex values
        
        // Function to detect all colors in HTML content
        function detectColorsInText(htmlContent) {
            const colors = new Set();
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;
            
            // Function to extract color from style attribute
            function extractColorFromStyle(style) {
                if (!style) return null;
                const colorMatch = style.match(/color:\s*([^;]+)/i);
                if (colorMatch) {
                    return colorMatch[1].trim();
                }
                return null;
            }
            
            // Function to normalize color to hex format
            function normalizeToHex(color) {
                if (!color) return null;
                color = color.trim().toLowerCase();
                
                // Already hex
                if (color.startsWith('#')) {
                    if (color.length === 4) {
                        // Convert #rgb to #rrggbb
                        return '#' + color[1] + color[1] + color[2] + color[2] + color[3] + color[3];
                    }
                    return color.length === 7 ? color : null;
                }
                
                // RGB/RGBA format
                const rgbMatch = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
                if (rgbMatch) {
                    const r = parseInt(rgbMatch[1]);
                    const g = parseInt(rgbMatch[2]);
                    const b = parseInt(rgbMatch[3]);
                    return '#' + [r, g, b].map(x => {
                        const hex = x.toString(16);
                        return hex.length === 1 ? '0' + hex : hex;
                    }).join('');
                }
                
                // Named colors (basic set)
                const namedColors = {
                    'black': '#000000', 'white': '#ffffff', 'red': '#ff0000',
                    'green': '#008000', 'blue': '#0000ff', 'yellow': '#ffff00',
                    'cyan': '#00ffff', 'magenta': '#ff00ff', 'orange': '#ffa500',
                    'purple': '#800080', 'pink': '#ffc0cb', 'brown': '#a52a2a',
                    'gray': '#808080', 'grey': '#808080'
                };
                if (namedColors[color]) {
                    return namedColors[color];
                }
                
                return null;
            }
            
            // Walk through all elements
            function walkElements(element) {
                if (!element) return;
                
                // Check style attribute
                const style = element.getAttribute('style');
                if (style) {
                    const color = extractColorFromStyle(style);
                    if (color) {
                        const hexColor = normalizeToHex(color);
                        if (hexColor) {
                            colors.add(hexColor);
                        }
                    }
                }
                
                // Check color attribute (deprecated but might be used)
                const colorAttr = element.getAttribute('color');
                if (colorAttr) {
                    const hexColor = normalizeToHex(colorAttr);
                    if (hexColor) {
                        colors.add(hexColor);
                    }
                }
                
                // Check font tag with color
                if (element.tagName && element.tagName.toLowerCase() === 'font') {
                    const fontColor = element.getAttribute('color');
                    if (fontColor) {
                        const hexColor = normalizeToHex(fontColor);
                        if (hexColor) {
                            colors.add(hexColor);
                        }
                    }
                }
                
                // Recursively check children
                for (let child of element.children) {
                    walkElements(child);
                }
            }
            
            walkElements(tempDiv);
            return Array.from(colors);
        }
        
        function addColorItem(color) {
            // Check if color already exists
            const existingColors = colorList.querySelectorAll('.color-preview');
            for (let existing of existingColors) {
                if (existing.getAttribute('data-color') === color) {
                    return; // Color already exists, don't add duplicate
                }
            }
            
            const colorItem = document.createElement('div');
            colorItem.className = 'color-item';
            
            const colorPreview = document.createElement('div');
            colorPreview.className = 'color-preview';
            colorPreview.style.backgroundColor = color;
            colorPreview.setAttribute('data-color', color);
            colorPreview.setAttribute('data-selected', 'true'); // Default to selected
            
            // Toggle selection on click
            colorPreview.addEventListener('click', function(e) {
                e.stopPropagation();
                const isSelected = colorPreview.getAttribute('data-selected') === 'true';
                colorPreview.setAttribute('data-selected', isSelected ? 'false' : 'true');
                colorPreview.classList.toggle('color-selected', !isSelected);
                updateSelectedColors();
            });
            
            // Set initial selected state
            colorPreview.classList.add('color-selected');
            
            const removeBtn = document.createElement('button');
            removeBtn.className = 'remove-color-btn';
            removeBtn.innerHTML = '×';
                        removeBtn.addEventListener('click', function(e) {
                            e.stopPropagation();
                            colorItem.remove();
                            // Update selected colors
                            const colorPreviews = document.querySelectorAll('#colorList .color-preview[data-selected="true"]');
                            selectedColors = [];
                            colorPreviews.forEach(preview => {
                                selectedColors.push(preview.getAttribute('data-color'));
                            });
                        });
            
            colorItem.appendChild(colorPreview);
            colorItem.appendChild(removeBtn);
            colorList.appendChild(colorItem);
            
            updateSelectedColors();
        }
        
        function updateSelectedColors() {
            selectedColors = [];
            const colorPreviews = colorList.querySelectorAll('.color-preview[data-selected="true"]');
            colorPreviews.forEach(preview => {
                selectedColors.push(preview.getAttribute('data-color'));
            });
        }
        
        // Show color section when checkbox is checked and automatically detect colors
        if (colorTextCheckbox) {
            colorTextCheckbox.addEventListener('change', function() {
                if (colorPickerSection) {
                    colorPickerSection.style.display = this.checked ? 'block' : 'none';
                    // If checked, automatically detect colors from current input text
                    if (this.checked && colorList) {
                        const htmlContent = textInput.innerHTML;
                        if (htmlContent) {
                            const detectedColors = detectColorsInText(htmlContent);
                            // Clear existing colors and add detected ones
                            colorList.innerHTML = '';
                            if (detectedColors && detectedColors.length > 0) {
                                detectedColors.forEach(color => {
                                    // Create color item directly
                                    const existingColors = colorList.querySelectorAll('.color-preview');
                                    let colorExists = false;
                                    for (let existing of existingColors) {
                                        if (existing.getAttribute('data-color') === color) {
                                            colorExists = true;
                                            break;
                                        }
                                    }
                                    
                                    if (!colorExists) {
                                        const colorItem = document.createElement('div');
                                        colorItem.className = 'color-item';
                                        
                                        const colorPreview = document.createElement('div');
                                        colorPreview.className = 'color-preview'; // Initially not selected
                                        colorPreview.style.backgroundColor = color;
                                        colorPreview.setAttribute('data-color', color);
                                        colorPreview.setAttribute('data-selected', 'false'); // Initially deselected
                                        
                                        colorPreview.addEventListener('click', function(e) {
                                            e.stopPropagation();
                                            const isSelected = colorPreview.getAttribute('data-selected') === 'true';
                                            colorPreview.setAttribute('data-selected', isSelected ? 'false' : 'true');
                                            // Toggle the selected class - selected means purple border
                                            if (!isSelected) {
                                                colorPreview.classList.add('color-selected');
                                            } else {
                                                colorPreview.classList.remove('color-selected');
                                            }
                                            // Update selected colors
                                            const colorPreviews = document.querySelectorAll('#colorList .color-preview[data-selected="true"]');
                                            selectedColors = [];
                                            colorPreviews.forEach(preview => {
                                                selectedColors.push(preview.getAttribute('data-color'));
                                            });
                                        });
                                        
                                        const removeBtn = document.createElement('button');
                                        removeBtn.className = 'remove-color-btn';
                                        removeBtn.innerHTML = '×';
                                        removeBtn.addEventListener('click', function(e) {
                                            e.stopPropagation();
                                            colorItem.remove();
                                            // Update selected colors
                                            const colorPreviews = document.querySelectorAll('#colorList .color-preview[data-selected="true"]');
                                            selectedColors = [];
                                            colorPreviews.forEach(preview => {
                                                selectedColors.push(preview.getAttribute('data-color'));
                                            });
                                        });
                                        
                                        colorItem.appendChild(colorPreview);
                                        colorItem.appendChild(removeBtn);
                                        colorList.appendChild(colorItem);
                                    }
                                });
                                // Update selected colors (initially empty since all are deselected)
                                selectedColors = [];
                            } else {
                                // Show message if no colors detected
                                const noColorsMsg = document.createElement('div');
                                noColorsMsg.style.padding = '0.5rem';
                                noColorsMsg.style.color = '#6b7280';
                                noColorsMsg.style.fontSize = '0.85rem';
                                noColorsMsg.textContent = 'No colors detected in text';
                                colorList.appendChild(noColorsMsg);
                            }
                        } else {
                            // Show message if no text
                            const noTextMsg = document.createElement('div');
                            noTextMsg.style.padding = '0.5rem';
                            noTextMsg.style.color = '#6b7280';
                            noTextMsg.style.fontSize = '0.85rem';
                            noTextMsg.textContent = 'Paste text first to detect colors';
                            colorList.appendChild(noTextMsg);
                        }
                    }
                }
            });
        }
        
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
        
        // Add blank counter and accuracy counter to output area
        const counterElement = document.createElement('div');
        counterElement.id = 'blankCounter';
        counterElement.className = 'blank-counter';
        counterElement.textContent = '0/0 blanks open';
        output.appendChild(counterElement);
        
        const accCounter = document.createElement('div');
        accCounter.id = 'accuracyCounter';
        accCounter.className = 'accuracy-counter';
        accCounter.textContent = '';
        output.appendChild(accCounter);
        
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
        const colorSelected = document.getElementById('colorText').checked;
        
        // Get selected colors directly from the DOM
        let selectedColorsArray = [];
        if (colorSelected) {
            const colorList = document.getElementById('colorList');
            if (colorList) {
                const colorPreviews = colorList.querySelectorAll('.color-preview[data-selected="true"]');
                colorPreviews.forEach(preview => {
                    selectedColorsArray.push(preview.getAttribute('data-color'));
                });
            }
        }
        
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
        // Group adjacent capitalized words into a single match
        if (capitalizedSelected) {
            const capitalizedMatches = [];
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
                    capitalizedMatches.push({
                        word: word,
                        start: start,
                        end: end
                    });
                }
            }
            
            // Group adjacent capitalized words
            if (capitalizedMatches.length > 0) {
                let currentGroup = [capitalizedMatches[0]];
                for (let i = 1; i < capitalizedMatches.length; i++) {
                    const prevMatch = capitalizedMatches[i - 1];
                    const currMatch = capitalizedMatches[i];
                    
                    // Check if current word is adjacent to previous (allowing for whitespace/punctuation)
                    const textBetween = text.substring(prevMatch.end, currMatch.start);
                    // If only whitespace or punctuation between, group them
                    if (/^[\s\.,;:!?\-]*$/.test(textBetween)) {
                        currentGroup.push(currMatch);
            } else {
                        // End current group and start new one
                        // Build grouped content by joining words with the actual text between them
                        let groupedContent = currentGroup[0].word;
                        for (let j = 1; j < currentGroup.length; j++) {
                            const prevEnd = currentGroup[j - 1].end;
                            const currStart = currentGroup[j].start;
                            const betweenText = text.substring(prevEnd, currStart);
                            groupedContent += betweenText + currentGroup[j].word;
                        }
                        const groupStart = currentGroup[0].start;
                        const groupEnd = currentGroup[currentGroup.length - 1].end;
                        allMatches.push({
                            type: 'capitalized',
                            start: groupStart,
                            end: groupEnd,
                            content: groupedContent
                        });
                        currentGroup = [currMatch];
                    }
                }
                // Add the last group
                if (currentGroup.length > 0) {
                    // Build grouped content by joining words with the actual text between them
                    let groupedContent = currentGroup[0].word;
                    for (let j = 1; j < currentGroup.length; j++) {
                        const prevEnd = currentGroup[j - 1].end;
                        const currStart = currentGroup[j].start;
                        const betweenText = text.substring(prevEnd, currStart);
                        groupedContent += betweenText + currentGroup[j].word;
                    }
                    const groupStart = currentGroup[0].start;
                    const groupEnd = currentGroup[currentGroup.length - 1].end;
                    allMatches.push({
                        type: 'capitalized',
                        start: groupStart,
                        end: groupEnd,
                        content: groupedContent
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
            italicSelected, boldSelected, highlightedSelected, underlinedSelected, colorSelected, selectedColors: selectedColorsArray
        });
        
        // Update blank counter
        updateBlankCounter(blankButtons, blankButtons.length);
        
        // Initialize accuracy counter if it doesn't exist
        if (!document.getElementById('accuracyCounter')) {
            const accCounter = document.createElement('div');
            accCounter.id = 'accuracyCounter';
            accCounter.className = 'accuracy-counter';
            accCounter.textContent = '';
            output.appendChild(accCounter);
        }
        updateAccuracy();
        
        // Clamp blanks to end of current line after processing (use double RAF to ensure layout is done)
        requestAnimationFrame(() => {
            requestAnimationFrame(clampBlanksToLineEnd);
        });
    }
    
    function clampBlanksToLineEnd() {
        const area = document.getElementById('output');
        if (!area) return;

        const areaRect = area.getBoundingClientRect();
        const csArea = getComputedStyle(area);
        const innerRight =
            areaRect.right
            - (parseFloat(csArea.paddingRight) || 0)
            - (parseFloat(csArea.borderRightWidth) || 0);

        const wrappers = Array.from(area.querySelectorAll('.blank-button-wrapper'));

        // PASS 1: force shrink so the wrapper is willing to sit on the current line
        const targets = [];
        for (const w of wrappers) {
            const btn = w.querySelector('.blank-button');
            if (!btn) continue;

            const state = btn.getAttribute('data-state');
            if (state === 'blank' || state === 'hint') {
                w.style.display = 'inline-block';   // defeats any CSS override
                w.style.width = '1px';              // force reflow attempt
                w.style.maxWidth = '';              // clear any previous max-width
                targets.push(w);
            } else {
                // Answer state: allow normal wrapping, remove any clamping
                w.style.width = '';
                w.style.maxWidth = '';
                w.style.display = 'inline-block';  // ensure it's still inline-block but without clamping
            }
        }

        // Force reflow
        void area.offsetHeight;

        // PASS 2: set wrapper max-width to available space, but let button size naturally
        for (const w of targets) {
            const r = w.getBoundingClientRect();
            const avail = Math.max(24, innerRight - r.left - 2);
            // Use max-width so button can be shorter than available space
            w.style.maxWidth = `${avail}px`;
            w.style.width = '';  // Let wrapper size to content (button), but clamped by max-width
        }
    }
    
    function processHTMLWithMatches(sourceNode, targetParent, matches, blankButtons, formatOptions) {
        let charOffset = 0;
        const processedMatches = new Set(); // Track which matches have been processed
        formatOptions = formatOptions || {};
        
        // Track the last color-run blank for merging consecutive segments
        // Reset at the start of each processing session
        let lastColorRun = null; 
        // { parent: Node, wrapper: HTMLElement, button: HTMLElement, css: string }
        
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
        
        // Helper function to check if element has an explicit color (any color, not just selected)
        function hasExplicitColor(el) {
            if (!el || el.nodeType !== Node.ELEMENT_NODE) return false;
            const style = el.getAttribute('style') || '';
            if (/color\s*:/i.test(style)) return true;
            if (el.getAttribute('color')) return true;
            if (el.tagName && el.tagName.toLowerCase() === 'font' && el.getAttribute('color')) return true;
            return false;
        }
        
        // Helper function to check if element has a selected color
        function hasSelectedColor(element, selectedColors) {
            if (!selectedColors || selectedColors.length === 0) return false;
            if (!element.tagName) return false;
            
            // Normalize color to compare (convert to lowercase, handle different formats)
            function normalizeColor(color) {
                if (!color) return '';
                return color.toLowerCase().trim();
            }
            
            // Get computed color from element
            function getElementColor(el) {
                const style = el.getAttribute('style') || '';
                // Check for color in style attribute
                if (style.includes('color:')) {
                    const colorMatch = style.match(/color:\s*([^;]+)/i);
                    if (colorMatch) {
                        return normalizeColor(colorMatch[1].trim());
            }
                }
                // Check for color attribute (deprecated but might be used)
                const colorAttr = el.getAttribute('color');
                if (colorAttr) {
                    return normalizeColor(colorAttr);
                }
                // Check for font tag with color
                if (el.tagName && el.tagName.toLowerCase() === 'font') {
                    const fontColor = el.getAttribute('color');
                    if (fontColor) {
                        return normalizeColor(fontColor);
                    }
                }
                return null;
            }
            
            const elementColor = getElementColor(element);
            if (!elementColor) return false;
            
            // Compare with selected colors (normalize selected colors too)
            return selectedColors.some(selectedColor => {
                const normalizedSelected = normalizeColor(selectedColor);
                // Direct match
                if (elementColor === normalizedSelected) return true;
                // Convert hex to rgb for comparison if needed
                if (normalizedSelected.startsWith('#')) {
                    const hex = normalizedSelected.replace('#', '');
                    if (hex.length === 6) {
                        const r = parseInt(hex.substr(0, 2), 16);
                        const g = parseInt(hex.substr(2, 2), 16);
                        const b = parseInt(hex.substr(4, 2), 16);
                        const rgbStr = `rgb(${r}, ${g}, ${b})`;
                        if (elementColor === rgbStr || elementColor === `rgb(${r},${g},${b})`) return true;
                    }
                }
                // Check if element color contains the hex value
                if (elementColor.includes(normalizedSelected)) return true;
                return false;
            });
        }
        
        // Helper function to check if element has any non-selected colored descendants
        // Strict check: if ANY descendant (at any depth) has a non-selected explicit color, return true
        function hasNonSelectedColoredDescendant(el, selectedColors) {
            if (!el || !selectedColors || selectedColors.length === 0) return false;
            
            // Find any descendant that explicitly sets a color that is NOT one of the selected colors
            const descendants = el.querySelectorAll('[style*="color"], font[color], [color]');
            
            for (const d of descendants) {
                if (d === el) continue; // ignore self
                if (hasExplicitColor(d) && !hasSelectedColor(d, selectedColors)) {
                    return true;
                }
            }
            return false;
        }
        
        // Helper to get explicit color CSS from an element
        function getExplicitColorCss(el) {
            if (!el || el.nodeType !== Node.ELEMENT_NODE) return null;
            
            const style = el.getAttribute('style') || '';
            const m = style.match(/color:\s*([^;]+)/i);
            if (m) return m[1].trim();
            
            const colorAttr = el.getAttribute('color');
            if (colorAttr) return colorAttr.trim();
            
            if (el.tagName && el.tagName.toLowerCase() === 'font') {
                const fc = el.getAttribute('color');
                if (fc) return fc.trim();
            }
            return null;
        }
        
        // Helper: check if an element is just a "color wrapper" (span/font with only color styling)
        function isColorOnlyWrapper(el) {
            if (!el || el.nodeType !== Node.ELEMENT_NODE) return false;

            const tag = (el.tagName || '').toLowerCase();
            if (tag !== 'span' && tag !== 'font') return false;

            // If it has a class/id or other attributes besides style/color, keep it (might matter).
            const attrs = Array.from(el.attributes).map(a => a.name.toLowerCase());
            const allowed = new Set(['style', 'color']);
            for (const a of attrs) {
                if (!allowed.has(a)) return false;
            }

            // Style must be ONLY color (no font-weight, background, underline, etc.)
            const style = (el.getAttribute('style') || '').trim().toLowerCase();
            // If no style but has color attribute, that's also a color-only wrapper
            if (!style) {
                const colorAttr = el.getAttribute('color');
                return !!colorAttr; // If it has color attribute but no style, it's still a color wrapper
            }

            // If style has properties other than color, don't skip wrapper
            const props = style.split(';').map(s => s.trim()).filter(Boolean);
            for (const p of props) {
                const normalizedProp = p.trim();
                if (!normalizedProp.startsWith('color:')) return false;
            }

            return true;
        }

        // When in selected-color context, turn text into a blank button.
        // Merges consecutive color-text segments into one blank.
        function appendTextOrColorBlank(textSeg, parent, colorCtx) {
            if (!textSeg) return;
            
            const inSelectedColor =
                !!formatOptions.colorSelected &&
                colorCtx &&
                colorCtx.state === 'selected';
            
            // If not selected-color context, output normal text
            // Don't reset lastColorRun if it's just whitespace/punctuation - might be between color segments that should merge
            if (!inSelectedColor) {
                parent.appendChild(document.createTextNode(textSeg));
                // Only reset if text contains actual words (whitespace/punctuation between color spans should preserve merge state)
                // Check if text is just whitespace, punctuation, or short separators
                const trimmed = textSeg.trim();
                if (trimmed.length === 0 || /^[\s.,;:!?'"()\-–—]+$/.test(textSeg)) {
                    // Keep lastColorRun - this is likely between colored segments
                } else {
                    // Actual text content - reset merge state
                    lastColorRun = null;
                }
                return;
            }
            
            // Don't create blanks for empty or whitespace-only text
            const trimmed = textSeg.trim();
            if (!trimmed || trimmed.length === 0) {
                // Just whitespace - output as normal text and don't create a blank
                parent.appendChild(document.createTextNode(textSeg));
                return;
            }
            
            const css = colorCtx.css || '';
            
            // Merge if the previous thing we emitted was a selected-color blank in the SAME parent + SAME color
            if (
                lastColorRun &&
                lastColorRun.parent === parent &&
                lastColorRun.css === css
            ) {
                const btn = lastColorRun.button;
                const oldContent = btn.getAttribute('data-content') || '';
                const newContent = oldContent + textSeg;
                
                btn.setAttribute('data-content', newContent);
                
                // Update stored HTML (keep it simple)
                const escaped = newContent
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;');
                
                const html = css ? `<span style="color:${css}">${escaped}</span>` : escaped;
                btn.setAttribute('data-html-content', html);
                
                // If still blank state, expand blanks to match new length
                const state = btn.getAttribute('data-state') || 'blank';
                if (state === 'blank') {
                    btn.textContent = generateBlankText(newContent);
                }
                return;
            }
            
            // Otherwise create a new blank
            const escaped = textSeg
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');
            
            const html = css ? `<span style="color:${css}">${escaped}</span>` : escaped;
            
            const wrapper = createClickableButton(textSeg, blankButtons.length, html);
            parent.appendChild(wrapper);
            
            const btn = wrapper.querySelector('.blank-button');
            
            // IMPORTANT: blankButtons should store the actual button elements (not wrappers)
            blankButtons.push(btn);
            
            lastColorRun = { parent, wrapper, button: btn, css };
        }
        
        function walkNode(node, parent, colorCtx) {
            colorCtx = colorCtx || { state: 'none', css: null }; // state: 'none' | 'selected' | 'nonselected'
            
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent;
                if (text) {
                    const nodeStart = charOffset;
                    const nodeEnd = charOffset + text.length;
                    
                    // Find all matches (processed or not) that overlap with this text node
                    const allOverlappingMatches = matches.filter(m => m.start < nodeEnd && m.end > nodeStart);
                    
                    if (allOverlappingMatches.length === 0) {
                        // No matches, use color context to determine if text should be a blank
                        appendTextOrColorBlank(text, parent, colorCtx);
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
                                appendTextOrColorBlank(text.substring(lastIndex, range.start), parent, colorCtx);
                            }
        
                            if (!range.isSkip && range.match && !processedMatches.has(range.match)) {
                                // Process the match
                                if (range.match.type === 'bracket') {
                                    // Add left bracket
                                    parent.appendChild(document.createTextNode(range.match.leftBracket));
                                    // Extract HTML content from source structure for the bracket content
                                    const htmlContent = extractHTMLContent(range.match.start + range.match.leftBracket.length, range.match.end - range.match.rightBracket.length);
                                    // Create button with HTML content
                                    const wrapper = createClickableButton(range.match.content, blankButtons.length, htmlContent);
                                    parent.appendChild(wrapper);
                                    blankButtons.push(wrapper.querySelector('.blank-button'));
                                    // Add right bracket
                                    parent.appendChild(document.createTextNode(range.match.rightBracket));
                                } else if (range.match.type === 'capitalized' || 
                                          range.match.type === 'italic' ||
                                          range.match.type === 'bold' ||
                                          range.match.type === 'highlighted') {
                                    // Extract HTML content from source structure
                                    const htmlContent = extractHTMLContent(range.match.start, range.match.end);
                                    // Create button with HTML content
                                    const wrapper = createClickableButton(range.match.content, blankButtons.length, htmlContent);
                                    parent.appendChild(wrapper);
                                    blankButtons.push(wrapper.querySelector('.blank-button'));
                                }
                                
                                // Mark match as processed
                                processedMatches.add(range.match);
                            }
                            // If it's a skip range, we don't add anything (the text is skipped)
                            
                            lastIndex = range.end;
                        }
                        
                        // Add remaining text after all ranges
                        if (lastIndex < text.length) {
                            appendTextOrColorBlank(text.substring(lastIndex), parent, colorCtx);
                        }
                    }
                    charOffset += text.length;
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                // Check if element itself has selected color FIRST - if so, convert entire element as one
                const elementText = node.textContent || '';
                
                // Compute inherited color context for children
                const explicitCss = getExplicitColorCss(node);
                let nextColorCtx = { ...colorCtx };
                
                if (explicitCss) {
                    if (formatOptions.colorSelected && hasSelectedColor(node, formatOptions.selectedColors)) {
                        nextColorCtx = { state: 'selected', css: explicitCss };
                    } else {
                        nextColorCtx = { state: 'nonselected', css: explicitCss };
                    }
                }
                
                // If element is selected-color wrapper (span/font), DON'T clone it.
                // Walking children into SAME parent enables merging into ONE blank.
                if (
                    nextColorCtx.state === 'selected' &&
                    node.tagName &&
                    (node.tagName.toLowerCase() === 'span' || node.tagName.toLowerCase() === 'font') &&
                    formatOptions.colorSelected &&
                    hasSelectedColor(node, formatOptions.selectedColors)
                ) {
                    for (let child = node.firstChild; child; child = child.nextSibling) {
                        walkNode(child, parent, nextColorCtx); // parent (not clonedElement)
                    }
                    return;
                }
                
                let shouldConvert = false;
                let formatType = null;
                
                // Check if element has selected color
                const colorIsSelected = formatOptions.colorSelected &&
                                       formatOptions.selectedColors &&
                                       hasSelectedColor(node, formatOptions.selectedColors);
                
                // Handle color conversion: if container has mixed colors, skip converting the whole thing
                // but still traverse children to find smaller valid colored spans
                let skipDueToMixedColors = false;
                if (colorIsSelected) {
                    if (hasNonSelectedColoredDescendant(node, formatOptions.selectedColors)) {
                        // The container mixes colors — don't convert the whole thing,
                        // but DO traverse its children to find smaller colored spans.
                        shouldConvert = false;
                        skipDueToMixedColors = true; // Mark that we're skipping due to mixed colors
                    } else {
                        // Purely one selected color — but DON'T convert whole element for color
                        // Let children/text-node merging handle it to allow proper merging
                        shouldConvert = false;
                        formatType = 'color';
                    }
                }
                
                // Check other formats if color conversion was skipped or not applicable
                // BUT: if we skipped due to mixed colors, don't check other formats - just process children
                if (!skipDueToMixedColors) {
                    if (!shouldConvert && formatOptions.italicSelected && isItalic(node)) {
                        shouldConvert = true;
                        formatType = 'italic';
                    } else if (!shouldConvert && formatOptions.boldSelected && isBold(node)) {
                        shouldConvert = true;
                        formatType = 'bold';
                    } else if (!shouldConvert && formatOptions.highlightedSelected && isHighlighted(node)) {
                        shouldConvert = true;
                        formatType = 'highlighted';
                    } else if (!shouldConvert && formatOptions.underlinedSelected && isUnderlined(node)) {
                        shouldConvert = true;
                        formatType = 'underlined';
                    }
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
                            // Only count children, not siblings
                            for (let child = node.firstChild; child; child = child.nextSibling) {
                                countChars(child);
                            }
                        }
                    }
                    countChars(node);
                    const elementEndOffset = elementStartOffset + elementCharCount;
                    
                    // CRITICAL: Verify that elementText matches what we counted
                    // This ensures we're not including adjacent text
                    const actualElementText = node.textContent || '';
                    const countedTextLength = elementCharCount;
                    const actualTextLength = actualElementText.length;
                    
                    // If there's a significant mismatch, something is wrong
                    if (Math.abs(countedTextLength - actualTextLength) > 5) {
                        // Recalculate more carefully
                        elementCharCount = 0;
                        countChars(node);
                        const recalculatedEndOffset = elementStartOffset + elementCharCount;
                        // Use the more accurate calculation
                    }
                    
                    // Mark any capitalized matches that overlap with this element as processed
                    for (const match of matches) {
                        if (match.type === 'capitalized' && 
                            match.start < elementEndOffset && 
                            match.end > elementStartOffset) {
                            processedMatches.add(match);
                        }
                    }
                    
                    // Convert formatted element to button
                    // Preserve the entire HTML structure including children (like <sup>)
                    let elementHtml = '';
                    const tagName = node.tagName.toLowerCase();
                    
                    // For color elements, preserve the entire innerHTML including all child elements
                    if (formatType === 'color') {
                        // CRITICAL: Extract HTML content ONLY from direct children of this element
                        // This ensures we don't accidentally include adjacent text nodes
                        const tempContainer = document.createElement('div');
                        
                        // Only clone and append direct children, not siblings
                        for (let child = node.firstChild; child; child = child.nextSibling) {
                            tempContainer.appendChild(child.cloneNode(true));
                        }
                        
                        // Get innerHTML from the container (only contains direct children)
                        elementHtml = tempContainer.innerHTML || '';
                        
                        // Remove leading/trailing whitespace
                        elementHtml = elementHtml.trim();
                        
                        // If elementHtml is empty after trimming, fall back to textContent
                        if (!elementHtml && elementText.trim()) {
                            elementHtml = elementText.trim();
                        }
                        
                        // Preserve the style attribute if present
                        const style = node.getAttribute('style') || '';
                        if (style && elementHtml) {
                            // Check if elementHtml already has a span with this exact style to avoid double-wrapping
                            const styleMatch = style.match(/color:\s*([^;]+)/i);
                            if (styleMatch) {
                                const colorValue = styleMatch[1].trim();
                                // Check if the HTML already contains this color style (avoid double-wrapping)
                                const hasColorStyle = elementHtml.includes(`color:${colorValue}`) || 
                                                     elementHtml.includes(`color: ${colorValue}`) ||
                                                     elementHtml.includes(`"${style}"`) ||
                                                     elementHtml.includes(`'${style}'`);
                                
                                if (!hasColorStyle) {
                                    elementHtml = `<span style="${style}">${elementHtml}</span>`;
                                }
                            } else {
                                // Wrap with the full style if no color match found
                                elementHtml = `<span style="${style}">${elementHtml}</span>`;
                            }
                        }
                    } else {
                        // For other formatting types, use simpler wrapping
                        elementHtml = elementText.trim();
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
                    }
                    
                    // CRITICAL: Extract text content from the HTML we extracted, not from node.textContent
                    // This ensures the text matches exactly what's in the HTML
                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = elementHtml;
                    const extractedText = (tempDiv.textContent || '').trim();
                    
                    // Use the extracted text, or fall back to elementText if extraction fails
                    const buttonText = extractedText || (node.textContent || '').trim();
                    const wrapper = createClickableButton(buttonText, blankButtons.length, elementHtml);
                    parent.appendChild(wrapper);
                    blankButtons.push(wrapper.querySelector('.blank-button'));
                    
                    // Update charOffset to skip over this element's text content ONLY
                    // This ensures adjacent text nodes are processed separately
                    charOffset = elementEndOffset;
                    // Don't process children - the entire element is already converted to a button
                    return;
                } else {
                    // Clone element and its attributes to preserve formatting
                    const clonedElement = node.cloneNode(false);
                    parent.appendChild(clonedElement);
                    
                    // Recursively process child nodes, passing color context
                    for (let child = node.firstChild; child; child = child.nextSibling) {
                        walkNode(child, clonedElement, nextColorCtx);
                    }
                }
            }
        }
        
        // Start walking from sourceNode's children
        for (let child = sourceNode.firstChild; child; child = child.nextSibling) {
            walkNode(child, targetParent, { state: 'none', css: null });
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
            // Check if the first text node is inside a sup or sub tag
            let parentElement = cloneFirstTextNode.parentNode;
            let supSubElement = null;
            while (parentElement && parentElement !== cloneDiv) {
                const tagName = parentElement.tagName ? parentElement.tagName.toLowerCase() : '';
                if (tagName === 'sup' || tagName === 'sub') {
                    supSubElement = parentElement;
                    break;
                }
                parentElement = parentElement.parentNode;
            }
            
            // Replace the text node's content with just the first character
            cloneFirstTextNode.textContent = firstChar;
            
            // If inside sup/sub, preserve the entire sup/sub element with just the first char
            if (supSubElement && supSubElement !== cloneDiv) {
                // Remove all siblings after the sup/sub element
                let sibling = supSubElement.nextSibling;
                while (sibling) {
                    const next = sibling.nextSibling;
                    sibling.remove();
                    sibling = next;
                }
                // Walk up and remove siblings
                let parent = supSubElement.parentNode;
                while (parent && parent !== cloneDiv) {
                    sibling = parent.nextSibling;
                    while (sibling) {
                        const next = sibling.nextSibling;
                        sibling.remove();
                        sibling = next;
                    }
                    parent = parent.parentNode;
                }
            } else {
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
        }
        
        return cloneDiv.innerHTML || firstChar;
    }
    
    // Helper function to generate blank text matching content length
    function generateBlankText(content) {
        if (!content) return '　　';
        // Full-width spaces are approximately 2x the width of regular characters
        // So we need roughly half the number of full-width spaces to match the visual length
        const length = content.length;
        // Use approximately half the number of full-width spaces to match visual width
        const blankLength = Math.max(2, Math.ceil(length / 2));
        return '　'.repeat(blankLength);
    }
    
    function createClickableButton(content, index, htmlContent) {
        // Create wrapper to hold button and feedback buttons
        const wrapper = document.createElement('span');
        wrapper.className = 'blank-button-wrapper';
        
        const button = document.createElement('span');
        button.className = 'blank-button';
        button.setAttribute('role', 'button');
        button.setAttribute('tabindex', '0');
        button.textContent = generateBlankText(content); // Match answer length
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
            const wasAnswered = button.hasAttribute('data-answered');
            const wasCorrect = button.hasAttribute('data-correct');
            
            checkButton.classList.add('active');
            xButton.classList.remove('active');
            button.classList.remove('wrong-answer');
            button.classList.add('correct-answer');
            button.setAttribute('data-answered', 'true');
            button.setAttribute('data-correct', 'true');
            
            // Update accuracy if this is a new answer or changed from wrong to correct
            if (!wasAnswered || (wasAnswered && !wasCorrect)) {
                updateAccuracy();
            }
        });
        
        const xButton = document.createElement('button');
        xButton.className = 'feedback-btn feedback-x';
        xButton.innerHTML = '✗';
        xButton.setAttribute('aria-label', 'Got it wrong');
        xButton.addEventListener('click', function(e) {
            e.stopPropagation();
            const wasAnswered = button.hasAttribute('data-answered');
            const wasCorrect = button.hasAttribute('data-correct');
            
            xButton.classList.add('active');
            checkButton.classList.remove('active');
            button.classList.remove('correct-answer');
            button.classList.add('wrong-answer');
            button.setAttribute('data-answered', 'true');
            button.removeAttribute('data-correct');
            
            // Update accuracy if this is a new answer or changed from correct to wrong
            if (!wasAnswered || (wasAnswered && wasCorrect)) {
                updateAccuracy();
            }
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
            
            // Helper function to convert block elements to inline while preserving formatting
            function convertBlockToInline(html) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = html;
                
                // Replace <br> tags with spaces
                tempDiv.querySelectorAll('br').forEach(br => {
                    br.replaceWith(document.createTextNode(' '));
                });
                
                // Convert block elements to inline spans while preserving only formatting attributes
                const blockElements = tempDiv.querySelectorAll('div, p, h1, h2, h3, h4, h5, h6, section, article, header, footer, nav, aside');
                blockElements.forEach(el => {
                    // Check if element has any formatting (style, class, or inline formatting)
                    const hasStyle = el.hasAttribute('style') && el.getAttribute('style').trim();
                    const hasClass = el.hasAttribute('class') && el.getAttribute('class').trim();
                    const hasDataAttrs = Array.from(el.attributes).some(attr => attr.name.startsWith('data-'));
                    const hasInlineFormatting = el.querySelector('b, strong, i, em, u, mark, span[style], font');
                    
                    if (hasStyle || hasClass || hasDataAttrs || hasInlineFormatting) {
                        // Has formatting - preserve it in a span
                        const span = document.createElement('span');
                        span.style.display = 'inline';
                        
                        // Only copy formatting-related attributes
                        Array.from(el.attributes).forEach(attr => {
                            if (attr.name === 'style' || attr.name === 'class' || attr.name.startsWith('data-')) {
                                span.setAttribute(attr.name, attr.value);
                            }
                        });
                        
                        // Move all children
                        while (el.firstChild) {
                            span.appendChild(el.firstChild);
                        }
                        
                        if (el.parentNode) {
                            el.parentNode.replaceChild(span, el);
                        }
                    } else {
                        // No formatting - just unwrap the element
                        const fragment = document.createDocumentFragment();
                        while (el.firstChild) {
                            fragment.appendChild(el.firstChild);
                        }
                        if (el.parentNode) {
                            el.parentNode.replaceChild(fragment, el);
                        }
                    }
                });
                
                return tempDiv.innerHTML;
            }
            
            if (state === 1) {
                // Show first character as hint with formatting preserved
                let firstCharHtml = getFirstCharacterHTML(storedHtmlContent, content);
                firstCharHtml = convertBlockToInline(firstCharHtml);
                // Add blank spaces after the hint to maintain original button size
                const blankText = generateBlankText(content);
                const hintWithPadding = firstCharHtml + blankText.substring(1);
                button.innerHTML = hintWithPadding;
                button.setAttribute('data-state', 'hint');
                button.classList.add('hint-state');
                feedbackContainer.style.display = 'none';
                wrapper.classList.remove('show-feedback');
            } else if (state === 2) {
                // Show full answer with formatting preserved
                const sanitizedHtml = convertBlockToInline(storedHtmlContent);
                button.innerHTML = sanitizedHtml;
                button.setAttribute('data-state', 'answer');
                button.classList.remove('hint-state');
                button.classList.add('answer-state');
                feedbackContainer.style.display = 'flex';
                wrapper.classList.add('show-feedback');
            } else {
                // Reset to blank (but keep feedback color)
                const content = button.getAttribute('data-content') || '';
                button.textContent = generateBlankText(content);
                button.setAttribute('data-state', 'blank');
                button.classList.remove('hint-state', 'answer-state');
                feedbackContainer.style.display = 'none';
                wrapper.classList.remove('show-feedback');
                // Don't remove correct-answer or wrong-answer classes - keep the background color
            }
            
            // Update blank counter
            updateBlankCounterFromOutput();
            
            // Clamp blanks to end of current line after state change (use double RAF)
            requestAnimationFrame(() => {
                requestAnimationFrame(clampBlanksToLineEnd);
            });
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
        
        updateAccuracy();
    }
    
    function updateAccuracy() {
        const buttons = output.querySelectorAll('.blank-button');
        let answered = 0;
        let correct = 0;
        
        buttons.forEach(button => {
            if (button.hasAttribute('data-answered')) {
                answered++;
                if (button.hasAttribute('data-correct')) {
                    correct++;
                }
            }
        });
        
        const accuracyElement = document.getElementById('accuracyCounter');
        if (accuracyElement) {
            if (answered === 0) {
                accuracyElement.textContent = '';
            } else {
                const percentage = Math.round((correct / answered) * 100);
                accuracyElement.textContent = `Accuracy: ${correct}/${answered} (${percentage}%)`;
            }
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
        // Clamp blanks after fullscreen change
        requestAnimationFrame(clampBlanksToLineEnd);
    });
    
    // Clamp blanks on window resize
    window.addEventListener('resize', function() {
        requestAnimationFrame(clampBlanksToLineEnd);
    });
});
