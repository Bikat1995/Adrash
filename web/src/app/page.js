"use client";

import { useState } from "react";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState([]);
  
  const handleLogin = (e) => {
    e.preventDefault();
    if (phone.length > 5) setIsAuthenticated(true);
  };

  const handleBulkUpload = () => {
    const mockBulkOrders = [
      { id: 101, desc: "Box of electronics", status: "requested", lat: 9.03, lng: 38.74 },
      { id: 102, desc: "Documents", status: "matched", lat: 9.04, lng: 38.76 },
      { id: 103, desc: "Spare Parts", status: "delivered", lat: 9.02, lng: 38.73 },
    ];
    setOrders(mockBulkOrders);
  };

  if (!isAuthenticated) {
    return (
      <main style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', padding: '2rem', backgroundColor: 'var(--primary-forest)' }}>
        <div className="glass-card" style={{ width: '100%', maxWidth: '400px', textAlign: 'center', backgroundColor: 'var(--background-cream)', border: 'none' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: 'bold', color: 'var(--secondary-gold)' }}>🛵 Adrash</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Sign in to manage bulk dispatches.</p>
          <form onSubmit={handleLogin}>
            <input 
              type="tel" 
              placeholder="Enter Phone Number" 
              className="input-field" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
            <button type="submit" className="btn-primary" style={{ width: '100%' }}>Send OTP</button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main style={{ minHeight: '100vh' }}>
      <header style={{ backgroundColor: 'var(--primary-forest)', padding: '1.5rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--secondary-gold)' }}>🛵 Adrash Dispatch Portal</h1>
        <button onClick={() => setIsAuthenticated(false)} style={{ background: 'transparent', color: 'var(--background-cream)', border: '1px solid var(--accent-terracotta)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>Logout</button>
      </header>

      <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          {/* Bulk Upload Widget */}
          <section className="glass-card">
            <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', color: 'var(--primary-forest)' }}>Bulk Order Upload</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
              Upload a CSV file containing pickup and dropoff coordinates to instantly dispatch drivers.
            </p>
            <div style={{ border: '2px dashed var(--accent-terracotta)', padding: '2rem', textAlign: 'center', borderRadius: '8px', marginBottom: '1rem', backgroundColor: 'var(--background-cream)' }}>
              <p style={{ color: 'var(--text-secondary)' }}>Drag & Drop CSV here</p>
            </div>
            <button className="btn-primary" style={{ width: '100%' }} onClick={handleBulkUpload}>Simulate CSV Upload</button>
          </section>

          {/* Live Dispatch Map Mock */}
          <section className="glass-card" style={{ gridColumn: 'auto / span 2' }}>
            <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', color: 'var(--primary-forest)' }}>Live Tracking</h2>
            <div style={{ width: '100%', height: '300px', backgroundColor: '#F3E8D6', borderRadius: '8px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ color: 'var(--text-secondary)', zIndex: 2 }}>[Map Interface Mock]</p>
              {/* Fake route line */}
              <div style={{ position: 'absolute', height: '4px', backgroundColor: 'var(--primary-forest)', width: '60%', transform: 'rotate(15deg)', zIndex: 1 }}></div>
            </div>
          </section>
        </div>

        <section className="glass-card" style={{ marginTop: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', fontSize: '1.25rem', color: 'var(--primary-forest)' }}>Recent Active Orders</h2>
          {orders.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>No active orders.</p>
          ) : (
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <th style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>Order ID</th>
                  <th style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>Description</th>
                  <th style={{ padding: '1rem 0', color: 'var(--text-secondary)' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={{ padding: '1rem 0', fontWeight: 'bold' }}>#{order.id}</td>
                    <td style={{ padding: '1rem 0' }}>{order.desc}</td>
                    <td style={{ padding: '1rem 0' }}>
                      <span style={{ 
                        padding: '4px 8px', 
                        borderRadius: '4px', 
                        fontSize: '0.8rem',
                        fontWeight: 'bold',
                        backgroundColor: order.status === 'delivered' ? 'var(--primary-forest)' : 'var(--border-light)',
                        color: order.status === 'delivered' ? 'white' : 'var(--text-secondary)'
                      }}>
                        {order.status.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </div>
    </main>
  );
}
