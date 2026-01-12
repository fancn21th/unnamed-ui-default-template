import type { SenderInputSkillListProps } from "../types";

export function DefaultSkillList(props: SenderInputSkillListProps) {
  const { items, command, selectedIds } = props;

  const renderAvatar = (src: string | null) => {
    if (!src) {
      return (
        <div style={{ width: 24, height: 24, backgroundColor: "#D9D9D9" }} />
      );
    }
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt="Avatar" style={{ width: 24, height: 24 }} />;
  };
  
  if (items.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: 280,
          height: 150,
        }}
      >
        暂无数据
      </div>
    );
  }
  
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 12,
        padding: 16,
        backgroundColor: "white",
        border: "1px solid #E8E7ED",
        borderRadius: 8,
      }}
    >
      {items.map((item, index) => {
        const isSelected = selectedIds?.has(item.value);
        
        return (
          <div
            style={{
              width: 248,
              padding: "8px 12px",
              gap: 8,
              cursor: isSelected ? "not-allowed" : "pointer",
              border: "1px solid #E8E7ED",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              opacity: isSelected ? 0.5 : 1,
              backgroundColor: isSelected ? "#F5F5F5" : "transparent",
              pointerEvents: isSelected ? "none" : "auto",
            }}
            key={`${item.value}-${index}`}
            onClick={() => command(item)}
          >
            {renderAvatar(item?.avatar || null)}
            <div style={{ color: "#403F4D", fontSize: 14 }}>
              {item.label}
              {isSelected && (
                <span style={{ 
                  marginLeft: 8, 
                  color: "#999", 
                  fontSize: 12 
                }}>
                  (已选)
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
