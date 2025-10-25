import { useState } from "react";
import { Container, Form, FormGroup, Input, Button } from "reactstrap";
import axios from "axios";

const CreatePost = () => {
  const [form, setForm] = useState({ title: "", description: "" });
  const [image, setImage] = useState(null);

  const token = localStorage.getItem("token");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleFileChange = (e) => setImage(e.target.files[0]);

  const handleSubmit = async () => {
    if (!form.title) return alert("Title is required!");

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    if (image) formData.append("image", image);

    try {
      const res = await axios.post(
        "http://localhost:5000/api/posts/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        alert("Post created successfully!");
        setForm({ title: "", description: "" });
        setImage(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error creating post");
    }
  };

  return (
    <Container style={{ maxWidth: "600px", marginTop: "2rem" }}>
      <h2>Create Post</h2>
      <Form>
        <FormGroup>
          <Input
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Input
            type="textarea"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Input type="file" onChange={handleFileChange} />
        </FormGroup>
        <Button color="primary" onClick={handleSubmit}>
          Create Post
        </Button>
      </Form>
    </Container>
  );
};

export default CreatePost;
