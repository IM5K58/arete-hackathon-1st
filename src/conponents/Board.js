import { useState } from "react";
import PostForm from "./PostForm";
import PostList from "./PostList";

function Board() {
  const [posts, setPosts] = useState([]);

  const handleAddPost = (newPost) => {
    setPosts([newPost, ...posts]);
  };

  return (
    <div>
      <h2>공용 게시판</h2>
      <PostForm onAdd={handleAddPost} />
      <PostList posts={posts} />
    </div>
  );
}

export default Board;