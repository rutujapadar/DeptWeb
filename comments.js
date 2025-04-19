// Handle the comment reply functionality
const commentList = document.getElementById("unique-comment-list");

// Sample comment data (Replace with dynamic content or fetch from DB)
const comments = [
  {
    username: "Adamsdavid",
    avatar:
      "https://rvs-comment-module.vercel.app/Assets/User Avatar.png",
    time: "20 hours ago",
    text:
      "I genuinely think that Codewell's community is AMAZING. It's just starting out but the templates on there are amazing.",
    likes: 2,
    dislikes: 0,
  },
];

// Function to render comments dynamically
function renderComments() {
  commentList.innerHTML = "";
  comments.forEach((comment) => {
    const li = document.createElement("li");
    li.classList.add("unique-comment-item");
    li.innerHTML = `
      <div class="unique-comment">
        <div class="unique-comment-img">
          <img src="${comment.avatar}" alt="User Avatar" />
        </div>
        <div class="unique-comment-content">
          <div class="unique-comment-details">
            <h4 class="unique-comment-name">${comment.username}</h4>
            <span class="unique-comment-log">${comment.time}</span>
          </div>
          <div class="unique-comment-desc">
            <p>${comment.text}</p>
          </div>
          <div class="unique-comment-data">
            <div class="unique-comment-likes">
              <div class="unique-comment-likes-up">
                <img
                  src="https://rvs-comment-module.vercel.app/Assets/Up.svg"
                  alt="Like"
                />
                <span>${comment.likes}</span>
              </div>
              <div class="unique-comment-likes-down">
                <img
                  src="https://rvs-comment-module.vercel.app/Assets/Down.svg"
                  alt="Dislike"
                />
                <span>${comment.dislikes}</span>
              </div>
            </div>
            <div class="unique-comment-reply">
              <a href="#!" onclick="replyToComment(${comments.indexOf(comment)})">
                Reply
              </a>
            </div>
            <div class="unique-comment-report">
              <a href="#!" onclick="reportComment(${comments.indexOf(comment)})">
                Report
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
    commentList.appendChild(li);
  });
}

// Handle comment reply
function replyToComment(index) {
  alert(`Replying to comment by: ${comments[index].username}`);
}

// Handle comment reporting
function reportComment(index) {
  alert(`Reported comment by: ${comments[index].username}`);
}

// Initially render comments
renderComments();
