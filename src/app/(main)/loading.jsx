export default function Loading() {
  return (
    <div style={{ minHeight: "80vh", padding: "40px 20px" }}>
      <div className="container">
        {/* Banner / Hero Skeleton */}
        <div 
          className="skeleton" 
          style={{ 
            height: "180px", 
            width: "100%", 
            borderRadius: "12px", 
            marginBottom: "40px" 
          }} 
        />

        {/* Section Title Skeleton */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "30px" }}>
          <div className="skeleton" style={{ height: "32px", width: "240px" }} />
        </div>

        {/* Grid Cards Skeleton */}
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
          gap: "25px" 
        }}>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div 
              key={n} 
              style={{ 
                background: "white", 
                padding: "30px", 
                borderRadius: "10px", 
                boxShadow: "0 4px 15px rgba(0,0,0,0.05)" 
              }}
            >
              <div className="skeleton" style={{ height: "40px", width: "40px", borderRadius: "50%", marginBottom: "15px" }} />
              <div className="skeleton" style={{ height: "24px", width: "70%", marginBottom: "12px" }} />
              <div className="skeleton" style={{ height: "16px", width: "100%", marginBottom: "8px" }} />
              <div className="skeleton" style={{ height: "16px", width: "85%", marginBottom: "20px" }} />
              <div className="skeleton" style={{ height: "40px", width: "100%", borderRadius: "4px" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
