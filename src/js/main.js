// UP Blog Template - Main JavaScript
// Config is injected via window.SITE_CONFIG from base.njk

const CONFIG = window.SITE_CONFIG || {
    blogId: 'demo',
    workerUrl: 'https://up-blogs-1.micaiah-tasks.workers.dev',
    courierListId: ''
};

// ==========================================
// Subscribe Form
// ==========================================
const subscribeForm = document.getElementById('subscribe-form');
if (subscribeForm) {
    subscribeForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = subscribeForm.querySelector('input[type="email"]').value;
        const button = subscribeForm.querySelector('button');
        const originalText = button.textContent;
        
        button.textContent = 'Subscribing...';
        button.disabled = true;
        
        try {
            const response = await fetch(`${CONFIG.workerUrl}/${CONFIG.blogId}/subscribe`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email })
            });
            
            if (response.ok) {
                button.textContent = 'Subscribed! ✓';
                subscribeForm.querySelector('input').value = '';
                setTimeout(() => {
                    button.textContent = originalText;
                    button.disabled = false;
                }, 3000);
            } else {
                throw new Error('Subscribe failed');
            }
        } catch (err) {
            console.error('Subscribe error:', err);
            button.textContent = 'Error - Try Again';
            button.disabled = false;
            setTimeout(() => {
                button.textContent = originalText;
            }, 3000);
        }
    });
}

// ==========================================
// Share Buttons
// ==========================================
function shareOnTwitter(url, title) {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
}

function shareOnFacebook(url) {
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(fbUrl, '_blank', 'width=550,height=420');
}

function shareOnLinkedIn(url, title) {
    const liUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(liUrl, '_blank', 'width=550,height=420');
}

function copyLink(url) {
    navigator.clipboard.writeText(url).then(() => {
        const copyBtn = document.querySelector('.share-btn.copy');
        if (copyBtn) {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = 'Copied!';
            setTimeout(() => {
                copyBtn.textContent = originalText;
            }, 2000);
        }
    }).catch(err => {
        console.error('Copy failed:', err);
    });
}

// ==========================================
// Like Button
// ==========================================
async function toggleLike(postSlug) {
    const likeBtn = document.querySelector('.like-btn');
    const likeCount = document.querySelector('.like-count');
    
    try {
        const response = await fetch(`${CONFIG.workerUrl}/${CONFIG.blogId}/posts/${postSlug}/like`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
            const data = await response.json();
            likeBtn.classList.add('liked');
            likeCount.textContent = `${data.likes} ${data.likes === 1 ? 'like' : 'likes'}`;
        }
    } catch (err) {
        console.error('Like failed:', err);
    }
}

async function loadLikeCount(postSlug) {
    const likeCount = document.querySelector('.like-count');
    if (!likeCount) return;
    
    try {
        const response = await fetch(`${CONFIG.workerUrl}/${CONFIG.blogId}/posts/${postSlug}/likes`);
        if (response.ok) {
            const data = await response.json();
            likeCount.textContent = `${data.likes} ${data.likes === 1 ? 'like' : 'likes'}`;
        } else {
            likeCount.textContent = '0 likes';
        }
    } catch (err) {
        likeCount.textContent = '0 likes';
    }
}

// ==========================================
// Comments
// ==========================================
async function loadComments(postSlug) {
    const commentsList = document.querySelector('.comments-list');
    if (!commentsList) return;
    
    try {
        const response = await fetch(`${CONFIG.workerUrl}/${CONFIG.blogId}/posts/${postSlug}/comments`);
        if (response.ok) {
            const data = await response.json();
            const comments = data.comments || data || [];
            
            if (comments.length === 0) {
                commentsList.innerHTML = '<p class="no-comments">No comments yet. Be the first!</p>';
                return;
            }
            
            commentsList.innerHTML = comments.map(comment => `
                <div class="comment">
                    <div class="comment-author">${escapeHtml(comment.name || comment.author || 'Anonymous')}</div>
                    <div class="comment-date">${formatDate(comment.createdAt || comment.created_at)}</div>
                    <div class="comment-text">${escapeHtml(comment.content || comment.text)}</div>
                </div>
            `).join('');
        } else {
            commentsList.innerHTML = '<p class="no-comments">No comments yet. Be the first!</p>';
        }
    } catch (err) {
        console.error('Load comments failed:', err);
        commentsList.innerHTML = '<p class="no-comments">No comments yet. Be the first!</p>';
    }
}

async function submitComment(postSlug, author, text) {
    try {
        const response = await fetch(`${CONFIG.workerUrl}/${CONFIG.blogId}/posts/${postSlug}/comments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                postId: postSlug,
                name: author,
                content: text
            })
        });
        
        if (response.ok) {
            loadComments(postSlug);
            return true;
        }
    } catch (err) {
        console.error('Submit comment failed:', err);
    }
    return false;
}

// ==========================================
// Utilities
// ==========================================
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}
