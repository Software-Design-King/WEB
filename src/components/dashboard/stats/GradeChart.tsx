import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { colors } from '../common/Common.styles';

interface GradeChartProps {
  data: {
    subject: string;
    점수: number;
    전체평균: number;
  }[];
}

const GradeChart: React.FC<GradeChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="subject" />
        <YAxis domain={[0, 100]} />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="점수"
          fill={colors.primary.main}
          name="내 점수"
        />
        <Bar
          dataKey="전체평균"
          fill={colors.secondary.main}
          name="전체 평균"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default GradeChart;
