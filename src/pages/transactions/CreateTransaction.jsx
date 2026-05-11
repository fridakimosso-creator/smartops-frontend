import { useNavigate } from "react-router-dom";
import TransactionForm from "../../components/forms/TransactionForm";
import { useTheme } from "../../context/ThemeContext";

export default function CreateTransaction() {
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleSubmit = (data) => {
    console.log("Transaction:", data);

    navigate("/transactions", {
      state: { success: "Transaction added!" },
    });
  };

  return (
    <div style={{ color: theme.color }}>
      <h2>Create Transaction</h2>
      <TransactionForm onSubmit={handleSubmit} />
    </div>
  );
}