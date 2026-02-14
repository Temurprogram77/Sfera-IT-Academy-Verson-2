import { Card, Col, Row, Statistic } from "antd";
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
            styles={{ content: { color: "#1890ff" } }}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Umumiy Bo'sh"
            value={totalFree}
            suffix="soat"
            styles={{ content: { color: '#52c41a'} }}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Umumiy Soat"
            value={totalHours}
            suffix="soat"
            styles={{ content: { color: '#531dab'} }}
          />
        </Card>
      </Col>

      <Col xs={24} sm={12} md={6}>
        <Card>
          <Statistic
            title="Utilizatsiya"
            value={utilization.toFixed(1)}
            suffix="%"
            styles={{ content: { color: '#78ccbe'} }}
          />
        </Card>
      </Col>
    </Row>
  );
};
