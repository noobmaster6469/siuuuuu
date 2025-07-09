
import sys
import json
import requests
import pandas as pd
from collections import defaultdict, Counter
from sklearn.metrics.pairwise import cosine_similarity

if len(sys.argv) < 2:
    print("No user ID provided")
    sys.exit()

target_user_id = sys.argv[1]

likes_url = "http://localhost:8000/api/likes/all-public"

try:
    response = requests.get(likes_url)
    response.raise_for_status()
    likes = response.json()
except requests.exceptions.RequestException as e:
    print("HTTP Request failed:", e)
    print(json.dumps({"recommendations": []}))
    sys.exit()
except ValueError as e:
    print("Invalid JSON from backend:", e)
    print(json.dumps({"recommendations": []}))
    sys.exit()

if not likes:
    print(json.dumps({"recommendations": []}))
    sys.exit()

# Build user-blog matrix: user -> blog liked = 1, else 0
user_blog_matrix = defaultdict(lambda: defaultdict(int))
for like in likes:
    user = like.get("userId")
    blog = like.get("blogId")
    if user and blog:
        user_blog_matrix[user][blog] = 1

df = pd.DataFrame(user_blog_matrix).T.fillna(0)  # users as rows, blogs as columns
item_matrix = df.T  # blogs as rows, users as columns (for item-item similarity)

if item_matrix.shape[0] < 2:
    print(json.dumps({"recommendations": []}))
    sys.exit()

# Compute item-item similarity matrix (blog-blog similarity)
cosine_sim = cosine_similarity(item_matrix)
similarity_df = pd.DataFrame(cosine_sim, index=item_matrix.index, columns=item_matrix.index)

# Get blogs liked by target user
if target_user_id not in df.index:
    # User not found or no likes
    print(json.dumps({"recommendations": []}))
    sys.exit()

liked_blogs = df.loc[target_user_id]
liked_blogs = liked_blogs[liked_blogs > 0].index.tolist()

if not liked_blogs:
    print(json.dumps({"recommendations": []}))
    sys.exit()

# Aggregate similar blogs from all liked blogs
recommendation_scores = Counter()

for blog_id in liked_blogs:
    if blog_id not in similarity_df.columns:
        continue
    similar_blogs = similarity_df[blog_id].drop(blog_id, errors="ignore")
    for sim_blog_id, score in similar_blogs.items():
        if sim_blog_id not in liked_blogs:  # exclude already liked
            recommendation_scores[sim_blog_id] += score

# Get top 3 recommended blogs
top_recommendations = recommendation_scores.most_common(5)  # or 3

print(json.dumps({
    "recommendations": [
        { "blogId": blog_id, "score": round(score, 4) }
        for blog_id, score in top_recommendations
    ]
}))
