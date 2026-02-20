import { Card, Row, Col, Space, Typography } from "antd";
import {
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleFilled,
  RiseOutlined,
  TeamOutlined,
  WarningOutlined,
} from "@ant-design/icons";

const { Text } = Typography;

interface MonthStats {
  totalKeldi: number;
  totalKelmadi: number;
  totalSababli: number;
  rate: number;
}

interface TodayStats {
  keldi: number;
  kelmadi: number;
  sababli: number;
  kechikkan: number;
  total: number;
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  bg: string;
}

const StatCard = ({ label, value, icon, bg }: StatCardProps) => (
  <Card size="small" styles={{ body: { padding: "12px 16px" } }}>
    <Space size={12} align="center">
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 8,
          background: bg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 16,
          flexShrink: 0,
        }}
      >
        {icon}
      </div>
      <div>
        <Text type="secondary" style={{ fontSize: 11 }}>
          {label}
        </Text>
        <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.2 }}>
          {value}
        </div>
      </div>
    </Space>
  </Card>
);

interface StatsBarProps {
  monthStats: MonthStats;
  todayStats: TodayStats;
}

const StatsBar = ({ monthStats, todayStats }: StatsBarProps) => (
  <div style={{ marginBottom: 16 }}>
    <Text
      type="secondary"
      style={{
        fontSize: 11,
        fontWeight: 600,
        display: "block",
        marginBottom: 6,
      }}
    >
      📅 BUGUN
    </Text>
    <Row gutter={[12, 12]} style={{ marginBottom: 12 }}>
      <Col xs={12} sm={6}>
        <StatCard
          label="Jami o'quvchi"
          value={todayStats.total}
          icon={<TeamOutlined style={{ color: "#6366f1" }} />}
          bg="#eef2ff"
        />
      </Col>
      <Col xs={12} sm={6}>
        <StatCard
          label="Keldi"
          value={todayStats.keldi}
          icon={<CheckOutlined style={{ color: "#10b981" }} />}
          bg="#ecfdf5"
        />
      </Col>
      <Col xs={12} sm={6}>
        <StatCard
          label="Kelmadi"
          value={todayStats.kelmadi}
          icon={<CloseOutlined style={{ color: "#ef4444" }} />}
          bg="#fef2f2"
        />
      </Col>
      <Col xs={12} sm={6}>
        <StatCard
          label="Sababli yoki Kechikkan"
          value={todayStats.kechikkan}
          icon={<WarningOutlined style={{ color: "#f59e0b" }} />}
          bg="#fffbeb"
        />
      </Col>
    </Row>

    <Text
      type="secondary"
      style={{
        fontSize: 11,
        fontWeight: 600,
        display: "block",
        marginBottom: 6,
      }}
    >
      📊 OY DAVOMIDA
    </Text>
    <Row gutter={[12, 12]}>
      <Col xs={12} sm={6}>
        <StatCard
          label="Keldi"
          value={monthStats.totalKeldi}
          icon={<CheckOutlined style={{ color: "#10b981" }} />}
          bg="#ecfdf5"
        />
      </Col>
      <Col xs={12} sm={6}>
        <StatCard
          label="Kelmadi"
          value={monthStats.totalKelmadi}
          icon={<CloseOutlined style={{ color: "#ef4444" }} />}
          bg="#fef2f2"
        />
      </Col>
      <Col xs={12} sm={6}>
        <StatCard
          label="Sababli"
          value={monthStats.totalSababli}
          icon={<ExclamationCircleFilled style={{ color: "#f59e0b" }} />}
          bg="#fffbeb"
        />
      </Col>
      <Col xs={12} sm={6}>
        <StatCard
          label="Davomat %"
          value={`${monthStats.rate}%`}
          icon={<RiseOutlined style={{ color: "#8b5cf6" }} />}
          bg="#f5f3ff"
        />
      </Col>
    </Row>
  </div>
);

export default StatsBar;