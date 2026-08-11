export default function AdminLoading() {
  return (
    <div style={{ padding: "20px" }}>
      {/* Header Skeleton */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "30px" }}>
        <div>
          <div className="skeleton" style={{ height: "36px", width: "220px", marginBottom: "15px" }} />
          <div style={{ display: "flex", gap: "20px" }}>
            <div className="skeleton" style={{ height: "70px", width: "120px", borderRadius: "8px" }} />
            <div className="skeleton" style={{ height: "70px", width: "120px", borderRadius: "8px" }} />
          </div>
        </div>
        <div className="skeleton" style={{ height: "40px", width: "150px", borderRadius: "4px" }} />
      </div>

      {/* Table Rows Skeleton */}
      <div style={{ background: "white", borderRadius: "8px", padding: "20px" }}>
        <div className="skeleton" style={{ height: "40px", width: "100%", marginBottom: "15px" }} />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton" style={{ height: "48px", width: "100%", marginBottom: "10px" }} />
        ))}
      </div>
    </div>
  );
}
