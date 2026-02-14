import { Card, Col, Row, Statistic } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";

interface StatisticsCardsProps {
  totalBusy: number;
  totalFree: number;
  totalHours: number;
  utilization: number;
}

export const StatisticsCards = ({
  totalBusy,
  totalFree,
  totalHours,
  utilization,
}: StatisticsCardsProps) => {
  return (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Umumiy Band"
            value={totalBusy}
            suffix="soat"
            prefix={<ClockCircleOutlined />}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Umumiy Bo'sh"
            value={totalFree}
            suffix="soat"
            prefix={<CheckCircleOutlined />}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Umumiy Soat"
            value={totalHours}
            suffix="soat"
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Utilizatsiya"
            value={utilization.toFixed(1)}
            suffix="%"
          />
        </Card>
      </Col>
    </Row>
  );
};