function PostItem({ post }) {
  return (
    <div style={{ border: "1px solid gray", margin: "10px", padding: "10px" }}>
      <h3>{post.title}</h3>
      <p>{post.content}</p>
    </div>
  );
}

export default PostItem;