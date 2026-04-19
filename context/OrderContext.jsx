import React, { createContext, useContext, useState } from "react";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orderItems, setOrderItems] = useState([]);

  const addItem = (item) => {
    setOrderItems((prev) => [...prev, item]);
  };

  const removeItem = (index) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  };

  const clearOrder = () => {
    setOrderItems([]);
  };

  const getTotal = () => {
    return orderItems.reduce((sum, item) => sum + item.total, 0);
  };

  return (
    <OrderContext.Provider
      value={{
        orderItems,
        addItem,
        removeItem,
        clearOrder,
        getTotal,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrder = () => {
  return useContext(OrderContext);
};
