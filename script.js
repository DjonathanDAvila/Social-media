// Check if user is logged in
function isLoggedIn() {
    return localStorage.getItem('currentUser') !== null;
}

// Redirect to login page if not logged in
if (!isLoggedIn() && window.location.pathname !== '/index.html') {
    window.location.href = 'index.html';
}

// Login / Register functionality
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        let users = JSON.parse(localStorage.getItem('users')) || {};
        
        if (users[username]) {
            if (users[username] === password) {
                localStorage.setItem('currentUser', username);
                window.location.href = 'main.html';
            } else {
                alert('Incorrect password');
            }
        } else {
            users[username] = password;
            localStorage.setItem('users', JSON.stringify(users));
            localStorage.setItem('currentUser', username);
            window.location.href = 'main.html';
        }
    });
}

// Main page functionality
if (document.getElementById('postForm')) {
    const currentUser = localStorage.getItem('currentUser');

    // Set user greeting
    const userGreeting = document.getElementById('userGreeting');
    if (userGreeting) {
        const capitalizedUser = currentUser.charAt(0).toUpperCase() + currentUser.slice(1);
        userGreeting.textContent = `Hi, ${capitalizedUser}`;
    }

    // Post form submission
    document.getElementById('postForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const content = document.getElementById('postContent').value;
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts.unshift({
            id: Date.now(),
            user: currentUser,
            content: content,
            likes: [],
            comments: []
        });
        localStorage.setItem('posts', JSON.stringify(posts));
        document.getElementById('postContent').value = '';
        renderPosts();
    });

    // Render posts
    function renderPosts() {
        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        const postsContainer = document.getElementById('postsContainer');
        postsContainer.innerHTML = '';

        posts.forEach(post => {
            const postElement = document.createElement('div');
            postElement.className = 'card post-card';
            postElement.innerHTML = `
                <div class="card-body">
                    <h5 class="card-title">${post.user}</h5>
                    <p class="card-text">${post.content}</p>
                    <button class="btn btn-primary like-btn" data-id="${post.id}">
                        ${post.likes.includes(currentUser) ? 'Unlike' : 'Like'} (${post.likes.length})
                    </button>
                    <button class="btn btn-secondary comment-btn" data-id="${post.id}">Comment</button>
                    ${post.user === currentUser ? `<button class="btn btn-danger delete-btn" data-id="${post.id}">Delete</button>` : ''}
                    <div class="comment-form" id="commentForm-${post.id}">
                        <input type="text" class="form-control mt-2" placeholder="Write a comment...">
                        <button class="btn btn-primary mt-2 submit-comment" data-id="${post.id}">Submit Comment</button>
                    </div>
                    <div class="comment-list" id="commentList-${post.id}">
                        ${post.comments.map(comment => `<div class="comment">${comment.user}: ${comment.content}</div>`).join('')}
                    </div>
                </div>
            `;
            postsContainer.appendChild(postElement);
        });

        // Add event listeners for like, comment, and delete buttons
        document.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', handleLike);
        });

        document.querySelectorAll('.comment-btn').forEach(btn => {
            btn.addEventListener('click', toggleCommentForm);
        });

        document.querySelectorAll('.submit-comment').forEach(btn => {
            btn.addEventListener('click', handleComment);
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', handleDelete);
        });
    }

    // Handle like button click
    function handleLike(e) {
        const postId = parseInt(e.target.getAttribute('data-id'));
        const posts = JSON.parse(localStorage.getItem('posts'));
        const post = posts.find(p => p.id === postId);
        
        if (post.likes.includes(currentUser)) {
            post.likes = post.likes.filter(user => user !== currentUser);
        } else {
            post.likes.push(currentUser);
        }
        
        localStorage.setItem('posts', JSON.stringify(posts));
        renderPosts();
    }

    // Toggle comment form visibility
    function toggleCommentForm(e) {
        const postId = e.target.getAttribute('data-id');
        const commentForm = document.getElementById(`commentForm-${postId}`);
        commentForm.style.display = commentForm.style.display === 'none' ? 'block' : 'none';
    }

    // Handle comment submission
    function handleComment(e) {
        const postId = parseInt(e.target.getAttribute('data-id'));
        const commentInput = e.target.previousElementSibling;
        const content = commentInput.value.trim();
        
        if (content) {
            const posts = JSON.parse(localStorage.getItem('posts'));
            const post = posts.find(p => p.id === postId);
            post.comments.push({ user: currentUser, content: content });
            localStorage.setItem('posts', JSON.stringify(posts));
            commentInput.value = '';
            renderPosts();
        }
    }

    // Handle post deletion
    function handleDelete(e) {
        const postId = parseInt(e.target.getAttribute('data-id'));
        const posts = JSON.parse(localStorage.getItem('posts'));
        const updatedPosts = posts.filter(p => p.id !== postId);
        localStorage.setItem('posts', JSON.stringify(updatedPosts));
        renderPosts();
    }

    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');

    function updateThemeIcon(isDarkTheme) {
        if (isDarkTheme) {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        } else {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }

    themeToggle.addEventListener('click', function() {
        const isDarkTheme = document.body.classList.toggle('dark-theme');
        localStorage.setItem('darkTheme', isDarkTheme);
        updateThemeIcon(isDarkTheme);
    });

    // Apply saved theme
    const savedDarkTheme = localStorage.getItem('darkTheme') === 'true';
    if (savedDarkTheme) {
        document.body.classList.add('dark-theme');
    }
    updateThemeIcon(savedDarkTheme);

    // Logout
    document.getElementById('logoutBtn').addEventListener('click', function() {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });

    // Initial render
    renderPosts();
}

//Linha comentada apenas para testar a Pipe line com a notificação do pull via chat bot telegram