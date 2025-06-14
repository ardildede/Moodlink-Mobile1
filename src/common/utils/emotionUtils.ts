export const getEmotionName = (emotionType: number): string => {
  const emotionMap: { [key: number]: string } = {
    1: "Mutluluk",
    2: "Üzüntü",
    3: "Öfke",
    4: "Endişe",
    5: "Stres",
    6: "Huzur",
    7: "Enerji",
    8: "Heyecan",
    9: "Yalnızlık",
    10: "Mizah",
  };

  return emotionMap[emotionType] || "Bilinmeyen";
};

export const getEmotionColor = (emotionType: number): string => {
  const colorMap: { [key: number]: string } = {
    1: "#FFD700", // Mutluluk - Gold
    2: "#4169E1", // Üzüntü - Royal Blue
    3: "#DC143C", // Öfke - Crimson
    4: "#FF8C00", // Endişe - Dark Orange
    5: "#FF6347", // Stres - Tomato
    6: "#20B2AA", // Huzur - Light Sea Green
    7: "#32CD32", // Enerji - Lime Green
    8: "#FF1493", // Heyecan - Deep Pink
    9: "#9370DB", // Yalnızlık - Medium Purple
    10: "#FFA500", // Mizah - Orange
  };

  return colorMap[emotionType] || "#808080";
};

export const getCompatibilityColor = (percentage: number): string => {
  if (percentage >= 90) return "#10b981"; // Very High - Green
  if (percentage >= 75) return "#22c55e"; // High - Light Green
  if (percentage >= 60) return "#eab308"; // Medium - Yellow
  if (percentage >= 40) return "#f97316"; // Low - Orange
  return "#ef4444"; // Very Low - Red
};

export const getCompatibilityText = (percentage: number): string => {
  if (percentage >= 90) return "Çok Yüksek";
  if (percentage >= 75) return "Yüksek";
  if (percentage >= 60) return "Orta";
  if (percentage >= 40) return "Düşük";
  return "Çok Düşük";
};
