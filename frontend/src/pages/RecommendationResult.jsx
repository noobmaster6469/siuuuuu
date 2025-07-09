import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const RecommendationResult = () => {
  const { title } = useParams();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await axios.get(`/api/blog/recommend-content/${title}`);
        setRecommendations(res.data.recommendations);
      } catch (err) {
        console.error("Failed to fetch recommendations", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [title]);

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Recommendations for: {decodeURIComponent(title)}</h2>

      {loading ? (
        <p>Loading...</p>
      ) : recommendations.length === 0 ? (
        <p>No recommendations found.</p>
      ) : (
        <ul className="space-y-4">
          {recommendations.map(blog => (
            <li key={blog._id} className="border p-4 rounded shadow">
              <h3 className="text-lg font-bold">{blog.title}</h3>
              {blog.image && <img src={blog.image} alt={blog.title} className="w-full h-40 object-cover my-2" />}
              <p className="text-sm text-gray-700">{blog.content.slice(0, 150)}...</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecommendationResult;
