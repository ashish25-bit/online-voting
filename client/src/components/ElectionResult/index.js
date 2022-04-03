import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";

function ElectionResult({ data }) {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

  const CustomTooltip = ({ active, payload }) => {
    if (active) {
      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "#ffff",
            padding: "5px",
            border: "1px solid #cccc",
          }}
        >
          <label>{`${payload[0].name} : ${payload[0].value}`}</label>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <h1>Election Result</h1>
      <PieChart width={300} height={300}>
        <Pie
          data={data}
          color="#000000"
          dataKey="votes"
          nameKey="name"
          outerRadius={120}
          fill="#8884d8"
        >
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </PieChart>
    </>
  );
}

export default ElectionResult;
