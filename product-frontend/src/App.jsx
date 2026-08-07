import { useState, useEffect } from 'react';
import './App.css';

const API_URL = 'http://localhost:8080/api/products';

function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '' });
  const [editingId, setEditingId] = useState(null);

  // Fetch all products
  const fetchProducts = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productData = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
    };

    if (editingId) {
      // Update existing product
      await fetch(`${API_URL}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      setEditingId(null);
    } else {
      // Create new product
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
    }

    setForm({ name: '', description: '', price: '' });
    fetchProducts();
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
    });
    setEditingId(product.id);
  };

  const handleDelete = async (id) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  const handleCancelEdit = () => {
    setForm({ name: '', description: '', price: '' });
    setEditingId(null);
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Product Manager</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            name="name"
            placeholder="Product name"
            value={form.name}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="number"
            step="0.01"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px' }}
          />
        </div>
        <button type="submit" style={{ padding: '8px 16px', marginRight: '10px' }}>
          {editingId ? 'Update Product' : 'Add Product'}
        </button>
        {editingId && (
          <button type="button" onClick={handleCancelEdit} style={{ padding: '8px 16px' }}>
            Cancel
          </button>
        )}
      </form>

      <div>
        {products.length === 0 && <p>No products yet.</p>}
        {products.map((product) => (
          <div
            key={product.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '6px',
              padding: '12px',
              marginBottom: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <strong>{product.name}</strong> — {product.description} — ${product.price}
            </div>
            <div>
              <button onClick={() => handleEdit(product)} style={{ marginRight: '8px' }}>
                Edit
              </button>
              <button onClick={() => handleDelete(product.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;