document.addEventListener("DOMContentLoaded", async () => {
    const outputDiv = document.getElementById("output");
  
    const API_KEY = "AIzaSyDi3FT8TsPtYmwonyybiudVt9ng3L2sdQM";
    const API_URL = "http://localhost:8000/predict";
  
    chrome.tabs.query({ active: true, currentWindow: true }, async (tabs) => {
      const url = tabs[0].url;
      const youtubeRegex = /^https:\/\/(?:www\.)?youtube\.com\/watch\?v=([\w-]{11})/;
      const match = url.match(youtubeRegex);
  
      if (match && match[1]) {
        const videoId = match[1];
  
        outputDiv.innerHTML = `
          <div class="section-title">YouTube Video ID</div>
          <p>${videoId}</p>
          <p>Fetching comments...</p>
        `;
  
        // 1. Fetch comments from YouTube API
        const comments = await fetchComments(videoId);
        if (comments.length === 0) {
          outputDiv.innerHTML += "<p>No comments found for this video.</p>";
          return;
        }
  
        outputDiv.innerHTML += `<p>Fetched ${comments.length} comments. Sending for sentiment analysis...</p>`;
  
        const analysis = await getSentimentAnalysis(comments);
  
        if (!analysis) {
          outputDiv.innerHTML += "<p>Error fetching sentiment predictions.</p>";
          return;
        }
  
  
        const { predictions, sentiment_counts } = analysis;
  
        const total = predictions.length;
        const positivePercent = ((sentiment_counts["1"] / total) * 100).toFixed(2);
        const neutralPercent = ((sentiment_counts["0"] / total) * 100).toFixed(2);
        const negativePercent = ((sentiment_counts["-1"] / total) * 100).toFixed(2);
  
        // 3. Render summary + top comments
        outputDiv.innerHTML += `
          <div class="section">
            <div class="section-title">Sentiment Analysis Results</div>
            <div class="sentiment-boxes">
              <div class="sentiment-box">
                <div class="label">Positive</div>
                <div class="percentage">${positivePercent}%</div>
              </div>
              <div class="sentiment-box">
                <div class="label">Neutral</div>
                <div class="percentage">${neutralPercent}%</div>
              </div>
              <div class="sentiment-box">
                <div class="label">Negative</div>
                <div class="percentage">${negativePercent}%</div>
              </div>
            </div>
          </div>
  
          <div class="section">
            <div class="section-title">Top 25 Comments with Sentiments</div>
            <ul class="comment-list">
              ${predictions.slice(0, 25).map((item, index) => `
                <li class="comment-item">
                  <span>${index + 1}. ${item.comment}</span><br>
                  <span class="comment-sentiment">Sentiment: ${item.sentiment}</span>
                </li>
              `).join("")}
            </ul>
          </div>
        `;
      } else {
        outputDiv.innerHTML = "<p>This is not a valid YouTube URL.</p>";
      }
    });
  

    async function fetchComments(videoId) {
      let comments = [];
      let pageToken = "";
  
      try {
        while (comments.length < 500) {
          const url = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=50&pageToken=${pageToken}&key=${API_KEY}`;
          const response = await fetch(url);
          const data = await response.json();
  
          if (!data.items) break;
  
          data.items.forEach(item => {
            comments.push(item.snippet.topLevelComment.snippet.textOriginal);
          });
  
          pageToken = data.nextPageToken;
          if (!pageToken) break;
        }
      } catch (err) {
        console.error("Error fetching comments:", err);
      }
  
      return comments;
    }
  
    async function getSentimentAnalysis(comments) {
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ comments })
        });
  
        console.log("Response status:", response.status);
        const result = await response.json();
        console.log("Result from API:", result);
  

        if (!result || !result.predictions || !Array.isArray(result.predictions)) {
          console.error("Unexpected API response shape:", result);
          return null;
        }
  
        return result;
      } catch (error) {
        console.error("Error fetching predictions:", error);
        return null;
      }
    }
  });