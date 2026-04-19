const calculateTotal = ({
  quantity,
  washRate,
  pressRate = 0,
  pressed = false,
}) => {
  if (!quantity || quantity <= 0) return 0;

  const washTotal = quantity * washRate;
  const pressTotal = pressed ? quantity * pressRate : 0;

  return washTotal + pressTotal;
};

export default calculateTotal;
