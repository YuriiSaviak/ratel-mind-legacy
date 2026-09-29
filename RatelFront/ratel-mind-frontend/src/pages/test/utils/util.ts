export function getLevelBadgeClass(level: string | null) {
    if (!level) return "levelBadge levelBadge--medium";
    const l = level.toLowerCase();
    if (l.startsWith("high")) return "levelBadge levelBadge--high";
    if (l.startsWith("low")) return "levelBadge levelBadge--low";
    return "levelBadge levelBadge--medium";
}

export function localizeLevel(level: string | null) {
    if (!level) return "Brak danych";

    if (level === "High") return "Wysoki";
    if (level === "Medium") return "Średni";
    if (level === "Low") return "Niski";
    if (level === "Unknown") return "Brak danych";

    return level;
}
