// Character mapping for URL-safe filenames
const charMap = {
    '–': '-',  // en-dash to hyphen
    '—': '-',  // em-dash to hyphen
    ' ': '%20', // space to encoded space
};

function sanitizeFilePath(filePath) {
    let sanitizedPath = filePath;
    for (const [char, replacement] of Object.entries(charMap)) {
        sanitizedPath = sanitizedPath.replace(new RegExp(char, 'g'), replacement);
    }
    return sanitizedPath;
}

// Theme management
let currentTheme = localStorage.getItem('theme') || 'dark';

// Font size settings
let currentFontSize = parseInt(localStorage.getItem('fontSize') || '16');

// Current file and path tracking
let currentFile = null;
let currentPath = [];

// Navigation state
const navState = {};

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadTheme(currentTheme);
    applyFontSize(currentFontSize);
    buildNavigation();
    setupEventListeners();
}

function setupEventListeners() {
    // Theme toggle
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('input', handleSearch);
    
    // Navigation controls
    document.getElementById('expandAll').addEventListener('click', () => toggleAllNavItems(true));
    document.getElementById('collapseAll').addEventListener('click', () => toggleAllNavItems(false));
    
    // Font size controls
    document.getElementById('fontSizeDecrease').addEventListener('click', () => adjustFontSize(-1));
    document.getElementById('fontSizeIncrease').addEventListener('click', () => adjustFontSize(1));
    
    // Focus mode
    document.getElementById('focusMode').addEventListener('click', toggleFocusMode);
    
    // Copy content
    document.getElementById('copyContent').addEventListener('click', copyContent);
}

function loadTheme(themeName) {
    document.body.classList.remove('light-theme', 'sepia-theme', 'blue-light-theme');
    
    switch(themeName) {
        case 'light':
            document.body.classList.add('light-theme');
            document.querySelector('.theme-toggle i').className = 'fas fa-sun';
            break;
        case 'sepia':
            document.body.classList.add('sepia-theme');
            document.querySelector('.theme-toggle i').className = 'fas fa-palette';
            break;
        case 'blue-light':
            document.body.classList.add('blue-light-theme');
            document.querySelector('.theme-toggle i').className = 'fas fa-tint';
            break;
        default:
            document.body.classList.add('dark-theme');
            document.querySelector('.theme-toggle i').className = 'fas fa-moon';
            currentTheme = 'dark';
    }
    
    localStorage.setItem('theme', currentTheme);
}

function toggleTheme() {
    switch(currentTheme) {
        case 'dark':
            currentTheme = 'light';
            break;
        case 'light':
            currentTheme = 'sepia';
            break;
        case 'sepia':
            currentTheme = 'blue-light';
            break;
        case 'blue-light':
        default:
            currentTheme = 'dark';
    }
    
    loadTheme(currentTheme);
}

function applyFontSize(fontSize) {
    document.documentElement.style.setProperty('--font-size', fontSize + 'px');
    document.body.style.fontSize = fontSize + 'px';
    localStorage.setItem('fontSize', fontSize.toString());
}

function adjustFontSize(change) {
    const newFontSize = Math.max(12, Math.min(24, currentFontSize + change));
    if (newFontSize !== currentFontSize) {
        currentFontSize = newFontSize;
        applyFontSize(currentFontSize);
    }
}

function toggleFocusMode() {
    document.body.classList.toggle('focus-mode');
}

function copyContent() {
    const contentArea = document.getElementById('contentArea');
    const text = contentArea.innerText || contentArea.textContent;
    
    navigator.clipboard.writeText(text)
        .then(() => {
            showNotification('Content copied to clipboard!');
        })
        .catch(err => {
            console.error('Failed to copy: ', err);
            showNotification('Failed to copy content.');
        });
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: var(--accent-primary);
        color: white;
        padding: 10px 15px;
        border-radius: 5px;
        z-index: 1000;
        animation: fadeInOut 3s ease-out forwards;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function buildNavigation() {
    const navList = document.getElementById('navList');
    navList.innerHTML = '';
    
    // Build navigation tree from directory structure
    const navItems = [
        { name: 'PYTHON COURSE – INDEX.txt', path: 'PYTHON COURSE – INDEX.txt', type: 'file' },
        { name: 'Python Review.txt', path: 'Python Review.txt', type: 'file' },
        { name: 'Python Basics', path: 'Python Basics', type: 'folder', children: [
            { name: 'Booleans and Conditionals', path: 'Python Basics/Booleans and Conditionals', type: 'folder', children: [
                { name: 'How Do Conditional Statements and Logical Operators Work.txt', path: 'Python Basics/Booleans and Conditionals/How Do Conditional Statements and Logical Operators Work.txt', type: 'file' },
                { name: 'What Are Truthy and Falsy Values, and How Do Boolean Operators and Short-Circuiting Work.txt', path: 'Python Basics/Booleans and Conditionals/What Are Truthy and Falsy Values, and How Do Boolean Operators and Short-Circuiting Work.txt', type: 'file' }
            ]},
            { name: 'Introduction to Python', path: 'Python Basics/Introduction to Python', type: 'folder', children: [
                { name: 'How Do You Install, Configure and Use Python in Your Local Environment.txt', path: 'Python Basics/Introduction to Python/How Do You Install, Configure and Use Python in Your Local Environment.txt', type: 'file' },
                { name: 'What Is Python and What Are Some Common Uses in the Industry.txt', path: 'Python Basics/Introduction to Python/What Is Python and What Are Some Common Uses in the Industry.txt', type: 'file' }
            ]},
            { name: 'Introduction to Strings', path: 'Python Basics/Introduction to Strings', type: 'folder', children: [
                { name: 'What Are Some Common String Methods.txt', path: 'Python Basics/Introduction to Strings/What Are Some Common String Methods.txt', type: 'file' },
                { name: 'What Are String Concatenation and String Interpolation.txt', path: 'Python Basics/Introduction to Strings/What Are String Concatenation and String Interpolation.txt', type: 'file' },
                { name: 'What Are Strings and What Is String Immutability.txt', path: 'Python Basics/Introduction to Strings/What Are Strings and What Is String Immutability.txt', type: 'file' },
                { name: 'What Is String Slicing and How Does It Work.txt', path: 'Python Basics/Introduction to Strings/What Is String Slicing and How Does It Work.txt', type: 'file' }
            ]},
            { name: 'Numbers and Mathematical Operations', path: 'Python Basics/Numbers and Mathematical Operations', type: 'folder', children: [
                { name: 'How Do Augmented Assignments Work.txt', path: 'Python Basics/Numbers and Mathematical Operations/How Do Augmented Assignments Work.txt', type: 'file' },
                { name: 'How Do You Work With Integers and Floating Point Numbers.txt', path: 'Python Basics/Numbers and Mathematical Operations/How Do You Work With Integers and Floating Point Numbers.txt', type: 'file' }
            ]},
            { name: 'Understanding Functions and Scope', path: 'Python Basics/Understanding Functions and Scope', type: 'folder', children: [
                { name: 'How Do Functions Work in Python.txt', path: 'Python Basics/Understanding Functions and Scope/How Do Functions Work in Python.txt', type: 'file' },
                { name: 'What Is Scope in Python and How Does It Work.txt', path: 'Python Basics/Understanding Functions and Scope/What Is Scope in Python and How Does It Work.txt', type: 'file' }
            ]},
            { name: 'Understanding Variables and Data Types', path: 'Python Basics/Understanding Variables and Data Types', type: 'folder', children: [
                { name: 'How Do You Declare Variables and What Are Naming Conventions to Name Variables.txt', path: 'Python Basics/Understanding Variables and Data Types/How Do You Declare Variables and What Are Naming Conventions to Name Variables.txt', type: 'file' },
                { name: 'How Does the Print Function Work.txt', path: 'Python Basics/Understanding Variables and Data Types/How Does the Print Function Work.txt', type: 'file' },
                { name: 'What Are Common Data Types in Python and How Do You Get the Type of a Variable.txt', path: 'Python Basics/Understanding Variables and Data Types/What Are Common Data Types in Python and How Do You Get the Type of a Variable.txt', type: 'file' }
            ]},
            { name: 'Python Basics Review.txt', path: 'Python Basics/Python Basics Review.txt', type: 'file' }
        ]},
        { name: 'Loops and Sequences', path: 'Loops and Sequences', type: 'folder', children: [
            { name: 'Working with Loops and Sequences', path: 'Loops and Sequences/Working with Loops and Sequences', type: 'folder', children: [
                { name: 'How Do Loops Work.txt', path: 'Loops and Sequences/Working with Loops and Sequences/How Do Loops Work.txt', type: 'file' },
                { name: 'What Are Lambda Functions and How Do They Work.txt', path: 'Loops and Sequences/Working with Loops and Sequences/What Are Lambda Functions and How Do They Work.txt', type: 'file' },
                { name: 'What Are List Comprehensions and What Are Some Useful Functions to Work With Lists.txt', path: 'Loops and Sequences/Working with Loops and Sequences/What Are List Comprehensions and What Are Some Useful Functions to Work With Lists.txt', type: 'file' },
                { name: 'What Are Lists and How Do They Work.txt', path: 'Loops and Sequences/Working with Loops and Sequences/What Are Lists and How Do They Work.txt', type: 'file' },
                { name: 'What Are Ranges and How Can You Use Them in a Loop.txt', path: 'Loops and Sequences/Working with Loops and Sequences/What Are Ranges and How Can You Use Them in a Loop.txt', type: 'file' },
                { name: 'What Are Some Common Methods Used for Lists.txt', path: 'Loops and Sequences/Working with Loops and Sequences/What Are Some Common Methods Used for Lists.txt', type: 'file' },
                { name: 'What Are Some Common Methods for Tuples.txt', path: 'Loops and Sequences/Working with Loops and Sequences/What Are Some Common Methods for Tuples.txt', type: 'file' },
                { name: 'What Are Tuples and How Do They Work.txt', path: 'Loops and Sequences/Working with Loops and Sequences/What Are Tuples and How Do They Work.txt', type: 'file' },
                { name: 'What Are the Enumerate and Zip Functions and How Do They Work.txt', path: 'Loops and Sequences/Working with Loops and Sequences/What Are the Enumerate and Zip Functions and How Do They Work.txt', type: 'file' }
            ]},
            { name: 'Loops and Sequences Review.txt', path: 'Loops and Sequences/Loops and Sequences Review.txt', type: 'file' }
        ]},
        { name: 'Linear Data Structures', path: 'Linear Data Structures', type: 'folder', children: [
            { name: 'Working with Common Data Structures', path: 'Linear Data Structures/Working with Common Data Structures', type: 'folder', children: [
                { name: 'How Do Dynamic Arrays Differ From Static Arrays.txt', path: 'Linear Data Structures/Working with Common Data Structures/How Do Dynamic Arrays Differ From Static Arrays.txt', type: 'file' },
                { name: 'How Do Maps, Hash Maps and Sets Work.txt', path: 'Linear Data Structures/Working with Common Data Structures/How Do Maps, Hash Maps and Sets Work.txt', type: 'file' },
                { name: 'How Do Singly Linked Lists Work and How Do They Differ From Doubly Linked List.txt', path: 'Linear Data Structures/Working with Common Data Structures/How Do Singly Linked Lists Work and How Do They Differ From Doubly Linked List.txt', type: 'file' },
                { name: 'How Do Stacks and Queues Work.txt', path: 'Linear Data Structures/Working with Common Data Structures/How Do Stacks and Queues Work.txt', type: 'file' },
                { name: 'What Are Good Problem-Solving Techniques and Ways to Approach Algorithmic Challenges.txt', path: 'Linear Data Structures/Working with Common Data Structures/What Are Good Problem-Solving Techniques and Ways to Approach Algorithmic Challenges.txt', type: 'file' },
                { name: 'What Is an Algorithm and How Does Big O Notation Work.txt', path: 'Linear Data Structures/Working with Common Data Structures/What Is an Algorithm and How Does Big O Notation Work.txt', type: 'file' }
            ]},
            { name: 'Data Structures Review.txt', path: 'Linear Data Structures/Data Structures Review.txt', type: 'file' }
        ]},
        { name: 'Dictionaries and Sets', path: 'Dictionaries and Sets', type: 'folder', children: [
            { name: 'Working with Dictionaries and Sets', path: 'Dictionaries and Sets/Working with Dictionaries and Sets', type: 'folder', children: [
                { name: 'What Are Dictionaries, and How Do They Work.txt', path: 'Dictionaries and Sets/Working with Dictionaries and Sets/What Are Dictionaries, and How Do They Work.txt', type: 'file' },
                { name: 'What Are Sets, and How Do They Work.txt', path: 'Dictionaries and Sets/Working with Dictionaries and Sets/What Are Sets, and How Do They Work.txt', type: 'file' },
                { name: 'What Are Some Common Techniques to Loop Over a Dictionary.txt', path: 'Dictionaries and Sets/Working with Dictionaries and Sets/What Are Some Common Techniques to Loop Over a Dictionary.txt', type: 'file' }
            ]},
            { name: 'Working with Modules', path: 'Dictionaries and Sets/Working with Modules', type: 'folder', children: [
                { name: 'What Is the Python Standard Library, and How Do You Import a Module.txt', path: 'Dictionaries and Sets/Working with Modules/What Is the Python Standard Library, and How Do You Import a Module.txt', type: 'file' }
            ]},
            { name: 'Dictionaries and Sets Review.txt', path: 'Dictionaries and Sets/Dictionaries and Sets Review.txt', type: 'file' }
        ]},
        { name: 'Classes and Objects', path: 'Classes and Objects', type: 'folder', children: [
            { name: 'Classes and Objects Review.txt', path: 'Classes and Objects/Classes and Objects Review.txt', type: 'file' },
            { name: 'How Do Classes Work and How Do They Differ From Objects.txt', path: 'Classes and Objects/How Do Classes Work and How Do They Differ From Objects.txt', type: 'file' },
            { name: 'How to Handle Object Attributes Dynamically.txt', path: 'Classes and Objects/How to Handle Object Attributes Dynamically.txt', type: 'file' },
            { name: 'What Are Methods and Attributes, and How Do They Work.txt', path: 'Classes and Objects/What Are Methods and Attributes, and How Do They Work.txt', type: 'file' },
            { name: 'What Are Special Methods and What Are They Used For.txt', path: 'Classes and Objects/What Are Special Methods and What Are They Used For.txt', type: 'file' }
        ]},
        { name: 'Object-Oriented Programming (OOP)', path: 'Object-Oriented Programming (OOP)', type: 'folder', children: [
            { name: 'Understanding Abstraction', path: 'Object-Oriented Programming (OOP)/Understanding Abstraction', type: 'folder', children: [
                { name: 'What Is Abstraction and How Does It Help Keep Complex Systems Organized.txt', path: 'Object-Oriented Programming (OOP)/Understanding Abstraction/What Is Abstraction and How Does It Help Keep Complex Systems Organized.txt', type: 'file' }
            ]},
            { name: 'Understanding Inheritance and Polymorphism', path: 'Object-Oriented Programming (OOP)/Understanding Inheritance and Polymorphism', type: 'folder', children: [
                { name: 'What Is Inheritance and How Does It Promote Code Reuse.txt', path: 'Object-Oriented Programming (OOP)/Understanding Inheritance and Polymorphism/What Is Inheritance and How Does It Promote Code Reuse.txt', type: 'file' },
                { name: 'What Is Polymorphism and How Does It Promote Code Reuse.txt', path: 'Object-Oriented Programming (OOP)/Understanding Inheritance and Polymorphism/What Is Polymorphism and How Does It Promote Code Reuse.txt', type: 'file' },
                { name: 'What is Name Mangling and How Does it Work.txt', path: 'Object-Oriented Programming (OOP)/Understanding Inheritance and Polymorphism/What is Name Mangling and How Does it Work.txt', type: 'file' }
            ]},
            { name: 'Understanding Object Oriented Programming and Encapsulation', path: 'Object-Oriented Programming (OOP)/Understanding Object Oriented Programming and Encapsulation', type: 'folder', children: [
                { name: 'What are Getters and Setters.txt', path: 'Object-Oriented Programming (OOP)/Understanding Object Oriented Programming and Encapsulation/What are Getters and Setters.txt', type: 'file' },
                { name: 'What is Object-Oriented Programming, and How Does Encapsulation Work.txt', path: 'Object-Oriented Programming (OOP)/Understanding Object Oriented Programming and Encapsulation/What is Object-Oriented Programming, and How Does Encapsulation Work.txt', type: 'file' }
            ]},
            { name: 'Object Oriented Programming Review.txt', path: 'Object-Oriented Programming (OOP)/Object Oriented Programming Review.txt', type: 'file' }
        ]},
        { name: 'Algorithms', path: 'Algorithms', type: 'folder', children: [
            { name: 'Searching and Sorting Algorithms', path: 'Algorithms/Searching and Sorting Algorithms', type: 'folder', children: [
                { name: 'What Is Binary Search and How Does It Differ From Linear Search.txt', path: 'Algorithms/Searching and Sorting Algorithms/What Is Binary Search and How Does It Differ From Linear Search.txt', type: 'file' },
                { name: 'What Is Divide and Conquer, and How Does Merge Sort Work.txt', path: 'Algorithms/Searching and Sorting Algorithms/What Is Divide and Conquer, and How Does Merge Sort Work.txt', type: 'file' }
            ]},
            { name: 'Searching and Sorting Algorithms Review.txt', path: 'Algorithms/Searching and Sorting Algorithms Review.txt', type: 'file' }
        ]},
        { name: 'Error Handling', path: 'Error Handling', type: 'folder', children: [
            { name: 'Understanding Error Handling', path: 'Error Handling/Understanding Error Handling', type: 'folder', children: [
                { name: 'How Does Exception Handling Work.txt', path: 'Error Handling/Understanding Error Handling/How Does Exception Handling Work.txt', type: 'file' },
                { name: 'What Are Some Common Error Messages in Python.txt', path: 'Error Handling/Understanding Error Handling/What Are Some Common Error Messages in Python.txt', type: 'file' },
                { name: 'What Are Some Good Debugging Techniques in Python.txt', path: 'Error Handling/Understanding Error Handling/What Are Some Good Debugging Techniques in Python.txt', type: 'file' },
                { name: 'What Is the Raise Statement and How Does It Work.txt', path: 'Error Handling/Understanding Error Handling/What Is the Raise Statement and How Does It Work.txt', type: 'file' }
            ]},
            { name: 'Error Handling Review.txt', path: 'Error Handling/Error Handling Review.txt', type: 'file' }
        ]},
        { name: 'Graphs and Trees', path: 'Graphs and Trees', type: 'folder', children: [
            { name: 'Understanding Graphs and Trees', path: 'Graphs and Trees/Understanding Graphs and Trees', type: 'folder', children: [
                { name: 'How Do Depth First and Breadth First Search Work.txt', path: 'Graphs and Trees/Understanding Graphs and Trees/How Do Depth First and Breadth First Search Work.txt', type: 'file' },
                { name: 'How Do Matrices and Adjacency Lists Work.txt', path: 'Graphs and Trees/Understanding Graphs and Trees/How Do Matrices and Adjacency Lists Work.txt', type: 'file' },
                { name: 'How Do Priority Queues and Heaps Work.txt', path: 'Graphs and Trees/Understanding Graphs and Trees/How Do Priority Queues and Heaps Work.txt', type: 'file' },
                { name: 'What Are Graphs in Computer Science.txt', path: 'Graphs and Trees/Understanding Graphs and Trees/What Are Graphs in Computer Science.txt', type: 'file' },
                { name: 'What Are Trees and Tries and How Do They Work.txt', path: 'Graphs and Trees/Understanding Graphs and Trees/What Are Trees and Tries and How Do They Work.txt', type: 'file' }
            ]},
            { name: 'Graphs and Trees Review.txt', path: 'Graphs and Trees/Graphs and Trees Review.txt', type: 'file' }
        ]},
        { name: 'Dynamic Programming', path: 'Dynamic Programming', type: 'folder', children: [
            { name: 'Understanding Dynamic Programming', path: 'Dynamic Programming/Understanding Dynamic Programming', type: 'folder', children: [
                { name: 'What Is Dynamic Programming and What Are Some Common Algorithms.txt', path: 'Dynamic Programming/Understanding Dynamic Programming/What Is Dynamic Programming and What Are Some Common Algorithms.txt', type: 'file' }
            ]},
            { name: 'Dynamic Programming Review.txt', path: 'Dynamic Programming/Dynamic Programming Review.txt', type: 'file' }
        ]}
    ];
    
    navList.appendChild(createNavTree(navItems));
}

function createNavTree(items, level = 0) {
    const ul = document.createElement('ul');
    
    items.forEach(item => {
        const li = document.createElement('li');
        
        if (item.type === 'folder') {
            const folderDiv = document.createElement('div');
            folderDiv.className = 'nav-item folder';
            folderDiv.innerHTML = `
                <i class="fas fa-folder"></i>
                <span>${item.name}</span>
                <i class="fas fa-chevron-right chevron"></i>
            `;
            
            const chevron = folderDiv.querySelector('.chevron');
            const childUl = createNavTree(item.children, level + 1);
            childUl.className = 'expand-collapse hidden';
            
            folderDiv.addEventListener('click', (e) => {
                e.stopPropagation();
                chevron.classList.toggle('rotated');
                childUl.classList.toggle('hidden');
                
                // Store state in navState
                const path = item.path;
                navState[path] = !childUl.classList.contains('hidden');
            });
            
            li.appendChild(folderDiv);
            li.appendChild(childUl);
        } else {
            const fileDiv = document.createElement('div');
            fileDiv.className = 'nav-item file';
            fileDiv.innerHTML = `
                <i class="fas fa-file-alt"></i>
                <span>${item.name}</span>
            `;
            
            fileDiv.addEventListener('click', () => {
                loadFileContent(item.path);
                
                // Update active state
                document.querySelectorAll('.nav-item').forEach(el => {
                    el.classList.remove('active');
                });
                fileDiv.classList.add('active');
                
                // Update breadcrumb
                updateBreadcrumb(item.path);
            });
            
            li.appendChild(fileDiv);
        }
        
        ul.appendChild(li);
    });
    
    return ul;
}

function updateBreadcrumb(path) {
    const breadcrumb = document.getElementById('breadcrumb');
    const parts = path.split('/');
    let breadcrumbHtml = '<span>Home</span>';
    
    parts.forEach((part, index) => {
        if (index < parts.length - 1) {
            breadcrumbHtml += `<span>/ ${part}</span>`;
        } else {
            breadcrumbHtml += `<span>/ ${part}</span>`;
        }
    });
    
    breadcrumb.innerHTML = breadcrumbHtml;
}

function loadFileContent(filePath) {
    // Show loading state
    const contentArea = document.getElementById('contentArea');
    contentArea.innerHTML = '<div class="loading">Loading...</div>';
    
    // For GitHub Pages compatibility, try direct fetch first
    console.log('Attempting to fetch file:', filePath);
    
    fetch(filePath)
        .then(response => {
            if (!response.ok) {
                // If direct fetch fails, try with sanitized path
                console.log('Direct fetch failed, trying sanitized path');
                const sanitizedPath = sanitizeFilePath(filePath);
                console.log('Sanitized path:', sanitizedPath);
                return fetch(sanitizedPath);
            }
            return response;
        })
        .then(response => {
            console.log('Response status:', response.status);
            if (!response.ok) {
                throw new Error(`File not found: ${filePath} (Status: ${response.status})`);
            }
            return response.text();
        })
        .then(content => {
            console.log('Received content length:', content.length);
            displayFileContent(content, filePath);
        })
        .catch(error => {
            console.error('Error loading file:', error);
            contentArea.innerHTML = `
                <div class="error-message">
                    <h2>Error Loading File</h2>
                    <p>Could not load file: ${filePath}</p>
                    <p>Error: ${error.message}</p>
                    <p><strong>For GitHub Pages:</strong> Make sure all .txt files are committed to the repository and filenames don't contain special characters.</p>
                    <p>Check console for details</p>
                </div>
            `;
        });
}

function displayFileContent(content, filePath) {
    const contentArea = document.getElementById('contentArea');
    
    // Sanitize content to prevent XSS
    const sanitizedContent = sanitizeContent(content);
    
    // Calculate reading time (average 200 words per minute)
    const wordCount = sanitizedContent.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);
    
    // Create content container
    contentArea.innerHTML = `
        <div class="note-content fade-in">
            <div class="metadata">
                <div class="metadata-item">
                    <i class="fas fa-file-alt"></i>
                    <span>${getFileNameFromPath(filePath)}</span>
                </div>
                <div class="metadata-item">
                    <i class="fas fa-clock"></i>
                    <span>~${readingTime} min read</span>
                </div>
                <div class="metadata-item">
                    <i class="fas fa-font"></i>
                    <span>${wordCount} words</span>
                </div>
            </div>
            <div class="content-body">
                ${formatContent(sanitizedContent)}
            </div>
        </div>
    `;
    
    // Update current file
    currentFile = filePath;
    

}

function sanitizeContent(content) {
    // Basic sanitization to prevent XSS
    const div = document.createElement('div');
    div.textContent = content;
    return div.innerHTML;
}

function formatContent(content) {
    // Convert markdown-like formatting to HTML
    let formatted = content;
    
    // Split into lines and process each
    const lines = formatted.split('\n');
    let result = [];
    let inCodeBlock = false;
    let codeBuffer = [];
    
    for (let line of lines) {
        // Check for code blocks (indented lines)
        if (line.trim().startsWith('    ') || line.trim().startsWith('\t')) {
            if (!inCodeBlock) {
                inCodeBlock = true;
                codeBuffer = [];
            }
            codeBuffer.push(line.replace(/^[\t ]{4}/, '').replace(/^\t/, ''));
        } else {
            if (inCodeBlock) {
                // Close code block
                result.push(`<pre><code>${escapeHtml(codeBuffer.join('\n'))}</code></pre>`);
                inCodeBlock = false;
                codeBuffer = [];
            }
            
            // Process regular line
            line = escapeHtml(line.trim());
            
            // Check for headings (lines starting with #)
            if (line.startsWith('#')) {
                const level = line.match(/^#+/)[0].length;
                if (level <= 3) {
                    const headingText = line.replace(/^#+\s*/, '');
                    line = `<h${level}>${headingText}</h${level}>`;
                } else {
                    line = `<p>${line.replace(/^#+\s*/, '')}</p>`;
                }
            } else if (line === '') {
                // Skip empty lines
                continue;
            } else if (line.startsWith('- ') || line.startsWith('* ')) {
                // Simple list handling
                line = `<p>${line}</p>`;
            } else {
                line = `<p>${line}</p>`;
            }
            
            result.push(line);
        }
    }
    
    // Close any remaining code block
    if (inCodeBlock) {
        result.push(`<pre><code>${escapeHtml(codeBuffer.join('\n'))}</code></pre>`);
    }
    
    return result.join('');
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getFileNameFromPath(path) {
    return path.split('/').pop();
}

function handleSearch(event) {
    const searchTerm = event.target.value.toLowerCase();
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        const text = item.querySelector('span').textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            item.style.display = 'flex';
            // Show parent folders
            let parent = item.parentElement;
            while (parent && parent !== document.getElementById('navList')) {
                if (parent.classList.contains('expand-collapse')) {
                    parent.classList.remove('hidden');
                    // Rotate chevron if needed
                    const sibling = parent.previousElementSibling;
                    if (sibling && sibling.querySelector('.chevron')) {
                        sibling.querySelector('.chevron').classList.add('rotated');
                    }
                }
                parent = parent.parentElement;
            }
        } else {
            item.style.display = 'none';
        }
    });
}

function toggleAllNavItems(expand) {
    const folders = document.querySelectorAll('.nav-item.folder');
    const childLists = document.querySelectorAll('.expand-collapse');
    const chevrons = document.querySelectorAll('.chevron');
    
    folders.forEach((folder, index) => {
        if (expand) {
            childLists[index].classList.remove('hidden');
            chevrons[index].classList.add('rotated');
        } else {
            childLists[index].classList.add('hidden');
            chevrons[index].classList.remove('rotated');
        }
    });
}

// Add animation for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translateY(20px); }
        10% { opacity: 1; transform: translateY(0); }
        90% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0; transform: translateY(20px); }
    }
    
    .loading {
        text-align: center;
        padding: 40px;
        font-style: italic;
        color: var(--text-secondary);
    }
    
    .error-message {
        padding: 20px;
        color: var(--danger);
    }
    
    .error-message h2 {
        margin-bottom: 10px;
    }
`;
document.head.appendChild(style);

// AI Chat functionality
let aiChatActive = false;
