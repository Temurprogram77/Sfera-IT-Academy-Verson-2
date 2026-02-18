import React from "react";
import { useParams } from "react-router-dom";
import { Skeleton, Tag } from "antd";
import {
  ClockCircleOutlined,
  QuestionCircleOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useCategoryDetail } from "../../hooks/useCategoryDetail";
import { useTheme } from "../../context/ThemeContext";

const CategoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { category, loading } = useCategoryDetail(id);

  // ── Ranglar ──────────────────────────────────────────────────────────────────
  const card = isDark ? "#1f2937" : "#ffffff";
  const border = isDark ? "#374151" : "#e5e7eb";
  const textPrimary = isDark ? "#f3f4f6" : "#111827";
  const textSecondary = isDark ? "#9ca3af" : "#6b7280";
  const bg = isDark ? "#111827" : "#f9fafb";

  return (
    <div
      style={{
        minHeight: "100vh",
        background: bg,
        padding: "24px",
      }}
    >
      {loading ? (
        /* ── Skeleton ── */
        <div
          style={{
            background: card,
            borderRadius: 16,
            border: `1px solid ${border}`,
            overflow: "hidden",
            maxWidth: 800,
          }}
        >
          <Skeleton.Image
            active
            style={{ width: "100%", height: 280, borderRadius: 0 }}
          />
          <div style={{ padding: 28 }}>
            <Skeleton active paragraph={{ rows: 4 }} />
          </div>
        </div>
      ) : !category ? (
        /* ── Topilmadi ── */
        <div
          style={{
            textAlign: "center",
            padding: "80px 20px",
            color: textSecondary,
            fontSize: 16,
          }}
        >
          📭 Kategoriya topilmadi
        </div>
      ) : (
        /* ── Asosiy karta ── */
        <div
          style={{
            maxWidth: 800,
            background: card,
            borderRadius: 16,
            border: `1px solid ${border}`,
            overflow: "hidden",
            boxShadow: isDark
              ? "0 4px 12px rgba(0,0,0,0.4)"
              : "0 4px 12px rgba(0,0,0,0.06)",
          }}
        >
          {/* ── Rasm ── */}
          {category.imgUrl ? (
            <div
              style={{
                width: "100%",
                height: 260,
                overflow: "hidden",
                background: isDark ? "#374151" : "#f3f4f6",
                position: "relative",
              }}
            >
              <img
                src={category.imgUrl}
                alt={category.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  padding: "20px",
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          ) : (
            <div
              style={{
                width: "100%",
                height: 120,
                background: isDark ? "#374151" : "#f3f4f6",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 48,
              }}
            >
              📚
            </div>
          )}

          {/* ── Kontent ── */}
          <div style={{ padding: "28px 32px" }}>
            {/* Nomi */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 12,
              }}
            >
              <h1
                style={{
                  margin: 0,
                  fontSize: 26,
                  fontWeight: 700,
                  color: textPrimary,
                  lineHeight: 1.3,
                }}
              >
                {category.name}
              </h1>
              <Tag
                color="blue"
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "3px 10px",
                  borderRadius: 8,
                }}
              >
                #{category.id}
              </Tag>
            </div>

            {/* Tavsif */}
            {category.description && (
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                  marginBottom: 24,
                  padding: "14px 16px",
                  background: isDark
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(0,0,0,0.02)",
                  borderRadius: 10,
                  border: `1px solid ${border}`,
                }}
              >
                <FileTextOutlined
                  style={{
                    color: isDark ? "#60a5fa" : "#3b82f6",
                    fontSize: 16,
                    marginTop: 2,
                    flexShrink: 0,
                  }}
                />
                <p
                  style={{
                    margin: 0,
                    fontSize: 15,
                    color: isDark ? "#d1d5db" : "#4b5563",
                    lineHeight: 1.7,
                  }}
                >
                  {category.description}
                </p>
              </div>
            )}

            {/* ── Statistika kartachalari ── */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
              }}
            >
              {/* Davomiylik */}
              <StatCard
                icon={
                  <ClockCircleOutlined
                    style={{ color: "#8b5cf6", fontSize: 20 }}
                  />
                }
                label="Davomiylik"
                value={`${category.duration} oy`}
                accent="#8b5cf6"
                isDark={isDark}
                border={border}
              />

              {/* Savollar soni */}
              <StatCard
                icon={
                  <QuestionCircleOutlined
                    style={{ color: "#f59e0b", fontSize: 20 }}
                  />
                }
                label="Savol limiti"
                value={`${category.questionLimit} ta`}
                accent="#f59e0b"
                isDark={isDark}
                border={border}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Stat karta ───────────────────────────────────────────────────────────────
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
  isDark: boolean;
  border: string;
}

const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  accent,
  isDark,
  border,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "16px 20px",
      borderRadius: 12,
      border: `1px solid ${border}`,
      background: isDark ? "rgba(255,255,255,0.03)" : "#fafafa",
    }}
  >
    <div
      style={{
        width: 44,
        height: 44,
        borderRadius: 10,
        background: `${accent}18`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {icon}
    </div>
    <div>
      <p
        style={{
          margin: 0,
          fontSize: 12,
          color: isDark ? "#9ca3af" : "#6b7280",
          fontWeight: 500,
          marginBottom: 4,
        }}
      >
        {label}
      </p>
      <p
        style={{
          margin: 0,
          fontSize: 20,
          fontWeight: 700,
          color: isDark ? "#f3f4f6" : "#111827",
          lineHeight: 1,
        }}
      >
        {value}
      </p>
    </div>
  </div>
);

export default CategoryDetail;